import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, query } from './config/db';
import weatherRoutes from './route/routes'; 
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/', weatherRoutes);

async function startServer() {
  try {
    console.log("📡 Connecting to Neon PostgreSQL...");
        
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running locally at: http://localhost:${PORT}`);
      
    });
    
  } catch (error) {
    console.error(" App startup failed || Database error :", error);
    process.exit(1);
  }
}

startServer();