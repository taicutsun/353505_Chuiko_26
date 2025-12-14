import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import { connectDB } from "./config/database.js";
import { passport } from "./config/auth.js";
import { authenticateToken } from "./middleware/auth.js";
import clientsRouter from "./routes/clients.js";
import employeesRouter from "./routes/employees.js";
import propertiesRouter from "./routes/properties.js";
import newsRouter from "./routes/news.js";
import authRouter from "./routes/auth.js";
import publicRouter from "./routes/public.js";
import veterinaryRouter from "./routes/veterinary.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express server!" });
});

// API Routes with authentication
app.use("/api/auth", authRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/news", newsRouter);

// Protected API Routes (authentication required)
app.use("/api/veterinary", veterinaryRouter);

// Public API Routes (no authentication required)
app.use("/api/public", publicRouter);

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("=== GLOBAL ERROR HANDLER ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Method:", req.method);
    console.error("URL:", req.url);
    console.error("Headers:", JSON.stringify(req.headers, null, 2));
    console.error("Body:", JSON.stringify(req.body, null, 2));
    console.error("Query:", JSON.stringify(req.query, null, 2));
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
    console.error("===========================");

    // Send detailed error response in development
    const response = {
      error: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV !== "production" && {
        stack: err.stack,
        details: {
          method: req.method,
          url: req.url,
          query: req.query,
          body: req.body,
        },
      }),
    };

    res.status(err.status || 500).json(response);
  }
);

// 404 Handler
app.use((req, res) => {
  console.log("404 - Route not found:", req.method, req.url);
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.url,
  });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
