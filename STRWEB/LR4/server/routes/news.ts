import express from "express";
import { News } from "../models/News.js";

const router = express.Router();

// NOTE: Authentication removed - CRUD works without tokens

// GET /api/news - Get all news with search and sorting
router.get("/", async (req, res) => {
  try {
    const {
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
      category,
      isPublished,
    } = req.query;

    let filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search as string, "i")] } },
      ];
    }
    if (category) filter.category = category;
    if (isPublished !== undefined) filter.isPublished = isPublished === "true";

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const news = await News.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await News.countDocuments(filter);

    res.json({
      news,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// GET /api/news/:id - Get news by ID
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// POST /api/news - Create new news
router.post("/", async (req, res) => {
  try {
    const news = new News(req.body);
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error: any) {
    res.status(400).json({ error: "Failed to create news" });
  }
});

// PUT /api/news/:id - Update news
router.put("/:id", async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json(news);
  } catch (error: any) {
    res.status(400).json({ error: "Failed to update news" });
  }
});

// DELETE /api/news/:id - Delete news
router.delete("/:id", async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete news" });
  }
});

export default router;
