import express from "express";
import { authUser, authUserOrCaptain } from "../middleware/auth.middleware.js";
import {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getAddress,
} from "../controllers/map.controller.js";
import { query } from "express-validator";

const router = express.Router();

router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  authUserOrCaptain,
  getCoordinates,
);

router.get(
  "/get-address",
  query("lat").isNumeric(),
  query("lng").isNumeric(),
  authUserOrCaptain,
  getAddress,
);

router.get(
  "/get-distance-time",
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
  authUserOrCaptain,
  getDistanceTime,
);

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 3 }),
  authUserOrCaptain,
  getAutoCompleteSuggestions,
);

export default router;
