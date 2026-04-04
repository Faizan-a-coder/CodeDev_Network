import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { createContest,getContest,getContestProblems,joinContest } from '../controllers/contest.controller.js'
import adminOnly from '../middleware/admin.middleware.js'

const router = express.Router()

router.post('/create',authMiddleware,adminOnly,createContest)
router.get('/:id',authMiddleware,getContest)
router.post('/join',authMiddleware,joinContest)
router.get('/:id/problems',authMiddleware,getContestProblems)


export default router