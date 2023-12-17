const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const Categories = require('../models/Categories');
const Subscriptions = require('../models/Subscriptions');
const PaymentRequests = require('../models/PaymentRequests');
const Users = require('../models/Users');
const JWT_SECRET = "SecurityInsure";

Router.changePakage = async (req, res) => {
    try {
        const { token, pakageID } = req.body;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userID = decodedToken.id;

        const checkCustomerRequest = await PaymentRequests.find({ userID: userID });
        if (checkCustomerRequest.length > 0) {
            const checkCustomerRequest = await PaymentRequests.findOneAndUpdate(
                { userID: userID },
                { $set: { pakageID: pakageID } }
            );

            if (!checkCustomerRequest) {
                res.json({ status: 400, message: 'Your Request of this pakage not send' });
            }
            else {
                res.json({ status: 200, message: 'Your Request Send Successfully', data: checkCustomerRequest });
            }

        } else {
            const requestData = new PaymentRequests({
                userID: userID, pakageID: pakageID
            });

            const dataSave = await requestData.save();
            if (dataSave) {
                res.json({ status: 200, message: 'Your Request Send Successfully', data: dataSave });
            }
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred in creating the Pakage' });
    }
};

Router.listofPaymentRequests = async (req, res) => {
    try {
        const pakagesRequestsData = await PaymentRequests.find();

        const result = await Promise.all(pakagesRequestsData.map(async (request) => {
            const user = await Users.findOne({ _id: request.userID });
            const package = await Subscriptions.findOne({ _id: request.pakageID });

            return {
                _id: request._id,
                userID: request.userID,
                pakageID: request.pakageID,
                userEmail: user ? user.email : null,
                packageName: package ? package.name : null,
                status: request.status,
            };
        }));

        res.json({ status: 200, data: result });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.changeStatus = async (req, res) => {
    try {
        const checkExist = await PaymentRequests.findById(req.params.id);

        if (checkExist) {
            const updateUserPakage = await Users.findByIdAndUpdate(
                { _id: checkExist.userID },
                {
                    $set: {
                        subscriptionPakage: checkExist.pakageID,
                        pakageAllocationDate: Date.now() // Add the current date
                    }
                }
            );

            if (updateUserPakage) {
                await PaymentRequests.findByIdAndRemove(req.params.id);
                const checkrequestDelete = await PaymentRequests.findById(req.params.id);
                if (checkrequestDelete) {
                    res.json({ status: 400, message: "Customer Pakage changed but not delete from records" });
                }
                else {
                    res.json({ status: 200, message: "Customer Pakage changed" });
                }
            } else {
                res.json({ status: 400, message: "Error in Request" });
            }
        } else {
            res.json({ status: 400, message: "Request not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

Router.deleteRequest = async (req, res) => {
    try {
        const checkExist = await PaymentRequests.findById(req.params.id);

        if (checkExist) {
            await PaymentRequests.findByIdAndRemove(req.params.id);
            res.json({ status: 200, message: "Request Deleted" });
        }
        else {
            res.json({ status: 400, message: "Error in Request" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

module.exports = Router;