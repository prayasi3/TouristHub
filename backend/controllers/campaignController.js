import Campaign from "../models/Campaign.js";

// Get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.getAll();
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error while fetching campaigns" });
  }
};

// Get campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.getById(id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error while fetching campaign" });
  }
};

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const { title, description, start_date, end_date, banner_url } = req.body;

    if (!title || !description || !start_date || !end_date || !banner_url) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    const newCampaign = await Campaign.create({
      title,
      description,
      start_date,
      end_date,
      banner_url
    });

    res.status(201).json(newCampaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error while creating campaign" });
  }
};

// Update a campaign by ID
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, banner_url } = req.body;

    if (!title || !description || !start_date || !end_date || !banner_url) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Campaign.update(id, {
      title,
      description,
      start_date,
      end_date,
      banner_url
    });

    if (!updated) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ message: "Campaign updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error while updating campaign" });
  }
};

// Delete a campaign by ID
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Campaign.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error while deleting campaign" });
  }
};
