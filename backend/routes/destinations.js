import express from 'express';
import Destination from '../models/Destination.js';

const router = express.Router();

// GET all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE destination
router.post('/', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE destination
router.put('/:id', async (req, res) => {
  try {
    const updated = await Destination.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({ message: 'Destination updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE destination
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Destination.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
