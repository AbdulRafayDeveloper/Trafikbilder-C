/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryContext from '../contexts/CategoryContext';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilImage } from '@coreui/icons';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CSpinner } from '@coreui/react';

const HomeContent = () => {
  const { selectedCategory } = useContext(CategoryContext);
  const [uploadProgress, setUploadProgress] = useState("");
  const [selectedCategories, setSelectedCategories] = useState("");
  const [tags, setTags] = useState([]);
  const [resizedImage, setResizedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [filteredImage, setfilteredImage] = useState([]); // Initialize with an empty array
  // State to store the scroll position
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  // scrolling ////////////////////

  // Fetch images when the component mounts
  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/image/listOfFrontImages`, { token: token, category: selectedCategory });
      if (Array.isArray(response.data.data)) {
        setImages(response.data.data);
        setfilteredImage(response.data.data); // Initialize filteredImage with the same data
      } else {
        console.error("API response is not an array:", response.data.data);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const validateFile = (file) => {
    const maxSize = 7 * 1024 * 1024; // 6MB in bytes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Only JPEG, JPG, and PNG image formats are allowed.',
      });
      return false;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'File size must be less than 7MB.',
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!validateFile(selectedFile)) {
        return;
      }

      // Create an Image object to obtain image dimensions
      const image = new Image();
      image.onload = () => {
        // Resize the image client-side
        resizeImage(selectedFile, image.width, image.height);
      };
      image.src = URL.createObjectURL(selectedFile);
    }
    setSelectedFile(selectedFile);
  };

  const resizeImage = (file, originalWidth, originalHeight) => {
    const maxWidth = 800;
    const maxHeight = 600;
    const maxSize = 300 * 1024; // 300kb in bytes

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let newWidth = originalWidth;
      let newHeight = originalHeight;

      if (file.size > maxSize) {
        // If the image size is larger than 300kb, reduce dimensions by half
        newWidth /= 2;
        newHeight /= 2;
      } else {
        // Otherwise, shrink dimensions while preserving aspect ratio
        while (newWidth > maxWidth || newHeight > maxHeight) {
          newWidth *= 0.9;
          newHeight *= 0.9;
        }
      }

      newWidth = Math.round(newWidth);
      newHeight = Math.round(newHeight);

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const resizedDataURL = canvas.toDataURL(file.type);
      const resizedBlob = dataURLtoBlob(resizedDataURL);

      resizedBlob.name = file.name;

      setResizedImage(resizedBlob);
    };

    img.src = URL.createObjectURL(file);
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resizedImage) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select an image file to upload.',
      });
      return;
    }
    const formData = new FormData();
    formData.append('state', 'Pending');
    formData.append('tags', tags);
    formData.append('categories', selectedCategories);
    formData.append('name', resizedImage, selectedFile.name);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/image/addImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: () => {
          setUploadProgress("Uploading your image");
        },
      });

      if (response.data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        });
        setUploadProgress("");

      } else {
        setUploadProgress("");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });

        if (
          response.data.status === 400 &&
          response.data.message === 'This image already exists'
        ) {
        }
      }
    } catch (error) {
      setUploadProgress("");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response ? error.response.data.message : 'An error occurred',
      });
    }
  };

  const handleFilter = (e) => {
    const searchText = e.target.value.toLowerCase();

    if (searchText.trim() === '') {
      setfilteredImage(images); // Reset filtered data to all data
    } else {
      const filteredData = images.filter((item) => {
        const itemTags = item.tags.join(' ').toLowerCase();
        const itemCategories = item.categories.join(' ').toLowerCase();
        return itemTags.includes(searchText) || itemCategories.includes(searchText);
      });
      setfilteredImage(filteredData);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Restore scroll position when navigating back to the page
  useEffect(() => {
    const handleScrollRestoration = () => {
      window.scrollTo(0, scrollPosition);
    };

    // Subscribe to the 'popstate' event to handle browser back/forward navigation
    window.addEventListener('popstate', handleScrollRestoration);

    return () => {
      // Unsubscribe from the 'popstate' event when the component unmounts
      window.removeEventListener('popstate', handleScrollRestoration);
    };
  }, [scrollPosition]);

  // Fetch images when the component mounts
  useEffect(() => {
    // Subscribe to the 'popstate' event to handle browser back/forward navigation
    const handlePopstate = () => {
      window.scrollTo(0, scrollPosition);
    };

    window.addEventListener('popstate', handlePopstate);

    // Scroll to top when the component mounts
    window.scrollTo(0, 0);

    // Set the scroll position from localStorage
    const storedScrollPosition = localStorage.getItem('scrollPosition');
    if (storedScrollPosition) {
      setScrollPosition(parseInt(storedScrollPosition, 10));
    }

    // Store the scroll position when navigating away
    const handleBeforeUnload = () => {
      localStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Unsubscribe from the 'popstate' and 'beforeunload' events when the component unmounts
      window.removeEventListener('popstate', handlePopstate);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div
      className="main-content justify-content-end mb-5"
      style={{ paddingTop: "100px" }}
    >
      {/* main page images render using map */}
      <div className="Box row justify-content-center justify-content-evenly">
        <CForm onSubmit={handleSubmit} encType="multipart/form-data" className="d-flex flex-wrap justify-content-center">
          <div className="mt-3 text-lg-start text-center" style={{ marginLeft: "50px", marginRight: "auto", maxWidth: "300px", width: "100%" }}>
            <input
              type="text"
              placeholder="Sök bild"
              onChange={handleFilter}
              className="form-control rounded-pill"
              style={{ width: "100%" }}
            />
          </div>
          <div className="mb-4 me-3 text-center" style={{ marginLeft: "20px" }}>
            <div className="mb-3">
              {uploadProgress && (
                <div className="d-flex align-items-center">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: '130px' }}
                    >
                      {uploadProgress}
                    </div>
                  </div>
                  <CSpinner
                    className="ms-2"
                    variant="grow"
                    size="sm"
                  />
                </div>
              )}
            </div>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilImage} />
              </CInputGroupText>
              <CFormInput
                type="file"
                id="name"
                name="name"
                onChange={handleFileChange}
                accept="image/jpeg, image/jpg, image/png"
                required
              />
            </CInputGroup>
          </div>
          <CButton
            className="flex-shrink-0 align-self-end mb-4 me-0"
            type="submit"
            style={{
              color: '#fff',
              backgroundColor: '#D4AF37',
              border: 'none',
              fontWeight: 'bold',
            }}
          >
            Skicka bild
          </CButton>
        </CForm>
        {filteredImage.length === 0 ? (
          <div className="col-lg-12 text-center mt-5 mb-5">
            <h4>No images in this category</h4>
          </div>
        ) : (
          filteredImage.map((element, index) => (
            <div className="col-lg-3 mx-4 col-md-6 mb-2 text-center" key={index}>
              <div className="card-body">
                <div className="image-container">
                  <div className="relative">
                    <Link to={`/detailOfImage/${element._id}`}>
                      <LazyLoadImage
                        key="img"
                        className="rounded-1 img-fluid image-zoom-on-hover relative"
                        src={`https://trafikbilderbucket.s3.amazonaws.com/images/${element.name}`}
                        alt="Image related to categories"
                        effect="blur"
                        placeholderSrc={`https://trafikbilderbucket.s3.amazonaws.com/images/${element.name}`}
                        style={{
                          width: '300px',  // Default width for mobile
                          height: '250px', // Default height for mobile
                          maxWidth: '300px', // Max width for desktop
                          maxHeight: '300px', // Max height for desktop
                          margin: '0 auto', // Center the image horizontally
                          cursor: 'pointer'
                        }}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div >
  );
};

export default HomeContent;