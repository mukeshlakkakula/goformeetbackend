const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Handle both cases

  console.log("Token received:", token);

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = protect;
