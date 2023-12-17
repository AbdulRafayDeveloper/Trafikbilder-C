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
import { cilLockLocked, cilEnvelopeOpen, cilEyedropper } from '@coreui/icons'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Frontend validation
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'All fields are required',
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

    // If all validations pass, proceed with the API call
    const formData = {
      email,
      password,
    }

    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/logout`, { token: token })
        .then((result) => {
          if (result.data.status === 200) {
            // Remove the token from local storage
            localStorage.removeItem('token');
          }
        })
        .catch((error) => {
          // Handle error if necessary
          console.error('Error occurred:', error);
        });
    }

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/user/login`, formData)
      .then((response) => {
        if (response.data.status === 200) {
          if (response.data.token) {
            // Store the token in local storage
            localStorage.setItem('token', response.data.token);
          }
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message,
          })
          if (response.data.data.role === 0) {
            navigate('/admin/dashboard')
            window.location.href = "/admin/dashboard";
          }
          else if (response.data.data.role === 1) {
            navigate('/home')
            window.location.href = "/home";
          }
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
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} lg={9} sm={8} md={9}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm method="post" onSubmit={handleSubmit}>
                    <h1>Logga in</h1>
                    <p className="text-medium-emphasis">Logga in nedan om du har konto</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeOpen} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-post"
                        autoComplete="Email"
                        style={{ flex: 1 }} // Add this style to make the input field fill available space
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Lösenord"
                        autoComplete="current-password"
                        style={{ flex: 1 }} // Add this style to make the input field fill available space
                      />
                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                        style={{ cursor: 'pointer' }}
                      >
                        <CIcon icon={showPassword ? cilEyedropper : cilEyedropper} />
                      </CInputGroupText>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={12} sm={6}>
                        <CButton
                          type="submit"
                          className="w-100"
                          style={{
                            color: '#fff',
                            backgroundColor: '#D4AF37',
                            border: 'none',
                            fontWeight: 'bold',
                          }}
                        >
                          Logga in
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow className='mt-3'>
                      <CCol xs={12} sm={6}>
                        <a className="w-100" href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#search/kundcenter%40transportteori.se?compose=new" target="blank">Contact for query</a>
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
                    <h2>Välkommen till trafikbilder.se</h2>
                    <p>
                      Av trafiklärare, för trafiklärare!
                      Medlemmar har tillgång till royaltyfria bilder inom körkortsbehörigheterna
                      A, A1, A2, B, B96, BE C, CE, D, DE, YKB, Taxi och en övriga-bilder kategori.
                      Du väljer själv vilket medlemskap du önskar dig.
                    </p>
                    <Link to="/auth/signup">
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
                        Registrera dig här
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

export default Login
