const Credit = require("../models/creditModel");

const checkCredits = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userCredit = await Credit.findOne({ user: userId });

    if (!userCredit || userCredit.credit <= 0) {
      return res.status(403).json({
        message: "Insufficient credits",
        credits: userCredit?.credit || 0,
      });
    }

    req.userCredits = userCredit.credit;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error checking credits" });
  }
};

module.exports = checkCredits;
