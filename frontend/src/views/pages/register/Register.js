/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilEyedropper, cilEnvelopeOpen } from '@coreui/icons'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("password.value: " + password);
    console.log("confirmPassword.value: " + confirmPassword);

    // Frontend validation
    if (!name || !email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'All fields are required',
      })
      return
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Name must contain only alphabetic characters',
      })
      return
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid email format',
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
      name,
      email,
      password,
      confirmPassword
    }

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/user/signUp`, formData)
      .then((response) => {
        if (response.data.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message,
          })

          navigate('/auth/login')
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message,
          })
          if (
            response.data.status === 400 &&
            response.data.message === 'Account with this email already exist'
          ) {
            // console.log('error.response.data.message: ' + response.data.message)
            navigate('/auth/login')
          }
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.message : 'An error occurred',
        })
        if (
          error.response.status === 400 &&
          error.response.data.message === 'Account with this email already exist'
        ) {
          console.log('error.response.data.message: ' + error.response.data.message)
          navigate('/auth/login')
        }
      })
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} lg={9} sm={8} md={9}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm method="post" onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    <p className="text-medium-emphasis">Sign up to new account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Username"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeOpen} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        autoComplete="current-email"
                      />
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
                          SignUp
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white py-5"
                style={{ width: '100%', backgroundColor: '#D4AF37' }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Login</h2>
                    <p>
                      Discover a world of visual wonders at Trafikbilder. categories, curated to
                      inspire. Gain to inspire. Gain exclusive access as a Pre-paid user, or harness
                      the power of our robust tools as an Administrator. as an Administrator. Embark
                      on a visual adventure today, where creativity knows no bounds.
                    </p>
                    <Link to="/auth/login">
                      <CButton
                        className="mt-3"
                        active
                        tabIndex={-1}
                        style={{
                          color: '#D4AF37',
                          backgroundColor: '#fff',
                          border: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        Login Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
