const express = require('express');
const Router = express.Router();
const Categories = require('../models/Categories');
const Videos = require('../models/Videos');
const Users = require('../models/Users');
const Subscriptions = require('../models/Subscriptions');
const multer = require("multer");
const JWT_SECRET = "SecurityInsure";
const jwt = require('jsonwebtoken');
// const ffmpeg = require('fluent-ffmpeg'); // Import fluent-ffmpeg
const { spawn } = require('child_process');
const path = require("path");
const fs = require("fs");
const fsWithoutPromises = require('fs');
const which = require('which');

const aws = require("aws-sdk"); // Import the AWS SDK
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION, // Change to your preferred region
});
const s3 = new aws.S3();

// // Function to find the path to the ffmpeg executable
// function findFFmpegPath() {
//     try {
//         // Attempt to find the path to the ffmpeg executable
//         const ffmpegPath = which.sync('ffmpeg');
//         return ffmpegPath;
//     } catch (error) {
//         console.error('FFmpeg executable not found. Please make sure FFmpeg is installed and in your PATH.');
//         process.exit(1);
//     }
// }

// // Define a function to compress a video using FFmpeg
// function compressVideo(inputPath, outputPath) {
//     const ffmpegPath = findFFmpegPath();
//     return new Promise((resolve, reject) => {
//         // Use FFmpeg command to compress the video
//         const ffmpeg = spawn('ffmpeg', [
//             '-i', inputPath,              // Input file
//             '-c:v', 'libx264',           // Video codec
//             '-crf', '28',                // Constant Rate Factor (lower value means higher quality but larger file size)
//             '-preset', 'slow',           // Compression preset (slow provides better compression)
//             outputPath                   // Output file
//         ]);
//         // Listen for FFmpeg process events
//         ffmpeg.stdout.on('data', (data) => {
//             console.log(`stdout: ${data}`);
//         });

//         ffmpeg.stderr.on('data', (data) => {
//             console.error(`stderr: ${data}`);
//         });

//         ffmpeg.on('close', (code) => {
//             if (code === 0) {
//                 console.log('Video compression finished');
//                 resolve();
//             } else {
//                 console.error(`Video compression process exited with code ${code}`);
//                 reject(`Video compression process exited with code ${code}`);
//             }
//         });
//     });
// }

Router.addVideo = async (req, res) => {
    try {
        console.log("1");
        const { state, tags, categories } = req.body;
        const categoryNames = categories.split(","); // Split category names into an array

        // Find category IDs based on category names
        const categoryIds = await Categories.find({ name: { $in: categoryNames } }).select('_id');

        // Extract _id values and create an array
        const categoryIdsArray = categoryIds.map(category => category._id);

        const tagsArray = tags.split(",");
        if (req.file.originalname) {
            const checkVideo = await Videos.findOne({ name: req.file.originalname })
            if (checkVideo) {
                console.log("Video Already Exist");
                res.json({ status: 400, message: 'This Video already exists' });
            } else {
                // Define input and output paths for video compression
                console.log("Video Not Exist");
                const inputVideoPath = path.join(__dirname, '../public/videos', req.file.originalname);
                // const compressedVideoPath = path.join(__dirname, '../public/videos/compress', req.file.originalname);
                // console.log("inputVideoPath: " + inputVideoPath);
                // console.log("compressedVideoPath: " + compressedVideoPath);
                // // Compress the video
                // await compressVideo(inputVideoPath, compressedVideoPath);

                // Upload the compressed video to S3
                const s3Params = {
                    Bucket: 'trafikbilderbucket', // Replace with your S3 bucket name
                    Key: `videos/${req.file.originalname}`, // Specify the path and filename in S3
                    Body: fs.readFileSync(inputVideoPath), // Read the compressed video file
                    ACL: 'public-read', // Optional: Set the ACL (Access Control List)
                };

                console.log("s3Params: " + s3Params);

                s3.upload(s3Params, async (error, s3Data) => {
                    if (error) {
                        // Remove the locally compressed video file and original file 
                        // fs.unlinkSync(compressedVideoPath);
                        fs.unlinkSync(inputVideoPath);
                        console.error('Error uploading video to S3:', error);
                        return res.status(500).json({ status: 500, error: 'An error occurred while uploading the video.' });
                    }

                    // Remove the locally compressed video file and original file after successful upload to S3
                    // fs.unlinkSync(compressedVideoPath);
                    fs.unlinkSync(inputVideoPath);

                    const VideoData = new Videos({
                        name: req.file.originalname,
                        state: state,
                        tags: tagsArray,
                        categories: categoryIdsArray,
                    });

                    await VideoData.save();

                    const checkVideoSave = await Videos.findOne({ name: req.file.originalname })

                    if (checkVideoSave) {
                        res.json({ status: 200, message: 'Video uploaded Successfully', data: VideoData });
                    } else {
                        res.json({ status: 400, message: 'Video Not Upload' });
                    }
                });
            }
        } else {
            res.json({ status: 400, message: 'Please Fill all fields' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 500, error: error });
    }
};

Router.listOfFrontVideos = async (req, res) => {
    try {
        // find user pakage
        const { token, category } = req.body;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userID = decodedToken.id;
        const user = await Users.findById(userID);
        const userPakageCategories = await Subscriptions.findById(user.subscriptionPakage);

        // pakage categories
        let videoCategories = userPakageCategories.categories;
        console.log("Video 1: ", videoCategories);
        // Selected Category
        if (videoCategories) {
            if (category !== null) {
                videoCategories = [category];
                console.log("Video 2: ", videoCategories);
            }
            else {
                console.log("Category not exist");
            }
        }

        // Find images whose categories match any in imageCategories
        const VideosData = await Videos.find({ categories: { $in: videoCategories } });

        // Create a list to store Videos with category names
        const VideosWithCategoryNames = await Promise.all(VideosData.map(async (Video) => {
            // Fetch category names based on category IDs stored in the Video
            const categoryNames = await Categories.find({ _id: { $in: Video.categories } }).select('name');

            // Map category documents to category names
            const categories = categoryNames.map(category => category.name);

            // Create a new object with category names and other Video data
            const VideoWithCategories = {
                ...Video._doc, // Include existing Video data
                categories: categories, // Replace category IDs with category names
            };

            return VideoWithCategories;
        }));

        res.json({ status: 200, data: VideosWithCategoryNames });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.listOfVideos = async (req, res) => {
    try {
        const VideosData = await Videos.find();

        // Create a list to store Videos with category names
        const VideosWithCategoryNames = await Promise.all(VideosData.map(async (Video) => {
            // Fetch category names based on category IDs stored in the Video
            const categoryNames = await Categories.find({ _id: { $in: Video.categories } }).select('name');

            // Map category documents to category names
            const categories = categoryNames.map(category => category.name);

            // Create a new object with category names and other Video data
            const VideoWithCategories = {
                ...Video._doc, // Include existing Video data
                categories: categories, // Replace category IDs with category names
            };

            return VideoWithCategories;
        }));

        res.json({ status: 200, data: VideosWithCategoryNames });
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.changeStatus = async (req, res) => {
    try {
        const checkVideo = await Videos.findById(req.params.id);

        if (checkVideo) {
            if (checkVideo.state === "Pending") {
                checkVideo.state = "Approved";
                const updateState = await checkVideo.save();
                if (updateState.state === "Approved") {
                    res.json({ status: 200, message: "Update Status Successfully" });
                }
            } else if (checkVideo.state === "Approved") {
                checkVideo.state = "Pending";
                const updateState = await checkVideo.save();
                if (updateState.state === "Pending") {
                    res.json({ status: 200, message: "Update Status Successfully" });
                }
            }
        } else {
            res.json({ status: 400, message: "Video not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};

Router.getVideo = async (req, res) => {
    try {
        const checkVideo = await Videos.findById(req.params.id);
        if (checkVideo) {
            // Map the category IDs to category names
            const categoryNames = await Categories.find({ _id: { $in: checkVideo.categories } }, 'name');
            const categoryNamesArray = categoryNames.map(category => category.name);

            // Replace the category IDs with category names in the data
            const VideoData = { ...checkVideo._doc, categories: categoryNamesArray };

            res.json({ status: 200, message: "Video get Successfully", data: VideoData });
        } else {
            res.json({ status: 400, message: "Video not found" });
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.updateVideo = async (req, res) => {
    try {
        const { state, tags, categories } = req.body;
        if (!tags || !categories) {
            res.json({ status: 400, message: "Please Fill All Fields" });
        } else {
            const checkVideo = await Videos.findById(req.params.id);
            if (checkVideo) {
                // Find category IDs based on category names
                const categoryIds = await Categories.find({ name: { $in: categories } }).select('_id');
                // Extract _id values and create an array
                const categoryIdsArray = categoryIds.map(category => category._id);

                const updateObject = {
                    name: checkVideo.name,
                    tags: tags,
                    categories: categoryIdsArray,
                    state: state
                };

                await Videos.findByIdAndUpdate({ _id: req.params.id }, { $set: updateObject })
                res.json({ status: 200, message: "Update Successfully" });

            } else {
                res.json({ status: 400, message: "Video not found" });
            }
        }
    } catch (error) {
        res.json({ status: 500, error: 'An error occurred while retrieving the records.' });
    }
};

Router.deleteVideo = async (req, res) => {
    try {
        const checkVideo = await Videos.findById(req.params.id);

        if (checkVideo) {
            // Delete the video from S3
            const s3Key = `videos/${checkVideo.name}`;
            const s3Params = {
                Bucket: 'trafikbilderbucket', // Replace with your S3 bucket name
                Key: s3Key,
            };

            s3.deleteObject(s3Params, async (error, data) => {
                if (error) {
                    console.error('Error deleting video from S3:', error);
                    return res.status(500).json({ status: 500, error: 'An error occurred while deleting the video.' });
                }

                // Remove the original and compressed video files after successfully deleting from S3
                const VideoOriginalPath = path.join(__dirname, '..', 'public', 'videos', checkVideo.name);
                if (fsWithoutPromises.existsSync(VideoOriginalPath)) {
                    fsWithoutPromises.unlinkSync(VideoOriginalPath);
                }
                const VideoCompressPath = path.join(__dirname, '..', 'public', 'videos', 'compress', checkVideo.name);
                if (fsWithoutPromises.existsSync(VideoCompressPath)) {
                    fsWithoutPromises.unlinkSync(VideoCompressPath);
                }

                // Remove the database record after successfully deleting from S3 and locally
                await Videos.findByIdAndRemove(req.params.id);

                res.json({ status: 200, message: 'Video deleted Successfully' });
            });
        } else {
            res.json({ status: 400, message: 'Video not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.json({ status: 500, error: 'An error occurred while retrieving the record.' });
    }
};


module.exports = Router;
