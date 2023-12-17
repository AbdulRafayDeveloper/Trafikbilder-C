/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

const CategoriesList = () => {
  const [category, setCategory] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Current page number
  const [filteredCategory, setFilteredCategory] = useState([]); // Initialize with an empty array
  const perPage = 5; // Number of items per page

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/category/listOfCategories`)
      .then((result) => {
        if (Array.isArray(result.data.data)) {
          setCategory(result.data.data);
          setFilteredCategory(result.data.data);
        } else {
          console.error("API response is not an array:", result.data.data);
        }
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }, []);

  const handleFilter = (e) => {
    const searchText = e.target.value.toLowerCase();

    if (searchText.trim() === '') {
      setFilteredCategory(category); // Reset filtered data to all data
    } else {
      const filteredData = category.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchText)
        )
      );
      setFilteredCategory(filteredData);
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

  // Slice the category array to display items for the current page
  // const displayedCategory = category.slice(startIndex, endIndex);
  const displayedCategory = filteredCategory.slice(startIndex, endIndex);

  // Function to handle category deletion
  const handleDelete = (id) => {
    // Display a SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this category permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      console.log("Id: " + id);
      if (result.isConfirmed) {
        // User clicked the "Yes, delete it!" button, make the API call to delete
        axios
          .delete(`${process.env.REACT_APP_API_BASE_URL}/category/deleteCategory/${id}`)
          .then((response) => {
            if (response.status === 200) {
              // Category deleted successfully
              // Swal.fire('Deleted!', 'Category has been deleted.', 'success');
              setCategory((prevCategories) => prevCategories.filter((element) => element._id !== id));
              setFilteredCategory((prevFilteredCategories) => prevFilteredCategories.filter((element) => element._id !== id));
            } else {
              Swal.fire('Error!', 'Category deletion failed.', 'error');
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Error!', 'Category deletion failed.', 'error');
          });
      }
    });
  };

  // Function to toggle the description display
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12 d-flex justify-content-between align-items-center">
              <h2 className="mb-3">Categories List</h2>
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
                  <th className="text-center" style={{ width: "20%" }}>Name</th>
                  <th className="text-center" style={{ width: "35%" }}>Description</th>
                  <th className="text-center" style={{ width: "15%" }}>Total Images</th>
                  <th className="text-center" style={{ width: "20%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedCategory.map((element, index) => (
                  <tr key={element._id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{element.name}</td>
                    <td className="text-center">
                      {showFullDescription ? (
                        element.description // Display the full description
                      ) : (
                        // Display only the first 20 words
                        <>
                          {element.description.split(' ').slice(0, 20).join(' ')}
                          {element.description.split(' ').length > 20 && (
                            <>
                              <br /> {/* Add a line break */}
                              <Link
                                To="/"
                                onClick={toggleDescription}
                                style={{ textDecoration: 'underline', color: '#007bff', cursor: 'pointer' }}
                                className="btn btn-link"
                              >
                                Read More
                              </Link>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td className="text-center">{element.numberOfImages}</td>
                    <td className="text-center">
                      <Link
                        to={`/category/update/${element._id}`}
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
              pageCount={Math.ceil(category.length / perPage)}
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

export default CategoriesList;