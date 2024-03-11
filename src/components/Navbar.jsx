import React from "react";
import Container from "./Container";
import List from "./List";
import ListItem from "./ListItem";

const Navbar = () => {
  return (
    <div class="absolute top-0 left-0 w-full z-30">
      <Container>
        <nav>
          <div class="flex justify-center">
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
