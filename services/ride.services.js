import rideModel from "../models/ride.model.js";
import {
  getAddressCoordinate,
  getDistanceAndTime,
  getAutoCompleteSuggestionservice,
  getCaptainInTheRadius,
} from "./map.service.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

// export const getFareService = async (pickup, destination) => {
//   if (!pickup || !destination) {
//     throw new Error("Pickup and destination are required");
//   }

//   const distanceTime = await getDistanceAndTime(pickup, destination);

//   const baseFare = {
//     auto: 30,
//     car: 50,
//     bike: 20,
//   };

//   const perKmRate = {
//     auto: 10,
//     car: 15,
//     bike: 8,
//   };

//   const fare = {
//     auto: Math.round(
//       baseFare.auto +
//         distance_km * perKmRate.auto +
//         duration_min * perMinuteRate.auto
//     ),
//     car: Math.round(
//       baseFare.car +
//         distance_km * perKmRate.car +
//         duration_min * perMinuteRate.car
//     ),
//     moto: Math.round(
//       baseFare.moto +
//         distance_km * perKmRate.moto +
//         duration_min * perMinuteRate.moto
//     ),
//   };

//   return fare;
// };

export const getFareService = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await getDistanceAndTime(pickup, destination);
  const { distance_km, duration_min } = distanceTime; // ✅ extract variables

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 1,
    car: 2,
    moto: 1,
  };

  const fare = {
    auto: Math.round(
      baseFare.auto +
        distance_km * perKmRate.auto +
        duration_min * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        distance_km * perKmRate.car +
        duration_min * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        distance_km * perKmRate.moto +
        duration_min * perMinuteRate.moto
    ),
  };

  return fare;
};


const getOtp = (num) => {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
};

export const createRideService = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  const fare = await getFareService(pickup, destination);

  const ride = rideModel.create({
    user,
    pickup,
    destination,
    vehicleType,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};

export const confirmRideService = async ({ rideId, captain }) => {
  const ride = await rideModel
    .findOneAndUpdate(
      { _id: rideId },
      { status: "accepted", captain: captain._id },
      { new: true } // <-- important: return updated ride
    )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

export const startRideService = async ({ rideId, otp, captain }) => {
  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (!ride.status === "accepted") {
    throw new Error("Ride not accepted");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  return ride;
};

// export const endRideService = async ({ rideId, captain }) => {
//   const ride = await rideModel
//     .findOne({
//       _id: rideId,
//       captain: captain._id,
//     })
//     .populate("user")
//     .populate("captain")
//     .select("+otp");

//   if (!ride) {
//     throw new Error("Ride not found");
//   }

//   if (ride.status !== "ongoing") {
//     throw new Error("Ride not ongoing");
//   }

//   await rideModel.findOneAndUpdate(
//     {
//       _id: rideId,
//     },
//     {
//       status: "completed",
//     }
//   );

//   return ride;
// };

export const endRideService = async ({ rideId, captain }) => {
  const ride = await rideModel
    .findOne({ _id: rideId, captain: captain._id })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status === "completed") {
    // ✅ Already completed — just return it
    return ride;
  }

  if (ride.status !== "ongoing") {
    // ❌ Ride is in invalid state
    throw new Error("Ride not eligible to end");
  }

  // ✅ Complete it now
  ride.status = "completed";
  await ride.save();

  return ride;
};
