const mongoose = require("mongoose");

const accountCounterSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    }
});

const AccountCounter = mongoose.model("AccountCounter", accountCounterSchema);

module.exports = AccountCounter;