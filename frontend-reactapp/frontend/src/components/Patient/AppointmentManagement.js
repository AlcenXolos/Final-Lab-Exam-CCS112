import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentManagement = ({ currentUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        doctor_id: '',
        appointment_date: '',
        reason: ''
    });
    const [activeEdit, setActiveEdit] = useState(null);

    useEffect(() => {
        fetchPatientId();
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (patientId) {
            fetchAppointments(patientId);
        }
    }, [patientId]);

    const fetchPatientId = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/patientsEmail/${currentUser.email}`);
            const fetchedPatientId = response.data.id;
            setPatientId(fetchedPatientId);
        } catch (error) {
            console.error('Failed to fetch patient ID:', error);
        }
    };

    const fetchAppointments = async (patientId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/appointmentsPatient/${patientId}`);
            const appointmentsWithDoctorDetails = await Promise.all(
                response.data.map(async appointment => {
                    const doctorName = await fetchPersonDetails('doctors', appointment.doctor_id);
                    return {
                        ...appointment,
                        doctor: doctorName
                    };
                })
            );
            setAppointments(appointmentsWithDoctorDetails);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/doctors`);
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchPersonDetails = async (type, id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/${type}/${id}`);
            return `${response.data.first_name} ${response.data.last_name}`;
        } catch (error) {
            console.error(`Failed to fetch ${type} details with id ${id}:`, error);
            return 'Unknown';
        }
    };

    const cancelAppointment = (appointmentId) => {
        axios.delete(`http://127.0.0.1:8000/api/removeAppointments/${appointmentId}`)
            .then(response => {
                const updatedAppointments = appointments.map(appointment =>
                    appointment.id === appointmentId ? { ...appointment, status: 'cancelled' } : appointment
                );
                setAppointments(updatedAppointments);
                setActiveEdit(null);
            })
            .catch(error => {
                console.error('Error cancelling appointment:', error);
            });
    };

    const bookAppointment = () => {
        const { doctor_id, appointment_date, reason } = newAppointment;

        if (!doctor_id || !appointment_date || !reason) {
            console.error('Please fill all fields');
            return;
        }

        const appointmentData = {
            patient_id: patientId,
            doctor_id: parseInt(doctor_id),
            appointment_date: appointment_date,
            reason: reason,
            status: 'scheduled'
        };

        axios.post('http://127.0.0.1:8000/api/addAppointments', appointmentData)
            .then(response => {
                const addedAppointment = response.data;
                setAppointments([...appointments, addedAppointment]);
                setNewAppointment({
                    doctor_id: '',
                    appointment_date: '',
                    reason: ''
                });
            })
            .catch(error => {
                console.error('Error booking appointment:', error);
            });
    };

    return (
        <div className="container">
            <h3 className="mt-4">Appointment Management</h3>

            <div className="row mt-4">
                <div className="col-md-12">
                    <h4>Your Appointments</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Appointment Date</th>
                                    <th>Doctor</th>
                                    <th>Status</th>
                                    <th>Reason</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.appointment_date}</td>
                                        <td>{appointment.doctor}</td>
                                        <td>{appointment.status}</td>
                                        <td>{appointment.reason}</td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <h4>Schedule New Appointment</h4>
                    <div className="form-group">
                        <select
                            className="form-control"
                            value={newAppointment.doctor_id}
                            onChange={(e) => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{`${doctor.first_name} ${doctor.last_name}`}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <input
                            type="date"
                            className="form-control"
                            value={newAppointment.appointment_date}
                            onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Reason"
                            value={newAppointment.reason}
                            onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={bookAppointment}>Book Appointment</button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentManagement;
