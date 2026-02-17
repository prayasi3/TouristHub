import Review from "../models/Review.js";

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.getAll();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.getById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching review" });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const id = await Review.create(req.body);
    res.status(201).json({ message: "Review created", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Insert failed" });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const affected = await Review.update(req.params.id, req.body);

    if (affected === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const affected = await Review.delete(req.params.id);

    if (affected === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
