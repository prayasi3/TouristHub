import Hotel from "../models/Hotel.js";

function normalizeHotelPayload(body = {}) {
  return {
    name: String(body.name || "").trim(),
    location: String(body.location || "").trim(),
    price_per_night:
      body.price_per_night === undefined || body.price_per_night === null || body.price_per_night === ""
        ? ""
        : Number(body.price_per_night),
    contact_info: String(body.contact_info || "").trim(),
  };
}

function validateHotelPayload(body = {}) {
  const payload = normalizeHotelPayload(body);
  const errors = [];

  if (!payload.name) errors.push("name is required");
  if (!payload.location) errors.push("location is required");
  if (payload.price_per_night === "" || Number.isNaN(payload.price_per_night) || payload.price_per_night < 0) {
    errors.push("price_per_night must be a non-negative number");
  }

  return { payload, errors };
}
export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.getAll({
      location: req.query.location,
      name: req.query.name,
    });
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
    const { payload, errors } = validateHotelPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Invalid hotel payload", errors });
    }

    const id = await Hotel.create(payload);
    res.status(201).json({ message: "Hotel created", id });
  } catch (err) {
    res.status(500).json({ message: "Failed to create hotel" });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { payload, errors } = validateHotelPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Invalid hotel payload", errors });
    }

    const updated = await Hotel.update(req.params.id, payload);
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
