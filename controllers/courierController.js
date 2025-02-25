const Courier = require("../models/Courier");

// Track a shipment
const trackShipment = async (req, res) => {
  const { trackingNumber } = req.body;

  try {
    const courier = await Courier.findOne({ trackingNumber });

    if (!courier) return res.status(404).json({ message: "Courier not found" });

    res.json({
      status: courier.status,
      trackingNumber: courier.trackingNumber,
      user: courier.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Store tracking history (you may want to track more details depending on external API)
const addTrackingHistory = async (req, res) => {
  const { trackingNumber, status } = req.body;
  const user = req.user.id; // To ensure the tracking history belongs to the user

  try {
    const courier = await Courier.create({
      user,
      trackingNumber,
      status,
    });
    res.json({ message: "Tracking history added successfully", courier });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { trackShipment, addTrackingHistory };
