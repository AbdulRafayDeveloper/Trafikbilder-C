/* eslint-disable prettier/prettier */
import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import VideosCategoryContext, { VideosCategoryProvider } from './views/frontPages/VideoContext/VideosCategoryContext'; // Update the path
import CategoryContext, { CategoryProvider } from './views/frontPages/contexts/CategoryContext'; // Update the path
import './scss/style.scss'
import './App.css';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const AllPakages = React.lazy(() => import('./views/frontPages/pakages/AllPakages'))
const Home = React.lazy(() => import('./views/frontPages/home/Home'))
const About = React.lazy(() => import('./views/frontPages/about/About'))
const Contact = React.lazy(() => import('./views/frontPages/contact/Contact'))
const Videos = React.lazy(() => import('./views/frontPages/videos/Videos'))
const DetailOfImage = React.lazy(() => import('./views/frontPages/imageDetail/DetailOfImage'))
const DetailOfVideo = React.lazy(() => import('./views/frontPages/videoDetail/DetailOfVideo'))
const PasswordChange = React.lazy(() => import('./views/frontPages/password/PasswordChange'))

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.log('Token has expired');
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
        localStorage.removeItem('token'); // Remove the token if it has expired
      } else {
        console.log('Token is valid');
      }
    }
  }

  render() {
    const token = localStorage.getItem('token');
    let validRole = false;

    if (token) {
      const decoded = jwt_decode(token);
      if (decoded.role === 1) {
        validRole = true;
      }
    }

    return (
      <>
        <BrowserRouter>
          <Suspense fallback={loading}>
            <VideosCategoryProvider>
              <CategoryProvider>
                <Routes>
                  <Route path="/home" name="Home Page" element={validRole ? <Home /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/videos" name="Videos Page" element={validRole ? <Videos /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/about" name="About Page" element={validRole ? <About /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/contactUs" name="Contact Page" element={validRole ? <Contact /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/videos" name="Videos Page" element={validRole ? <Videos /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/404" name="Page 404" element={validRole ? <Home /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/500" name="Page 500" element={validRole ? <Home /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/customer/dashboard" name="All Pakages" element={validRole ? <AllPakages /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/detailOfImage/:id" name="Detail Of Image" element={validRole ? <DetailOfImage /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/detailOfVideo/:id" name="Detail Of Video" element={validRole ? <DetailOfVideo /> : <Navigate to="/auth/login" replace />} exact={true} />
                  <Route path="/auth/login" name="Login Page" element={<Login />} />
                  <Route path="/auth/signup" name="Register Page" element={<Register />} />
                  <Route path="*" element={token ? <DefaultLayout /> : <Navigate to="/auth/login" replace />} />
                  <Route path="/" element={validRole ? <Home /> : <Navigate to="/auth/login" replace />} />
                  <Route path="/customer/changePassword/:id" name="Change Password" element={validRole ? <PasswordChange /> : <Navigate to="/auth/login" replace />} exact={true} />
                </Routes>
              </CategoryProvider>
            </VideosCategoryProvider>
          </Suspense>
        </BrowserRouter>
      </>
    )
  }
}

export default App