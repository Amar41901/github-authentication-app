// Wires everything together. The order matters: session must come
// before passport.session().

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");

const config = require("./config/env");
const configurePassport = require("./config/passport");

const homeRoutes = require("./routes/home.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const noteRoutes = require("./routes/note.routes");

const app = express();

if (config.isProd) app.set("trust proxy", 1); // needed behind Nginx / Render / Heroku

app.use(helmet());
app.use(express.json());

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    // MemoryStore is for development only. Use connect-redis or connect-mongo in production.
    cookie: {
      httpOnly: true,
      secure: config.isProd,   // HTTPS only in production
      sameSite: "lax",         // lax keeps the cookie working through the GitHub redirect
      maxAge: 1000 * 60 * 60,  // 1 hour
    },
  })
);

configurePassport(passport);

//ntializes Passport for incoming requests, allowing authentication strategies to be applied.
app.use(passport.initialize());

// Middleware that will restore login state from a session.
app.use(passport.session());

// Routes
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/notes", noteRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;