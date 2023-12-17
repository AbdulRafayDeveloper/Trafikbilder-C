/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

const CustomersList = () => {
    const [customer, setCustomer] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredCustomer, setfilteredCustomer] = useState([]); // Initialize with an empty array
    const perPage = 5;
    const [selectedOptions, setSelectedOptions] = useState({}); // State to manage selected options

    const fetchCustomers = () => {
        axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/user/listOfCustomers`)
            .then((result) => {
                if (Array.isArray(result.data.data)) {
                    setCustomer(result.data.data);
                    setfilteredCustomer(result.data.data);
                } else {
                    console.error("API response is not an array:", result.data.data);
                }
            })
            .catch((error) => {
                console.error("API error:", error);
            });
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredCustomer(customer); // Reset filtered data to all data
        } else {
            const filteredData = customer.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setfilteredCustomer(filteredData);
        }

        setCurrentPage(0);
    };

    // Calculate the start and end index for the current page
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;

    // Slice the category array to display items for the current page
    // const displayedCategory = category.slice(startIndex, endIndex);
    const displayedCustomer = filteredCustomer.slice(startIndex, endIndex)

    const handleChangeStatus = async (id, status) => {
        // You can now update the selected option in the state or perform other actions.
        setSelectedOptions({ ...selectedOptions, [id]: status });
        console.log("Status Change" + status);

        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/changeStatus/${id}`, { status: status })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Status Change 2");
                    fetchCustomers();
                } else {
                    console.log("Status Change 3");
                    Swal.fire('Error!', 'Status changing failed.', 'error');
                }
            })
            .catch((error) => {
                console.log("Status Change 4");
                console.error(error);
                Swal.fire('Error!', 'Status changing failed.', 'error');
            });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this customer permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${process.env.REACT_APP_API_BASE_URL}/user/deleteCustomer/${id}`)
                    .then((response) => {
                        
                        if (response.status === 200) {
                            // Update the subscription list without refreshing
                            setCustomer((prevCustomers) => prevCustomers.filter((element) => element._id !== id))
                            setfilteredCustomer((prevCustomers) => prevCustomers.filter((element) => element._id !== id));
                        } else {
                            Swal.fire('Error!', 'Customer deletion failed.', 'error');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire('Error!', 'Customer deletion failed.', 'error');
                    });
            }
        });
    };

    const handlePasswordReset = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to change the customers password temporarily.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, change it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/resetPassword/${id}`)
                    .then((response) => {
                        if (response.status !== 200) {
                            Swal.fire('Error!', 'Customer reset password failed.', 'error');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire('Error!', 'Customer deletion failed.', 'error');
                    });
            }
        });
    };


    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <h2 className="mb-3">Customers List</h2>
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
                                    <th className="text-center" style={{ width: "15%" }}>Sr#</th>
                                    <th className="text-center" style={{ width: "17%" }}>Name</th>
                                    <th className="text-center" style={{ width: "18%" }}>Email</th>
                                    <th className="text-center" style={{ width: "15%" }}>Status</th>
                                    <th className="text-center" style={{ width: "15%" }}>Password</th>
                                    <th className="text-center" style={{ width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedCustomer.map((element, index) => (
                                    <tr key={element._id}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{element.name}</td>
                                        <td className="text-center">{element.email}</td>
                                        <td className="text-center">
                                            <div className="dropdown">
                                                <select
                                                    value={selectedOptions[element._id] || element.status}
                                                    style={{ backgroundColor: "#D4AF37", color: "#fff", borderColor: "#fff" }}
                                                    className='p-1'
                                                    onChange={(e) => handleChangeStatus(element._id, e.target.value)}
                                                >
                                                    <option value="Verify">Verify</option>
                                                    <option value="Pause">Pause</option>
                                                    <option value="Block">Block</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => handlePasswordReset(element._id)}
                                                className="btn btn-danger btn-sm text-white mb-1"
                                            >
                                                Reset
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
                            pageCount={Math.ceil(customer.length / perPage)}
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
            </div>
        </div>
    );
};

export default CustomersList;