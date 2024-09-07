"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint # type: ignore
from api.models import db, User, Habit
from api.utils import generate_sitemap, APIException, set_password
from flask_cors import CORS # type: ignore
from base64 import b64encode
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity # type: ignore
from werkzeug.security import check_password_hash # type: ignore
import os


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


def check_password(hash_password, password, salt):
    return check_password_hash(hash_password, f"{password}{salt}")

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#Register
###TODO: Falta validar los datos y mejorar las respuestas.
@api.route("/users", methods=["POST"])
def add_user():
    data = request.json
    salt = b64encode(os.urandom(32)).decode("utf-8")
    user = User(
        last_name = data.get("last_name"),
        email = data.get("email"),
        first_name = data.get("first_name"),
        password =  set_password(data.get("password"), salt),
        salt = salt,
        is_active = True
    )
    try:
        db.session.add(user)
        db.session.commit()
        return(jsonify(user.serialize()))
    except Exception as error:
        print(error.args)
        db.session.rollback()
        return(jsonify({'error':'ocurrio un error'}))
    
#Login
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
        
#Show users
@api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    result = list(map(lambda item: item.serialize(), users))
    return jsonify(result), 200

@api.route("/user", methods=["GET"])
@jwt_required()
def get_users_auth():
    user = User.query.get(get_jwt_identity())
    if user is None:
        return jsonify({"message":"user not found"}), 404

    return jsonify(user.serialize()), 200


#Add habit
@api.route("/habit", methods=["POST"])
def add_habit():
    data = request.json
    habit = Habit(
        name= data.get('name'),
        description =data.get('description'),
        user_id=data.get('user_id'),
        deleted=False
    )
    try:
        db.session.add(habit)
        db.session.commit()
        return(jsonify(habit.serialize()))
    except Exception as error:
        print(error.args)
        db.session.rollback()
        return(jsonify({'error':'ocurrio un error'}))
    
#Get all habits
@api.route("/habit", methods=["GET"])
def get_all_habits():
    habits = Habit.query.all()
    result = list(map(lambda item: item.serialize(), habits))
    return jsonify(result)

#Show user habits
@api.route("/user/<int:user_id>/habits", methods=["GET"])
def get_user_habits(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error':'user not found'}), 404
    habits = Habit.query.filter_by(user_id=user_id).all()
    result = list(map(lambda item: item.serialize(), habits))
    return jsonify(result), 200

#Update user habit
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
