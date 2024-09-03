from flask import Flask, render_template_string, request, jsonify, make_response
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
    "origins": ["http://localhost:3000", "https://sihsite.vercel.app"],
    "methods": ["POST", "OPTIONS", "GET"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://sihsite.vercel.app')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

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

# Authentication routes
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # 'doctor' or 'patient'

    if not username or not password or not role:
        return make_response(jsonify({'error': 'Missing fields'}), 400)

    hashed_password = (password)

    if role == 'doctor':
        if db.doctors.find_one({'username': username}):
            return make_response(jsonify({'error': 'User already exists'}), 400)
        db.doctors.insert_one({'username': username, 'password': hashed_password})
    elif role == 'patient':
        if db.patients.find_one({'username': username}):
            return make_response(jsonify({'error': 'User already exists'}), 400)
        db.patients.insert_one({'username': username, 'password': hashed_password})
    else:
        return make_response(jsonify({'error': 'Invalid role'}), 400)

    return jsonify({'message': 'User registered successfully'})

@app.route('/auth/login', methods=['POST' ])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # 'doctor' or 'patient'

    if not username or not password or not role:
        return make_response(jsonify({'error': 'Missing fields'}), 400)

    if role == 'doctor':
        user = db.doctors.find_one({'username': username})
    elif role == 'patient':
        user = db.patients.find_one({'username': username})
    else:
        return make_response(jsonify({'error': 'Invalid role'}), 400)

    if user and (user['password'], password):
        return jsonify({'message': 'Login successful'})
    else:
        return make_response(jsonify({'error': 'Invalid credentials'}), 400)

# CRUD routes
@app.route('/doctors', methods=['GET', 'POST'])
def manage_doctors():
    if request.method == 'GET':
        doctors = list(db.doctors.find({}, {'_id': 0, 'password': 0}))
        return jsonify(doctors)
    elif request.method == 'POST':
        data = request.get_json()
        db.doctors.insert_one(data)
        return jsonify({'message': 'Doctor added successfully'})

@app.route('/patients', methods=['GET', 'POST'])
def manage_patients():
    if request.method == 'GET':
        patients = list(db.patients.find({}, {'_id': 0, 'password': 0}))
        return jsonify(patients)
    elif request.method == 'POST':
        data = request.get_json()
        db.patients.insert_one(data)
        return jsonify({'message': 'Patient added successfully'})

@app.route('/appointments', methods=['GET', 'POST'])
def manage_appointments():
    if request.method == 'GET':
        appointments = list(db.appointments.find({}, {'_id': 0}))
        return jsonify(appointments)
    elif request.method == 'POST':
        data = request.get_json()
        db.appointments.insert_one(data)
        return jsonify({'message': 'Appointment added successfully'})

@app.route('/prescriptions', methods=['GET', 'POST'])
def manage_prescriptions():
    if request.method == 'GET':
        prescriptions = list(db.prescriptions.find({}, {'_id': 0}))
        return jsonify(prescriptions)
    elif request.method == 'POST':
        data = request.get_json()
        db.prescriptions.insert_one(data)
        return jsonify({'message': 'Prescription added successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
