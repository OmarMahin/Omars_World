import React from 'react'
import First_animation from '../animations/First_animation'
import Banner from '../components/Banner'
import DisableZoom from '../components/DisableZoom'


const Home = () => {
  return (
    <div>
      <DisableZoom/>
        <Banner/>
        <First_animation/>
    </div>
  )
}

export default Home