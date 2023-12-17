const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const cors = require("cors");
router.use(cors());

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/customerDashboardData', userController.customerDashboardData);
router.post('/changeCustomerPassword', userController.changeCustomerPassword);
router.get('/listOfCustomers', userController.listOfCustomers);
router.delete('/deleteCustomer/:id', userController.deleteCustomer);
router.put('/changeStatus/:id', userController.changeStatus);
router.put('/resetPassword/:id', userController.resetPassword);

module.exports = router;
