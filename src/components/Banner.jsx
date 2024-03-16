import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useRef } from "react";
import Button from "./Button";
import Container from "./Container";

const Banner = () => {
  let worldRef = useRef(null)
  let contRef = useRef(null)

  
  // let [zoom, setZoom] = useState(Math.ceil(window.devicePixelRatio*100))

  // window.addEventListener('resize',()=>{
  //   setZoom(Math.ceil(window.devicePixelRatio*100))
  //   console.log(zoom)
  // })

  // let styles = {
  //   transform: `scale(${1-zoom/100 == 0 ? 1 : 1+(1-zoom/100)})`,
  // };

  const {setWorldReference} = useContext(contextApi)

  useEffect(()=>{
    if (worldRef)
    { 
      setWorldReference(worldRef.current.getBoundingClientRect().width)
      console.log(worldRef.current.getBoundingClientRect().width)
    }
  },[])
  
  
  return (
    <div className="absolute top-0 left-0 w-full pb-64 bg-backgroundColor">
      <Container>
        {/* <div>{containerRef}</div> */}
        <div className="pl-[190px] mt-52" >
          <h3 className="text-[40px] font-subHeading text-[#1B1B1B]">
            Hi! Welcome to
          </h3>

          <div className="ml-16 ">
            <h1 className=" text-[100px] font-mainHeading text-fontColor">
              Omar’s W<span  ref={worldRef} className="text-transparent">o</span>rld
            </h1>

            <p className="mt-6 w-[650px] text-mainFont font-bold text-[#3C3C3C] leading-8 text-lg">
              My name is Omar. I love to play with codes and make my own
              mechanical buddies, like the one you are seeing here, right on top
              of the word ‘World’. (
              <span className="text-[#5B5B5B]">
                The letter ‘o’ in ‘World’ looks a bit suspicious. I wonder what
                happens if you move it far away....
              </span>
              ) Learn more...
            </p>
            <div className="mt-11">
              <Button text={"About me"} />
              <Button text={"About the robot"} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Banner;
