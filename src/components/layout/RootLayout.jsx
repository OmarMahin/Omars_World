import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const RootLayout = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Outlet />
      <h1>asudhuah</h1>
    </div>
  );
};

export default RootLayout;
