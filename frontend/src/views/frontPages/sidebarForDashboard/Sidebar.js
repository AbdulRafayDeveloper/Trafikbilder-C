/* eslint-disable prettier/prettier */
// import React from "react";

// const links = ['Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1', 'Link 1']

// const Sidebar = () => {
//     return (
//         <>
//             <aside
//                 className="bg-dark col-lg-2"
//                 style={{
//                     background: "linear-gradient(to right, #D4AF37,#fff1a4)",
//                     minHeight: "70vh",
//                     position: window.innerWidth >= 992 ? "fixed" : "none", // Apply fixed position on large devices
//                 }}
//             >
//                 <nav style={{marginTop: "100px",}}>
//                     <div>
//                         <h2 className="text-center">Categories</h2>
//                     </div>
//                     <div
//                         style={{
//                             marginTop: "10px",
//                             maxHeight: "calc(101vh - 80px)",
//                             overflowY: "auto",
//                         }}
//                     >
//                         <ul className="mt-2 list-unstyled">
//                             {
//                                 links.map((link, index) => (
//                                     <li
//                                         className=" m-2 py-1 mx rounded text-center " key={index}
//                                         style={{
//                                             background: "linear-gradient(to right, #fff1a4, #FFFFFF)  ", cursor: 'pointer'
//                                         }}
//                                     >
//                                         <a href="#" className="text-decoration-none text-black fw-bold  ">
//                                             {link}
//                                         </a>
//                                     </li>))
//                             }

//                         </ul>
//                     </div>
//                 </nav>
//             </aside>
//         </>
//     );
// };

// export default Sidebar;
import React, { useState, useEffect } from "react";
import axios from 'axios';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/category/listOfCategories`)
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

    return (
        <>
            <aside
                className="bg-dark col-lg-2"
                style={{
                    background: "linear-gradient(to right, #D4AF37,#fff1a4)",
                    minHeight: "70vh",
                    position: window.innerWidth >= 992 ? "fixed" : "none", // Apply fixed position on large devices
                }}
            >
                <nav style={{ marginTop: "100px" }}>
                    <div>
                        <h2 className="text-center">Categories</h2>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            maxHeight: "calc(101vh - 80px)",
                            overflowY: "auto",
                        }}
                    >
                        <ul className="mt-2 list-unstyled">
                            {categories.map((category, index) => (
                                <li
                                    className=" m-2 py-1 mx rounded text-center"
                                    key={index}
                                    style={{
                                        background:
                                            "linear-gradient(to right, #fff1a4, #FFFFFF)  ",
                                        cursor: "pointer",
                                    }}
                                >
                                    <a
                                        href="#"
                                        className="text-decoration-none text-black fw-bold"
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
