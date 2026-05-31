import axios from 'axios';

const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  city: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  forecast: Array<{
    date: string;
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: string;
  }>;
}


export async function fetchWeatherData(city: string): Promise<WeatherData> {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("WEATHER_API_KEY is not defined in environment variables.");
  }

  // WeatherAPI combines current and forecast metrics inside the 'forecast.json' endpoint
  const response = await axios.get(`${BASE_URL}/forecast.json`, {
    params: {
      key: apiKey,
      q: city,
      days: 5,
      aqi: 'no',
      alerts: 'no'
    }
  });

  const data = response.data;

  // Map response 
  return {
    city: data.location.name,
    temp: data.current.temp_c,
    minTemp: data.forecast.forecastday[0].day.mintemp_c,
    maxTemp: data.forecast.forecastday[0].day.maxtemp_c,
    forecast: data.forecast.forecastday.map((day: any) => ({
      date: day.date,
      maxtemp_c: day.day.maxtemp_c,
      mintemp_c: day.day.mintemp_c,
      avgtemp_c: day.day.avgtemp_c,
      condition: day.day.condition.text
    }))
  };
}