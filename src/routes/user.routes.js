// Mounted at /api.

const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const store = require("../data/store");

const router = express.Router();

// Any logged-in user
router.get("/me", authenticate, (req, res) => res.json(req.user));

// Admin only (role-based authorization)
router.get("/admin/users", authenticate, authorize("admin"), (req, res) => {
  res.json(store.getAllUsers());
});

module.exports = router;
