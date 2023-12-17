/* eslint-disable prettier/prettier */
import React from "react";
import Header from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { ImLocation2 } from "react-icons/im";
import { FiPhone } from "react-icons/fi";
import { HiMail } from "react-icons/hi";

const ContactUs = () => {
    return (
        <>
            <div>
                <Header />
            </div>
            <section className="my-5   container" style={{ paddingTop: "130px" }}>
                {/* Section heading */}
                <h1
                    className="h1-responsive font-weight-bold text-center my-4 "
                    style={{ color: "#D4AF37", fontWeight: "bolder" }}
                >
                    Contact us
                </h1>
                {/* Section description */}
                <p className="text-center w-responsive mx-auto mb-5">
                    Do you have any questions? Please do not hesitate to contact us
                    directly. Our team will come back to you within a matter of hours to
                    help you.
                </p>

                <div className="row">
                    {/* Grid column */}
                    <div className="col-md-9 mb-md-0 mb-5 ">
                        <form
                            id="contact-form"
                            name="contact-form"
                            action="mail.php"
                            method="POST"
                        >
                            <div className="row ">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="form-control border-none"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group my-2">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="form-control"

                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Your message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    className="form-control"
                                ></textarea>
                            </div>
                        </form>

                        <div className="text-center text-md-left justify-content-start my-3 d-flex">
                            <a
                                className="btn  px-5 customBtn " style={{ background: "linear-gradient(to right, #D4AF37,#d0f575 ) ", fontWeight: 'bolder' }}
                                onClick={() => document.getElementById("contact-form").submit()}
                            >
                                Submit
                            </a>
                        </div>
                        <div className="status"></div>
                    </div>
                    {/* Grid column */}

                    {/* Grid column */}
                    <div className="col-md-3 text-center">
                        <ul className="list-unstyled mb-0">
                            <li>
                                <i className="">
                                    <ImLocation2 size={40} className="custom-icon3" />{" "}
                                </i>
                                <p>
                                    <strong>Modal Town, H-Block 126, LHR</strong>{" "}
                                </p>
                            </li>

                            <li>
                                <i>
                                    <FiPhone size={40} />{" "}
                                </i>
                                <p>
                                    <strong>+ 01 234 567 89</strong>
                                </p>
                            </li>

                            <li>
                                <i>
                                    <HiMail size={40} />{" "}
                                </i>
                                <p>
                                    <strong> contact@danish.com </strong>{" "}
                                </p>
                            </li>
                        </ul>
                    </div>
                    {/* Grid column */}
                </div>
                <div className="col-lg-12 my-5">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.612058308516!2d74.3587198151318!3d31.549710758502224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391902e14cd09a6b%3A0xd1c62a25e76b449!2sModa%20Town%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1624523797308!5m2!1sen!2sus"
                        className="container"
                        style={{ border: "0", height: "300px" }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ContactUs;
