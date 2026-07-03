import BlackListToken from "../models/blacklisttoken.model.js";
import User from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";
import EventEmitter from "events";
import rabbitMq from "../services/rabbit.service.js";

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  const isUserAlready = await User.findOne({ email });

  if (isUserAlready) {
    return res.status(400).json({ message: "User already exist" });
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};

export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  delete user._doc.password;

  res.cookie("token", token);

  res.status(200).json({ token, user, message: "logged in successfully" });
};

export const getUserprofile = async (req, res, next) => {
  res.status(200).json(req.user);
};

export const logoutUser = async (req, res, next) => {
  res.clearCookie("token");

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await BlackListToken.create({ token });

  res.status(200).json({ message: "Logged out successfully" });
};

const rideEventEmitter = new EventEmitter();


export const acceptedRide = (req, res) => {
  const handler = (data) => {
    res.json(data);
  };
  
  rideEventEmitter.once(`ride-accepted-${req.user._id}`, handler);
  
  setTimeout(() => {
    rideEventEmitter.removeListener(`ride-accepted-${req.user._id}`, handler);
    if (!res.headersSent) {
      res.status(204).end();
    }
  }, 30000);
};

rabbitMq.subscribeToQueue("ride-accepted", async (msg) => {
  const data = JSON.parse(msg);
  const userId = typeof data.user === 'object' ? data.user._id : data.user;
  rideEventEmitter.emit(`ride-accepted-${userId}`, data);
});

rabbitMq.subscribeToQueue("update-user-socket", async (msg) => {
  try {
    const { userId, socketId } = JSON.parse(msg);
    await User.findByIdAndUpdate(userId, { socketId });
    console.log(`User socket updated: ${userId} -> ${socketId}`);
  } catch (error) {
    console.error("Error updating user socket:", error);
  }
});