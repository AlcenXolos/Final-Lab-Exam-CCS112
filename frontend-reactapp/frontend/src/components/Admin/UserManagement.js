import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
    const { users, setUsers } = useOutletContext();
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'patient' });
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const formRef = useRef(null);
    const userListView = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        setUsers([]);
        fetchUsers();
    }, [setUsers]);

    const handleAddOrUpdateUser = async () => {
        const userData = {
            ...newUser,
            name: `${firstName} ${lastName}`,
        };

        if (isEditing) {
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/users/${editingUser.id}`, userData);
                const updatedUser = response.data;
                setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
                resetForm();

                const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/register', userData);
                const addedUser = response.data;

                if (newUser.role === 'patient') {
                    await registerPatient();
                } else if (newUser.role === 'doctor') {
                    await registerDoctor();
                } else {
                    setUsers([...users, addedUser]);
                    resetForm();
                }

                const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error adding user:', error);
            }
        }
    };

    const registerPatient = async () => {
        const patientData = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            gender,
            address,
            phone,
            email: newUser.email,
            emergency_contact: emergencyContact,
            medical_history: medicalHistory,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/addPatients', patientData);
            const data = response.data;
            if (data.errors) {
                alert('Error registering patient: ' + JSON.stringify(data.errors));
            } else {
                resetForm();
            }
        } catch (error) {
            console.error('Error registering patient:', error);
        }
    };

    const registerDoctor = async () => {
        const doctorData = {
            first_name: firstName,
            last_name: lastName,
            specialization,
            license_number: licenseNumber,
            phone,
            email: newUser.email,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/addDoctors', doctorData);
            const data = response.data;
            if (data.errors) {
                alert('Error registering doctor: ' + JSON.stringify(data.errors));
            } else {
                resetForm();
            }
        } catch (error) {
            console.error('Error registering doctor:', error);
        }
    };

    const handleEditUser = async (id) => {
        const userToEdit = users.find(user => user.id === id);
        setEditingUser(userToEdit);
        setIsEditing(true);
        setNewUser({ email: userToEdit.email, role: userToEdit.role });
        const [firstName, lastName] = userToEdit.name.split(' ');
        setFirstName(firstName);
        setLastName(lastName);

        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removeUser/${id}`);
            setUsers(users.filter(user => user.id !== id));
            const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
            setUsers(usersResponse.data);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleAddUserClick = () => {
        resetForm();
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleCancelation = () => {
        resetForm();
        if (userListView.current) {
            userListView.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setIsEditing(false);
        setNewUser({ email: '', password: '', role: 'patient' });
        setFirstName('');
        setLastName('');
        setDateOfBirth('');
        setGender('');
        setAddress('');
        setPhone('');
        setEmergencyContact('');
        setMedicalHistory('');
        setSpecialization('');
        setLicenseNumber('');
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4">User Management</h3>
            <div ref={userListView} className="d-flex justify-content-between align-items-center">
                <h4>User List</h4>
                <button className="btn btn-primary" onClick={handleAddUserClick}>Add User</button>
            </div>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => handleEditUser(user.id)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="card mb-4" ref={formRef}>
                <div className="card-header">
                    <h4>{isEditing ? 'Edit User' : 'Add New User'}</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <select className="form-select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="patient">Patient</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    {!isEditing && newUser.role === 'patient' && (
                        <>
                            <div className="mb-3">
                                <input type="date" className="form-control" placeholder="Date of Birth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Emergency Contact" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control" placeholder="Medical History" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)}></textarea>
                            </div>
                        </>
                    )}
                    {!isEditing && newUser.role === 'doctor' && (
                        <>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </>
                    )}
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                    </div>
                    {!isEditing && (
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                        </div>
                    )}
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary" onClick={handleAddOrUpdateUser}>{isEditing ? 'Update User' : 'Add User'}</button>
                        {isEditing && <button className="btn btn-secondary" onClick={handleCancelation}>Cancel Update</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
