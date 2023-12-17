const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: {
        type: String,
        validate: {
            validator: function (password) {
                return password.length >= 7;
            },
            message: "Password must be at least 7 characters long.",
        },
    },
    role: {
        type: Number,
        default: 1, // 1 for customers and 0 for admin
    },
    subscriptionPakage: {
        type: String,
        default: "No Pakage"
    },
    status: {
        type: String,
        default: "Verify",
    },
    pakageAllocationDate: {
        type: Date, // Change the type to Date
        default: Date.now // Set the default value to the current date
    },
    // paymentStatus: {
    //     type: String,
    //     default: "Unpaid",
    // },
    loginDevice: {
        type: Number,
        default: 0,
    },
    dateCreated: {
        type: Date, // Change the type to Date
        default: Date.now // Set the default value to the current date
    },
});

module.exports = mongoose.model("users", userSchema);
