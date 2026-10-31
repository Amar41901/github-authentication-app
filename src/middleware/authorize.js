// Does the user have one of the allowed roles? If not, return 403.
// Usage: authorize("admin")  or  authorize("admin", "editor")
module.exports =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };