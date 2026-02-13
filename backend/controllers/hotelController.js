import Hotel from "../models/Hotel.js";

export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.getAll();
    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.getById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hotel" });
  }
};

export const createHotel = async (req, res) => {
  try {
    const id = await Hotel.create(req.body);
    res.status(201).json({ message: "Hotel created", id });
  } catch (err) {
    res.status(500).json({ message: "Failed to create hotel" });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const updated = await Hotel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json({ message: "Hotel updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update hotel" });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const deleted = await Hotel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json({ message: "Hotel deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete hotel" });
  }
};
