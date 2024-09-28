"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint # type: ignore
from api.models import db, User, Habit, Skill, Habit_Tracker
from api.utils import generate_sitemap, APIException, set_password
from flask_cors import CORS # type: ignore
from base64 import b64encode
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity # type: ignore
from werkzeug.security import check_password_hash # type: ignore
import os
import cloudinary.uploader as uploader #type: ignore

api = Blueprint('api', __name__)

CORS(api)

def check_password(hash_password, password, salt):
    return check_password_hash(hash_password, f"{password}{salt}")

@api.route('/loadSkills/<int:user_id>', methods=['POST'])
def create_default_skills(user_id):
    skills = [
        {"name": "Productivity", "description": "Improves focus and efficiency", "level": 0, "progress":0},
        {"name": "Creativity", "description": "Enhances imagination and inspiration", "level": 0, "progress":0},
        {"name": "Resilience", "description": "Develops coping skills and perseverance", "level": 0, "progress":0},
        {"name": "Empathy", "description": "Improves understanding and connection with others", "level": 0, "progress":0},
        {"name": "Self-Awareness", "description": "Enhances understanding of oneself and emotions", "level": 0, "progress":0}
    ]
    try:
        for skill in skills:
            db.session.add(Skill(**skill, user_id=user_id))
        db.session.commit()
        return({"response": "true"})
    except Exception as e:
        print(e)
        return({"response": "false"})

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

########USER########
#REGISTER USER TODO: Falta validar los datos y mejorar las respuestas.
@api.route("/users", methods=["POST"])
def add_user():
    data_form = request.form
    data_files = request.files
    data = {
        "first_name":data_form.get("first_name"),
        "last_name":data_form.get("last_name"),
        "email":data_form.get("email"),
        "password":data_form.get("password"),
        "foto":data_files.get("foto")
    }
    first_name = data.get("first_name", None)
    last_name = data.get("last_name", None)
    email = data.get("email", None)
    password = data.get("password", None)
    foto = data.get("foto", None)
    if email is None or password is None or last_name is None or first_name is None:
        return jsonify("you need an the email and a password"), 400
    else:
        user = User.query.filter_by(email=email).one_or_none()
        if user is not None : 
            return jsonify("user existe"), 400
        salt = b64encode(os.urandom(32)).decode("utf-8")
        password = set_password(password, salt)
        result_cloud = uploader.upload(foto)
        user = User(
                email=email, 
                password=password,
                first_name=first_name,
                last_name=last_name, 
                is_active=True,
                salt=salt, 
                foto=result_cloud.get("secure_url"), 
                public_id_foto=result_cloud.get("public_id"))
        try:
            db.session.add(user)
            db.session.commit()
            return jsonify({"message":"User created"}), 201
            
        except Exception as error:
            print(error.args)
            db.session.rollback()
            return jsonify({"message":f"error: {error}"}), 500

#UPDATE     
@api.route('user/<int:user_id>', methods=['PUT'])
def modify_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 400
    data = request.json
    files = request.files
    if "email" in data and data["email"]!= user.email:
        existing_user = User.query.filter_by(email=data["email"]).one_or_none()
        if existing_user is not None:
            return jsonify({"message": "Email already exists"}), 400
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)
    if "password" in data:
        salt = b64encode(os.urandom(32)).decode("utf-8")
        user.password = set_password(data["password"], salt)
        user.salt = salt
    if "foto" in files:
        result_cloud = uploader.upload(files["foto"])
        user.foto = result_cloud.get("secure_url")
        user.public_id_foto = result_cloud.get("public_id")
    try:
        db.session.commit()
        return jsonify({"message": "User updated"}), 200
    except Exception as error:
        print(error.args)
        db.session.rollback()
        return jsonify({"message": f"error: {error}"}), 500

#LOGIN
@api.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user=User()
    user= user.query.filter_by(email=email).one_or_none()
    if user is None:
        return jsonify({'error':"invalid credentials"})
    else: 
        if check_password(user.password, password, user.salt):
            token = create_access_token(identity = user.id)
            return jsonify({"token":token}), 200
        else:
            return jsonify({'error':'invalid credentials'}), 400
        
#GET ALL
@api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    result = list(map(lambda item: item.serialize(), users))
    return jsonify(result), 200

#GET AUTH
@api.route("/user", methods=["GET"])
@jwt_required()
def get_users_auth():
    user = User.query.get(get_jwt_identity())
    if user is None:
        return jsonify({"message":"user not found"}), 404

    return jsonify(user.serialize()), 200


########HABIT########
#ADD
@api.route("/habit", methods=["POST"])
def add_habit():
    data = request.json
    habit = Habit(
        name= data.get('name'),
        description =data.get('description'),
        user_id=data.get('user_id'),
        deleted = False
    )
    try:
        db.session.add(habit)
        db.session.commit()
        return(jsonify(habit.serialize()))
    except Exception as error:
        print(error.args)
        db.session.rollback()
        return(jsonify({'error':'ocurrio un error'}))
    
#GET ALL
@api.route("/habit", methods=["GET"])
def get_all_habits():
    habits = Habit.query.all()
    result = list(map(lambda item: item.serialize(), habits))
    return jsonify(result)

#SHOW HABITS FROM USER
@api.route("/user/<int:user_id>/habits", methods=["GET"])
def get_user_habits(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error':'user not found'}), 404
    habits = Habit.query.filter_by(user_id=user_id).all()
    result = list(map(lambda item: item.serialize(), habits))
    return jsonify(result), 200

#UPDATE HABITS FROM USER
@api.route("/habits/<int:habit_id>", methods=["PUT"])
def update_user_habit(habit_id):
    habit = Habit.query.get(habit_id)
    if habit is None:
        return jsonify({'error':'habit not found'}), 404
    new_data = request.json
    habit.name = new_data.get('name', habit.name)
    habit.description = new_data.get('description', habit.description)
    habit.deleted = new_data.get('deleted', habit.deleted)
    try:
        db.session.commit()
        return(jsonify(habit.serialize()))
    except Exception as error:
        print(error.args)
        db.session.rollback()
        return(jsonify({'error':'error'}))


########SKILLS########
#GET SKILLS FROM USER
@api.route("/user/<int:user_id>/skills", methods=["GET"])
def get_skills(user_id):
    skills=Skill.query.filter_by(user_id = user_id).all()
    result = list(map(lambda item: item.serialize(), skills))
    return jsonify(result)

#ADD
@api.route("/user/<int:user_id>/skills", methods=["POST"])
def create_skill(user_id):
    data = request.json
    print(data)
    try:
        skill = Skill(
            name=data.get('name'),
            description=data.get('description'),
            level=0,
            progress=0,
            user_id=user_id
        )
        print("skill", skill)
        db.session.add(skill)
        db.session.commit()
        return jsonify({"message": "Skill created successfully"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to create skill"}), 400

#DELETE
@api.route("/user/<int:user_id>/skills/<int:skill_id>", methods=["DELETE"])
def delete_skill(user_id, skill_id):
    try:
        skill = Skill.query.get(skill_id)
        if skill is None or skill.user_id != user_id:
            return jsonify({"error": "Skill not found"}), 404
        db.session.delete(skill)
        db.session.commit()
        return jsonify({"message": "Skill deleted successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to delete skill"}), 400

#UPDATE
@api.route("/user/<int:user_id>/skills/<int:skill_id>", methods=["PUT"])
def update_skill(user_id, skill_id):
    try:
        skill = Skill.query.get(skill_id)
        if skill is None or skill.user_id != user_id:
            return jsonify({"error": "Skill not found"}), 404
        new_data = request.json
        skill.name = new_data.get('name', skill.name)
        skill.description = new_data.get('description', skill.description)
        try:
            db.session.commit()
            return jsonify(skill.serialize()), 200
        except Exception as e:
            print(e)
            db.session.rollback()
            return jsonify({"error": "Failed to update skill"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to update skill"}), 400


########HABIT CHECKER########
#MARK AS DONE
@api.route("/habit/<int:habit_id>/<int:user_id>/complete", methods=["POST"])
def complete_habit(habit_id, user_id):
    habit = Habit.query.get(habit_id)
    if habit:
        tracker = Habit_Tracker.query.filter_by(habit_id=habit_id).first()
        if tracker:
            # Verifica si el hábito ya está completado
            if tracker.completed:
                # Si lo está, marca como no completado y actualiza la base de datos
                tracker.completed = False
                db.session.commit()
                return jsonify({"message": "Hábito marcado como no completado"}), 200
            else:
                # Si no lo está, marca como completado y actualiza la base de datos
                tracker.completed = True
                db.session.commit()
                return jsonify({"message": "Hábito marcado como completado"}), 200
        else:
            new_tracker = Habit_Tracker(
                habit_id=habit.id,
                user_id=user_id,
                completed=True,
                deleted=False,
            )
            db.session.add(new_tracker)
            db.session.commit()
            return jsonify({"message": "Nueva instancia de Habit_Tracker creada"}), 201
    else:
        return jsonify({"error": "Habit no encontrado"}), 404
    
#GET ALL
@api.route('/habitt', methods=['GET'])
def get_all_habitt():
    habit = Habit_Tracker.query.all()
    result = list(map(lambda item: item.serialize(), habit))
    return jsonify(result), 200

#GET FROM USER
@api.route('/user/<int:user_id>/habitt', methods=['GET'])
def habits_check_by_user(user_id):
    habit = Habit_Tracker.query.filter_by(user_id=user_id)
    result = list(map(lambda item: item.serialize(), habit))
    return jsonify(result), 200