import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/captain.validator.js";
import {
  getCaptainProfile,
  loginCaptain,
  logoutCaptain,
  registerCaptain,
} from "../controllers/captain.controller.js";
import { authCaptain } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==================== Captain Routes ====================
// Base URL: /api/v1/captain

/**
 * @swagger
 * /api/v1/captain/register:
 *   post:
 *     summary: Register a new captain
 *     tags: [Captain]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "captain_123"
 *               email:
 *                 type: string
 *                 example: "captain@example.com"
 *               password:
 *                 type: string
 *                 example: "Captain@123"
 *               fullname:
 *                 type: object
 *                 properties:
 *                   firstname:
 *                     type: string
 *                     example: "Raj"
 *                   lastname:
 *                     type: string
 *                     example: "Singh"
 *               vehicles:
 *                 type: object
 *                 properties:
 *                   color:
 *                     type: string
 *                     example: "White"
 *                   plate:
 *                     type: string
 *                     example: "DL3CAB1234"
 *                   capacity:
 *                     type: integer
 *                     example: 4
 *                   vehicleType:
 *                     type: string
 *                     enum: [car, bike, auto]
 *                     example: "car"
 *     responses:
 *       201:
 *         description: Captain registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", registerValidator, registerCaptain);

/**
 * @swagger
 * /api/v1/captain/login:
 *   post:
 *     summary: Login captain and return token
 *     tags: [Captain]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: captain@example.com
 *               password:
 *                 type: string
 *                 example: Captain@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               token: eyJhbGciOiJIUzI1NiIsInR...
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginValidator, loginCaptain);

/**
 * @swagger
 * /api/v1/captain/profile:
 *   get:
 *     summary: Get authenticated captain's profile
 *     tags: [Captain]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Captain profile fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 60d0fe4f5311236168a109cb
 *               username: captain_123
 *               email: captain@example.com
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authCaptain, getCaptainProfile);

/**
 * @swagger
 * /api/v1/captain/logout:
 *   get:
 *     summary: Logout captain and clear session/token
 *     tags: [Captain]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Captain logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.get("/logout", authCaptain, logoutCaptain);

export default router;
