import express from "express";
import { Client } from "../models/Client.js";
import { validateRequest, clientValidation } from "../middleware/validation.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// NOTE: Authentication removed - CRUD works without tokens

// GET /api/clients - Get all clients with search and sorting
router.get("/", async (req, res) => {
  try {
    const {
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    let filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const clients = await Client.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Client.countDocuments(filter);

    res.json({
      clients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// GET /api/clients/:id - Get client by ID
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch client" });
  }
});

// POST /api/clients - Create new client (admin only)
router.post(
  "/",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(clientValidation),
  async (req, res) => {
    try {
      const client = new Client(req.body);
      const savedClient = await client.save();
      res.status(201).json(savedClient);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(400).json({ error: "Failed to create client" });
    }
  }
);

// PUT /api/clients/:id - Update client (admin only)
router.put(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(clientValidation),
  async (req, res) => {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(400).json({ error: "Failed to update client" });
    }
  }
);

// DELETE /api/clients/:id - Delete client (admin only)
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const client = await Client.findByIdAndDelete(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  }
);

export default router;
