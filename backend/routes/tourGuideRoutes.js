import express from "express";
import {
  getTourGuides,
  getTourGuideById,
  createTourGuide,
  updateTourGuide,
  deleteTourGuide
} from "../controllers/tourGuideController.js";

const router = express.Router();

router.get("/", getTourGuides);
router.get("/:id", getTourGuideById);
router.post("/", createTourGuide);
router.put("/:id", updateTourGuide);
router.delete("/:id", deleteTourGuide);

export default router;
