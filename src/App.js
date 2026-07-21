import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import RecruiterDashboard from './components/RecruiterDashboard';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '15px', background: '#f4f4f4', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '0 15px' }}>Login</Link>
          <Link to="/register" style={{ margin: '0 15px' }}>Register</Link>
          <Link to="/dashboard" style={{ margin: '0 15px' }}>Candidate Dashboard</Link>
          <Link to="/recruiter" style={{ margin: '0 15px' }}>Recruiter Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;