import express from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/user.validator.js";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==================== User Routes ====================
// Base URL: /api/v1/users

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - fullname
 *             properties:
 *               username:
 *                 type: string
 *                 example: kushagra123
 *               email:
 *                 type: string
 *                 example: kushagra@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               fullname:
 *                 type: object
 *                 properties:
 *                   firstname:
 *                     type: string
 *                     example: Kushagra
 *                   lastname:
 *                     type: string
 *                     example: Bharti
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

router.post("/register", registerValidator, registerUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user and return token
 *     tags: [Users]
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
 *                 example: kushagra@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
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
router.post("/login", loginValidator, loginUser);

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 60d0fe4f5311236168a109ca
 *               username: kushagra123
 *               email: kushagra@example.com
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authUser, getUserProfile);

/**
 * @swagger
 * /api/v1/users/logout:
 *   get:
 *     summary: Logout user and clear session/token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.get("/logout", authUser, logoutUser);

export default router;
