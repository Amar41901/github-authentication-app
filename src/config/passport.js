// AUTHENTICATION: GitHub tells us who the user is. Our app assigns
// the role.

const GitHubStrategy = require("passport-github2").Strategy;
const config = require("./env");
const store = require("../data/store");

module.exports = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
        scope: ["read:user"], // ask only for what you need
        state: true,          // CSRF protection for the OAuth flow
      },
      // Runs after GitHub confirms the user
      (accessToken, refreshToken, profile, done) => {
        let user = store.findUserById(profile.id);

        if (!user) {
          user = store.createUser({
            id: profile.id,
            username: profile.username,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value || "",
            // Authorization data: role is decided by OUR app, not GitHub
            role: config.adminUsernames.includes(profile.username.toLowerCase())
              ? "admin"
              : "user",
          });
        }

        return done(null, user);
      }
    )
  );

  // Save only the user id inside the session
  passport.serializeUser((user, done) => done(null, user.id));

  // On each request, rebuild req.user from that id
  passport.deserializeUser((id, done) => done(null, store.findUserById(id) || false));
};