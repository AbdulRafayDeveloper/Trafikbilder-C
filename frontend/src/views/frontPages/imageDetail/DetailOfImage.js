/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import Header from "../navbar/Navbar";
import axios from 'axios';
import Footer from "../footer/Footer";
import { BsDownload } from "react-icons/bs";
import { useParams } from 'react-router-dom';

const DetailOfImage = () => {
  const { id } = useParams();
  const [image, setImage] = useState('');
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/image/getImage/${id}`)
      .then((result) => {
        const imageData = result.data.data;
        setImage(imageData.name);
        setTags(imageData.tags);
        setCategories(imageData.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  function handleDownloadClick() {
    const downloadLink = document.createElement("a");
    downloadLink.href = `https://trafikbilderbucket.s3.amazonaws.com/images/${image}`
    downloadLink.download = image; // Set the desired file name
    downloadLink.click();
  }

  return (
    <>
      <div>
        <Header />
      </div>
      <main
        style={{
          paddingTop: "160px",
          background: " linear-gradient(to right, #D4AF37,#fff1a4)",
        }}
      >
        <div className="container pb-5  ">
          <div className="row justify-content-center  ">
            {/* Centered Product Detail */}
            <div className="col-md-12 d-flex flex-column flex-md-row align-items-center p-1">
              <div className="text-center   ">
                <img
                  src={`https://trafikbilderbucket.s3.amazonaws.com/images/${image}`}
                  alt="Product"
                  className="img-fluid rounded-2 p-3"
                />
              </div>
              <div
                className="product-details m-5"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="action-buttons mb-3 d-flex justify-content-center justify-content-sm-end">

                  <button
                    className="btn btn-warning  mx-1  rounded-pill mb-2 mb-sm-0 custom-button"
                    onClick={handleDownloadClick}
                  >
                    <BsDownload className="pr-2 customBtn custom-icon1" />
                    Download
                  </button>

                </div>
                <div className="card mt-2 shadow">
                  <div className="card-body">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <img
                          src={`https://trafikbilderbucket.s3.amazonaws.com/images/${image}`}
                          alt="product"
                          width={160}
                          height={160}
                          className="rounded-2  p-1 "
                        />{" "}
                      </li>
                      <li className="list-group-item">
                        <strong>Image</strong>
                      </li>
                      <li className="list-group-item">
                        <strong>Price:</strong> Free
                      </li>
                      <li className="list-group-item">
                        <strong>Category:</strong> {categories.join(', ')}
                      </li>
                      <li className="list-group-item">
                        <strong>Availability:</strong> In Stock
                      </li>
                      <li className="list-group-item">
                        <strong>Tags: </strong>
                        {tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="badge me-1" style={{ backgroundColor: "#D4AF37" }}>
                            {tag}
                          </span>
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default DetailOfImage;
