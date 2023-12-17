const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    name: String,
    state: String,
    tags: [String],
    categories: [String],
    dateCreated: {
        type: Date, // Change the type to Date
        default: Date.now // Set the default value to the current date
    },
});

module.exports = mongoose.model("videos", videoSchema);
