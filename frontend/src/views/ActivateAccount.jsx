import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('activating');
  const [message, setMessage] = useState('');
  const hasAttempted = React.useRef(false);

  useEffect(() => {
    const activate = async () => {
      if (hasAttempted.current) return;
      hasAttempted.current = true;

      if (!token) {
        setStatus('error');
        setMessage('No activation token provided.');
        return;
      }

      try {
        const response = await api.get(`/auth/activate?token=${token}`);
        setStatus('success');
        setMessage('Your account has been successfully activated!');
        
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage(err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Failed to activate account. The link may be invalid or expired.'));
      }
    };

    activate();
  }, [token, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
        {status === 'activating' && (
          <>
            <h2 style={{ color: '#111827', fontSize: '24px', marginBottom: '10px' }}>Activating...</h2>
            <p style={{ color: '#4b5563' }}>Please wait while we activate your account.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ backgroundColor: '#d1fae5', color: '#10b981', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px auto' }}>
              ✓
            </div>
            <h2 style={{ color: '#111827', fontSize: '24px', marginBottom: '10px' }}>Activated!</h2>
            <p style={{ color: '#4b5563', marginBottom: '20px' }}>{message}</p>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Redirecting to login...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ color: '#ef4444', fontSize: '60px', marginBottom: '20px' }}>✕</div>
            <h2 style={{ color: '#111827', fontSize: '24px', marginBottom: '10px' }}>Activation Failed</h2>
            <p style={{ color: '#4b5563', marginBottom: '20px' }}>{message}</p>
            <button 
              onClick={() => navigate('/auth')} 
              style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
