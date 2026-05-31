import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BulkAnalyticsForm } from './components/BulkAnalyticsForm';
import { AnalyticsSummary } from './components/AnalyticsSummary';
import { Loader } from './components/Loader';
import { weatherApiService } from './services/weatherApi';
import type { BulkAnalyticsResponse, SingleCityResponse } from './services/weatherApi'; 

function App() {
  const [analytics, setAnalytics] = useState<BulkAnalyticsResponse | null>(null);
  const [searchedCities, setSearchedCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for the second requirement (Single City 5-Day Forecast)
  const [selectedCityData, setSelectedCityData] = useState<SingleCityResponse | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Handle Bulk POST Analytics
  const handleFetchAnalytics = async (cities: string[]) => {
    setLoading(true);
    setError(null);
    setSelectedCityData(null); // Clear old forecast view
    try {
      const data = await weatherApiService.getBulkAnalytics(cities);
      setAnalytics(data);
      setSearchedCities(cities); // Remember cities to let user click them
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resolve data endpoints with backend.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Single City GET Analytics (Requirement 2)
  const handleCityClick = async (cityName: string) => {
    setLoadingForecast(true);
    setError(null);
    try {
      const data = await weatherApiService.getSingleCityAnalytics(cityName);
      setSelectedCityData(data);
    } catch (err: any) {
      setError(`Failed to fetch 5-day forecast for ${cityName}.`);
    } finally {
      setLoadingForecast(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '60px', fontFamily: 'sans-serif' }}>
      <Navbar />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <BulkAnalyticsForm onSubmit={handleFetchAnalytics} loading={loading} />

        {loading && <Loader />}

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            <strong>System Error:</strong> {error}
          </div>
        )}

        {analytics && !loading && (
          <>
            {/* 1. Show the Bulk Stats Dashboard */}
            <AnalyticsSummary data={analytics} />

            {/* 2. Interactive Quick Click Area to bridge Requirement 2 */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>🔍 Click any city to view its 5-Day Detailed Forecast:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {searchedCities.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleCityClick(city)}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                  >
                    📍 {city}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 3. Render Requirement 2 data: 5-day forecast details */}
        {loadingForecast && <Loader />}
        
        {selectedCityData && !loadingForecast && (
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', marginTop: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '2px solid #f3f4f6', paddingBottom: '12px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#1f2937', textTransform: 'capitalize' }}>🌤️ 5-Day Forecast: {selectedCityData.city}</h3>
            </div>
            
            <p style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
              🌡️ <strong>Current Temperature:</strong> {selectedCityData.currentTemperature}°C 
              <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '10px' }}>
                (Min: {selectedCityData.minTemp}°C / Max: {selectedCityData.maxTemp}°C)
              </span>
            </p>

            {/* Warning Alert if triggered */}
            {selectedCityData.warning && (
              <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                ⚠️ {selectedCityData.warning}
              </div>
            )}

            {/* 5 Day Flex Row List */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
              {selectedCityData.forecast.map((day, idx) => (
                <div key={idx} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '10px', minWidth: '120px', flex: 1, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>{day.date}</p>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>{day.avgtemp_c}°C</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#2563eb', fontWeight: 500 }}>{day.condition}</p>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    {day.mintemp_c}° / {day.maxtemp_c}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;