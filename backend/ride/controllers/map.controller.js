import { validationResult } from "express-validator";
import {
  getAddressCoordinate as getAddressCoordinateService,
  getDistanceTime as getDistanceTimeService,
  getAutoCompleteSuggestions as getAutoCompleteSuggestionsService,
} from "../services/map.service.js";

export const getCoordinates = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const coordinates = await getAddressCoordinateService(address);

    return res.status(200).json({
      success: true,
      data: coordinates,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDistanceTime = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { origin, destination } = req.query;

    const distanceTime = await getDistanceTimeService(origin, destination);

    return res.status(200).json({
      success: true,
      data: distanceTime,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAutoCompleteSuggestions = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { input } = req.query;

    const suggestions = await getAutoCompleteSuggestionsService(input);

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (err) {
    console.error("Controller Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
