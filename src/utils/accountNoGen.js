const AccountCounter = require("../Models/AccountCounter"); // Import the model for account counter

const padNumber = (num, size) => {
    let padded = num.toString();
    while (padded.length < size) {
        padded = "0" + padded;
    }
    return padded;
};

const accountNoGen = async () => {
    try {
        let accountCounter = await AccountCounter.findOneAndUpdate({}, { $inc: { count: 1 } }, { upsert: true, new: true });
        const paddedCounter = padNumber(accountCounter.count, 6);
        return `PK${paddedCounter}`;
    } catch (error) {
        console.error("Error generating account number:", error);
        throw new Error("Account number generation failed");
    }
};

module.exports = accountNoGen;