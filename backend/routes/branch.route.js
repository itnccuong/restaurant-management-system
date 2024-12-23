import { Router } from 'express';

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

import { createBranch, updateBranch } from '../controllers/branch.controller.js';

const router = Router();

// Create Branch endpoint with middleware
router.post('/', verifyToken, asyncErrorHandler(createBranch));

// Update Branch endpoint with middleware
router.patch('/:branchId', verifyToken, asyncErrorHandler(updateBranch));

export default router;