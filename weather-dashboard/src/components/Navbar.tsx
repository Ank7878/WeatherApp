import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav style={{ backgroundColor: '#2563eb', padding: '15px 20px', color: 'white', marginBottom: '30px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🌤️ WeatherOps Dashboard</h2>
      </div>
    </nav>
  );
};