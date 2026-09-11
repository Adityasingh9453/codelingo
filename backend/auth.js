import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "codelingo-dev-secret-change-in-prod";
const JWT_EXPIRES = "30d"; // tokens last 30 days

// Generate a signed JWT for a given learner id
export function generateToken(learnerId) {
  return jwt.sign({ sub: learnerId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// Express middleware — reads Authorization: Bearer <token>,
// verifies it, and attaches req.userId (integer learner id).
// Responds 401 if token is missing or invalid.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please log in." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = Number(payload.sub);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token expired or invalid. Please log in again." });
  }
}
