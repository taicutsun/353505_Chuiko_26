import express from "express";
import { passport } from "../config/auth.js";
import { User } from "../models/User.js";

const router = express.Router();

// Google OAuth routes
router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Redirect to frontend without JWT token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/auth/callback`);
  }
);

export default router;
