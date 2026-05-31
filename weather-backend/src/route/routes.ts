import { Router } from 'express';
import { getBulkAnalytics, getSingleCityAnalytics } from '../controllers/weatherController';

const router = Router();

// Routes 
router.post('/analytics/cities', getBulkAnalytics);
router.get('/analytics/city/:name', getSingleCityAnalytics);

export default router;