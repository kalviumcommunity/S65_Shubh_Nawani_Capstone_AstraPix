const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema(
    {
        credit: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Credit", creditSchema);
