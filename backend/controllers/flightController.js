import Flight from "../models/Flight.js";

export const getFlights = async (req, res) => {
  try {
    const flights = await Flight.getAll();
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
    const id = await Flight.create(req.body);
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
    const updated = await Flight.update(req.params.id, req.body);
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
