import express from "express";

const router = express.Router();

// Simple auth endpoint - just check if token exists
router.get("/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    res.json({
      user: {
        id: "user",
        email: "user@example.com",
        role: "user",
        name: "User",
        provider: "frontend",
        isActive: true,
      },
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
});

export default router;
