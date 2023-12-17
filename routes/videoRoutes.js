const express = require('express');
const videoController = require('../controllers/videoController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Vide0
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, '../public/videos');
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

const router = express.Router();

router.post('/addVideo', upload.single('name'), videoController.addVideo);
router.get('/listOfVideos', videoController.listOfVideos);
router.post('/listOfFrontVideos', videoController.listOfFrontVideos);
router.put('/changeStatus/:id', videoController.changeStatus);
router.delete('/deleteVideo/:id', videoController.deleteVideo);
router.get('/getVideo/:id', videoController.getVideo);
router.put('/updateVideo/:id', videoController.updateVideo);

module.exports = router;