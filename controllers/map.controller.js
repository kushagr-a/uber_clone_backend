import { validationResult } from "express-validator";
import { getAddressCoordinate, getDistanceAndTime, getAutoCompleteSuggestionservice } from "../services/map.service.js";


export const getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;
  // Logic to get coordinates based on address
  try {
    const coordinates = await getAddressCoordinates(address);

    res.status(200).json({ coordinates });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "coordinates not found" });
  }
};

export const getDistanceTime = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;

    const distanceTime = await getDistanceAndTime(origin, destination);
    res.status(200).json({ distanceTime });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "distance and time not found" });
  }
};

export const getAutoCompleteSuggestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    const suggestions = await getAutoCompleteSuggestionservice(input);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "autocomplete suggestions not found" });
  }
};
