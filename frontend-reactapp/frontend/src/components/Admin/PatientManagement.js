import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
        medical_history: '',
    });
    const formRef = useRef(null);
    const patientListView = useRef(null);

    useEffect(() => {
        fetchPatients();
    }, []); // Fetch patients when component mounts

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/patients'); // Adjust the URL based on your backend routes
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleUpdatePatient = async () => {
        try {
            if (editingPatient) {
                await axios.put(`http://127.0.0.1:8000/api/patients/${editingPatient.id}`, newPatient);
                setEditingPatient(null);
            }
            setNewPatient({
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
            fetchPatients(); // Refresh patients after updating
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleEditPatient = (id) => {
        const patientToEdit = patients.find(patient => patient.id === id);
        setEditingPatient(patientToEdit);
        setNewPatient(patientToEdit);

        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCancelation = () => {
        setEditingPatient(null);
        setNewPatient({
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
        if (patientListView.current) {
            patientListView.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeletePatient = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removePatient/${id}`);
            fetchPatients(); // Refresh patients after deletion
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    return (
        <div className="container">
            <div className="row mt-4" ref={patientListView}>
                <div className="col-md-12">
                    <h4>Patient List</h4>
                    <table className="table">
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(patient => (
                                <tr key={patient.id}>
                                    <td>{patient.first_name} {patient.last_name}</td>
                                    <td>{patient.date_of_birth}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.address}</td>
                                    <td>{patient.phone}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.emergency_contact}</td>
                                    <td>{patient.medical_history}</td>
                                    <td>
                                        <button className="btn btn-info btn-sm" onClick={() => handleEditPatient(patient.id)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeletePatient(patient.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <h3 className="mt-4">Patient Management</h3>
            <div className="row mt-4" ref={formRef}>
                <div className="col-md-6">
                    <h4>Edit Patient - Click a patient to edit</h4>
                    <form>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="first_name" placeholder="First Name" value={newPatient.first_name} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="last_name" placeholder="Last Name" value={newPatient.last_name} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <input type="date" className="form-control" name="date_of_birth" placeholder="Date of Birth" value={newPatient.date_of_birth} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="gender" placeholder="Gender" value={newPatient.gender} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="address" placeholder="Address" value={newPatient.address} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="phone" placeholder="Phone" value={newPatient.phone} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" name="email" placeholder="Email" value={newPatient.email} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="emergency_contact" placeholder="Emergency Contact" value={newPatient.emergency_contact} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <textarea className="form-control" name="medical_history" placeholder="Medical History" value={newPatient.medical_history} onChange={handleInputChange}></textarea>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleUpdatePatient}>Update Patient</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancelation}>Cancel Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientManagement;
