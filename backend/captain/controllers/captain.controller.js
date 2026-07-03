import Captain from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";
import BlackListToken from "../models/blacklisttoken.model.js";
import { validationResult } from "express-validator";
import rabbitMq from "../services/rabbit.service.js";

export const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  const isCaptainAlreadyExist = await Captain.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  const hashedPassword = await Captain.hashPassword(password);

  const captain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};

export const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await Captain.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

export const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

export const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await BlackListToken.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};

export const toggleAvailabilty = async (req, res, next) => {
  try {
    const captain = await Captain.findById(req.captain._id);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    captain.isAvailable = !captain.isAvailable;

    await captain.save();

    res.status(200).json({ captain });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCaptainsInTheRadius = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      return res
        .status(400)
        .json({ message: "Latitude, longitude, and radius are required" });
    }

    const numericLat = Number(lat);
    const numericLng = Number(lng);
    const numericRadius = Number(radius);

    const captains = await Captain.find({
      location: {
        $geoWithin: {
          $centerSphere: [[numericLat, numericLng], numericRadius / 6371],
        },
      },
    });

    res.status(200).json(captains);
  } catch (error) {
    console.error("Error fetching captains in radius:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const pendingRequests = [];

export const waitForNewRide = (req, res) => {
  req.setTimeout(30000, () => {
    res.status(204).end();
  });

  pendingRequests.push(res);
};

rabbitMq.subscribeToQueue("new-ride", (data) => {
  console.log(JSON.parse(data));
  const rideData = JSON.parse(data);

  pendingRequests.forEach((res) => {
    res.json(rideData);
  });

  pendingRequests.length = 0;
});

rabbitMq.subscribeToQueue("update-captain-socket", async (msg) => {
  try {
    const { userId, socketId } = JSON.parse(msg);
    await Captain.findByIdAndUpdate(userId, { socketId });
    console.log(`Captain socket updated: ${userId} -> ${socketId}`);
  } catch (error) {
    console.error("Error updating captain socket:", error);
  }
});

rabbitMq.subscribeToQueue("update-captain-location", async (msg) => {
  try {
    const { userId, location } = JSON.parse(msg);
    await Captain.findByIdAndUpdate(userId, {
      location: {
        ltd: location.ltd,
        lng: location.lng,
      },
    });
  } catch (error) {
    console.error("Error updating captain location:", error);
  }
});
