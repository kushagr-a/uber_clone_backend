import express from "express";
import { authUser, authCaptain } from "../middleware/auth.middleware.js";

import {
  confirmRide,
  createRide,
  endRide,
  getFare,
  startRide,
} from "../controllers/ride.controller.js";

import {
  createRideValidation,
  getFareValidation,
  confirmRideValidation,
  startRideValidation,
  endRideValidation,
} from "../validators/ride.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rides
 *   description: Ride management endpoints
 */

/**
 * @swagger
 * /api/v1/rides/create:
 *   post:
 *     summary: Create a ride
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickup
 *               - destination
 *               - vehicleType
 *             properties:
 *               pickup:
 *                 type: string
 *                 example: Patna
 *               destination:
 *                 type: string
 *                 example: Delhi
 *               vehicleType:
 *                 type: string
 *                 enum: [bike, auto, car]
 *                 example: car
 *     responses:
 *       201:
 *         description: Ride created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                 pickup:
 *                   type: string
 *                 destination:
 *                   type: string
 *                 fare:
 *                   type: number
 *                 status:
 *                   type: string
 *                 otp:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       400:
 *         description: Bad request
 */
router.post("/create", authUser, createRideValidation, createRide);

/**
 * @swagger
 * /api/v1/rides/get-fare:
 *   get:
 *     summary: Get fare estimate
 *     tags: [Rides]
 *     parameters:
 *       - in: query
 *         name: pickup
 *         schema:
 *           type: string
 *         required: true
 *         example: Connaught Place, Delhi
 *       - in: query
 *         name: drop
 *         schema:
 *           type: string
 *         required: true
 *         example: Noida Sector 18
 *     responses:
 *       200:
 *         description: Fare retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fare:
 *                   type: number
 *       400:
 *         description: Bad request
 */

router.get("/get-fare", authUser, getFareValidation, getFare);

/**
 * @swagger
 * /api/v1/rides/confirm:
 *   post:
 *     summary: Confirm a ride by captain
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rideId
 *               - captainId
 *             properties:
 *               rideId:
 *                 type: string
 *               captainId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ride confirmed successfully
 *       400:
 *         description: Invalid request
 */
router.post("/confirm", authCaptain, confirmRideValidation, confirmRide);


/**
 * @swagger
 * /api/v1/rides/start-ride:
 *   post:
 *     summary: Start a ride
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rideId
 *               - otp
 *             properties:
 *               rideId:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ride started successfully
 *       400:
 *         description: Invalid OTP or Ride ID
 */
router.post("/start-ride", authCaptain, startRideValidation, startRide);

/**
 * @swagger
 * /api/v1/rides/end-ride:
 *   post:
 *     summary: End a ride
 *     tags: [Rides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rideId
 *             properties:
 *               rideId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ride ended successfully
 *       400:
 *         description: Invalid ride
 */
router.post("/end-ride", authCaptain, endRideValidation, endRide);

export default router;
