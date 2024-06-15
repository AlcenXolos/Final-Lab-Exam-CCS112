import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const DoctorDashboard = ({ currentUser }) => {
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

    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
                    <div className="container-fluid">
                        <h2 className="navbar-brand">Doctor Dashboard</h2>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
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
                    <Link to="doctors" className="nav-link text-center bg-primary text-white">
                        Doctor Management
                    </Link>
                </div>
                <div className='col'>
                    <Link to="patients" className="nav-link text-center bg-primary text-white">
                        Patient Management
                    </Link>
                </div>
                <div className='col'>
                    <Link to="appointments" className="nav-link text-center bg-primary text-white">
                        Appointment Management
                    </Link>
                </div>
                <div className='col'>
                    <Link to="records" className="nav-link text-center bg-primary text-white">
                        Medical Records Management
                    </Link>
                </div>
            </div>

            <div className='row'>   
                <main role="main" className="col-md-10 ml-md-auto px-4 container" >
                    <div className="container-fluid content mt-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DoctorDashboard;
