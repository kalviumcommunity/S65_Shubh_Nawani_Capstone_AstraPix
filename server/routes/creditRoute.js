const express = require("express");
const { getCredit, addCredit } = require("../controllers/creditController");
const router = express.Router();

router.get("/credits/:email", getCredit);
router.post("/credits/:email", addCredit);

module.exports = router;
