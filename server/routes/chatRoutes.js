import express from 'express';
import { getChatHistory } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/history', authMiddleware, getChatHistory);

export default router;
