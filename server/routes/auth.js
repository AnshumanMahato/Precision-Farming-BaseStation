const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Signup route
router.post("/signup", authController.signup);

// Login route
router.post("/login", authController.login);

// Protected route example
router.get("/protected", authController.verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "You have access to this route", user: req.user });
});

module.exports = router;
