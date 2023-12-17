const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionPakageSchema = new Schema({
    name: String,
    description: String,    
    categories: [String],
    price:Number,
    dateCreated: {
        type: Date, // Change the type to Date
        default: Date.now // Set the default value to the current date
    },
});

module.exports = mongoose.model("SubscriptionPakage", subscriptionPakageSchema);
