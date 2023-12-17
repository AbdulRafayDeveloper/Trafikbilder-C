/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';


const SubscriptionsList = () => {
    const [subscriptions, setsubscriptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [filteredsubscription, setfilteredsubscription] = useState([]); // Initialize with an empty array
    const perPage = 5; // Number of items per page

    // Fetch subscriptions when the component mounts
    const fetchsubscriptions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subscription/listOfPakages`);
            if (Array.isArray(response.data.data)) {
                // Initialize the showDetails property to false for each package
                response.data.data.map(pkg => ({
                    ...pkg,
                    showDetails: false,
                }));
                setsubscriptions(response.data.data);
                setfilteredsubscription(response.data.data); // Initialize filteredsubscription with the same data
            } else {
                console.error("API response is not an array:", response.data.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    useEffect(() => {
        fetchsubscriptions();
    }, []);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredsubscription(subscriptions); // Reset filtered data to all data
        } else {
            const filteredData = subscriptions.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setfilteredsubscription(filteredData);
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

    // Slice the subscriptions array to display items for the current page
    const displayedsubscriptions = filteredsubscription.slice(startIndex, endIndex)

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this subscription permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            console.log("Id: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/subscription/deletePakage/${id}`);
                    if (response.status === 200) {
                        // Update the subscription list without refreshing
                        setsubscriptions((prevSubscriptions) => prevSubscriptions.filter((element) => element._id !== id));
                        setfilteredsubscription((prevFilteredSubscriptions) => prevFilteredSubscriptions.filter((element) => element._id !== id));
                    } else {
                        Swal.fire('Error!', 'subscription deletion failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'subscription deletion failed.', 'error');
                }
            }
        });
    };

    // Function to toggle the description display for a specific package
    const toggleDescription = (packageId) => {
        setfilteredsubscription((prevPackages) =>
            prevPackages.map((pkg) =>
                pkg._id === packageId
                    ? { ...pkg, showDetails: !pkg.showDetails } // Toggle showDetails for the clicked package
                    : pkg
            )
        );
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h2 className="mb-3">Subscriptions List</h2>
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
                            <th className="text-center" style={{ width: "8%" }}>Sr#</th>
                            <th className="text-center" style={{ width: "15%" }}>Name</th>
                            <th className="text-center" style={{ width: "30%" }}>Description</th>
                            <th className="text-center" style={{ width: "20%" }}>Categories</th>
                            <th className="text-center" style={{ width: "10%" }}>Price</th>
                            <th className="text-center" style={{ width: "17%" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedsubscriptions.map((element, index) => (
                            <tr key={element._id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{element.name}</td>
                                <td className="text-center">
                                    {element.showDetails ? (
                                        element.description // Display the full description for this package
                                    ) : (
                                        // Display only the first 30 words
                                        <>
                                            {element.description.split(' ').slice(0, 30).join(' ')}
                                            {element.description.split(' ').length > 30 && (
                                                <>
                                                    <br /> {/* Add a line break */}
                                                    <center>
                                                        <button
                                                            onClick={() => toggleDescription(element._id)} // Pass the package ID to the function
                                                            style={{ textDecoration: 'underline', color: '#007bff', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}
                                                        >
                                                            {element.showDetails ? "Read Less" : "Read More"}
                                                        </button>
                                                    </center>
                                                </>
                                            )}
                                        </>
                                    )}
                                </td>

                                <td className="text-center">
                                    {element.categories.join(', ')}
                                </td>
                                <td className="text-center">SEK{element.price}</td>
                                <td className="text-center">
                                    <Link
                                        to={`/subscription/update/${element._id}`}
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
                    pageCount={Math.ceil(subscriptions.length / perPage)}
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
        </div>
    );
};

export default SubscriptionsList;