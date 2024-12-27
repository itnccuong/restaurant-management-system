import { Router } from "express";

import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

import {
    createBranch,
    updateBranch,
    searchBranchesController,
    getBranch
} from "../controllers/branch.controller.js";

const router = Router();

// Create Branch endpoint with middleware
router.post("/", verifyToken, asyncErrorHandler(createBranch));

// Update Branch endpoint with middleware
router.patch("/:branchId", verifyToken, asyncErrorHandler(updateBranch));

// Add Search Branches endpoint with middleware
router.get('/search', verifyToken, asyncErrorHandler(searchBranchesController));

// Get Branches's name
router.get("/", verifyToken, asyncErrorHandler(getBranch));

export default router;
