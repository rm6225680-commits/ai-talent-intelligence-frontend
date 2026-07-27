import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!token) return null; // Don't show navbar if user is not logged in

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white tracking-tight">
          <div className="p-2 bg-sky-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span>Talent<span className="text-sky-400">AI</span></span>
        </Link>

        {/* Links & User Info */}
        <div className="flex items-center gap-6">
          {role === 'RECRUITER' ? (
            <Link 
              to="/recruiter-dashboard" 
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Recruiter Hub
            </Link>
          ) : (
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" /> My Workspace
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

      </div>
    </nav>
  );
}