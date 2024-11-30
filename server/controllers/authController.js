const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const { jwtSecret, jwtExpire } = require("../config");

const signToken = (id) =>
  jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire,
  });

// Signup route
exports.signup = catchAsync(async (req, res, next) => {
  const { username, password, email } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ username, password, email });
  await user.save();

  const token = signToken(user._id);

  res.status(201).json({
    message: "User registered successfully",
    user: { username: user.username, email: user.email, id: user._id },
    token,
  });
});

// Login route
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = signToken(user._id);
  res.status(200).json({ user, token });
});

// Middleware to verify token
exports.verifyToken = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});
