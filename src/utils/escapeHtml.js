// Stops a malicious name from injecting HTML (XSS) into the home page.

const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

module.exports = (value = "") => String(value).replace(/[&<>"']/g, (c) => map[c]);
