/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
// import { LazyLoadvideo } from 'react-lazy-load-video-component';


const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [viewVideoId, setViewVideoId] = useState(null);
    const [filteredvideo, setfilteredvideo] = useState([]); // Initialize with an empty array
    const perPage = 5; // Number of items per page

    // Fetch videos when the component mounts
    const fetchVideos = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/video/listOfVideos`);
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
    }, []);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredvideo(videos); // Reset filtered data to all data
        } else {
            const filteredData = videos.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setfilteredvideo(filteredData);
        }

        setCurrentPage(0);
    };


    // Function to handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    // Calculate the start and end index for the current page
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;

    // Slice the videos array to display items for the current page
    const displayedvideos = filteredvideo.slice(startIndex, endIndex)

    const changeStatus = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to change the state of the video.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, change it!',
        }).then(async (result) => {
            console.log("Id: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/video/changeStatus/${id}`);
                    if (response.status === 200) {
                        fetchVideos();
                    } else {
                        Swal.fire('Error!', 'video State changing failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'video State changing failed.', 'error');
                }
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this video permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            console.log("Id: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/video/deletevideo/${id}`);
                    if (response.status === 200) {
                        // Remove the deleted video from the videos state
                        const updatedvideos = videos.filter((element) => element._id !== id);
                        setVideos(updatedvideos);

                        setVideos((prevvideos) => prevvideos.filter((element) => element._id !== id));
                        setfilteredvideo((prevFilteredvideos) => prevFilteredvideos.filter((element) => element._id !== id));
                    } else {
                        Swal.fire('Error!', 'video deletion failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'video deletion failed.', 'error');
                }
            }
        });
    };

    const openVideoView = (id) => {
        console.log("viewVideoId" , id);
        setViewVideoId(id);
    };

    const closeVideoView = () => {
        setViewVideoId(null);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h2 className="mb-3">Videos List</h2>
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Search Results"
                            onChange={handleFilter}
                            className="form-control rounded-pill w-76"
                        />
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: "10%" }}>Sr#</th>
                            <th className="text-center" style={{ width: "22%" }}>Tags</th>
                            <th className="text-center" style={{ width: "23%" }}>Categories</th>
                            <th className="text-center" style={{ width: "23%" }}>State</th>
                            <th className="text-center" style={{ width: "22%" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedvideos.map((element, index) => (
                            <tr key={element._id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                    {element.tags.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="badge me-1" style={{ backgroundColor: "#D4AF37" }}>
                                            {tag}
                                            {/* {element.name} */}
                                        </span>
                                    ))}
                                </td>
                                <td className="text-center">
                                    {element.categories.join(', ')}
                                </td>
                                <td className="text-center">
                                    <button
                                        className='btn btn-sm text-white mb-1'
                                        style={{ backgroundColor: "#D4AF37" }}
                                        onClick={() => changeStatus(element._id)}
                                    >
                                        {element.state}
                                    </button>
                                </td>
                                <td className="text-center">
                                    <button
                                        className='btn btn-success btn-sm text-white me-2 mb-1'
                                        onClick={() => openVideoView(element.name)}
                                    >
                                        View
                                    </button>
                                    <Link
                                        to={`/video/update/${element._id}`}
                                        className="btn btn-info btn-sm me-2 mb-1"
                                        style={{ color: 'white' }}
                                    >
                                        Update
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(element._id)}
                                        className="btn btn-danger btn-sm text-white mb-1"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-center">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(videos.length / perPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination justify-content-center'}
                    activeClassName={'active'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    nextClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                />
            </div>
            {viewVideoId && (
                
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">View Video</h3>
                                <button
                                    type="button"
                                    className="btn position-absolute top-0 end-0 m-3"
                                    style={{
                                        fontSize: '15px',
                                        color: '#fff',
                                        zIndex: '500',
                                        backgroundColor: "#D4AF37"
                                    }}
                                    onClick={closeVideoView}
                                >
                                    <span aria-hidden="true">Close</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <video
                                    controls
                                    style={{ maxWidth: '100%', maxHeight: '80vh' }} // Set max width and height
                                    src={`https://trafikbilderbucket.s3.amazonaws.com/videos/${viewVideoId}`}
                                    alt="Viewed Video"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default VideosList;
