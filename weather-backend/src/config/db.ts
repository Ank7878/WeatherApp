import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from environment variables!");
}

// setiing connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, 
  },
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// create table wiht row sql
const tableInitializationQuery = `
  CREATE TABLE IF NOT EXISTS city_weather (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) UNIQUE NOT NULL,
    current_temp NUMERIC(5, 2) NOT NULL,
    min_temp NUMERIC(5, 2) NOT NULL,
    max_temp NUMERIC(5, 2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_city_name ON city_weather(city_name);
`;

export const initializeDatabase = async () => {
  try {
    console.log("Checking and updating database schemas...");
    await query(tableInitializationQuery);
    console.log(" Database tables and indexes are verified & ready!");
  } catch (error) {
    console.error(" Critical Error initializing database tables:", error);
    process.exit(1); // Stop the application if database setup fails
  }
};

export default pool;