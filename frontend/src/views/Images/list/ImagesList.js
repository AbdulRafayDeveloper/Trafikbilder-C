/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const ImagesList = () => {
    const [images, setImages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [viewImageId, setViewImageId] = useState(null); // Track the ID of the image to view
    const [filteredImage, setfilteredImage] = useState([]); // Initialize with an empty array
    const perPage = 5; // Number of items per page

    // Fetch images when the component mounts
    const fetchImages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/image/listOfImages`);
            if (Array.isArray(response.data.data)) {
                setImages(response.data.data);
                setfilteredImage(response.data.data); // Initialize filteredImage with the same data
            } else {
                console.error("API response is not an array:", response.data.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    useEffect(() => {
        fetchImages();
    }, []);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredImage(images); // Reset filtered data to all data
        } else {
            const filteredData = images.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setfilteredImage(filteredData);
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

    // Slice the images array to display items for the current page
    const displayedImages = filteredImage.slice(startIndex, endIndex)

    const changeStatus = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to change the state of the image.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, change it!',
        }).then(async (result) => {
            console.log("Id: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/image/changeStatus/${id}`);
                    if (response.status === 200) {
                        fetchImages();
                    } else {
                        Swal.fire('Error!', 'Image State changing failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Image State changing failed.', 'error');
                }
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this image permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            console.log("Id: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/image/deleteImage/${id}`);
                    if (response.status === 200) {
                        // Remove the deleted image from the images state
                        const updatedImages = images.filter((element) => element._id !== id);
                        setImages(updatedImages);

                        setImages((prevImages) => prevImages.filter((element) => element._id !== id));
                        setfilteredImage((prevFilteredImages) => prevFilteredImages.filter((element) => element._id !== id));
                    } else {
                        Swal.fire('Error!', 'Image deletion failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Image deletion failed.', 'error');
                }
            }
        });
    };

    const openImageView = (id) => {
        setViewImageId(id);
    };

    const closeImageView = () => {
        setViewImageId(null);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h2 className="mb-3">Images List</h2>
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
                            <th className="text-center" style={{ width: "16%" }}>Images</th>
                            <th className="text-center" style={{ width: "20%" }}>Tags</th>
                            <th className="text-center" style={{ width: "20%" }}>Categories</th>
                            <th className="text-center" style={{ width: "14%" }}>State</th>
                            <th className="text-center" style={{ width: "20%" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedImages.map((element, index) => (
                            <tr key={element._id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                    <LazyLoadImage
                                        key="img"
                                        className="rounded-1 img-fluid"
                                        src={`https://trafikbilderbucket.s3.amazonaws.com/images/${element.name}`}
                                        alt="Image related to categories"
                                        effect="blur"
                                        placeholderSrc={`https://trafikbilderbucket.s3.amazonaws.com/images/${element.name}`}
                                        style={{
                                            width: '85px',  // Default width for mobile
                                            height: '85px', // Default height for mobile
                                            maxWidth: '200px', // Max width for desktop
                                            maxHeight: '150px', // Max height for desktop
                                            margin: '0 auto', // Center the image horizontally
                                        }}
                                    />

                                </td>
                                <td className="text-center">
                                    {element.tags.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="badge me-1" style={{ backgroundColor: "#D4AF37" }}>
                                            {tag}
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
                                        onClick={() => openImageView(element.name)}
                                    >
                                        View
                                    </button>
                                    <Link
                                        to={`/image/update/${element._id}`}
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
                    pageCount={Math.ceil(images.length / perPage)}
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
            {viewImageId && (
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">View Image</h3>
                                <button
                                    type="button"
                                    className="btn position-absolute top-0 end-0 m-3"
                                    style={{
                                        fontSize: '15px',
                                        color: '#fff',
                                        zIndex: '500', // Ensure it's above other elements in the modal
                                        backgroundColor: "#D4AF37"
                                    }}
                                    onClick={closeImageView}
                                >
                                    <span aria-hidden="true">Close</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <LazyLoadImage
                                    key="img"
                                    style={{ maxWidth: '100%', maxHeight: '80vh' }}
                                    src={`https://trafikbilderbucket.s3.amazonaws.com/images/${viewImageId}`}
                                    alt="Viewed Image"
                                    effect="blur"
                                    placeholderSrc={`https://trafikbilderbucket.s3.amazonaws.com/images/${viewImageId}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagesList;
