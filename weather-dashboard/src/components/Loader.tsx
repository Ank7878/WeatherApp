import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
      <div style={{
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};