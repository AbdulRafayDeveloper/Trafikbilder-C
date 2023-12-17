/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    CFormTextarea,
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilDescription, cilMoney, cilShareBoxed } from '@coreui/icons';

function AddSubcription() {
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [selectedCategories, setSelectedCategories] = useState("");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/allCategoriesNames`)
            .then((result) => {
                if (Array.isArray(result.data.data)) {
                    setCategories(result.data.data);
                } else {
                    console.error("API response is not an array:", result.data.data);
                }
            })
            .catch((error) => {
                console.error("API error:", error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!name || !description || !price || !categories) {
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

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/subscription/addPakage`, {
                name: name,
                description: description,
                price: price,
                categories: selectedCategories
            });


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

                if (
                    response.data.status === 400 &&
                    response.data.message === 'This pakage already exists'
                ) {
                    navigate('/subscription/list');
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response ? error.response.data.message : 'An error occurred',
            });

            if (
                error.response.status === 400 &&
                error.response.data.message === 'This pakage already exists'
            ) {
                navigate('/subscription/list');
            }
        }
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
                                            <h2>Create New Pakage</h2>
                                            <p className="text-small-emphasis">Put the required information for the pakage</p>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilList} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="text"
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Pakage Name"
                                                    autoComplete="Name"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilDescription} />
                                                </CInputGroupText>
                                                <CFormTextarea
                                                    id="description"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Pakage Description"
                                                    autoComplete="Description"
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
                                                    autoComplete="Price"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilShareBoxed} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="text"
                                                    value="Select Categories Below"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, (option) => option.value))}
                                                    multiple
                                                    style={{ height: '200px', minHeight: '120px', padding: '5px' }}
                                                    required
                                                >
                                                    <optgroup>
                                                        {categories.map((size, index) => (
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
                                                        Create Pakage
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
}

export default AddSubcription;