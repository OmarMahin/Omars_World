import React, { useEffect } from "react";
import { useState } from "react";
import Container from "./Container";
import Flex from "./Flex";
import List from "./List";
import ListItem from "./ListItem";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
    let [showNavMenu, setShowNavMenu] = useState(false);
    // let [zoom, setZoom] = useState(Math.ceil(window.devicePixelRatio*100))

    // window.addEventListener('resize',()=>{
    //   setZoom(Math.ceil(window.devicePixelRatio*100))
    //   console.log(zoom)
    // })

    // let styles = {
    //   transform: `scale(${1-zoom/100 == 0 ? 1 : 1+(1-zoom/100)})`,
    // };

    useEffect(() => {
        function checkWindowSize() {
            if (window.innerWidth < 769) {
                setShowNavMenu(false);
            } else {
                setShowNavMenu(true);
            }
        }
        checkWindowSize();
        window.addEventListener("resize", checkWindowSize);
    }, []);

    const changeNavState = () => {
        setShowNavMenu(!showNavMenu);
        let element = document.getElementById('navMenu')
        console.log(element)
    };

    return (
        <div className='absolute top-0 left-0 w-full z-30'>
            <Flex className={"ml-3 mt-[28px] gap-2 items-center md:hidden"}>
                <FaBars
                    className=' w-6 h-6 rounded border-secondaryColor border-2 hover:text-white hover:duration-150 hover:bg-secondaryColor p-1 cursor-pointer'
                    onClick={changeNavState}
                />
                <h2 className=' text-mainFont text-fontColor font-bold text-[21px]'>Menu</h2>
            </Flex>

            <Container>
                <nav>
                    {/* {showNavMenu && (
                    
                        )} */}

                    <Flex className={"justify-center"}>
                        <List
                            className={`absolute top-10 left-[0px] md:flex md:static p-2 bg-black`}
                            id={"navMenu"}
                        >
                            <ListItem
                                className={
                                    "pt-6 mr-7 text-mainFont text-fontColor font-bold text-base md:relative md:after:content-[''] md:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                }
                            >
                                Home
                            </ListItem>
                            <ListItem
                                className={
                                    "pt-6 mr-7 text-mainFont text-fontColor font-bold text-base md:relative md:after:content-[''] md:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                }
                            >
                                About
                            </ListItem>
                            <ListItem
                                className={
                                    "pt-6 mr-7 text-mainFont text-fontColor font-bold text-base md:relative md:after:content-[''] md:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                }
                            >
                                Projects
                            </ListItem>
                            <ListItem
                                className={
                                    "pt-6 mr-7 text-mainFont text-fontColor font-bold text-base md:relative md:after:content-[''] md:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                }
                            >
                                Achievements
                            </ListItem>
                            <ListItem
                                className={
                                    "pt-6 mr-7 text-mainFont text-fontColor font-bold text-base md:relative md:after:content-[''] md:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                }
                            >
                                Portfolio
                            </ListItem>
                            <ListItem
                                className={
                                    "pt-6 mr-7 text-mainFont text-fontColor font-bold text-base md:relative md:after:content-[''] md:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                }
                            >
                                Contact
                            </ListItem>
                        </List>
                    </Flex>
                </nav>
            </Container>
        </div>
    );
};

export default Navbar;
