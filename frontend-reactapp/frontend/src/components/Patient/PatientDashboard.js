import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFileMedical, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../../App.css'

const PatientDashboard = ({ currentUser, users, setUsers }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout action here (e.g., clear session, reset authentication state)
        navigate('/');
    };

    React.useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    React.useEffect(() => {
        if (currentUser) {
            navigate('appointments');
        }
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="container-fluid">
                        <h2 className="navbar-brand">Patient Dashboard</h2>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item pe-3">
                                    <span className="navbar-text fs-5">Welcome, {currentUser.name}</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            <div className='row mt-5'>
                <div className='col'>
                    <Link to="appointments" className="nav-link text-center bg-primary text-white" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', display: 'block', marginBottom: '5px' }}>
                        Appointment Management
                    </Link>
                </div>
                <div className='col'>
                    <Link to="records" className="nav-link text-center bg-primary text-white" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', display: 'block', marginBottom: '5px' }}>
                       Medical Records Management
                    </Link>
                </div>
            </div>

            <div className='row'>
                <div className="container-fluid content mt-4" >
                    <Outlet context={{ users, setUsers }} />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
