const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const router = express.Router();

// router.get('/allCategoriesNames', subscriptionController.allCategoriesNames);
router.post('/addPakage', subscriptionController.addPakage);
router.get('/listOfPakages', subscriptionController.listOfPakages);
router.delete('/deletePakage/:id', subscriptionController.deletePakage);
router.get('/getPakage/:id', subscriptionController.getPakage);
router.put('/updatePakage/:id', subscriptionController.updatePakage);

module.exports = router;
