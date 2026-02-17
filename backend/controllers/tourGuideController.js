import TourGuide from "../models/TourGuide.js";

// Get all
export const getTourGuides = async (req, res) => {
  try {
    const guides = await TourGuide.getAll();
    res.json(guides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tour guides" });
  }
};

// Get by ID
export const getTourGuideById = async (req, res) => {
  try {
    const guide = await TourGuide.getById(req.params.id);

    if (!guide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.json(guide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tour guide" });
  }
};

// Create
export const createTourGuide = async (req, res) => {
  try {
    const id = await TourGuide.create(req.body);
    res.status(201).json({ message: "Tour guide created", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Insert failed" });
  }
};

// Update
export const updateTourGuide = async (req, res) => {
  try {
    const affected = await TourGuide.update(req.params.id, req.body);

    if (affected === 0) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.json({ message: "Tour guide updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete
export const deleteTourGuide = async (req, res) => {
  try {
    const affected = await TourGuide.delete(req.params.id);

    if (affected === 0) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    res.json({ message: "Tour guide deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
