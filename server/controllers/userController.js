const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return res.status(200).json({ message: "No users found!" });
    }
    return res.status(200).json({ userDetails: users });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching users" });
  }
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email!" });
    }
    if (!password) {
      return res.status(400).json({ message: "Please provide a password!" });
    }
    if (password.length < 8 || password.length >= 16) {
      return res
        .status(400)
        .json({
          message: "Password length must be in between 8 and 16 characters!",
        });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token for new user
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set cookie
    res.cookie("token", token, { httpOnly: true });

    // Send response with token and user data
    return res.status(201).json({
      message: "Signup Successful...",
      token: token,
      user: {
        email: newUser.email,
        id: newUser._id,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email!" });
    }
    if (!password) {
      return res.status(400).json({ message: "Please provide a password!" });
    }
    if (password.length < 8 || password.length >= 16) {
      return res
        .status(400)
        .json({
          message: "Password length must be in between 8 and 16 characters!",
        });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User Does Not Exists!" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the cookie
    res.cookie("token", token, { httpOnly: true });

    // Send token and user data in response body
    return res.status(200).json({
      message: "Login Successful...",
      token: token,
      user: {
        email: existingUser.email,
        id: existingUser._id,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, login, signup };
