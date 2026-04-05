import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { createContest,getContest,getContestProblems,joinContest } from '../controllers/contest.controller.js'
import adminOnly from '../middleware/admin.middleware.js'

const router = express.Router()

router.post('/create',authMiddleware,adminOnly,createContest)
router.get('/:slug',authMiddleware,getContest)
router.post('/:slug/join',authMiddleware,joinContest)
router.get('/:slug/problems',authMiddleware,getContestProblems)


export default router