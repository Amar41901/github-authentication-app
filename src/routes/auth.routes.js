// The OAuth flow, mounted at /auth.

const express = require("express");
const passport = require("passport");

const router = express.Router();

// Step 1: send the browser to GitHub
router.get("/github", passport.authenticate("github"));

// Step 2: GitHub sends the user back here with a code
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failed" }),
  (req, res) => res.redirect("/")
);

router.get("/failed", (req, res) =>
  res.status(401).send(`GitHub login failed. <a href="/">Go back</a>`)
);

// Logout uses POST so another site can't log you out with a plain link
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
});

module.exports = router;