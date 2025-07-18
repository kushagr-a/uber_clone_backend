import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getAutoCompleteSuggestionservice,
  getCaptainInTheRadius,
  getDistanceAndTime,
} from "../services/map.service.js";

import rideModel from "../models/ride.model.js";
import {
  confirmRideService,
  createRideService,
  endRideService,
  getFareService,
  startRideService,
} from "../services/ride.services.js";
import { sendMessageToSocketId } from "../socket.js";

export const createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;

  try {
    const ride = await createRideService({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    res.status(201).json(ride);

    const pickupCoordinates = await getAddressCoordinate(pickup);

    const captainsInRadius = await getCaptainInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      2
    );

    ride.otp = "";

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    captainsInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Ride not created" });
  }
};

export const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.body;

  try {
    const fare = await getFareService(pickup, destination);

    res.status(200).json(fare);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Fare not found" });
  }
};

// export const confirmRide = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { rideId } = req.body;

//   try {
//     const ride = await confirmRideService({ rideId, captain: req.captain });

//     // ✅ Populate user to access socketId
//     await ride.populate("user");

//     // ✅ Guard against missing socketId
//     if (ride.user?.socketId) {
//       sendMessageToSocketId(ride.user.socketId, {
//         event: "new-ride",
//         data: ride,
//       });
//     }

//     return res.status(200).json(ride);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: "Ride not confirmed" });
//   }
// };

// export const startRide = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { rideId, otp } = req.body;
//   // const { rideId, otp } = req.query

//   try {
//     const ride = await startRideService({ rideId, otp, captain: req.captain });

//     sendMessageToSocketId(ride.user.socketId, {
//       event: "ride-started",
//       data: ride,
//     });

//     return res.status(200).json(ride);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: "Ride not started" });
//   }
// };

export const confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await confirmRideService({ rideId, captain: req.captain });

    if (ride?.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "new-ride",
        data: ride,
      });
    }

    return res.status(200).json(ride);
  } catch (error) {
    console.error("Confirm ride failed:", error.message);
    return res.status(404).json({ error: "Ride not confirmed" });
  }
};


export const startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.body;

  try {
    // Validate ride exists
   // ✅ Now explicitly include 'otp'
    const ride = await rideModel.findById(rideId).select("+otp").populate("user");
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    // Check if already started
    if (ride.status === "ongoing") {
      return res.status(400).json({ error: "Ride already started" });
    }

    // Validate captain
    if (!req.captain || !ride.captain || !ride.captain.equals(req.captain._id)) {
      return res.status(403).json({ error: "You are not assigned to this ride" });
    }

    // Validate OTP
    if (ride.otp !== String (otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Update ride status
    ride.status = "ongoing";
    await ride.save();

    // Emit event
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await endRideService({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Ride not ended" });
  }
};
