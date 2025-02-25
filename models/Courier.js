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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courier", CourierSchema);
