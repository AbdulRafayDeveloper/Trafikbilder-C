/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import Header from "../navbar/Navbar";
import Footer from "../footer/Footer";
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
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilEyedropper } from '@coreui/icons'
import { useParams } from 'react-router-dom';

const PasswordChange = () => {
    const { id } = useParams();
    const [prevPassword, setPrevPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPrevPassword, setShowPrevPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Frontend validation
        if (!prevPassword || !confirmPassword || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'All fields are required',
            })
            return
        }

        if (password.length < 7) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password should be at least 7 characters long',
            })
            return
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password and Confirm Password not match.',
            })
            return
        }

        // If all validations pass, proceed with the API call
        const formData = {
            id,
            prevPassword,
            password,
            confirmPassword
        }

        axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/user/changeCustomerPassword`, formData)
            .then((response) => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message,
                    })

                    navigate('/customer/dashboard')
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.data.message,
                    })
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response ? error.response.data.message : 'An error occurred',
                })
            })
    }

    return (
        <>
            <div>
                <Header />
            </div>
            <div className="bg-light d-flex flex-row align-items-center" style={{ marginTop: "100px" }}>
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol xs={12} lg={8} md={10}>
                            <CCardGroup>
                                <CCard className="p-4" style={{ marginTop: "60px", marginBottom: "60px" }}>
                                    <CCardBody>
                                        <CForm method="post" onSubmit={handleSubmit}>
                                            <h2>Change Password</h2>
                                            <CInputGroup className="mb-4 mt-4">
                                                <CInputGroupText>
                                                    <CIcon icon={cilLockLocked} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type={showPrevPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                                    placeholder="Previous Password"
                                                    id="prevPassword"
                                                    name="prevPassword"
                                                    value={prevPassword}
                                                    onChange={(e) => setPrevPassword(e.target.value)}
                                                    autoComplete="PrevPassword"
                                                />
                                                <CInputGroupText
                                                    onClick={() => setShowPrevPassword(!showPassword)} // Toggle showPassword state
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <CIcon icon={showPassword ? cilEyedropper : cilEyedropper} />
                                                </CInputGroupText>
                                            </CInputGroup>
                                            <CInputGroup className="mb-4">
                                                <CInputGroupText>
                                                    <CIcon icon={cilLockLocked} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                                    placeholder="Password"
                                                    id="password"
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    autoComplete="current-password"
                                                />
                                                <CInputGroupText
                                                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <CIcon icon={showPassword ? cilEyedropper : cilEyedropper} />
                                                </CInputGroupText>
                                            </CInputGroup>
                                            <CInputGroup className="mb-4">
                                                <CInputGroupText>
                                                    <CIcon icon={cilLockLocked} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type={showConfirmPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm Password"
                                                    autoComplete="current-password"
                                                />
                                                <CInputGroupText
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle showPassword state
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <CIcon icon={setShowConfirmPassword ? cilEyedropper : cilEyedropper} />
                                                </CInputGroupText>
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
                                                        Submit
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
            <div>
                <Footer />
            </div>
        </>

    );
};

export default PasswordChange;