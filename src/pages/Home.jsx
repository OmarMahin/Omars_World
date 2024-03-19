import React from "react";
import { useState } from "react";
import Home_Animation from "../components/Home_Animation";
import Banner from "../components/Banner";
import DisableZoom from "../components/DisableZoom";

const Home = () => {

  return (
    <div>
      <DisableZoom />
      <Home_Animation />
    </div>
  );
};

export default Home;
