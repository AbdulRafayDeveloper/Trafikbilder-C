/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { TagsInput } from 'react-tag-input-component';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    CButton,
    CFormTextarea,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilDescription, cilMoney, cilShareBoxed } from '@coreui/icons';

const UpdateSubscription = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); // Initialize as an empty array
    const [allCategories, setAllCategories] = useState([]); // Initialize as an empty array
    const navigate = useNavigate();

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/allCategoriesNames`)
            .then((result) => {
                if (Array.isArray(result.data.data)) {
                    setAllCategories(result.data.data);
                } else {
                    console.error("API response is not an array:", result.data.data);
                }
            })
            .catch((error) => {
                console.error("API error:", error);
            });

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/subscription/getPakage/${id}`)
            .then((result) => {
                const pakageData = result.data.data;

                setName(pakageData.name);
                setDescription(pakageData.description);
                setPrice(pakageData.price);
                setCategories(pakageData.categories);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Frontend validation
        if (!name || !description || !price || !selectedCategories || selectedCategories.length === 0) { // Check if tags is falsy or empty
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'All fields required',
            });
            return;
        }

        // Convert the input value to a number
        const priceValue = parseFloat(price);

        if (isNaN(priceValue) || priceValue < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Price must be a positive number',
            });
            return;
        }

        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/subscription/updatePakage/${id}`, {
            name: name,
            description: description,
            price: price,
            categories: selectedCategories
        })
            .then((response) => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message,
                    });

                    navigate('/subscription/list');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response ? error.response.data.message : 'An error occurred',
                });
            });
    };

    return (
        <>
            <div className="bg-light my-3 d-flex flex-row align-items-center">
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol xs={12} lg={8} md={10}>
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody>
                                        <CForm onSubmit={handleSubmit}>
                                            <h2>Update Subscription Pakage</h2>
                                            <p className="text-small-emphasis">Update your required details</p>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilList} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="text"
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Category Name"
                                                    autoComplete="categoryName"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-4">
                                                <CInputGroupText>
                                                    <CIcon icon={cilDescription} />
                                                </CInputGroupText>
                                                <CFormTextarea
                                                    id="description"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Category Description"
                                                    autoComplete="categoryDescription"
                                                    rows={4} // Set the number of rows you want
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilMoney} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="number"
                                                    id="price"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    placeholder="Pakage Price"
                                                    autoComplete="price"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-4">
                                                <CInputGroupText>Selected Categories</CInputGroupText>
                                                <TagsInput
                                                    name="categories"
                                                    value={categories}
                                                    onChange={(newTags) => setCategories(newTags)}
                                                    disabled // Disable the input
                                                // Remove the placeholder and autoComplete props
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilShareBoxed} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="text"
                                                    value="Select Updated Categories Below"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, (option) => option.value))} // Update the selectedSize state with an array of selected values
                                                    multiple // Enable multiple selections
                                                    style={{ height: '200px', minHeight: '120px', padding: '5px' }} // Add some styling to the select element
                                                >
                                                    <optgroup>
                                                        {allCategories.map((size, index) => (
                                                            <option key={index} value={size}>
                                                                {size}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                </select>
                                            </CInputGroup>
                                            <CRow>
                                                <CCol xs={12} sm={6}>
                                                    <CButton
                                                        className="w-100"
                                                        type="submit"
                                                        style={{
                                                            color: '#fff',
                                                            backgroundColor: '#D4AF37',
                                                            border: 'none',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Update Pakage
                                                    </CButton>
                                                </CCol>
                                            </CRow>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </>
    );
};

export default UpdateSubscription;