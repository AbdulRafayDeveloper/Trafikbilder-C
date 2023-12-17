const express = require('express');
const Router = express.Router();
const Categories = require('../models/Categories');
const Images = require('../models/Images');
const Videos = require('../models/Videos');
const Users = require('../models/Users');
const Subscriptions = require('../models/Subscriptions');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "SecurityInsure";

Router.allCategoriesNames = async (req, res) => {
    try {
        const categories = await Categories.find();
        const categoryNames = categories.map(category => category.name); // Extract the 'name' property

        res.json({ status: 200, data: categoryNames });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const checkCategory = await Categories.findOne({ name: name })
        if (checkCategory) {
            res.json({ status: 400, message: 'This category already exist' });
        } else {
            const categoryData = new Categories({
                name,
                description
            });

            await categoryData.save();
            res.json({ status: 200, message: 'Category added Successfully', data: categoryData });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred in insertion of category.' });
    }
};

Router.listOfCategories = async (req, res) => {
    try {
        // Fetch all categories
        const categoriesData = await Categories.find();

        // Calculate the numberOfImages for each category
        const categoriesWithNumberOfImages = await Promise.all(
            categoriesData.map(async (category) => {
                // Find the images that belong to the category by category ID
                const numberOfImages = await Images.countDocuments({ categories: category._id });
                // Update the category with the numberOfImages attribute
                return {
                    ...category.toObject(),
                    numberOfImages,
                };
            })
        );

        res.json({ status: 200, data: categoriesWithNumberOfImages });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.getCategory = async (req, res) => {
    try {
        const checkCategory = await Categories.findById(req.params.id);
        if (checkCategory) {
            res.json({ status: 200, message: "Category get Successfully", data: checkCategory });
        } else {
            res.json({ status: 400, message: "Category not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.updateCategory = async (req, res) => {
    try {
        const checkCategory = await Categories.findById(req.params.id);
        if (checkCategory) {
            if (checkCategory.name === req.body.name) {
                const updateObject = {
                    name: req.body.name,
                    description: req.body.description
                };
                await Categories.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject });
                res.json({ status: 200, message: "Update Successfully" });
            } else {
                const checkAlreadyExistCategory = await Categories.find({ name: req.body.name });
                if (checkAlreadyExistCategory && checkAlreadyExistCategory.length > 0) {
                    res.json({ status: 400, message: "This category already exist" });
                }
                else {
                    const updateObject = {
                        name: req.body.name,
                        description: req.body.description
                    };
                    await Categories.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject });
                    res.json({ status: 200, message: "Update Successfully" });
                }
            }
        } else {
            res.json({ status: 400, message: "Category not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Step 1: Find and delete the category
        const checkCategory = await Categories.findById(categoryId);
        if (!checkCategory) {
            return res.json({ status: 400, message: "Category not found" });
        }

        await Categories.findByIdAndRemove(categoryId);

        // Step 2: Find all images that have this category ID and update their categories array
        const imagesToUpdate = await Images.find({ categories: categoryId });

        if (imagesToUpdate.length > 0) {
            // Create an array of image IDs to update
            const imageIdsToUpdate = imagesToUpdate.map((image) => image._id);

            // Update images: Remove the category ID from their categories array
            await Images.updateMany(
                { _id: { $in: imageIdsToUpdate } },
                { $pull: { categories: categoryId } }
            );
        }

        // Step 3: Find all Videos that have this category ID and update their categories array
        const videosToUpdate = await Videos.find({ categories: categoryId });

        if (imagesToUpdate.length > 0) {
            // Create an array of video IDs to update
            const videoIdsToUpdate = videosToUpdate.map((image) => image._id);

            // Update videos: Remove the category ID from their categories array
            await Videos.updateMany(
                { _id: { $in: videoIdsToUpdate } },
                { $pull: { categories: categoryId } }
            );
        }

        // Step 4: Find all Pakages that have this category ID and update their categories array
        const PakagesToUpdate = await Subscriptions.find({ categories: categoryId });

        if (imagesToUpdate.length > 0) {
            // Create an array of video IDs to update
            const PakagesIdsToUpdate = PakagesToUpdate.map((image) => image._id);

            // Update Pakages: Remove the category ID from their categories array
            await Subscriptions.updateMany(
                { _id: { $in: PakagesIdsToUpdate } },
                { $pull: { categories: categoryId } }
            );
        }

        res.json({ status: 200, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, error: 'An error occurred while deleting the category.' });
    }
};


Router.CategoriesOfPakages = async (req, res) => {
    try {
        // find user pakage
        const { token } = req.body;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userID = decodedToken.id;
        const user = await Users.findById(userID);
        const userPakageCategories = await Subscriptions.findById(user.subscriptionPakage);

        const categoriesData = await Categories.find({ _id: { $in: userPakageCategories.categories } });

        // Calculate the numberOfImages for each category
        const categoriesWithNumberOfImages = await Promise.all(
            categoriesData.map(async (category) => {
                // Find the images that belong to the category by category ID
                const numberOfImages = await Images.countDocuments({ categories: category._id });
                // Update the category with the numberOfImages attribute
                return {
                    ...category.toObject(),
                    numberOfImages,
                };
            })
        );

        res.json({ status: 200, data: categoriesWithNumberOfImages });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};


module.exports = Router;
