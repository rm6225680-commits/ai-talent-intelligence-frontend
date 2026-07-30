import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.token || response.data.accessToken || response.data.jwt;
      const serverRole = response.data.role || response.data.userRole || '';

      if (token) {
        localStorage.setItem('token', token);

        const upperRole = String(serverRole).toUpperCase();
        const lowerEmail = email.toLowerCase();

        if (upperRole.includes('ADMIN') || upperRole.includes('RECRUITER') || lowerEmail.includes('admin') || lowerEmail.includes('recruiter')) {
          localStorage.setItem('role', 'ROLE_RECRUITER');
          window.location.href = '/recruiter-dashboard';
        } else {
          localStorage.setItem('role', 'ROLE_CANDIDATE');
          window.location.href = '/dashboard';
        }
        return;
      } else {
        setError('Authentication token missing from server response.');
      }
    } catch (err) {
      console.error("LOGIN FAILED:", err);
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}