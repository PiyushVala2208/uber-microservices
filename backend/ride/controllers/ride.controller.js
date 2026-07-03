import rideService from "../services/ride.service.js";
import {
  getAddressCoordinate,
  getCaptainInTheRadius,
} from "../services/map.service.js";
import { validationResult } from "express-validator";
import Ride from "../models/ride.model.js";
import rabbitMq from "../services/rabbit.service.js";

export const createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupCoordinates = await getAddressCoordinate(pickup);

    console.log("Pickup coordinates:", pickupCoordinates);

    const captainsInRadius = await getCaptainInTheRadius(
      pickupCoordinates.ltd,
      pickupCoordinates.lng,
      220,
    );

    ride.otp = "";

    const rideWithUser = await Ride.findOne({ _id: ride._id });
    const rideData = rideWithUser.toObject();
    rideData.user = req.user;

    rabbitMq.publishToQueue("new-ride", JSON.stringify(rideData));

    captainsInRadius.forEach((captain) => {
      rabbitMq.publishToQueue(
        "send-socket-message",
        JSON.stringify({
          socketId: captain.socketId,
          event: "new-ride",
          message: rideData,
        }),
      );
    });

    return res.status(201).json(ride);
  } catch (err) {
    console.error("Error creating ride:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;
  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    console.error("Error fetching fare:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const acceptRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.query;

  try {
    const ride = await rideService.acceptRide({
      rideId,
      captain: req.captain,
    });

    const rideData = ride.toObject();
    rideData.captain = req.captain;

    rabbitMq.publishToQueue("ride-accepted", JSON.stringify(rideData));

    rabbitMq.publishToQueue(
      "send-socket-message",
      JSON.stringify({
        userId: ride.user._id || ride.user,
        event: "ride-confirmed",
        message: rideData,
      }),
    );

    return res.status(200).json(ride);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    const rideData = ride.toObject ? ride.toObject() : ride;
    rideData.captain = req.captain;

    console.log(rideData);

    rabbitMq.publishToQueue(
      "send-socket-message",
      JSON.stringify({
        userId: ride.user._id || ride.user,
        event: "ride-started",
        message: rideData,
      }),
    );

    return res.status(200).json(rideData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    const rideData = ride.toObject ? ride.toObject() : ride;
    rideData.captain = req.captain;

    rabbitMq.publishToQueue(
      "send-socket-message",
      JSON.stringify({
        userId: ride.user._id || ride.user,
        event: "ride-ended",
        message: rideData,
      }),
    );

    return res.status(200).json(rideData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
