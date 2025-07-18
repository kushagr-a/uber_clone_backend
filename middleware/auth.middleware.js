import userModel from "../models/user.model.js";
import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";

// ===================== User Auth Middleware =====================
export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded User Token:", decoded);

    const user = await userModel.findById(decoded._id || decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("User Auth Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// ===================== Captain Auth Middleware =====================
export const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Captain Token:", decoded);

    const captain = await captainModel.findById(decoded._id || decoded.id);
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized: Captain not found" });
    }

    req.captain = captain;
    next();
  } catch (error) {
    console.error("Captain Auth Error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
