import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlackListToken from "../models/blacklisttoken.model.js";
// import Captain from "../../model/captain.model.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await BlackListToken.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// export const authCaptain = async (req, res, next) => {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const isBlacklisted = await BlackListToken.findOne({ token: token });

//   if (isBlacklisted) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, ENV.JWT_SECRET);
//     const captain = await Captain.findById(decoded._id);

//     if (!captain) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     req.captain = captain;

//     return next();
//   } catch (err) {
//     console.log(err);
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };
