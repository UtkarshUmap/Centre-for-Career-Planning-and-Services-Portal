import express from 'express';
import { getThreads, createThread, createComment, handleVote } from '../controllers/thread.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/getThreads", protectRoute, getThreads);
router.post("/createThread", protectRoute, createThread);

router.post("/createComment/:threadId", protectRoute, createComment);

router.put("/vote/:threadId", protectRoute, handleVote);


export default router;