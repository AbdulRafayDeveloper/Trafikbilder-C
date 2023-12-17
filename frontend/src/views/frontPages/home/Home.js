/* eslint-disable prettier/prettier */
import React from "react";
import Header from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import HomeContent from "../homeContent/HomeContent";
import Footer from "../footer/Footer";

const Home = () => {
  return (
    <div className="homepage" style={{ overflowX: "hidden" }}>
      <div>
        <Header />
      </div>

      <div className="" style={{ marginTop: "50px" }}>
        <div className="row">
          <div className="col-lg-2 col-12">
            <Sidebar />
          </div>
          <div className="col-lg-9 col-12">
            <HomeContent />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <div className="col-lg-10 col-12 ">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
