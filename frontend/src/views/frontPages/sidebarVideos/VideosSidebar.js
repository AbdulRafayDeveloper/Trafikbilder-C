/* eslint-disable prettier/prettier */
// export default Sidebar;
import React, { useState, useEffect, useContext } from "react";
import VideosCategoryContext from '../VideoContext/VideosCategoryContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
    const { setCategory } = useContext(VideosCategoryContext);
    const [categories, setCategories] = useState([]);

    const handleCategoryClick = (category) => {
        setCategory(category);
        console.log("Clicked Category:", category);
        // You can add API calls here if needed
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .post(`${process.env.REACT_APP_API_BASE_URL}/category/CategoriesOfPakages`, { token: token })
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
                    minHeight: "100vh",
                    position: window.innerWidth >= 992 ? "fixed" : "none", // Apply fixed position on large devices
                    overflowY: "auto", // Enable scrolling
                }}
            >
                <nav style={{ marginTop: "100px" }}>
                    <div>
                        <h2 className="text-center">Kategorier</h2>
                    </div>
                    <div
                        style={{
                            marginTop: "10px",
                            maxHeight: "calc(90vh - 100px)", // Adjust the max height
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
                                    <Link
                                        to="/videos"
                                        className="text-decoration-none text-black fw-bold"
                                        onClick={() => handleCategoryClick(category._id)}
                                    >
                                        {category.name}
                                    </Link>
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
