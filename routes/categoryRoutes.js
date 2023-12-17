const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
});

router.post('/add', categoryController.addCategory);
router.get('/listOfCategories', categoryController.listOfCategories);
router.get('/allCategoriesNames', categoryController.allCategoriesNames);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);
router.get('/getCategory/:id', categoryController.getCategory);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.post('/CategoriesOfPakages', categoryController.CategoriesOfPakages);

module.exports = router;
