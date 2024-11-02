from flask import jsonify, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib, ssl
from api.models import db, Habit, Skill

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

def set_password(password, salt):
    return generate_password_hash(f"{password}{salt}")

def send_email(subject, to, body):
    smtp_address =os.getenv("SMTP_ADDRESS")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_email= os.getenv("EMAIL_ADDRESS")
    smtp_password=os.getenv("EMAIL_PASSWORD")
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = smtp_email
    message["To"] = to
    html = """
            <html>
                <body>
                    """ + body + """
                </body>
            </html>
        """
    
    html_mime = MIMEText(html, "html")

    message.attach(html_mime)

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_address, smtp_port, context=context) as server:
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_address, to, message.as_string())
            print("message sended")

        return True

    except Exception as error:
        print(error.args)

        return False
    
def create_default_habits_and_skills(user):
    try:
        default_habits = [
            Habit(name="Daily Meditation", description="Meditate for 10 minutes", user_id=user.id, skill=None, deleted=False, frequency="daily"),
            Habit(name="Morning Run", description="Run for 30 minutes", user_id=user.id, skill=None, deleted=False, frequency="daily"),
            Habit(name="Read a Book", description="Read 20 pages of a book", user_id=user.id, skill=None, deleted=False, frequency="daily"),
            Habit(name="Practice Coding", description="Practice coding for 1 hour", user_id=user.id, skill=None, deleted=False, frequency="daily"),
            Habit(name="Weekly Yoga", description="Attend a yoga class", user_id=user.id, skill=None, deleted=False, frequency="weekly"),
            Habit(name="Grocery Shopping", description="Buy groceries for the week", user_id=user.id, skill=None, deleted=False, frequency="weekly"),
            Habit(name="Family Time", description="Spend quality time with family", user_id=user.id, skill=None, deleted=False, frequency="weekly"),
            Habit(name="House Cleaning", description="Clean the house", user_id=user.id, skill=None, deleted=False, frequency="weekly"),
            Habit(name="Monthly Budget", description="Review monthly expenses", user_id=user.id, skill=None, deleted=False, frequency="monthly"),
            Habit(name="Fitness Check", description="Check fitness progress", user_id=user.id, skill=None, deleted=False, frequency="monthly"),
        ]
        default_skills = [
            Skill(name="Stress Management", description="Ability to manage stress", user_id=user.id, level=0, progress=0),
            Skill(name="Communication", description="Improve communication skills", user_id=user.id, level=0, progress=0),
            Skill(name="Time Management", description="Manage time effectively", user_id=user.id, level=0, progress=0),
            Skill(name="Public Speaking", description="Enhance public speaking skills", user_id=user.id, level=0, progress=0),
            Skill(name="Leadership", description="Develop leadership abilities", user_id=user.id, level=0, progress=0),
            Skill(name="Physical Fitness", description="Improve physical health", user_id=user.id, level=0, progress=0),
            Skill(name="Critical Thinking", description="Enhance critical thinking skills", user_id=user.id, level=0, progress=0),
            Skill(name="Creative Writing", description="Improve creative writing", user_id=user.id, level=0, progress=0),
            Skill(name="Budgeting", description="Effective budgeting skills", user_id=user.id, level=0, progress=0),
            Skill(name="Cooking", description="Develop cooking skills", user_id=user.id, level=0, progress=0),
        ]

        for habit in default_habits:
            print("paso")
            db.session.add(habit)
        for skill in default_skills:
            print("paso")
            db.session.add(skill)

        db.session.commit()
        print("termino")
    except Exception as error:
        db.session.rollback()
        print("Error creating default habits and skills:", error)