import React from 'react'
import ListItem from './ListItem'

const Navbar = () => {
  return (
    <div  class = 'absolute top-0 left-0 w-full z-30'>
        <nav class = 'container mx-auto'>
            <div class = 'flex justify-center'>
                <ul class = 'flex'>
                    <ListItem>Home</ListItem>
                    <ListItem>About</ListItem>
                    <ListItem>Projects</ListItem>
                    <ListItem>Achievements</ListItem>
                    <ListItem>Portfolio</ListItem>
                    <ListItem>Contact</ListItem>
                </ul>
            </div>
        </nav>
    </div>
  )
}

export default Navbar