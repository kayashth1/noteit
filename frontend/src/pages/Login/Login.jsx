import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../../components/Navbar/Nav';
import '../Login/Login.css';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';


function Login() {
  const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
   
    // Login API call

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if(response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        Navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message){
        alert(error.response.data.message);
      }
      else{
        alert("An Unexpected error occurred. Please try again !")
      }
    }

  };

  return (
    <>
      <Nav />
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p>
          Not registered? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </>
  );
}

export default Login;
