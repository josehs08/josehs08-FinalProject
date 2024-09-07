from flask_sqlalchemy import SQLAlchemy # type: ignore

db = SQLAlchemy()
#TODO agregar fecha de creacion de cada uno.
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), unique=False, nullable=False)
    last_name = db.Column(db.String(30), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(180), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    salt = db.Column(db.String(180), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name
        }
    
class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    name = db.Column(db.String(30), unique=False, nullable=False)
    description = db.Column(db.String(50), unique=False, nullable=True)
    deleted = db.Column(db.Boolean, unique=False, nullable=False)

    def serialize(self):
        return{
            "id": self.id,
            "name":self.name,
            "description":self.description,
            "deleted":self.deleted
        }
