import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/Navbar/Nav';
import '../Signup/Signup.css';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Signup API call

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName:name,
        email: email,
        password: password,
      });

      if(response.data && response.data.error) {
        alert(response.data.message);
        return;
      }

      if(response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/");
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
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
}

export default Signup;
