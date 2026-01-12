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
    console.log(decoded);
    req.user = decoded;
    console.log(req.user.role);
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isAuthenticated;
