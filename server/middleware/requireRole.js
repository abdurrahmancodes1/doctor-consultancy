const requireRole = (role) => {
  return (req, res, next) => {
    // req.user must be set by authenticate middleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated from reqired role",
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};

export default requireRole;
