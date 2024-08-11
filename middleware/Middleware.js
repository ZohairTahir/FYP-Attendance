import jwt from "jsonwebtoken";
import User from "../models/UsersData.js";

const verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Token not provided." });
    }

    const token = authorizationHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, "your_secret_key");
      const { userId, userType } = decodedToken;

      req.userData = { userId, userType };

      const user = await User.findOne({ userID: userId });
      if (!user) {
        return res.status(401).json({ error: "Unauthorized. User not found." });
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Unauthorized. Token expired." });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Unauthorized. Invalid token." });
      } else {
        console.error(error);
        return res
          .status(401)
          .json({ error: "Unauthorized. Token verification failed." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized." });
  }
};

export default { verifyToken };
