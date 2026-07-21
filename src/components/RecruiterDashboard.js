import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null); // State for Candidate Detail Modal
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
        
        // 🔍 DEBUG LOG: View candidate payload structure in browser console (F12)
        console.log("MY CANDIDATE DATA:", response.data);

        // Ensure data is an array
        if (Array.isArray(response.data)) {
          setCandidates(response.data);
        } else {
          setCandidates([]);
        }
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // Token expired or unauthorized
          localStorage.clear();
          navigate('/login');
        } else {
          setError('Failed to fetch candidate records.');
        }
        console.error(err);
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

  // Helper function to extract candidate name from flat or nested user objects
  const getCandidateName = (candidate) => {
    if (!candidate) return 'N/A';
    
    // Check direct user object name first
    if (candidate.user && candidate.user.name && candidate.user.name.trim() !== '') {
      return candidate.user.name;
    }
    
    return (
      candidate.name ||
      candidate.fullName ||
      candidate.candidateName ||
      candidate.user?.fullName ||
      candidate.user?.username ||
      candidate.username ||
      'N/A'
    );
  };

  // Helper function to extract candidate email from flat or nested user objects
  const getCandidateEmail = (candidate) => {
    if (!candidate) return 'N/A';
    return (
      candidate.user?.email ||
      candidate.email ||
      candidate.userEmail ||
      candidate.user?.username ||
      'N/A'
    );
  };

  // Helper function to safely render skills whether string or object
  const renderSkills = (skills) => {
    if (!skills) return 'Candidate';
    if (typeof skills === 'string') return skills;
    if (typeof skills === 'object') return JSON.stringify(skills);
    return String(skills);
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
            <p className="text-muted mb-0">Manage candidate profiles and AI evaluation scores.</p>
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
                  <th>AI Match Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                      Loading candidates...
                    </td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No candidates found.
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate, index) => (
                    <tr key={candidate.id || index}>
                      <td>{candidate.id || index + 1}</td>
                      <td className="fw-semibold">{getCandidateName(candidate)}</td>
                      <td>{getCandidateEmail(candidate)}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {renderSkills(candidate.skills)}
                        </span>
                      </td>
                      <td>
                        {candidate.aiMatchScore !== undefined && candidate.aiMatchScore !== null ? (
                          <span className={`badge ${
                            String(candidate.aiMatchScore).replace(/%/g, '') >= 75 
                              ? 'bg-success' 
                              : String(candidate.aiMatchScore).replace(/%/g, '') >= 50 
                              ? 'bg-warning text-dark' 
                              : 'bg-danger'
                          }`}>
                            {typeof candidate.aiMatchScore === 'object' 
                              ? candidate.aiMatchScore.score || JSON.stringify(candidate.aiMatchScore)
                              : `${String(candidate.aiMatchScore).replace(/%/g, '')}%`}
                          </span>
                        ) : (
                          <span className="badge bg-light text-dark border">Pending</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
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

        {/* Candidate Detail & AI Evaluation Modal */}
        {selectedCandidate && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content rounded-3 border-0 shadow">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Candidate Details: {getCandidateName(selectedCandidate)}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setSelectedCandidate(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Email</p>
                      <p className="fw-bold">{getCandidateEmail(selectedCandidate)}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-muted">Skills</p>
                      <p className="fw-bold">{renderSkills(selectedCandidate.skills)}</p>
                    </div>

                    {/* AI Evaluation Section */}
                    <div className="col-12 mt-3">
                      <div className="p-3 bg-light rounded border">
                        <h6 className="fw-bold text-primary mb-2">
                          <i className="bi bi-cpu me-2"></i>AI Assessment Summary
                        </h6>
                        
                        {/* Status / Message */}
                        {selectedCandidate.message && (
                          <p className="mb-2"><strong>Message:</strong> {String(selectedCandidate.message)}</p>
                        )}

                        {/* Match Score */}
                        <p className="mb-2">
                          <strong>Match Score: </strong> 
                          {typeof selectedCandidate.aiMatchScore === 'object' 
                            ? JSON.stringify(selectedCandidate.aiMatchScore) 
                            : `${String(selectedCandidate.aiMatchScore ?? 'N/A').replace(/%/g, '')}%`}
                        </p>

                        {/* Evaluation Remarks */}
                        <div className="mb-0">
                          <strong>Evaluation Details: </strong>
                          <div style={{ whiteSpace: 'pre-line', marginTop: '6px' }}>
                            {typeof selectedCandidate.aiEvaluation === 'object'
                              ? JSON.stringify(selectedCandidate.aiEvaluation, null, 2)
                              : (selectedCandidate.aiEvaluation || 'No detailed AI remarks available.')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedCandidate(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RecruiterDashboard;