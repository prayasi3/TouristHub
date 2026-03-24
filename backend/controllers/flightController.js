import Flight from "../models/Flight.js";

function normalizeFlightPayload(body = {}) {
  return {
    airline: String(body.airline || "").trim(),
    flight_number: String(body.flight_number || "").trim().toUpperCase(),
    source: String(body.source || "").trim(),
    destination: String(body.destination || "").trim(),
    price: body.price === undefined || body.price === null || body.price === "" ? "" : Number(body.price),
    date: String(body.date || "").trim(),
    departure_time: String(body.departure_time || "").trim(),
    arrival_time: String(body.arrival_time || "").trim(),
  };
}

function validateFlightPayload(body = {}) {
  const payload = normalizeFlightPayload(body);
  const errors = [];

  if (!payload.airline) errors.push("airline is required");
  if (!payload.flight_number) errors.push("flight_number is required");
  if (!payload.source) errors.push("source is required");
  if (!payload.destination) errors.push("destination is required");
  if (payload.price === "" || Number.isNaN(payload.price) || payload.price < 0) {
    errors.push("price must be a non-negative number");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) errors.push("date must be in YYYY-MM-DD format");
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(payload.departure_time)) errors.push("departure_time must be in HH:MM or HH:MM:SS format");
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(payload.arrival_time)) errors.push("arrival_time must be in HH:MM or HH:MM:SS format");

  return { payload, errors };
}

export const getFlights = async (req, res) => {
  try {
    const flights = await Flight.getAll({
      source: req.query.source,
      destination: req.query.destination,
      date: req.query.date,
    });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flights" });
  }
};

export const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.getById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flight" });
  }
};

export const createFlight = async (req, res) => {
  try {
    const { payload, errors } = validateFlightPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Invalid flight payload", errors });
    }

    const id = await Flight.create(payload);
    res.status(201).json({
      message: "Flight created successfully",
      id
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create flight" });
  }
};

export const updateFlight = async (req, res) => {
  try {
    const { payload, errors } = validateFlightPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Invalid flight payload", errors });
    }

    const updated = await Flight.update(req.params.id, payload);
    if (!updated) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.json({ message: "Flight updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update flight" });
  }
};

export const deleteFlight = async (req, res) => {
  try {
    const deleted = await Flight.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.json({ message: "Flight deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete flight" });
  }
};
