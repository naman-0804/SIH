from flask import Flask, render_template_string
from flask_cors import CORS
from flask_mail import Mail
from flask_session import Session
from flask_admin import Admin
from flask_admin.contrib.pymongo import ModelView
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, DateTimeField, TextAreaField
from wtforms.validators import DataRequired
from datetime import timedelta
from pymongo import MongoClient

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
Session(app)

CORS(app, resources={r"/auth/*": {
    "origins": ["http://localhost:3000"],
    "methods": ["POST", "OPTIONS", "GET"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

# MongoDB configuration
client = MongoClient(
    'mongodb+srv://namansrivastava1608:sihsite@sihsite.oecua77.mongodb.net/?retryWrites=true&w=majority&appName=sihsite',
    tls=True
)
db = client.sihsite

# Forms
class DoctorForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

class PatientForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

class AppointmentForm(FlaskForm):
    doctor_username = StringField('Doctor Username', validators=[DataRequired()])
    patient_username = StringField('Patient Username', validators=[DataRequired()])
    appointment_time = DateTimeField('Appointment Time', validators=[DataRequired()], format='%Y-%m-%d %H:%M:%S')
    description = TextAreaField('Description', validators=[DataRequired()])

class PrescriptionForm(FlaskForm):
    doctor_username = StringField('Doctor Username', validators=[DataRequired()])
    patient_username = StringField('Patient Username', validators=[DataRequired()])
    prescription_details = TextAreaField('Prescription Details', validators=[DataRequired()])

# Views
class DoctorView(ModelView):
    column_list = ('username', 'password')
    form = DoctorForm

class PatientView(ModelView):
    column_list = ('username', 'password')
    form = PatientForm

class AppointmentView(ModelView):
    column_list = ('doctor_username', 'patient_username', 'appointment_time', 'description')
    form = AppointmentForm

class PrescriptionView(ModelView):
    column_list = ('doctor_username', 'patient_username', 'prescription_details')
    form = PrescriptionForm

admin = Admin(app, name='Admin Panel', template_mode='bootstrap3')
admin.add_view(DoctorView(db.doctors, 'Doctors'))
admin.add_view(PatientView(db.patients, 'Patients'))
admin.add_view(AppointmentView(db.appointments, 'Appointments'))
admin.add_view(PrescriptionView(db.prescriptions, 'Prescriptions'))

def initialize_db():
    # Check if collections already exist
    collections = db.list_collection_names()

    # If collections don't exist, create them
    if 'doctors' not in collections:
        db.create_collection('doctors')
    if 'patients' not in collections:
        db.create_collection('patients')
    if 'appointments' not in collections:
        db.create_collection('appointments')
    if 'prescriptions' not in collections:
        db.create_collection('prescriptions')

    # Create indexes
    db.doctors.create_index('username', unique=True)
    db.patients.create_index('username', unique=True)
    db.appointments.create_index([('doctor_username', 1), ('patient_username', 1), ('appointment_time', 1)], unique=True)
    db.prescriptions.create_index([('doctor_username', 1), ('patient_username', 1)], unique=True)

initialize_db()

@app.route('/')
def home():
    return render_template_string('<h1>Welcome to the Admin Panel</h1><p>You can access the admin panel at <a href="/admin">/admin</a></p>')

if __name__ == '__main__':
    app.run(debug=True)
