import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [editingPatient, setEditingPatient] = useState(null);
    const [newPatient, setNewPatient] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        emergency_contact: '',
        medical_history: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleEditPatient = (patient) => {
        setEditingPatient(patient);
        setNewPatient(patient);
        // Trigger modal for editing
    };

    const handleUpdatePatient = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/patients/${editingPatient.id}`, newPatient);
            setEditingPatient(null);
            // Close modal for editing
            fetchPatients(); // Refresh patient list
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    return (
        <div className="container">
            <h3 className="mt-4">Patient Management</h3>
            <div>
                {/* Modal for editing patient information */}
                {editingPatient && (
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Patient</h5>
                                    <button type="button" className="close" onClick={() => setEditingPatient(null)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {/* Input fields for editing patient */}
                                    <button className="btn btn-primary" onClick={handleUpdatePatient}>Update Patient</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div>
                {/* Table to display patients */}
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Emergency Contact</th>
                            <th>Medical History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient.id} onClick={() => handleEditPatient(patient)} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}>
                                <td>{patient.first_name} {patient.last_name}</td>
                                <td>{patient.date_of_birth}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.address}</td>
                                <td>{patient.phone}</td>
                                <td>{patient.email}</td>
                                <td>{patient.emergency_contact}</td>
                                <td>{patient.medical_history}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientManagement;
