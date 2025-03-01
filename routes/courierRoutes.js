const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  trackShipment,
  addTrackingHistory,
  updateCourierStatus,
  getAllCouriers,
  trackCourier,
} = require("../controllers/courierController");
router.get("/all", protect, getAllCouriers);
//  Track a shipment
router.post("/track", protect, trackShipment);
// Tracking courier by user
router.post("/track-courier", protect, trackCourier);
//  Add tracking history (for registered users)
router.post("/history", protect, addTrackingHistory);

// Admin can update the courier status
router.put("/update-status", protect, updateCourierStatus);

module.exports = router;
