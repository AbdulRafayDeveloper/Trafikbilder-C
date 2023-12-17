const express = require('express');
const Router = express.Router();
const Categories = require('../models/Categories');
const Subscriptions = require('../models/Subscriptions');

Router.addPakage = async (req, res) => {
    try {
        const { name, description, price, categories } = req.body;

        // Find category IDs based on category names
        const categoryIds = await Categories.find({ name: { $in: categories } }).select('_id');
        // Extract _id values and create an array
        const categoryIdsArray = categoryIds.map(category => category._id);

        if (name && description && price) {
            const checkSubscription = await Subscriptions.findOne({ name: name })
            if (checkSubscription) {
                res.json({ status: 400, message: 'This pakage already exist' });
            } else {
                const SubscriptionData = new Subscriptions({
                    name: name,
                    description: description,
                    price: price,
                    categories: categoryIdsArray
                });

                await SubscriptionData.save();

                const checkSubscriptionSave = await Subscriptions.findOne({ name: name })
                if (checkSubscriptionSave) {
                    res.json({ status: 200, message: 'Pakage created successfully', data: checkSubscriptionSave });
                } else {
                    res.json({ status: 400, message: 'Pakage not create.Error!' });
                }
            }
        }
        else {
            res.json({ status: 400, message: 'Please Fill all fields' });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred in creating the Pakage' });
    }
};

Router.listOfPakages = async (req, res) => {
    try {
        const SubscriptionsData = await Subscriptions.find();

        // Create a list to store Subscriptions with category names
        const SubscriptionsWithCategoryNames = await Promise.all(SubscriptionsData.map(async (pakage) => {
            // Fetch category names based on category IDs stored in the pakage
            const categoryNames = await Categories.find({ _id: { $in: pakage.categories } }).select('name');

            // Map category documents to category names
            const categories = categoryNames.map(category => category.name);

            // Create a new object with category names and other pakage data
            const SubscriptionWithCategories = {
                ...pakage._doc, // Include existing pakage data
                categories: categories, // Replace category IDs with category names
            };

            return SubscriptionWithCategories;
        }));

        res.json({ status: 200, message: "data retrieve successfully", data: SubscriptionsWithCategoryNames });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.getPakage = async (req, res) => {
    try {
        const checkPakage = await Subscriptions.findById(req.params.id);
        if (checkPakage) {
            // Map the category IDs to category names
            const categoryNames = await Categories.find({ _id: { $in: checkPakage.categories } }, 'name');
            const categoryNamesArray = categoryNames.map(category => category.name);

            // Replace the category IDs with category names in the data
            const PakageData = { ...checkPakage._doc, categories: categoryNamesArray };

            res.json({ status: 200, message: "Pakage get Successfully", data: PakageData });
        } else {
            res.json({ status: 400, message: "Pakage not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.updatePakage = async (req, res) => {
    try {
        const { name, description, price, categories } = req.body;
        if (!name || !description || !price || !categories) {
            res.json({ status: 400, message: "Please Fill All Fields" });
        } else {
            const checkPakage = await Subscriptions.findById(req.params.id);
            if (checkPakage) {
                if (checkPakage.name === name) {
                    // Find category IDs based on category names
                    const categoryIds = await Categories.find({ name: { $in: categories } }).select('_id');
                    // Extract _id values and create an array
                    const categoryIdsArray = categoryIds.map(category => category._id);

                    const updateObject = {
                        name: name,
                        description: description,
                        price: price,
                        categories: categoryIdsArray,
                    };

                    await Subscriptions.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject })
                    res.json({ status: 200, message: "Update Successfully" });
                } else {
                    const checkAlreadyExistPakage = await Subscriptions.find({ name: name });
                    if (checkAlreadyExistPakage && checkAlreadyExistPakage.length > 0) {
                        res.json({ status: 400, message: "This pakage already exist" });
                    }
                    else {
                        // Find category IDs based on category names
                        const categoryIds = await Categories.find({ name: { $in: categories } }).select('_id');
                        // Extract _id values and create an array
                        const categoryIdsArray = categoryIds.map(category => category._id);

                        const updateObject = {
                            name: name,
                            description: description,
                            price: price,
                            categories: categoryIdsArray,
                        };

                        await Subscriptions.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject })
                        res.json({ status: 200, message: "Update Successfully" });
                    }
                }
            } else {
                res.json({ status: 400, message: "Pakage not found" });
            }
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.deletePakage = async (req, res) => {
    try {
        const checkSubscription = await Subscriptions.findById(req.params.id);

        if (checkSubscription) {
            await Subscriptions.findByIdAndRemove(req.params.id);

            const checkSubscriptionDelete = await Subscriptions.findById(req.params.id)

            if (checkSubscriptionDelete) {
                res.json({ status: 400, message: 'Subscription Pakage Not Deleted' });
            } else {
                res.json({ status: 200, message: 'Subscription Pakage deleted Successfully' });
            }
        } else {
            res.json({ status: 400, message: "Subscription Pakage not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

module.exports = Router;
