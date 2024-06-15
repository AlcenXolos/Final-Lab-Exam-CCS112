import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const DoctorManagement = () => {
    const [role, setRole] = useState('doctor');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        first_name: '',
        last_name: '',
        specialization: '',
        license_number: '',
        phone: '',
        email: '',
        password: '',
        role,

    });
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef(null);
    const doctorListView = useRef(null);

    useEffect(() => {
        fetchDoctors();
    }, []); // Fetch doctors when component mounts

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors'); // Adjust the URL based on your backend routes
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleRegistration = (last_name, first_name, email, password) => {
        // Check if required fields are provided
        // if (!firstName || !lastName || !email || !password) {
        //     alert('Please provide all required fields.');
        //     return;
        // }
    
        const name = `${first_name} ${last_name}`;
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
                     registerDoctor();
                    
                }
            })
            .catch(error => console.error('Error during registration:', error));
    
            setNewDoctor({
                first_name: '',
                last_name: '',
                specialization: '',
                license_number: '',
                phone: '',
                email: '',
                password: '',
                role: '',
            });
    };
    
    const registerDoctor = () => {
        const doctorData = {
            first_name: firstName,
            last_name: lastName,
            specialization,
            license_number: licenseNumber,
            phone,
            email,
            password,
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
                    // navigate('/');
                }
            })
            .catch(error => console.error('Error registering doctor:', error));
    };

    const handleAddOrUpdateDoctor = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/api/doctors/${editingDoctor.id}`, newDoctor);
                setEditingDoctor(null);
                setIsEditing(false);
            } else {
                await axios.post('http://127.0.0.1:8000/api/addDoctors', newDoctor);
                handleRegistration(newDoctor.last_name, newDoctor.first_name, newDoctor.email, newDoctor.password);
            }
            
            fetchDoctors(); // Refresh doctors after adding or updating
        } catch (error) {
            console.error('Error adding/updating doctor:', error);
        }
    };

    const handleEditDoctor = (id) => {
        const doctorToEdit = doctors.find(doctor => doctor.id === id);
        setEditingDoctor(doctorToEdit);
        setIsEditing(true);
        setNewDoctor(doctorToEdit);

        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeleteDoctor = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removeDoctor/${id}`);
            fetchDoctors(); // Refresh doctors after deletion
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    const handleAddDoctorClick = () => {
        setEditingDoctor(null);
        setIsEditing(false);
        setNewDoctor({
            first_name: '',
            last_name: '',
            specialization: '',
            license_number: '',
            phone: '',
            email: '',
            password: '',
        });

        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCancelation = () => {
        setEditingDoctor(null);
        setIsEditing(false);
        setNewDoctor({
            first_name: '',
            last_name: '',
            specialization: '',
            license_number: '',
            phone: '',
            email: ''
        });

        if (doctorListView.current) {
            doctorListView.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="container">
            <div className="row mt-4" ref={doctorListView}>
                <div className="col-md-12">
                    <h4>Doctor List</h4>
                    <button className="btn btn-primary" onClick={handleAddDoctorClick}>Add Doctor</button>
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>License Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doctor => (
                                <tr key={doctor.id}>
                                    <td>{doctor.first_name} {doctor.last_name}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.license_number}</td>
                                    <td>
                                        <button className="btn btn-info btn-sm" onClick={() => handleEditDoctor(doctor.id)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div ref={formRef} className="row mt-4">
                <div className="col-md-6">
                    <h4>{isEditing ? 'Edit Doctor' : 'Add New Doctor'}</h4>
                    <form>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="First Name" value={newDoctor.first_name} onChange={(e) => setNewDoctor({ ...newDoctor, first_name: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Last Name" value={newDoctor.last_name} onChange={(e) => setNewDoctor({ ...newDoctor, last_name: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="License Number" value={newDoctor.license_number} onChange={(e) => setNewDoctor({ ...newDoctor, license_number: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Phone" value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Password" value={newDoctor.password} onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })} />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-primary" onClick={handleAddOrUpdateDoctor}>{isEditing ? 'Update Doctor' : 'Add Doctor'}</button>
                            {isEditing && <button type="button" className="btn btn-secondary" onClick={handleCancelation}>Cancel Update</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorManagement;
