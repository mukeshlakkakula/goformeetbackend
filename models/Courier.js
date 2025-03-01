const mongoose = require("mongoose");

const CourierSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trackingNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["In Transit", "Delivered", "Delayed"],
      default: "In Transit",
    },
    order_data: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    users_tracking: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courier", CourierSchema);
