import { Request, Response } from 'express';
import { fetchWeatherData, WeatherData } from '../services/weatherService';
import { query } from '../config/db';

const TEMPERATURE_THRESHOLD = 35;


export const getBulkAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      res.status(400).json({ error: "Invalid request payload. 'cities' must be a non-empty array." });
      return;
    }

    const weatherResults: WeatherData[] = [];
    const errors: string[] = [];

    for (const city of cities) {
      try {
        const data = await fetchWeatherData(city);
        weatherResults.push(data);

    
        const sqlQuery = `
          INSERT INTO city_weather (city_name, current_temp, min_temp, max_temp, last_updated)
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
          ON CONFLICT (city_name) 
          DO UPDATE SET 
            current_temp = EXCLUDED.current_temp,
            min_temp = EXCLUDED.min_temp,
            max_temp = EXCLUDED.max_temp,
            last_updated = CURRENT_TIMESTAMP;
        `;
        await query(sqlQuery, [data.city, data.temp, data.minTemp, data.maxTemp]);

      } catch (err: any) {
        errors.push(`Failed to fetch or save weather for city: ${city}. Error: ${err.message}`);
      }
    }

    if (weatherResults.length === 0) {
      res.status(500).json({ error: "Could not fetch data for any of the specified cities.", details: errors });
      return;
    }

    // Aggregation Logiic 
    let totalTemp = 0;
    let highestTempCity = weatherResults[0];
    let lowestTempCity = weatherResults[0];
    const hotCities: string[] = [];

    weatherResults.forEach((cityData) => {
      totalTemp += cityData.temp;

      if (cityData.temp > highestTempCity.temp) {
        highestTempCity = cityData;
      }
      if (cityData.temp < lowestTempCity.temp) {
        lowestTempCity = cityData;
      }
      if (cityData.temp > TEMPERATURE_THRESHOLD) {
        hotCities.push(cityData.city);
      }
    });

    const averageTemperature = Number((totalTemp / weatherResults.length).toFixed(2));

    res.json({
      averageTemperature,
      highestTemperature: { city: highestTempCity.city, temp: highestTempCity.temp },
      lowestTemperature: { city: lowestTempCity.city, temp: lowestTempCity.temp },
      hotCities,
      metadata: { partialErrors: errors.length > 0 ? errors : undefined }
    });

  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


export const getSingleCityAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const cityName = String(req.params.name);
    const weatherData = await fetchWeatherData(cityName);

    const warning = weatherData.temp > TEMPERATURE_THRESHOLD 
      ? `Warning: Extreme heat detected! Temperature exceeds ${TEMPERATURE_THRESHOLD}°C.` 
      : null;

    res.json({
      city: weatherData.city,
      currentTemperature: weatherData.temp,
      minTemp: weatherData.minTemp,
      maxTemp: weatherData.maxTemp,
      forecast: weatherData.forecast,
      warning
    });
  } catch (error: any) {
    res.status(500).json({ error: `Could not retrieve data for city: ${req.params.name}`, details: error.message });
  }
};