import axios from "axios";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await axios.get(`${process.env.BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/captains/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    req.captain = response.data;
    if (!req.captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const authUserOrCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    try {
      const userRes = await axios.get(`${process.env.BASE_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (userRes.data) {
        req.user = userRes.data;
        return next();
      }
    } catch (e) { }

    try {
      const captainRes = await axios.get(`${process.env.BASE_URL}/captains/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (captainRes.data) {
        req.captain = captainRes.data;
        return next();
      }
    } catch (e) { }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

