import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Eye, 
  X, 
  Cpu, 
  Mail, 
  Code, 
  Briefcase, 
  LogOut
} from 'lucide-react';

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();

  const fetchCandidates = useCallback(async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Security Guard: Flexible, case-insensitive check for recruiter role
    if (!token || !role || !role.toUpperCase().includes('RECRUITER')) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
      const response = await axios.get(`${baseURL}/api/candidate/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("MY CANDIDATE DATA:", response.data);

      if (Array.isArray(response.data)) {
        setCandidates(response.data);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.clear();
        navigate('/login');
      } else {
        setError('Failed to fetch candidate records.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper function to extract candidate name
  const getCandidateName = (candidate) => {
    if (!candidate) return 'N/A';
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

  // Helper function to extract candidate email
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

  // Helper function to safely render skills
  const renderSkills = (skills) => {
    if (!skills) return 'Candidate';
    if (typeof skills === 'string') return skills;
    if (typeof skills === 'object') return JSON.stringify(skills);
    return String(skills);
  };

  // Filter candidates by search term
  const filteredCandidates = candidates.filter((candidate) => {
    const name = getCandidateName(candidate).toLowerCase();
    const email = getCandidateEmail(candidate).toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* Top Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="p-2 bg-sky-600 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span>Recruiter<span className="text-sky-400">Portal</span></span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Manage candidate profiles and AI evaluation scores.</p>
          </div>
          <button
            onClick={fetchCandidates}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-medium px-4 py-2.5 rounded-xl border border-slate-200 text-sm shadow-sm transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
          </button>
        </div>

        {/* Stats Card & Search Bar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Applicants</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{candidates.length}</h3>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Search Applicants
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidate by name or email..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Candidate Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Candidate Applications</h2>
          </div>

          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">#ID</th>
                  <th className="py-3.5 px-6">Candidate Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Skills / Details</th>
                  <th className="py-3.5 px-6">AI Match Score</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-sky-600" />
                        <span>Loading candidates...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No candidates found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate, index) => {
                    const rawScore = candidate.aiMatchScore !== undefined && candidate.aiMatchScore !== null
                      ? String(typeof candidate.aiMatchScore === 'object' ? candidate.aiMatchScore.score || '' : candidate.aiMatchScore).replace(/%/g, '')
                      : null;

                    const numericScore = rawScore ? parseFloat(rawScore) : null;

                    return (
                      <tr key={candidate.id || index} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-slate-400">
                          #{candidate.id || index + 1}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {getCandidateName(candidate)}
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {getCandidateEmail(candidate)}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block max-w-xs truncate bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-medium border border-slate-200">
                            {renderSkills(candidate.skills)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {numericScore !== null && !isNaN(numericScore) ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              numericScore >= 75
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : numericScore >= 50
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {numericScore}%
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg border border-sky-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {getCandidateName(selectedCandidate)}
                  </h3>
                  <p className="text-xs text-slate-400">Candidate Details & Assessment</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Mail className="w-4 h-4 text-sky-600" /> Email Address
                  </div>
                  <p className="font-medium text-slate-900 break-all">{getCandidateEmail(selectedCandidate)}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Code className="w-4 h-4 text-sky-600" /> Skills / Stack
                  </div>
                  <p className="font-medium text-slate-900">{renderSkills(selectedCandidate.skills)}</p>
                </div>
              </div>

              {/* AI Assessment Box */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-sky-400 flex items-center gap-2">
                    <Cpu className="w-5 h-5" /> AI Assessment Summary
                  </h4>
                  {selectedCandidate.aiMatchScore !== undefined && selectedCandidate.aiMatchScore !== null && (
                    <span className="px-3 py-1 bg-sky-500/10 text-sky-300 border border-sky-500/30 font-semibold rounded-full text-xs">
                      Match Score: {typeof selectedCandidate.aiMatchScore === 'object' 
                        ? JSON.stringify(selectedCandidate.aiMatchScore) 
                        : `${String(selectedCandidate.aiMatchScore).replace(/%/g, '')}%`}
                    </span>
                  )}
                </div>

                {selectedCandidate.message && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Status Message</span>
                    <p className="text-slate-300 text-xs bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                      {String(selectedCandidate.message)}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Evaluation Details</span>
                  <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap bg-slate-800/80 p-3 rounded-lg border border-slate-700/50 font-sans">
                    {typeof selectedCandidate.aiEvaluation === 'object'
                      ? JSON.stringify(selectedCandidate.aiEvaluation, null, 2)
                      : (selectedCandidate.aiEvaluation || 'No detailed AI remarks available.')}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}