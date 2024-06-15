import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Registration = () => {
    const [role, setRole] = useState('patient');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const navigate = useNavigate();

    const handleRegistration = () => {
        const name = `${firstName} ${lastName}`;
        const userData = {
            name,
            email,
            password,
            role,
        };

        fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    alert('Error during registration: ' + JSON.stringify(data.errors));
                } else {
                    if (role === 'patient') {
                        registerPatient();
                    } else if (role === 'doctor') {
                        registerDoctor();
                    }
                }
            })
            .catch(error => console.error('Error during registration:', error));
    };

    const registerPatient = () => {
        const patientData = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            gender,
            address,
            phone,
            email,
            emergency_contact: emergencyContact,
            medical_history: medicalHistory,
        };

        fetch('http://127.0.0.1:8000/api/addPatients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    alert('Error registering patient: ' + JSON.stringify(data.errors));
                } else {
                    alert('Patient account created successfully! Please log in.');
                    navigate('/');
                }
            })
            .catch(error => console.error('Error registering patient:', error));
    };

    const registerDoctor = () => {
        const doctorData = {
            first_name: firstName,
            last_name: lastName,
            specialization,
            license_number: licenseNumber,
            phone,
            email,
        };

        fetch('http://127.0.0.1:8000/api/addDoctors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(doctorData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errors) {
                    alert('Error registering doctor: ' + JSON.stringify(data.errors));
                } else {
                    alert('Doctor account created successfully! Please log in.');
                    navigate('/');
                }
            })
            .catch(error => console.error('Error registering doctor:', error));
    };

    return (
      <div className="container mt-5">
          <div className="row justify-content-center">
              <div className="col-md-6">
                  <div className="card">
                      <div className="card-body">
                          <h2 className="card-title">Registration</h2>
                          <div className="form-group">
                              <label>PATIENT</label>
                          </div>
                          <div className="form-group mb-3">
                              <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                          </div>
                          <div className="form-group mb-3">
                              <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                          </div>
                          {role === 'patient' && (
                              <>
                                  <div className="form-group mb-3">
                                      <input type="date" className="form-control" placeholder="Date of Birth" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                                  </div>
                                  <div className="form-group mb-3">
                                      <input type="text" className="form-control" placeholder="Gender" value={gender} onChange={e => setGender(e.target.value)} />
                                  </div>
                                  <div className="form-group mb-3">
                                      <input type="text" className="form-control" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
                                  </div>
                                  <div className="form-group mb-3">
                                      <input type="tel" className="form-control" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                                  </div>
                                  <div className="form-group mb-3">
                                      <input type="text" className="form-control" placeholder="Emergency Contact" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} />
                                  </div>
                                  <div className="form-group mb-3">
                                      <input type="text" className="form-control" placeholder="Medical History" value={medicalHistory} onChange={e => setMedicalHistory(e.target.value)} />
                                  </div>
                              </>
                          )}
                          {role === 'doctor' && (
                              <>
                                  <div className="form-group mb-3">
                                      <input type="tel" className="form-control" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                                  </div>
                                  <div className="form-group mb-3">
                                      <input type="text" className="form-control" placeholder="Specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} />
                                  </div>
                                  <div className="form-group mb-3">
                                      <input type="text" className="form-control" placeholder="License Number" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
                                  </div>
                              </>
                          )}
                          <div className="form-group mb-3">
                              <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                          </div>
                          <div className="form-group mb-3">
                              <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                          </div>
                          <button type="button" className="btn btn-primary mb-3" onClick={handleRegistration}>Register</button>
                          <p>Already have an account? <a href="/">Login</a></p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Registration;
