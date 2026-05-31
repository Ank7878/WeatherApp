import axios from 'axios';

// Interfaces placed directly here for simple access
export interface ForecastDay {
  date: string;
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  condition: string;
}

export interface BulkAnalyticsResponse {
  averageTemperature: number;
  highestTemperature: { city: string; temp: number };
  lowestTemperature: { city: string; temp: number };
  hotCities: string[];
  metadata?: { partialErrors?: string[] };
}

export interface SingleCityResponse {
  city: string;
  currentTemperature: number;
  minTemp: number;
  maxTemp: number;
  forecast: ForecastDay[];
  warning: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const weatherApiService = {
  getBulkAnalytics: async (cities: string[]): Promise<BulkAnalyticsResponse> => {
    const response = await apiClient.post<BulkAnalyticsResponse>('/analytics/cities', { cities });
    return response.data;
  },

  getSingleCityAnalytics: async (cityName: string): Promise<SingleCityResponse> => {
    const response = await apiClient.get<SingleCityResponse>(`/analytics/city/${cityName}`);
    return response.data;
  }
};