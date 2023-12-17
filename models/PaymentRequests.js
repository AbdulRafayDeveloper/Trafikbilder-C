const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentRequestSchema = new Schema({
    userID: String,
    pakageID: String,
    status: {
        type: String, // Change the type
        default: "Pending" // Set the default value to the status
    },
    dateCreated: {
        type: Date, // Change the type to Date
        default: Date.now // Set the default value to the current date
    },
});

module.exports = mongoose.model("PaymentRequests", paymentRequestSchema);