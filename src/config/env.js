// Loads .env, checks that the required values exist, and exports
// one config object.

require("dotenv").config();

const required = ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "SESSION_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing env variables: ${missing.join(", ")}`);
  console.error("Copy .env.example to .env and fill it in.");
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 3000,
  isProd: process.env.NODE_ENV === "production",
  sessionSecret: process.env.SESSION_SECRET,
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:
      process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback",
  },
  adminUsernames: (process.env.ADMIN_GITHUB_USERNAMES || "")
    .split(",")
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean),
};