import { Router } from 'express';
import { createItinerary } from '../controllers/itineraryController';
import { answerFaq } from '../controllers/faqController';

const router = Router();

router.post('/itinerary', createItinerary);
router.post('/faq', answerFaq);

export default router;
export {};