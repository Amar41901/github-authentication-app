// Mounted at /api/notes. Shows OWNERSHIP-BASED authorization.

const express = require("express");
const authenticate = require("../middleware/authenticate");
const store = require("../data/store");

const router = express.Router();

// Every route in this file requires login
router.use(authenticate);

// Users see their own notes, admins see all
router.get("/", (req, res) => {
  const all = store.getNotes();
  const list = req.user.role === "admin" ? all : all.filter((n) => n.ownerId === req.user.id);
  res.json(list);
});

router.post("/", (req, res) => {
  const text = req.body?.text;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "text is required" });
  }
  const note = store.addNote(req.user.id, text.slice(0, 200));
  res.status(201).json(note);
});

// Only the owner OR an admin can delete
router.delete("/:id", (req, res) => {
  const note = store.findNote(Number(req.params.id));
  if (!note) return res.status(404).json({ message: "Note not found" });

  const isOwner = note.ownerId === req.user.id;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "You can only delete your own notes" });
  }

  store.deleteNote(note.id);
  res.json({ message: "Deleted" });
});

module.exports = router;