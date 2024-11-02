"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint # type: ignore
from api.models import db, User, Habit, Skill, Habit_Log
from api.utils import generate_sitemap, APIException, set_password
from flask_cors import CORS # type: ignore
from base64 import b64encode
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity # type: ignore
from werkzeug.security import check_password_hash # type: ignore
import os
import re
import cloudinary.uploader as uploader #type: ignore
from datetime import date, datetime, timezone, timedelta
from api.utils import set_password, send_email, create_default_habits_and_skills

api = Blueprint('api', __name__)

CORS(api)

expires_in_minutes = 10
expires_delta = timedelta(minutes=expires_in_minutes)

def check_password(hash_password, password, salt):
    return check_password_hash(hash_password, f"{password}{salt}")


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

########USER########
@api.route("/users", methods=["POST"])
def add_user():
    data_form = request.form
    data_files = request.files

    data = {
        "first_name": data_form.get("first_name"),
        "last_name": data_form.get("last_name"),
        "email": data_form.get("email"),
        "password": data_form.get("password"),
        "foto": data_files.get("foto")
    }
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    foto = data.get("foto")

    if not first_name or not last_name or not email or not password:
        return jsonify({"message": "First name, last name, email, and password are required."}), 400
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"message": "Invalid email format."}), 400

    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long."}), 400
    
    user = User.query.filter_by(email=email).one_or_none()
    if user is not None:
        return jsonify({"message": "User with this email already exists."}), 400

    try:
        salt = b64encode(os.urandom(32)).decode("utf-8")
        hashed_password = set_password(password, salt)
        
        if foto:  # Only upload if a photo is provided
            result_cloud = uploader.upload(foto)
            foto_url = result_cloud.get("secure_url")
            public_id = result_cloud.get("public_id")
        else:
            foto_url = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_960_720.png"
            public_id = None

        user = User(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            salt=salt,
            foto=foto_url,
            public_id_foto=public_id
        )
        db.session.add(user)
        db.session.commit()
        create_default_habits_and_skills(user)
        return jsonify({"message": "User created successfully."}), 201

    except Exception as error:
        db.session.rollback()
        print(error.args)
        return jsonify({"message": f"An unexpected error occurred: {error}"}), 500

@api.route('/register-google', methods=['POST'])
def register_with_google():
    data = request.json
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    google_id = data.get('google_id')
    foto = data.get('foto')

    if not email or not google_id:
        return jsonify({"message": "Email and Google ID are required."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user is not None:
        return jsonify({"message": "User already exists."}), 200

    try:
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            google_id=google_id,
            foto=foto
        )
        db.session.add(user)
        db.session.commit()
        print("paso")
        create_default_habits_and_skills(user)
        return jsonify({"message": "User registered successfully."}), 201
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({"message": "An unexpected error occurred."}), 500

#LOGIN
@api.route('/login-google', methods=['POST'])
def login_with_google():
    data = request.json
    email = data.get('email')
    google_id = data.get('googleId')
    if not email or not google_id:
        return jsonify({'error': 'Email and Google ID are required'}), 400
    try:
        user = User.query.filter_by(email=email, google_id=google_id).one_or_none()
        if user:
            token = create_access_token(identity=user.id)
            return jsonify({"token": token}), 200
        else:
            return jsonify({'error': "User not registered"}), 404
    except Exception as error:
        return jsonify({"message": "An unexpected error occurred"}), 500

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not 'email' in data or not 'password' in data:
        return jsonify({'error': 'Email and password are required'}), 400

    email = data.get('email')
    password = data.get('password')

    try:
        user = User.query.filter_by(email=email).one_or_none()
        if user is None:
            return jsonify({'error': "Invalid credentials"}), 401

        if check_password(user.password, password, user.salt):
            token = create_access_token(identity=user.id)
            return jsonify({"token": token}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as error:
        return jsonify({"message": "An unexpected error occurred: {error}"}), 500
        
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
        skill=data.get('skill_id'),
        deleted = False,
        frequency = data.get('frequency')
    )
    try:
        db.session.add(habit)
        db.session.commit()
        return jsonify(habit.serialize())
    except Exception as error:
        print(error.args)
        db.session.rollback()
        return jsonify({'error':'ocurrio un error'}), 500

#GET HABITS FROM USER
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
    
########HABIT LOG########
#GET FROM USER
from datetime import datetime, timezone

@api.route('/user/<int:user_id>/habitlog', methods=['GET'])
def get_or_create_daily_habit_logs(user_id):
    try:
        today = datetime.now(timezone.utc).date()
        habits = Habit.query.filter_by(user_id=user_id, deleted=False).all()
        
        for habit in habits:
            existing_log = Habit_Log.query.filter(
                Habit_Log.habit_id == habit.id,
                Habit_Log.completed_at.cast(db.Date) == today
            ).first()
            if not existing_log:
                new_log = Habit_Log(
                    habit_id=habit.id,
                    user_id=user_id,
                    completed=False,
                    completed_at=datetime.now(timezone.utc)
                )
                db.session.add(new_log)
    
        db.session.commit()
        all_logs = Habit_Log.query.filter_by(user_id=user_id).all()
        result = list(map(lambda item: item.serialize(), all_logs))
        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#MARK AS DONE
@api.route("/habit/<int:habit_id>/<int:user_id>/complete", methods=["POST"])
def complete_habit(habit_id, user_id):
    habit = Habit.query.filter_by(id=habit_id).first()
    if habit:
        tracker = Habit_Log.query.filter_by(habit_id=habit_id, user_id=user_id).first()
        if tracker:
            was_completed = tracker.completed
            tracker.completed = not tracker.completed
            tracker.completed_at = datetime.now(timezone.utc) if tracker.completed else None
        else:
            tracker = Habit_Log(
                habit_id=habit.id,
                user_id=user_id,
                completed=True,
                completed_at=datetime.now(timezone.utc),
            )
            db.session.add(tracker)

        if habit.skill is not None:
            skill = Skill.query.filter_by(id=habit.skill).first()
            if skill and skill.user_id == user_id:
                if tracker.completed:
                    skill.progress = (skill.progress or 0) + 1
                    # Check skill progress and level up if necessary
                    while skill.progress >= 100:
                        skill.level = (skill.level or 0) + 1
                        skill.progress -= 100
                elif was_completed:
                    skill.progress = (skill.progress or 0) - 1
                    if skill.progress < 0:
                        skill.progress = 0

        db.session.commit()
        return jsonify({"message": "Habit completion status updated"}), 200

    return jsonify({"error": "Habit not found"}), 404

@api.route("/reset-password", methods=["POST"])
def reset_password():
    body = request.json
    access_token = create_access_token(identity=body, expires_delta=expires_delta)
    message = f"""
        <html>
            <head></head>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #0056b3;">Password Reset Request</h1>
                <p>Hi,</p>
                <p>We received a request to reset your password. Click the link below to set up a new password:</p>
                <a href="{os.getenv("FRONTEND_URL")}password-update?token={access_token}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
                <p>If you did not request a password reset, no further action is required.</p>
                <p style="color: #999;">This link will expire in 15 minutes. If you need further assistance, please contact our support team at habiquest6@gmail.com.</p>
                <p>Thank you,<br>HabiQuest Team</p>
            </body>
        </html>
    """

    data = {
        "subject": "Recuperación de contraseña",
        "to": body,
        "message": message
    }

    sended_email = send_email(data.get("subject"), data.get("to"), data.get("message"))

    print(sended_email)
    return jsonify("trabajando por un mejor servicio :)"), 200

@api.route("/update-password", methods=["PUT"])
@jwt_required()
def update_pass():
    email = get_jwt_identity()
    body = request.json
    user = User.query.filter_by(email=email).one_or_none()
    if user is not None:
        salt = b64encode(os.urandom(32)).decode("utf-8")
        password = set_password(body, salt)
        user.salt = salt
        user.password= password
        try:
            db.session.commit()
            return jsonify("Clave actualizada bien"), 201
        except Exception as error:
            print(error.args)
            return jsonify("No se puede actualizar el password")

@api.route("/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    try:
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        db.session.commit()
        return jsonify(user.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500