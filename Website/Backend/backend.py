from flask import Flask, request, jsonify, make_response
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
from flask import Flask, request, jsonify, make_response, session

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
Session(app)

# Specify allowed origins
CORS(app, resources={r"/auth/*": {
    "origins": ["http://localhost:3000"], 
    "methods": ["POST", "OPTIONS", "GET"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
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
    role= StringField('Role',validators=[DataRequired()])
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

@app.route('/auth/login', methods=['POST'])
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

    if user and user['password'] == password:
        session['logged_in'] = True
        session['username'] = username
        session['role'] = role
        return jsonify({'message': 'Login successful'})
    else:
        return make_response(jsonify({'error': 'Invalid credentials'}), 400)
    pass

@app.route('/auth/get_user_data', methods=['GET'])
def get_user_data():
    if 'logged_in' not in session or not session['logged_in']:
        return jsonify({'error': 'Not logged in'}), 401

    username = session['username']
    role = session['role']

    if role == 'doctor':
        user = db.doctors.find_one({'username': username})
    elif role == 'patient':
        user = db.patients.find_one({'username': username})
    else:
        return jsonify({'error': 'Invalid role'}), 400

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'username': user['username'],
        'role': role
    }), 200
# Doctor Panel API Endpoints

@app.route('/doctors/patients', methods=['GET'])
def get_patient_list():
    if 'logged_in' not in session or session['role'] != 'doctor':
        return jsonify({'error': 'Unauthorized'}), 403
    patients = list(db.patients.find({}, {'_id': 0, 'password': 0}))
    return jsonify(patients)

@app.route('/doctors/appointments', methods=['GET'])
def get_doctor_appointments():
    if 'logged_in' not in session or session['role'] != 'doctor':
        return jsonify({'error': 'Unauthorized'}), 403
    username = session['username']
    appointments = list(db.appointments.find({'doctor_username': username}, {'_id': 0}))
    return jsonify(appointments)

@app.route('/doctors/prescriptions', methods=['POST'])
def prescribe_medicine():
    if 'logged_in' not in session or session['role'] != 'doctor':
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    prescription = {
        'doctor_username': session['username'],
        'patient_username': data.get('patient_username'),
        'prescription_details': data.get('prescription_details')
    }
    db.prescriptions.insert_one(prescription)
    return jsonify({'message': 'Prescription added successfully'})

# Patient Panel API Endpoints
@app.route('/patients/doctors', methods=['GET'])
def get_doctor_list():
    if 'logged_in' not in session or session['role'] != 'patient':
        return jsonify({'error': 'Unauthorized'}), 403
    
    try:
        doctors = list(db.doctors.find({}, {'_id': 0, 'password': 0}))
        return jsonify(doctors), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/patients/appointments', methods=['POST'])
def schedule_appointment():
    if 'logged_in' not in session or session['role'] != 'patient':
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.get_json()
    appointment = {
        'doctor_username': data.get('doctor_username'),
        'patient_username': session['username'],
        'appointment_time': data.get('appointment_time'),
        'description': data.get('description')
    }
    db.appointments.insert_one(appointment)
    return jsonify({'message': 'Appointment scheduled successfully'})
@app.route('/patients/appointments', methods=['GET'])
def get_appointments():
    if 'logged_in' not in session or session['role'] != 'patient':
        return jsonify({'error': 'Unauthorized'}), 403
    
    username = session['username']  # Get the logged-in patient's username
    try:
        # Retrieve all appointments for the logged-in patient
        appointments = list(db.appointments.find({'patient_username': username}, {'_id': 0}))
        return jsonify(appointments), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/patients/medicines', methods=['GET'])
def get_medicine_list():
    if 'logged_in' not in session or session['role'] != 'patient':
        return jsonify({'error': 'Unauthorized'}), 403
    username = session['username']
    prescriptions = list(db.prescriptions.find({'patient_username': username}, {'_id': 0}))
    return jsonify(prescriptions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
