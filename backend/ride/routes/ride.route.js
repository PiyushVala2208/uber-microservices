import express from "express";
import { authUser, authCaptain } from "../middleware/auth.middleware.js";
import { body, query } from "express-validator";
import {
  acceptRide,
  createRide,
  endRide,
  getFare,
  startRide,
} from "../controllers/ride.controller.js";

const router = express.Router();

router.post(
  "/create",
  authUser,
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
  createRide,
);

router.get(
  "/get-fare",
  authUser,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  getFare,
);

router.put(
  "/accept-ride",
  authCaptain,
  query("rideId").isMongoId().withMessage("Invalid ride id"),
  acceptRide,
);

router.get(
  "/start-ride",
  authCaptain,
  query("rideId").isMongoId().withMessage("Invalid ride id"),
  query("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  startRide,
);

router.post(
  "/end-ride",
  authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  endRide,
);



export default router;