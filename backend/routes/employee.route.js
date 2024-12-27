import { Router } from 'express';
import { addEmployee, deleteEmployee, updateEmployee, searchEmployeesController, getEmployeeInformation } from '../controllers/employee.controller.js';
import { Router } from "express";
import verifyToken from "../middlewares/verify-token.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

const router = Router();

// Add Employee endpoint with middleware
router.post("/", verifyToken, asyncErrorHandler(addEmployee));

// Delete Employee endpoint with middleware
router.delete("/:employeeId", verifyToken, asyncErrorHandler(deleteEmployee));

// Update Employee endpoint with middleware
router.patch("/:employeeId", verifyToken, asyncErrorHandler(updateEmployee));

// Get Employee Information endpoint with middleware
router.get(
  "/:employeeId",
  verifyToken,
  asyncErrorHandler(getEmployeeInformation)
);

// Add Search Employees endpoint with middleware
router.get('/search', verifyToken, asyncErrorHandler(searchEmployeesController));

export default router;
