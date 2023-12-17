const express = require('express');
const paymentRequestController = require('../controllers/paymentRequestController');
const router = express.Router();

router.post('/changePakage', paymentRequestController.changePakage);
router.get('/listofPaymentRequests', paymentRequestController.listofPaymentRequests);
router.put('/changeStatus/:id', paymentRequestController.changeStatus);
router.delete('/deleteRequest/:id', paymentRequestController.deleteRequest);

module.exports = router;
