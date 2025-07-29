import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Needed to fetch user details from DB
import dotenv from "dotenv";

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer TOKEN_STRING")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user from token payload to request object (without password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found." });
      }

      next(); // Continue to the next middleware or route handler
    } catch (error) {
      console.error("Token verification error:", error.message);
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Not authorized, token expired." });
      }
      return res.status(401).json({ message: "Not authorized, token failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token." });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized to access this route (insufficient role).",
      });
    }
    next();
  };
};

export { protect, authorizeRoles };
