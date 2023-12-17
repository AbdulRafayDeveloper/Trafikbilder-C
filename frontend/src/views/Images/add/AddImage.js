/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { TagsInput } from 'react-tag-input-component';
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
import { CSpinner } from '@coreui/react';
import { cilTags, cilImage, cilList } from '@coreui/icons';

function AddImage() {
    const [tags, setTags] = useState([]);
    const [uploadProgress, setUploadProgress] = useState("");
    const [selectedCategories, setSelectedCategories] = useState("");
    const [categories, setCategories] = useState([]);
    const [resizedImage, setResizedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/category/allCategoriesNames`)
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

    // const resizeImage = (file, originalWidth, originalHeight) => {
    //     const maxWidth = 800;
    //     const maxHeight = 600;

    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");
    //     const img = new Image();

    //     img.onload = () => {
    //         let newWidth = originalWidth;
    //         let newHeight = originalHeight;

    //         while (true) {
    //             newWidth = newWidth * 0.99;
    //             newHeight = newHeight * 0.99;

    //             if (newWidth <= maxWidth && newHeight <= maxHeight) {
    //                 break;
    //             }
    //         }

    //         newWidth = Math.round(newWidth);
    //         newHeight = Math.round(newHeight);

    //         canvas.width = newWidth;
    //         canvas.height = newHeight;

    //         ctx.drawImage(img, 0, 0, newWidth, newHeight);

    //         const resizedDataURL = canvas.toDataURL(file.type);
    //         const resizedBlob = dataURLtoBlob(resizedDataURL);

    //         resizedBlob.name = file.name;

    //         setResizedImage(resizedBlob);
    //     };

    //     img.src = URL.createObjectURL(file);
    // };

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
        formData.append('state', 'Approved');
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

                navigate('/image/list');
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
                    navigate('/image/list');
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

    return (
        <>
            <div className="bg-light my-3 d-flex flex-row align-items-center">
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol xs={12} lg={8} md={10}>
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody>
                                        <CForm onSubmit={handleSubmit} encType="multipart/form-data">
                                            <h2>Upload New Image</h2>
                                            <p className="text-small-emphasis">Upload your required image</p>
                                            <div className="mb-3">
                                                {uploadProgress && ( // Only show progress bar when upload is in progress
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
                                            <CInputGroup className="mb-3">
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
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilTags} />
                                                </CInputGroupText>
                                                <TagsInput
                                                    name="tags"
                                                    id="tags"
                                                    value={tags}
                                                    onChange={(newTags) => setTags(newTags)}
                                                    placeHolder="Add Tags"
                                                    autoComplete="tags"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilList} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    type="text"
                                                    value="Select Categories Below"
                                                />
                                            </CInputGroup>
                                            <CInputGroup className="mb-3">
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, (option) => option.value))}
                                                    multiple
                                                    style={{ height: '200px', minHeight: '120px', padding: '5px' }}
                                                    required
                                                >
                                                    <optgroup>
                                                        {categories.map((size, index) => (
                                                            <option key={index} value={size}>
                                                                {size}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                </select>
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
                                                        Upload Image
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
        </>
    );
}

export default AddImage;