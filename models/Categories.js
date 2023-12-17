const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    numberOfImages: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date, // Change the type to Date
        default: Date.now // Set the default value to the current date
    },
});

module.exports = mongoose.model("categories", categorySchema);