// ride.validation.js
import { body, query } from "express-validator";

export const createRideValidation = [
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"),
];

export const getFareValidation = [
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
];

export const confirmRideValidation = [
  body("rideId").isMongoId().withMessage("Invalid ride id"),
];

// export const startRideValidation = [
//   query("rideId").isMongoId().withMessage("Invalid ride id"),
//   query("otp")
//     .isString()
//     .isLength({ min: 6, max: 6 })
//     .withMessage("Invalid OTP"),
// ];
// export const startRideValidation = [
//   body("rideId").isMongoId().withMessage("Invalid ride id"),
//   body("otp")
//     .isString()
//     .isLength({ min: 6, max: 6 })
//     .withMessage("Invalid OTP"),
// ];

export const startRideValidation = [
  body("rideId").isMongoId().withMessage("Invalid ride id"),
body("otp").isLength({ min: 6, max: 6 }).withMessage("Invalid OTP")

];

export const endRideValidation = [
  body("rideId").isMongoId().withMessage("Invalid ride id"),
];
