// Is the user logged in? If not, return 401.
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Login required" });
};

