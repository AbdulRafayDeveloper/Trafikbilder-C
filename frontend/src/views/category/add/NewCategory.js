/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList , cilDescription} from '@coreui/icons';

const NewCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Frontend validation
        if (!name || !description) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'All fields required',
            });
            return;
        }

        // If all validations pass, proceed with the API call
        const formData = {
            name,
            description
        }

        axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/category/add`, formData)
            .then((response) => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message,
                    });

                    navigate('/category/list');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message,
                    });
                    if (
                        response.data.status === 400 &&
                        response.data.message === 'This category already exist'
                    ) {
                        navigate('/category/list');
                    }
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response ? error.response.data.message : 'An error occurred',
                });
                if (
                    error.response.status === 400 &&
                    error.response.data.message === 'This category already exist'
                ) {
                    console.log('error.response.data.message: ' + error.response.data.message);
                    navigate('/category/list');
                }
            });
    };

    return (
        <div className="bg-light my-3 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol xs={12} lg={8} md={10}>
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm method="post" onSubmit={handleSubmit}>
                                        <h2>Add New Category</h2>
                                        <p className="text-small-emphasis">Add your required category</p>
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
                                                    Add category
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
    );
};

export default NewCategory;
