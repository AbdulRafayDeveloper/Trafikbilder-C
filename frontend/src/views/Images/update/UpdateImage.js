/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { TagsInput } from 'react-tag-input-component';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    CButton,
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
import { cilList } from '@coreui/icons';

const UpdateImage = () => {
    const { id } = useParams();
    const [image, setImage] = useState('');
    const [tags, setTags] = useState([]);
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

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/image/getImage/${id}`)
            .then((result) => {
                const imageData = result.data.data;
                setImage(imageData.name);
                setTags(imageData.tags);
                setCategories(imageData.categories);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Frontend validation
        if (!tags || tags.length === 0 || !selectedCategories || selectedCategories.length === 0) { // Check if tags is falsy or empty
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'All fields required',
            });
            return;
        }

        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/image/updateImage/${id}`, {
            tags,
            categories: selectedCategories,
            state:"Approved"
        })
            .then((response) => {
            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                });

                navigate('/image/list');
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
                                        <h2>Update Image</h2>
                                        <p className="text-small-emphasis">Update your image details</p>
                                        <CInputGroup className="mb-3">
                                            <img style={{ objectFit: "cover", width: "100px", height: "100px" }}
                                                className="rounded-1 img-fluid" src={`https://trafikbilderbucket.s3.amazonaws.com/images/${image}`} alt="Image related to categories" />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>Tags</CInputGroupText>
                                            <TagsInput
                                                name="tags"
                                                id="tags"
                                                value={tags}
                                                onChange={(newTags) => setTags(newTags)}
                                                placeHolder="Add Tags"
                                                autoComplete="tags"
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
                                                <CIcon icon={cilList} />
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
                                                    Update Image
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

export default UpdateImage;
