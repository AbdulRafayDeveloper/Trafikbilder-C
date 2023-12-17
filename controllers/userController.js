const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt
const mongoose = require('mongoose');
const Router = express.Router();
const Users = require('../models/Users');
const Subscriptions = require('../models/Subscriptions');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "SecurityInsure";
const cors = require("cors");
Router.use(cors());

// Signup Api //
Router.signUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (name && email && password) {
            if (password === confirmPassword) {

                const checkEmail = await Users.find({ email: email });
                if (checkEmail.length > 0) {
                    res.json({ status: 400, message: "Account with this email already exist" });
                } else {
                    // Hash the password before saving it
                    const saltRounds = 10; // You can adjust the number of salt rounds
                    const hashedPassword = await bcrypt.hash(password, saltRounds);

                    const FreePackage = await Subscriptions.findOne({ price: 0 });
                    let freePackageId = "No Pakage";
                    if (FreePackage) {
                        freePackageId = FreePackage._id;
                    }

                    const userData = new Users({
                        name, email, password: hashedPassword, subscriptionPakage: freePackageId  // Store the hashed password
                    });

                    const saveUser = await userData.save();

                    if (saveUser) {
                        res.json({ status: 200, message: "Signup Successfully", data: saveUser });
                    } else {
                        res.json({ status: 500, message: "Error occurred in signup" });
                    }
                }
            } else {
                res.json({ status: 400, message: "Password and Confirm Password not match" });
            }
        } else {
            res.json({ status: 400, message: "Please Input All required Information" });
        }
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "An error occurred while processing your request" });
    }
};

// login Api //
Router.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await Users.findOne({ email: email });
            if (user) {
                const userStatus = await Users.findOne({ email: email, status: "Verify" });
                if (userStatus) {
                    // Compare the provided password with the stored hashed password
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) {
                        const userLoginDevices = await Users.findOne({ email: email, loginDevice: 1 });
                        if (user.role !== 0) {
                            if (userLoginDevices) {
                                res.json({ status: 400, message: "Please logout from other device to login here.", data: user });
                            } else {
                                const zeroPricePackage = await Subscriptions.findOne({ price: 0 });
                                if (user.subscriptionPakage === "No Pakage") {
                                    if (zeroPricePackage) {
                                        user.subscriptionPakage = zeroPricePackage._id;
                                    }
                                }
                                else {
                                    const userPakage = user.subscriptionPakage;
                                    // Convert userPakage to ObjectId
                                    const userPakageObjectId = new mongoose.Types.ObjectId(userPakage);
                                    const findPakagePrice = await Subscriptions.findById(userPakageObjectId);
                                    if (findPakagePrice.price !== 0) {
                                        // Check the Pakage allocation date with the current date
                                        const createdDate = new Date(user.pakageAllocationDate);
                                        const currentDate = new Date();

                                        // Calculate the difference in milliseconds
                                        const timeDifference = currentDate.getTime() - createdDate.getTime();

                                        // Calculate the number of milliseconds in a year
                                        const millisecondsInOneYear = 365 * 24 * 60 * 60 * 1000;

                                        // Compare if one year has passed
                                        if (timeDifference >= millisecondsInOneYear) {
                                            const updatePakage = await Users.findByIdAndUpdate(
                                                { _id: user._id },
                                                {
                                                    $set: {
                                                        subscriptionPakage: zeroPricePackage._id,
                                                        pakageAllocationDate: Date.now() // Add the current date
                                                    }
                                                },
                                                { new: true } // Make sure to use { new: true } to get the updated document
                                            );
                                            console.log("updatePakage: " + updatePakage);
                                        } else {
                                            console.log("Less than one year has passed.");
                                        }
                                    }
                                }

                                user.loginDevice = 1;
                                await user.save();
                            }
                        }
                        const token = jwt.sign(
                            {
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                            },
                            JWT_SECRET,
                            { expiresIn: '24h' }
                        );
                        res.json({ status: 200, message: "Login Successful", data: user, token: token });
                    } else {
                        res.json({ status: 400, message: "Password Not Match." });
                    }
                } else {
                    res.json({ status: 400, message: "Your account not verified." });
                }
            } else {
                res.json({ status: 400, message: "This Account Does Not Exist." });
            }
        } else {
            res.json({ status: 400, message: "Please Input All Required Information" });
        }
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "An error occurred while processing your request" });
    }
};

// logout
Router.logout = async (req, res) => {
    try {
        const { token } = req.body;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.id;
        const user = await Users.findOne({ _id: userId });
        user.loginDevice = 0;
        await user.save();
        res.json({ status: 200, message: "Logout Successful", data: user, token: token });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "An error occurred while processing your request" });
    }
};


// List of Customers //
Router.listOfCustomers = async (req, res) => {
    try {
        const customersData = await Users.find({ role: 1 });
        if (customersData) {
            res.json({ status: 200, data: customersData });
        } else {
            res.json({ status: 200, message: "No records found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

// customerDashboardData
Router.customerDashboardData = async (req, res) => {
    try {
        const { token } = req.body;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.id;
        const userName = decodedToken.name;
        const userEmail = decodedToken.email;

        const user = await Users.findOne({ _id: userId });
        const checkPakage = await Subscriptions.findById(user.subscriptionPakage);

        res.json({ status: 200, message: "Logout Successful", id: userId, name: userName, email: userEmail, pakageName: checkPakage.name });
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "An error occurred while processing your request" });
    }
};

// resetPassword //
Router.resetPassword = async (req, res) => {
    try {
        const checkCustomer = await Users.findById(req.params.id);

        if (checkCustomer) {
            const password = "123456789";
            // Hash the password before saving it
            const saltRounds = 10; // You can adjust the number of salt rounds
            checkCustomer.password = await bcrypt.hash(password, saltRounds);
            checkCustomer.loginDevice = 0;
            const updatePassword = await checkCustomer.save();
            if (updatePassword) {
                res.json({ status: 200, message: "Update Password" });
            }
            else {
                res.json({ status: 400, message: "Not Update Password" });
            }
        } else {
            res.json({ status: 400, message: "Customer not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

// changeCustomerPassword
Router.changeCustomerPassword = async (req, res) => {
    try {
        const { id, prevPassword, password, confirmPassword } = req.body;
        if (prevPassword && password && confirmPassword) {
            if (password === confirmPassword) {
                const checkEmail = await Users.findById(id);
                if (checkEmail) {
                    const passwordMatch = await bcrypt.compare(prevPassword, checkEmail.password);
                    if (passwordMatch) {
                        // Hash the password before saving it
                        const saltRounds = 10; // You can adjust the number of salt rounds
                        const hashedPassword = await bcrypt.hash(password, saltRounds);

                        checkEmail.password = hashedPassword;
                        const saveUser = await checkEmail.save();

                        if (saveUser) {
                            res.json({ status: 200, message: "Password change Successfully", data: saveUser });
                        } else {
                            res.json({ status: 500, message: "Error occurred in Password change" });
                        }
                    } else {
                        res.json({ status: 400, message: "Your Previous Password not match" });
                    }
                }
                else {
                    res.json({ status: 400, message: "Account with this id not exist" });
                }
            } else {
                res.json({ status: 400, message: "Password and Confirm Password not match" });
            }
        } else {
            res.json({ status: 400, message: "Please Input All required Information" });
        }
    } catch (error) {
        console.error(error);
        res.json({ status: 500, message: "An error occurred while processing your request" });
    }
};

// changeStatus //
Router.changeStatus = async (req, res) => {
    try {
        const checkCustomer = await Users.findById(req.params.id);
        if (checkCustomer) {
            const updateState = await checkCustomer.save();
            updateState.status = req.body.status;
            updateState.save();
            res.json({ status: 200, message: "Update Status Successfully" });
        }
        else {
            res.json({ status: 400, message: "Customer not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

// Delete the Customer //
Router.deleteCustomer = async (req, res) => {
    try {
        const userID = req.params.id;
        // Step 1: Find and delete the customer
        const checkCustomer = await Users.findById(userID);
        if (!checkCustomer) {
            return res.json({ status: 400, message: "Customer not exist" });
        }

        await Users.findByIdAndRemove(userID);

        const checkUsersDelete = await Users.findById(userID);
        if (!checkUsersDelete) {
            res.json({ status: 200, message: "Customer deleted successfully" });
        }
        else {
            return res.json({ status: 400, message: "Customer not exist" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, error: 'An error occurred while deleting the customer.' });
    }
};

module.exports = Router;