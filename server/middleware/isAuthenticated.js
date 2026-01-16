import { verifyToken } from "../utils/token.js";

const isAuthenticated = (req, res, next) => {
  console.log("COOKIES:", req.cookies);

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  try {
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isAuthenticated;
