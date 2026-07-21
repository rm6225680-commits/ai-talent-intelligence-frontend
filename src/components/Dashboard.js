import React, { useState } from 'react';
import API from '../api/axiosConfig';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('0');
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatusMessage('Please select a file to upload.');
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('skills', skills);
    formData.append('experience', experience);

    setLoading(true);
    setStatusMessage('');

    try {
      const response = await API.post('/candidate/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsError(false);
      setStatusMessage(response.data || 'Resume uploaded successfully!');
    } catch (err) {
      console.error('Upload Error:', err);
      setIsError(true);
      setStatusMessage(
        err.response?.data?.message || 'Failed to upload resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Candidate Portal</h2>
        <p style={{ color: '#666' }}>
          Welcome! Manage your application profile and upload your resume for AI evaluation.
        </p>
        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              Upload Resume (PDF / DOCX):
            </label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange} 
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              Primary Skills (Comma separated):
            </label>
            <input 
              type="text" 
              value={skills} 
              onChange={(e) => setSkills(e.target.value)} 
              placeholder="e.g., java, spring boot, react"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              Years of Experience:
            </label>
            <input 
              type="number" 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              min="0"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Uploading...' : 'Submit Profile'}
          </button>
        </form>

        {statusMessage && (
          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            borderRadius: '4px', 
            borderLeft: `4px solid ${isError ? '#dc3545' : '#28a745'}`,
            backgroundColor: '#f8f9fa',
            color: isError ? '#dc3545' : '#155724'
          }}>
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;