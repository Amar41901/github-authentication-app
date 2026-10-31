const express = require("express");
const escapeHtml = require("../utils/escapeHtml");

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send(`<h1>GitHub OAuth demo</h1><a href="/auth/github">Login with GitHub</a>`);
  }

  const u = req.user;
  res.send(`
    <h1>Welcome, ${escapeHtml(u.name)}</h1>
    <img src="${escapeHtml(u.avatar)}" width="80" alt="avatar" />
    <p>GitHub: @${escapeHtml(u.username)} | Role: <b>${escapeHtml(u.role)}</b></p>
    <ul>
      <li><a href="/api/me">/api/me</a> (any logged-in user)</li>
      <li><a href="/api/notes">/api/notes</a> (any logged-in user)</li>
      <li><a href="/api/admin/users">/api/admin/users</a> (admin only)</li>
    </ul>
    <form method="POST" action="/auth/logout"><button>Logout</button></form>
  `);
});

module.exports = router;