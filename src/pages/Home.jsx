import React from 'react'
import First_animation from '../animations/First_animation'
import Banner from '../components/Banner'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <First_animation/>
    </div>
  )
}

export default Home