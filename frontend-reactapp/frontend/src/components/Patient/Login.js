import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ loginUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Send POST request to login endpoint
    fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log(email);
          console.log(password);
          throw new Error('Invalid email or password');
        }
      })
      .then(data => {
        // If login successful, set user details in local storage and redirect to dashboard
        localStorage.setItem('user', JSON.stringify(data.user));
        loginUser(data.user);
        navigate(`/${data.user.role}dashboard`);
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Login</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleLogin}>
                  Login
                </button>
              </form>
              <p className="mt-3">Don't have an account? <a href="/register">Register</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
