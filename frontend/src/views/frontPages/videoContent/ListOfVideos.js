/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import VideosCategoryContext from '../VideoContext/VideosCategoryContext';
import { Link } from 'react-router-dom';

const ListOfVideos = () => {
    const { selectedCategory } = useContext(VideosCategoryContext);
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [viewVideoId, setViewVideoId] = useState(null);
    const [filteredvideo, setfilteredvideo] = useState([]); // Initialize with an empty array
    const perPage = 5; // Number of items per page

    // Fetch videos when the component mounts
    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("Fetching videos for category:", selectedCategory);
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/video/listOfFrontVideos`, { token: token, category: selectedCategory });
            if (Array.isArray(response.data.data)) {
                setVideos(response.data.data);
                setfilteredvideo(response.data.data); // Initialize filteredvideo with the same data
            } else {
                console.error("API response is not an array:", response.data.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    useEffect(() => {
        fetchVideos();
    }, [selectedCategory]);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredvideo(videos); // Reset filtered data to all data
        } else {
            const filteredData = videos.filter((item) => {
                const itemTags = item.tags.join(' ').toLowerCase();
                const itemCategories = item.categories.join(' ').toLowerCase();
                return itemTags.includes(searchText) || itemCategories.includes(searchText);
            });
            setfilteredvideo(filteredData);
        }
    };

    return (
        <div
            className="main-content justify-content-end mb-5"
            style={{ paddingTop: "135px" }}
        >
            <div className="row">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <div className="mb-3" style={{ marginLeft: "50px" }}>
                        <input
                            type="text"
                            placeholder="Search Videos"
                            onChange={handleFilter}
                            className="form-control rounded-pill w-76"
                        />
                    </div>
                </div>
            </div>
            {/* main page images render using map */}
            <div className="Box row justify-content-center justify-content-evenly">
                {filteredvideo.map((element, index) => (
                    <div className="col-lg-3 mx-4 col-md-6 mb-2 text-center" key={index}>
                        <div className="card-body">
                            <div className="image-container">
                                <div className="relative">
                                    <Link to={`/detailOfVideo/${element._id}`}>
                                        <video
                                            controls
                                            style={{ width: '300px', height: '300px' }} // Set max width and height
                                            src={`https://trafikbilderbucket.s3.amazonaws.com/videos/${element.name}`}
                                            alt="Viewed Video"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default ListOfVideos;