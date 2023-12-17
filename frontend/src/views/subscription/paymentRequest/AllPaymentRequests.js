/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

const AllPaymentRequests = () => {
    const [pakages, setPakages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [filteredPakage, setfilteredPakage] = useState([]); // Initialize with an empty array
    const perPage = 5; // Number of items per page

    // Fetch pakages when the component mounts
    const fetchpakages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/paymentRequest/listofPaymentRequests`);
            if (Array.isArray(response.data.data)) {
                setPakages(response.data.data);
                setfilteredPakage(response.data.data); // Initialize filteredPakage with the same data
            } else {
                console.error("API response is not an array:", response.data.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };
    useEffect(() => {
        fetchpakages();
    }, []);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredPakage(pakages); // Reset filtered data to all data
        } else {
            const filteredData = pakages.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setfilteredPakage(filteredData);
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

    // Slice the pakages array to display items for the current page
    const displayedpakages = filteredPakage.slice(startIndex, endIndex)

    const changeStatus = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to approve the pakage request.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, change it!',
        }).then(async (result) => {
            console.log("Id: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/paymentRequest/changeStatus/${id}`);
                    if (response.status === 200) {
                        fetchpakages();
                    } else {
                        Swal.fire('Error!', 'Request State changing failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Request State changing failed.', 'error');
                }
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this request permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            console.log("Id: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/paymentRequest/deleteRequest/${id}`);
                    if (response.status === 200) {
                        // Remove the deleted paymentRequest from the pakages state
                        const updatedpakages = pakages.filter((element) => element._id !== id);
                        setPakages(updatedpakages);
                        setPakages((prevpakages) => prevpakages.filter((element) => element._id !== id));
                        setfilteredPakage((prevFilteredpakages) => prevFilteredpakages.filter((element) => element._id !== id));
                    } else {
                        Swal.fire('Error!', 'Request deletion failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Request deletion failed.', 'error');
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h2 className="mb-3">Pakages Request List</h2>
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
                            <th className="text-center" style={{ width: "23%" }}>User Email</th>
                            <th className="text-center" style={{ width: "23%" }}>Pakage Name</th>
                            <th className="text-center" style={{ width: "14%" }}>Status</th>
                            <th className="text-center" style={{ width: "20%" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedpakages.map((element, index) => (
                            <tr key={element._id}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                    {element.userEmail}
                                </td>
                                <td className="text-center">
                                    {element.packageName}
                                </td>
                                <td className="text-center">
                                    <button
                                        className='btn btn-sm text-white mb-1'
                                        style={{ backgroundColor: "#D4AF37" }}
                                        onClick={() => changeStatus(element._id)}
                                    >
                                        {element.status}
                                    </button>
                                </td>
                                <td className="text-center">
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
                    pageCount={Math.ceil(pakages.length / perPage)}
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

export default AllPaymentRequests;