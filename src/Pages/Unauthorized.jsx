import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      color: '#e0e0e0',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(233, 69, 96, 0.1)',
        borderRadius: '50%',
        padding: '30px',
        marginBottom: '20px'
      }}>
        <ShieldOff size={80} color="#e94560" />
      </div>
      <h1 style={{ fontSize: '2rem', marginBottom: '10px', color: '#e94560' }}>
        Access Denied
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '10px' }}>
        You don't have permission to access this page.
      </p>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '30px' }}>
        Please contact your administrator if you believe this is an error.
      </p>
      <button
        onClick={() => navigate('/manager/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          background: 'rgba(182, 243, 0, 0.15)',
          color: '#b6f300',
          border: '1px solid rgba(182, 243, 0, 0.3)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(182, 243, 0, 0.25)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(182, 243, 0, 0.15)'}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
    </div>
  );
};

export default Unauthorized;