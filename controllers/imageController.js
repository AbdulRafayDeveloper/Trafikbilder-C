const express = require('express');
const Router = express.Router();
const Categories = require('../models/Categories');
const Subscriptions = require('../models/Subscriptions');
const Images = require('../models/Images');
const multer = require("multer");
const path = require("path");
const Users = require('../models/Users');
const JWT_SECRET = "SecurityInsure";
const jwt = require('jsonwebtoken');
const fs = require("fs");
const fsWithoutPromises = require('fs');

const aws = require("aws-sdk"); // Import the AWS SDK
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION, // Change to your preferred region
});
const s3 = new aws.S3();

// Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, '../public/images');
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const filename = file.originalname; // Corrected to use file.originalname
        cb(null, filename);
    }
});

var upload = multer({
    storage: storage
});

Router.addImage = async (req, res) => {
    // console.log(s3Data.Location)
    try {
        const { originalname, buffer } = req.file;

        // Define S3 parameters for image upload
        const s3Params = {
            Bucket: 'trafikbilderbucket', // Replace with your S3 bucket name
            Key: `images/${originalname}`, // Path and filename in S3
            Body: buffer, // Image data
            ACL: 'public-read', // Optional: Set the ACL (Access Control List)
        };

        // Upload the image to S3
        s3.upload(s3Params, async (error, s3Data) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Failed to upload the image');
            }

            const { state, tags, categories } = req.body;
            const categoryNames = categories.split(","); // Split category names into an array

            // Find category IDs based on category names
            const categoryIds = await Categories.find({ name: { $in: categoryNames } }).select('_id');

            // Extract _id values and create an array
            const categoryIdsArray = categoryIds.map(category => category._id);

            const tagsArray = tags.split(",");
            if (req.file.originalname) {
                const checkImage = await Images.findOne({ name: req.file.originalname })
                if (checkImage) {
                    res.json({ status: 400, message: 'This image already exist' });
                } else {
                    const imageData = new Images({
                        name: req.file.originalname,
                        state: state,
                        tags: tagsArray,
                        categories: categoryIdsArray
                    });

                    await imageData.save();

                    const checkImageSave = await Images.findOne({ name: req.file.originalname })

                    if (checkImageSave) {
                        res.json({ status: 200, message: 'Image uploaded Successfully', data: imageData });

                    } else {
                        console.log("error");
                        res.json({ status: 400, message: 'Image Not Upload' });
                    }
                }
            }
            else {
                console.log("error 2");
                res.json({ status: 400, message: 'Please Fill all fields' });
            }
        });
    } catch (error) {
        console.log("error 3", error);
        res.json({ status: 500, error: 'An error occurred in uploading the image' });
    }
};

Router.listOfImages = async (req, res) => {
    try {
        const imagesData = await Images.find();

        // Create a list to store images with category names
        const imagesWithCategoryNames = await Promise.all(imagesData.map(async (image) => {
            // Fetch category names based on category IDs stored in the image
            const categoryNames = await Categories.find({ _id: { $in: image.categories } }).select('name');

            // Map category documents to category names
            const categories = categoryNames.map(category => category.name);

            // Create a new object with category names and other image data
            const imageWithCategories = {
                ...image._doc, // Include existing image data
                categories: categories, // Replace category IDs with category names
            };

            return imageWithCategories;
        }));

        res.json({ status: 200, data: imagesWithCategoryNames });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.listOfFrontImages = async (req, res) => {
    try {
        // find user pakage
        const { token, category } = req.body;
        //console.log("Catgeory Selected: ", category);
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userID = decodedToken.id;
        const user = await Users.findById(userID);
        const userPakageCategories = await Subscriptions.findById(user.subscriptionPakage);

        // pakage categories
        let imageCategories = userPakageCategories.categories;
        console.log("imageCategories: ", imageCategories);
        // Selected Category
        if (imageCategories) {
            if (category !== null) {
                imageCategories = [category];
                console.log("Image: ", imageCategories);
            }
            else {
                console.log("Category not exist");
            }
        }

        // Find images whose categories match any in imageCategories
        const imagesData = await Images.find({ state: 'Approved', categories: { $in: imageCategories } });

        // Create a list to store images with category names
        const imagesWithCategoryNames = await Promise.all(imagesData.map(async (image) => {
            // Fetch category names based on category IDs stored in the image
            const categoryNames = await Categories.find({ _id: { $in: image.categories } }).select('name');

            // Map category documents to category names
            const categories = categoryNames.map(category => category.name);

            // Create a new object with category names and other image data
            const imageWithCategories = {
                ...image._doc, // Include existing image data
                categories: categories, // Replace category IDs with category names
            };

            return imageWithCategories;
        }));

        res.json({ status: 200, data: imagesWithCategoryNames });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.changeStatus = async (req, res) => {
    try {
        const checkImage = await Images.findById(req.params.id);

        if (checkImage) {
            if (checkImage.state === "Pending") {
                checkImage.state = "Approved";
                const updateState = await checkImage.save();
                if (updateState.state === "Approved") {
                    res.json({ status: 200, message: "Update Status Successfully" });
                }
            } else if (checkImage.state === "Approved") {
                checkImage.state = "Pending";
                const updateState = await checkImage.save();
                if (updateState.state === "Pending") {
                    res.json({ status: 200, message: "Update Status Successfully" });
                }
            }
        } else {
            res.json({ status: 400, message: "Image not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

Router.getImage = async (req, res) => {
    try {
        const checkImage = await Images.findById(req.params.id);
        if (checkImage) {
            // Map the category IDs to category names
            const categoryNames = await Categories.find({ _id: { $in: checkImage.categories } }, 'name');
            const categoryNamesArray = categoryNames.map(category => category.name);

            // Replace the category IDs with category names in the data
            const imageData = { ...checkImage._doc, categories: categoryNamesArray };

            res.json({ status: 200, message: "Image get Successfully", data: imageData });
        } else {
            res.json({ status: 400, message: "Image not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.updateImage = async (req, res) => {
    try {
        const { state, tags, categories } = req.body;
        if (!tags || !categories) {
            res.json({ status: 400, message: "Please Fill All Fields" });
        } else {
            const checkImage = await Images.findById(req.params.id);
            if (checkImage) {
                // Find category IDs based on category names
                const categoryIds = await Categories.find({ name: { $in: categories } }).select('_id');
                // Extract _id values and create an array
                const categoryIdsArray = categoryIds.map(category => category._id);

                const updateObject = {
                    name: checkImage.name,
                    tags: tags,
                    categories: categoryIdsArray,
                    state: state
                };

                await Images.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject })
                res.json({ status: 200, message: "Update Successfully" });

            } else {
                res.json({ status: 400, message: "Image not found" });
            }
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.deleteImage = async (req, res) => {
    try {
        const checkImage = await Images.findById(req.params.id);

        if (checkImage) {
            // Delete the image from S3
            const s3Key = `images/${checkImage.name}`;
            const s3Params = {
                Bucket: 'trafikbilderbucket', // Replace with your S3 bucket name
                Key: s3Key,
            };

            s3.deleteObject(s3Params, async (error, data) => {
                if (error) {
                    console.error('Error deleting image from S3:', error);
                    return res.status(500).json({ status: 500, error: 'An error occurred while deleting the image.' });
                }

                // Remove the database record after successfully deleting from S3
                await Images.findByIdAndRemove(req.params.id);

                res.json({ status: 200, message: 'Image deleted Successfully' });
            });
        } else {
            res.json({ status: 400, message: 'Image not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

module.exports = Router;
