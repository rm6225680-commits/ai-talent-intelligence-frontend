import React, { useState } from 'react';
import API from '../api/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    role: 'CANDIDATE' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', formData);
      alert(response.data || 'Registration successful! Please login.');
    } catch (err) {
      alert(err.response?.data || 'Registration failed.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          onChange={handleChange} 
          required 
        /><br/><br/>
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        /><br/><br/>
        <select name="role" onChange={handleChange}>
          <option value="CANDIDATE">Candidate</option>
          <option value="RECRUITER">Recruiter</option>
        </select><br/><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;