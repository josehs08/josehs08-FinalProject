"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, set_password
from flask_cors import CORS
from base64 import b64encode
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
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
            return jsonify({"token":token})
        else:
            return jsonify({'error':'invalid credentials'})
        
#Show users
@api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    result = list(map(lambda item: item.serialize(), users))
    return jsonify(result), 200
