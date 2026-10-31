// A fake database. In a real project, replace it with MongoDB or
// PostgreSQL.

const users = new Map(); // githubId -> user
const notes = [];        // { id, ownerId, text }
let nextNoteId = 1;

// Users
const findUserById = (id) => users.get(id);

const createUser = (user) => {
  users.set(user.id, user);
  return user;
};

const getAllUsers = () => [...users.values()];

// Notes
const getNotes = () => notes;

const addNote = (ownerId, text) => {
  const note = { id: nextNoteId++, ownerId, text };
  notes.push(note);
  return note;
};

const findNote = (id) => notes.find((n) => n.id === id);

const deleteNote = (id) => {
  const index = notes.findIndex((n) => n.id === id);
  if (index !== -1) notes.splice(index, 1);
};

module.exports = {
  findUserById,
  createUser,
  getAllUsers,
  getNotes,
  addNote,
  findNote,
  deleteNote,
};