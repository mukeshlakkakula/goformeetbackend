const Courier = require("../models/Courier");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Configure Nodemailer for Email Notifications
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lakkakulababblu@gmail.com", // Replace with your email
    pass: "obuz zqgr fwsf qbkx", // Use an App Password if using Gmail
  },
});

//  Function to Send Email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "lakkakulababblu@gmail.com",
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email Error:", error);
  }
};

const trackCourier = async (req, res) => {
  const { trackingNumber } = req.body;
  const userId = req.user.id;

  try {
    const courier = await Courier.findOne({ trackingNumber });

    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }

    // Add user to the tracking list if not already added
    if (!courier.users_tracking.includes(userId)) {
      courier.users_tracking.push(userId);
      await courier.save();
    }

    res.json({ message: "You are now tracking this shipment", courier });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Add Tracking History (Updated)
const addTrackingHistory = async (req, res) => {
  const { trackingNumber, status } = req.body;
  const user = req.user.id;

  try {
    // Fetch user details to get the email
    const userData = await User.findById(user);
    if (!userData) return res.status(404).json({ message: "User not found" });

    // Create the courier record
    const courier = await Courier.create({
      user,
      trackingNumber,
      status,
      order_data: [{ status, timestamp: Date.now() }],
    });

    // Send email notification to the user
    sendEmail(
      userData.email,
      "Courier Order Placed",
      `Your courier with tracking number ${trackingNumber} has been In Transit.`
    );

    res.json({ message: "Tracking history added successfully", courier });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Admin: Update Courier Status
const updateCourierStatus = async (req, res) => {
  const { trackingNumber, status, adminEmail } = req.body;
  const adminUser = adminEmail; // Assume req.user contains logged-in user data
  console.log("trk", adminUser, typeof adminUser);
  // Only allow admin to update status

  if (adminUser !== "admin@gmail.com") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Only admins can update status" });
  }

  try {
    const courier = await Courier.findOne({ trackingNumber }).populate("user");

    if (!courier) return res.status(404).json({ message: "Courier not found" });

    // Update courier status & order history
    courier.status = status;
    courier.order_data.push({ status, timestamp: Date.now() });

    await courier.save();

    // Send email notification to the user
    sendEmail(
      courier.user.email,
      "Courier Status Updated",
      `Your courier (${trackingNumber}) status has been updated to: ${status}`
    );
    const emails = courier.users_tracking.map((user) => user.email);
    if (emails.length > 0) {
      sendEmail(
        emails.join(","), // Send to all users tracking this courier
        "Courier Status Updated",
        `Your courier (${trackingNumber}) status has been updated to: ${status}`
      );
    }

    res.json({ message: "Courier status updated successfully", courier });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Track a Shipment
const trackShipment = async (req, res) => {
  const { trackingNumber } = req.body;

  try {
    const courier = await Courier.findOne({ trackingNumber }).populate("user");

    if (!courier) return res.status(404).json({ message: "Courier not found" });

    res.json({
      status: courier.status,
      trackingNumber: courier.trackingNumber,
      user: courier.user.email, // Send back user email too
      order_data: courier.order_data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const getAllCouriers = async (req, res) => {
  try {
    const couriers = await Courier.find().populate("user", "email name");
    res.json({ couriers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  trackShipment,
  getAllCouriers,
  trackCourier,
  addTrackingHistory,
  updateCourierStatus,
};
