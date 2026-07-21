import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Security Guard: Check auth before making API calls
    if (!token || role !== 'ROLE_RECRUITER') {
      navigate('/login');
      return;
    }

    // Fetch live candidate profiles from backend
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/candidate/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCandidates(response.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // Token expired or unauthorized
          localStorage.clear();
          navigate('/login');
        } else {
          setError('Failed to fetch candidate records.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4">
        <span className="navbar-brand fw-bold">
          <i className="bi bi-briefcase-fill me-2 text-primary"></i>Recruiter Portal
        </span>
        <button className="btn btn-outline-light btn-sm ms-auto" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark">Dashboard Overview</h2>
            <p className="text-muted mb-0">Manage candidate profiles and application statuses.</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="card border-0 shadow-sm rounded-3 p-4 mb-4">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white p-3 rounded-circle me-3">
              <i className="bi bi-people-fill fs-3"></i>
            </div>
            <div>
              <h5 className="mb-1 text-secondary fw-semibold">Total Applicants</h5>
              <h3 className="mb-0 fw-bold text-dark">{candidates.length}</h3>
            </div>
          </div>
        </div>

        {/* Candidate Table Section */}
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <div className="card-header bg-white py-3 border-0">
            <h5 className="fw-bold mb-0 text-dark">Candidate Applications</h5>
          </div>

          {error && <div className="alert alert-danger m-3">{error}</div>}

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#ID</th>
                  <th>Candidate Name</th>
                  <th>Email</th>
                  <th>Skills / Details</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                      Loading candidates...
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate, index) => (
                    <tr key={candidate.id || index}>
                      <td>{candidate.id || index + 1}</td>
                      <td className="fw-semibold">{candidate.name || candidate.username || 'N/A'}</td>
                      <td>{candidate.email}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {candidate.skills || candidate.role || 'Candidate'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-eye me-1"></i> View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RecruiterDashboard;