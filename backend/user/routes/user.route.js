import express from "express";
import { body } from "express-validator";
import {
  getUserprofile,
  loginUser,
  logoutUser,
  registerUser,
  acceptedRide,
} from "../controllers/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginUser,
);

router.get("/profile", authUser, getUserprofile);

router.get("/logout", authUser, logoutUser);

router.get("/accepted-ride", authUser, acceptedRide);

export default router;
