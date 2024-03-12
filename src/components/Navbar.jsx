import React from "react";
import { useState } from "react";
import Container from "./Container";
import List from "./List";
import ListItem from "./ListItem";

const Navbar = () => {
  // let [zoom, setZoom] = useState(Math.ceil(window.devicePixelRatio*100))

  // window.addEventListener('resize',()=>{
  //   setZoom(Math.ceil(window.devicePixelRatio*100))
  //   console.log(zoom)
  // })

  // let styles = {
  //   transform: `scale(${1-zoom/100 == 0 ? 1 : 1+(1-zoom/100)})`,
  // };

  return (
    <div className="absolute top-0 left-0 w-full z-30">
      <Container>
        <nav>
          <div className="flex justify-center">
            <List>
              <ListItem>Home</ListItem>
              <ListItem>About</ListItem>
              <ListItem>Projects</ListItem>
              <ListItem>Achievements</ListItem>
              <ListItem>Portfolio</ListItem>
              <ListItem>Contact</ListItem>
            </List>
          </div>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
