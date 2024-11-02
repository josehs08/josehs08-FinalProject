from flask_sqlalchemy import SQLAlchemy # type: ignore
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), unique=False, nullable=False)
    last_name = db.Column(db.String(30), unique=False, nullable=False)
    foto = db.Column(db.String(100), nullable=True)
    public_id_foto = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(180), unique=False, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    salt = db.Column(db.String(180), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    google_id = db.Column(db.String(100), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "foto":self.foto,
            "created": self.created_at,
            "google_id": self.google_id
        }
    

class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    name = db.Column(db.String(30), unique=False, nullable=False)
    description = db.Column(db.String(50), unique=False, nullable=True)
    deleted = db.Column(db.Boolean(), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    skill = db.Column(db.Integer, db.ForeignKey("skill.id"))
    frequency = db.Column(db.String(15), nullable=False) 

    def serialize(self):
        return{
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "date": self.created_at,
            "deleted": self.deleted,
            "user_id": self.user_id,
            "skill_id": self.skill,
            "frequency": self.frequency
        }
    
class Habit_Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    habit_id  = db.Column(db.Integer, db.ForeignKey('habit.id'),nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    completed = db.Column(db.Boolean(), nullable=False, default=False)
    completed_at = db.Column(db.DateTime, nullable=True, default=datetime.now(timezone.utc))

    def serialize(self):
        return{
            "id": self.id,
            "habit_id":self.habit_id,
            "completed_at":self.completed_at,
            "completed":self.completed
         }

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    level = db.Column(db.Integer, unique=False, nullable=True)
    description = db.Column(db.String(50), unique=False, nullable=True)
    progress = db.Column(db.Integer, unique=False, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    

    def serialize(self):
        return{
            "id": self.id,
            "name":self.name,
            "description":self.description,
            "level":self.level,
            "progress":self.progress
        }