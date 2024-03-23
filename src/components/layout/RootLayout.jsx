import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import LoadingScreen from "../LoadingScreen";

const RootLayout = () => {
  return (
    <div>
      <LoadingScreen/>
      <Navbar></Navbar>
      <Outlet />
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
