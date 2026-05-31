import React, { useState } from 'react';

interface BulkAnalyticsFormProps {
  onSubmit: (cities: string[]) => void;
  loading: boolean;
}

export const BulkAnalyticsForm: React.FC<BulkAnalyticsFormProps> = ({ onSubmit, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const cityArray = input.split(',').map(c => c.trim()).filter(c => c.length > 0);
    onSubmit(cityArray);
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>📊 Compare Cities</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter cities separated by commas (e.g. London, Tokyo, Delhi)"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '15px',
            boxSizing: 'border-box'
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            marginTop: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '15px'
          }}
        >
          {loading ? 'Processing Data Stack...' : 'Analyze Metrics'}
        </button>
      </form>
    </div>
  );
};