/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
// import Sidebar from "../sidebar/Sidebar";
import Header from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Link } from 'react-router-dom';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilArrowRight } from '@coreui/icons';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const DashboardData = ({ label, value }) => {
    return (
        <div style={{ margin: '10px' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{label}:</p>
            <p style={{ fontSize: '16px' }}>{value}</p>
        </div>
    );
};

DashboardData.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

const Dashboard = ({ id, name, email, packageName }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <DashboardData label="Your ID" value={id} />
            <DashboardData label="Your Name" value={name} />
            <DashboardData label="Your Email" value={email} />
            <DashboardData label="Your Package Name" value={packageName} />
        </div>
    );
};

Dashboard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    packageName: PropTypes.string.isRequired,
};

const AllPakages = () => {
    const [subscriptions, setsubscriptions] = useState([]);
    const [id, setId] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState([]);
    const [packageName, setPackageName] = useState([]);
    const [filteredsubscription, setfilteredsubscription] = useState([]); // Initialize with an empty array

    // Fetch subscriptions when the component mounts
    const fetchsubscriptions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/subscription/listOfPakages`);
            if (Array.isArray(response.data.data)) {
                // Initialize the showDetails property to false for each package
                const packagesWithDetails = response.data.data.map(pkg => ({
                    ...pkg,
                    showDetails: false,
                }));
                setsubscriptions(packagesWithDetails);
                setfilteredsubscription(packagesWithDetails);
            } else {
                console.error("API response is not an array:", response.data.data);
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    useEffect(() => {
        fetchsubscriptions();
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/customerDashboardData`, { token: token })
                    .then((result) => {
                        if (result.data.status === 200) {
                            setId(result.data.id);
                            setName(result.data.name);
                            setEmail(result.data.email);
                            setPackageName(result.data.pakageName);
                        }
                    })
                    .catch((error) => {
                        // Handle error if necessary
                        console.error('Error occurred:', error);
                    });
            }
        } catch (error) {
            console.error("API error:", error);
        }
    }, []);

    // Function to toggle the description display for a specific package
    const toggleDescription = (packageId) => {
        setfilteredsubscription((prevPackages) =>
            prevPackages.map((pkg) =>
                pkg._id === packageId
                    ? { ...pkg, showDetails: !pkg.showDetails } // Toggle showDetails for the clicked package
                    : pkg
            )
        );
    };

    const displayedsubscriptions = filteredsubscription;

    const ChangePakage = async (id) => {
        console.log("ID: " + id);
        const token = localStorage.getItem('token');
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/paymentRequest/changePakage`, { pakageID: id, token: token })
            .then((response) => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message,
                    });

                    // navigate('/category/list');
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response ? error.response.data.message : 'An error occurred',
                });
            });
    }

    return (
        <>
            <div>
                <Header />
            </div>
            <div className="">
                {/* 
        <div className="col-lg-2 col-12">
                    <Sidebar />
                </div>
    */}
                <div className="col-12">
                    <div className="container" style={{ marginTop: "160px" }}>
                        <div className='row' style={{ marginTop: '20px' }}>
                            <div className='col-md-9 mb-4 mb-md-0'>
                                <div className="row">
                                    <div className="col-6 col-sm-6">
                                        <DashboardData label="Name" value={name} />
                                    </div>
                                    <div className="col-6 col-sm-6">
                                        <DashboardData label="ID" value={id} />
                                    </div>
                                    <div className="col-6 col-sm-6">
                                        <DashboardData label="Email" value={email} />
                                    </div>
                                    <div className="col-6 col-sm-6">
                                        <DashboardData label="Package Name" value={packageName} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mt-4 mt-md-0">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '18px', color: 'black', marginBottom: '10px' }}>Change Your password</p>
                                    <Link to={`/customer/changePassword/${id}`}>
                                        <button
                                            className="btn btn-danger"
                                            style={{ borderRadius: '20px', transition: 'background-color 0.2s', width: '100%', color: "white" }}
                                        >
                                            Change Password
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>


                        <div className="row justify-content-center">
                            <div className="col-md-8 text-center">
                                <h1
                                    className="Title display-4 font-weight-bold text-lg text-md text-sm"
                                    style={{ fontWeight: "600", color: "#D4AF37" }}
                                >
                                    Trafikbilder.se Packages
                                </h1>
                                <p className="Description flex-grow p-2" style={{ fontWeight: "600" }}>
                                    Write payment note here
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            {displayedsubscriptions.map((element, index) => (
                                <div key={element._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                                    <div className="card shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s', position: 'relative' }}>
                                        <div className="card-body">
                                            <h3 className="card-title text-center">{element.name}</h3>
                                            <p className="card-text">
                                                {element.showDetails ? (
                                                    element.description // Display the full description for this package
                                                ) : (
                                                    // Display only the first 30 words
                                                    <>
                                                        {element.description.split(' ').slice(0, 30).join(' ')}
                                                        {element.description.split(' ').length > 30 && (
                                                            <>
                                                                <br /> {/* Add a line break */}
                                                                <center>
                                                                    <button
                                                                        onClick={() => toggleDescription(element._id)} // Pass the package ID to the function
                                                                        style={{ textDecoration: 'underline', color: '#007bff', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' }}
                                                                    >
                                                                        {element.showDetails ? "Read Less" : "Read More"}
                                                                    </button>
                                                                </center>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center' }} className='my-2'>
                                                <b>Categories:</b>
                                                <p className="card-text" style={{ marginLeft: "5px" }}>{element.categories.join(', ')}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }} className='my-2'>
                                                <b>Price:</b>
                                                <p className="card-text" style={{ marginLeft: "5px" }}>SEK{element.price}/year</p>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <Link
                                                    to="/"
                                                    className="btn"
                                                    style={{ backgroundColor: "#D4AF37", color: "#fff", borderRadius: '20px', transition: 'background-color 0.2s' }}
                                                    onMouseOver={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#D4AF37'; e.target.style.border = '1px solid' }}
                                                    onMouseOut={(e) => { e.target.style.backgroundColor = '#D4AF37'; e.target.style.color = '#fff' }}
                                                    onClick={() => ChangePakage(element._id)}
                                                >
                                                    Subscribe Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Buttons */}
                        <div className="d-flex justify-content-between">
                            <Link
                                to="/auth/login"
                                style={{ backgroundColor: "#D4AF37", color: "#fff", borderRadius: '20px', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#D4AF37'; e.target.style.border = '1px solid' }}
                                onMouseOut={(e) => { e.target.style.backgroundColor = '#D4AF37'; e.target.style.color = '#fff' }}
                                className="btn mb-5 d-flex align-items-center"
                            >
                                <CIcon icon={cilArrowLeft} style={{ marginRight: "8px" }} /> Back
                            </Link>
                            <Link
                                to="/auth/login"
                                style={{ backgroundColor: "#D4AF37", color: "#fff", borderRadius: '20px', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#D4AF37'; e.target.style.border = '1px solid' }}
                                onMouseOut={(e) => { e.target.style.backgroundColor = '#D4AF37'; e.target.style.color = '#fff' }}
                                className="btn mb-5 d-flex align-items-center"
                            >
                                Next <CIcon icon={cilArrowRight} style={{ marginLeft: "8px" }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
};

export default AllPakages;
