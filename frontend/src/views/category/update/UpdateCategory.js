/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
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
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilList, cilDescription } from '@coreui/icons';

const UpdateCategory = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/getCategory/${id}`)
            .then((result) => {
                setName(result.data.data.name);
                setDescription(result.data.data.description);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Frontend validation
        if (!name || !description) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'All fields required',
            });
            return;
        }

        axios.put(`${process.env.REACT_APP_API_BASE_URL}/category/updateCategory/${id}`, { name, description })
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
        <>
            <div className="bg-light my-3 d-flex flex-row align-items-center">
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol xs={12} lg={8} md={10}>
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody>
                                        <CForm method="post" onSubmit={handleSubmit}>
                                            <h2>Update Category</h2>
                                            <p className="text-small-emphasis">Update your required category</p>
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
                                                        Update category
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

export default UpdateCategory;
