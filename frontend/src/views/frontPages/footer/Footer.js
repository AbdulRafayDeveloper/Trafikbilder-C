/* eslint-disable prettier/prettier */
import React from "react";
import { BsFacebook } from "react-icons/bs";
import {
  AiFillGoogleCircle,
  AiFillInstagram,
  AiFillTwitterCircle,
  AiOutlineMail,
} from "react-icons/ai";
function Footer() {
  return (
    <div className="d-flex ">
      <footer
        className="text-center text-lg-start text-white w-100 pt-3"
        style={{ backgroundColor: "#45526e" }}
      >
        {/* Grid container */}
        <div className="container">
          <section className="pb-0">
            <div className="row">
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                {/* Company name */}
                <h6
                  className="text-uppercase mb-4 font-weight-bold"
                  style={{ color: "#D4AF37", fontWeight: "bolder" }}
                >
                  Company name
                </h6>
                {/* Description */}
                <p>
                TransportTeori AB Importgatan 10 22 46 Göteborg
                </p>
              </div>

              <hr className="w-100 clearfix d-md-none" />

              {/* <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6
                  className="text-uppercase mb-4 font-weight-bold"
                  style={{ color: "#D4AF37", fontWeight: "bolder" }}
                >
                  Products
                </h6>
                <p>
                  <a className="text-white">Shopify</a>
                </p>
                <p>
                  <a className="text-white">MD-Brands</a>
                </p>
                <p>
                  <a className="text-white">BrandFlow</a>
                </p>
                <p>
                  <a className="text-white">Woman Angular</a>
                </p>
              </div> */}

              <hr className="w-100 clearfix d-md-none" />

              {/* <div className="d-none d-lg-block col-md-3 col-lg-2 col-xl-2 mx-auto pl-3 mt-3">
                <h6
                  className=" text-uppercase mb-4 font-weight-bold"
                  style={{ color: "#D4AF37", fontWeight: "bolder" }}
                >
                  Useful links
                </h6>
                <p>
                  <a className="text-white">Your Account</a>
                </p>
                <p>
                  <a className="text-white">Become an Affiliate</a>
                </p>
                <p>
                  <a className="text-white">Shipping Rates</a>
                </p>
                <p>
                  <a className="text-white">Help</a>
                </p>
              </div> */}

              <hr className="w-100 clearfix d-md-none" />

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6
                  className="text-uppercase mb-4 font-weight-bold"
                  style={{ color: "#D4AF37", fontWeight: "bolder" }}
                >
                  Contact
                </h6>
                <p>
                  <i className="fas fa-home mr-3"></i> Kontakta oss via E-post 
                </p>
                <p>
                  <i className="fas fa-envelope mr-3"></i> kundcenter@transportteori.se
                </p>
              </div>
            </div>
         
          </section>
          {/* Section: Links */}

          <hr className="my-3" />

          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              <div className="col-md-7 col-lg-8 text-center text-md-start">
              </div>

              <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                {/* Facebook */}
                <a
                  className="btn btn-outline-warning border btn-floating m-1 text-white hove"
                  role="button"
                  href="https://www.facebook.com"
                >
                  <i className="">
                    <BsFacebook />{" "}
                  </i>
                </a>
                {/* Email */}
                <a
                  className="btn btn-outline-warning border btn-floating m-1 text-white hove"
                  role="button"
                  href="mailto:youremail@example.com"
                >
                  <i className="">
                    <AiOutlineMail />{" "}
                  </i>
                </a>

                {/* Twitter */}
                <a
                  className="btn btn-outline-warning border btn-floating m-1 text-white hove"
                  role="button"
                  href="https://www.twitter.com"
                >
                  <i className="">
                    <AiFillTwitterCircle />
                  </i>
                </a>

                {/* Google */}
                <a
                  className="btn btn-outline-warning border btn-floating m-1 text-white hove"
                  role="button"
                  href="https://www.google.com"
                >
                  <i className="">
                    <AiFillGoogleCircle />{" "}
                  </i>
                </a>

                {/* Instagram */}
                <a
                  className="btn btn-outline-warning border btn-floating m-1 text-white hove"
                  role="button"
                  href="https://www.instagram.com"
                >
                  <i className="">
                    <AiFillInstagram />{" "}
                  </i>
                </a>
              </div>
            </div>
          </section>
          {/* Section: Copyright */}
        </div>
      </footer>
    </div>
  );
}

export default Footer;
