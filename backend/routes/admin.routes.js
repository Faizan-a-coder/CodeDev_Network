import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import adminOnly from '../middleware/admin.middleware.js';
import { getAllUsers, createUser, updateUser, deleteUser, syncSpecificUser, syncAllUsers } from '../controllers/admin.controller.js';

const router = express.Router();

// All routes are protected by authMiddleware and adminOnly
router.use(authMiddleware, adminOnly);

// User Management Routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Sync Routes
router.post('/users/sync-all', syncAllUsers);
router.post('/users/:id/sync', syncSpecificUser);

export default router;
