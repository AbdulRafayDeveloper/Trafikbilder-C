const express = require('express');
const imageController = require('../controllers/imageController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, '../public/images');
        // console.log('destinationPath: ' + destinationPath);
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const filename = file.originalname; // Corrected to use file.originalname
        cb(null, filename);
    }
});

var upload = multer({
    storage: multer.memoryStorage()
});

const router = express.Router();

// router.get('/allCategoriesNames', imageController.allCategoriesNames);
router.post('/addImage', upload.single('name'), imageController.addImage);
router.get('/listOfImages', imageController.listOfImages);
router.post('/listOfFrontImages', imageController.listOfFrontImages);
router.put('/changeStatus/:id', imageController.changeStatus);
router.delete('/deleteImage/:id', imageController.deleteImage);
router.get('/getImage/:id', imageController.getImage);
router.put('/updateImage/:id', imageController.updateImage);

module.exports = router;
