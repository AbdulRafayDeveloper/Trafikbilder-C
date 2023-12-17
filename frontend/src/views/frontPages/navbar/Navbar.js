/* eslint-disable prettier/prettier */
// import React from "react";
// import { BsCamera } from "react-icons/bs";
// import { AiOutlineSearch } from "react-icons/ai";
// import { MdImageSearch } from "react-icons/md";
// const Navbar = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light shadow flex-column  fixed-top bg-white">
//       <div className="container-fluid">
//       {/* logo icon */}
//         <a className="navbar-brand" href="#">
//           <img
//             src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Google-Photos_icon_logo_%28May-September_2015%29.png/1280px-Google-Photos_icon_logo_%28May-September_2015%29.png"
//             alt="logo"
//             width={80}
//             height={50}
//           />
//         </a>
//         {/* toggler bar */}
//         <div className="d-flex justify-content-between align-items-center">
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarNav"
//             aria-controls="navbarNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//         </div>
//         {/* nav links */}
//         <div className="collapse navbar-collapse">
//           <ul
//             className="navbar-nav ms-auto"
//             style={{ fontWeight: "bold", fontSize: "23px" }}
//           >
//             <li className="nav-item mx-1">
//               <a className="nav-link " aria-current="page" href="/">
//                 Home
//               </a>
//             </li>
//             <li className="nav-item mx-1">
//               <a className="nav-link  " href="images">
//                 Images
//               </a>
//             </li>
//             <li className="nav-item mx-1">
//               <a className="nav-link   " href="videos">
//                 Videos
//               </a>
//             </li>
//             <li className="nav-item mx-1">
//               <a className="nav-link   " href="about" tabIndex="-1">
//                 About Us
//               </a>
//             </li>
//             <li className="nav-item mx-1">
//               <a className="nav-link   " href="contactUs" tabIndex="-1">
//                 Contact Us
//               </a>
//             </li>
//             <li className="nav-item mx-1">
//               <a className="nav-link   " href="/customer/dashboard" tabIndex="-1">
//                 Dashboard
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//       {/* bottom search bar  */}
//       <section className="container-fluid d-flex  flex-md-row justify-content-between align-items-center">
//         <div className="container-fluid mt-2">
//           <div className="row ">
//             <div className="col-lg-9">
//               {/* search input div */}
//               <div className="input-group">
//                 <span className="input-group-text">
//                   <BsCamera className="mx-2 " />
//                 <span className="d-none d-xl-block">Photos/videos</span>

//                 </span>
//                 <input
//                   type="text"
//                   className="form-control no-outline"
//                   placeholder="Search for products..."
//                 />
//                 <span className="input-group-text search-icon">
//                   <AiOutlineSearch size={30} className="text-white" />
//                 </span>
//               </div>
//             </div>
//               {/*  btn fvt and search img  */}
//             <div className="d-none d-lg-block col-lg-3 col-sm-12 pt-2">
//               <div className="d-flex justify-content-end align-items-center">
//                 <ul className="list-unstyled d-flex gap-2 align-items-end">
//                   <button className="btn btn-light">
//                     <li className="text-center customBtn">
//                       <span className="icon customBtn">
//                         <MdImageSearch size={20} className="customBtn" />
//                       </span>
//                       <span style={{ fontSize: "15px" }}>
//                         Search according to your interest
//                       </span>
//                     </li>
//                   </button>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { BsCamera } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { MdImageSearch } from "react-icons/md";
import { PiListFill } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
// import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [showPiListFill, setShowPiListFill] = useState(true);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/logout`, { token: token }).then((response) => {
      if (response.data.status === 200) {
        // Remove the token from local storage
        localStorage.removeItem('token');
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        });

        navigate('/auth/login');
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

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
    setShowPiListFill(!showPiListFill);
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow flex-column fixed-top bg-white">
      <div className="container-fluid">
        {/* Logo icon */}

        <a className="navbar-brand" href="/home">
          <img
            src="../logo.jpg"
            alt="logo"
            width={60}
            height={50}
          />
        </a>

        {/* Toggler bar */}
        <span
          className="d-lg-none"
          onClick={handleNavCollapse}
          style={{ cursor: "pointer" }}
        >
          {showPiListFill ? (
            <PiListFill size={34} color="#D4AF37" />
          ) : (
            <RxCross1 size={28} color="#343a40" />
          )}
        </span>
        {/* Nav links */}
        <div className={`collapse navbar-collapse ${isNavCollapsed ? "" : "show"}`}>
          <ul
            className="navbar-nav ms-auto"
            style={{ fontWeight: "bold", fontSize: "23px" }}
          >
            <li className="nav-item mx-1">
              <Link className="nav-link" to="/home">
                Hem
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="nav-link" to="/videos">
                Filmer
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="nav-link" to="/about" tabIndex="-1">
                Om oss
              </Link>
            </li>
            {/* <li className="nav-item mx-1">
              <a className="nav-link" href="#" tabIndex="-1">
                Contact Us
              </a>
            </li> */}
            <li className="nav-item mx-1">
              <Link className="nav-link" to="/customer/dashboard" tabIndex="-1">
                Kontrollbord
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link className="nav-link" to="/auth/login" tabIndex="-1">
                Logga in
              </Link>
            </li>
            <li className="nav-item mx-1" onClick={handleLogout}>
              <Link className="nav-link" to="" tabIndex="-1">
                Logga ut
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* Bottom search bar
      <section className="container-fluid d-flex flex-md-row justify-content-between align-items-center">
        <div className="container-fluid mt-2">
          <div className="row">
            <div className="col-lg-9">
              {/* Search input div
              <div className="input-group" style={{ cursor: "pointer" }}>
                <span className="input-group-text">
                  <BsCamera className="mx-2" />
                  <span className="d-none d-xl-block">Photos/videos</span>
                </span>
                <input
                  type="text"
                  className="form-control no-outline"
                  placeholder="Search for products..."
                />
                <span
                  className="input-group-text search-icon"
                  style={{ cursor: "pointer" }}
                >
                  <AiOutlineSearch size={30} className="text-white" />
                </span>
              </div>
            </div>
            {/* Btn for Search Your Interest to search img
            <div className="d-none d-lg-block col-lg-3 col-sm-12 pt-2">
              <div className="d-flex justify-content-end align-items-center">
                <ul className="list-unstyled d-flex gap-2 align-items-end">
                  <button className="btn btn-light">
                    <li className="text-center customBtn">
                      <span className="icon customBtn">
                        <MdImageSearch size={20} className="customBtn" />
                      </span>
                      <span style={{ fontSize: "15px" }}>
                        Search Your Interest
                      </span>
                    </li>
                  </button>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </nav>
  );
};

export default Navbar;