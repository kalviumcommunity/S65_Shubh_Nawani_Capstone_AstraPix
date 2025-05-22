const Credit = require("../models/creditModel");
const User = require("../models/userModel");

const getCredit = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const userCredit = await Credit.findOne({ user: user._id });
    if (!userCredit)
      return res.status(400).json({ message: "No credits found!" });

    return res
      .status(200)
      .json({ credit: userCredit.credit, user: userCredit.user });
  } catch (err) {
    return res.status(500).json({ error: "Error checking credits" });
  }
};

const addCredit = async (req, res) => {
  try {
    const { email } = req.params;
    const { value } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({ message: "Invalid credit amount" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    let userCredit = await Credit.findOne({ user: user._id });

    if (!userCredit) {
      userCredit = new Credit({ user: user._id, credit: value });
    } else {
      userCredit.credit += value;
    }

    await userCredit.save();
    return res.status(201).json({
      message: "Credits added successfully!",
      updatedCredit: userCredit.credit,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getCredit, addCredit };
