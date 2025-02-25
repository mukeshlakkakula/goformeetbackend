const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  trackShipment,
  addTrackingHistory,
} = require("../controllers/courierController");

// Route to track a shipment
router.post("/track", protect, trackShipment);

// Route to add tracking history (for registered users)
router.post("/history", protect, addTrackingHistory);

module.exports = router;
