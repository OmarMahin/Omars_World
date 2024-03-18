import React, { useEffect } from "react";
import { useState } from "react";
import Container from "./Container";
import Flex from "./Flex";
import List from "./List";
import ListItem from "./ListItem";
import { FaBars } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import Link from "./Link";

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
            if (window.innerWidth < 1024) {
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
    };

    return (
        <div className='absolute top-0 left-0 w-full z-30'>
            {
                !showNavMenu && 
                <Flex className={"ml-3 mt-[20px] gap-2 items-center lg:hidden  cursor-pointer"} onClick={changeNavState}>

                <FaBars
                    className=' w-6 h-6 rounded border-secondaryColor border-2 hover:text-white hover:duration-150 hover:bg-secondaryColor p-1'
                    
                />
                <h2 className=' text-mainFont text-fontColor font-bold text-[21px]'>Menu</h2>
                
            </Flex>
            }

           
                
            

            <Container>
                <nav>

                    <Flex className={"justify-center"}>
                        <List
                            className={
                                showNavMenu
                                    ? `fixed top-0 left-[0] lg:flex lg:static px-5 pt-6 w-[220px] bg-[#161616] opacity-95 lg:bg-transparent h-[100vh] lg:h-auto lg:gap-7 lg:p-0 lg:w-auto duration-300`
                                    : `fixed top-0 left-[-100%] lg:flex lg:static px-5 pt-6 w-[220px] bg-[#3C3C3C] opacity-95 lg:bg-transparent h-[100vh] lg:h-auto lg:gap-7 lg:p-0 lg:w-auto duration-300`
                            }
                        >
                            <IoMdCloseCircle
                                className='lg:hidden text-white absolute right-4 top-3 text-xl hover:cursor-pointer'
                                onClick={changeNavState}
                            />
                            <ListItem>
                                <Link
                                    className={
                                        " pt-6 text-mainFont text-white font-bold text-[18px] lg:relative lg:after:content-[''] lg:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300 lg:text-base lg:text-fontColor"
                                    }
                                >
                                    Home
                                </Link>
                                <h3 className='text-mainFont text-white lg:text-fontColor font-bold text-[22px] inline-block lg:hidden'>
                                        +
                                    </h3>
                            </ListItem>
                            <ListItem>
                                <Link
                                    className={
                                        " pt-6 text-mainFont text-white lg:text-fontColor font-bold text-base lg:relative lg:after:content-[''] lg:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                    }
                                >
                                    About
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link
                                    className={
                                        " pt-6 text-mainFont text-white lg:text-fontColor font-bold text-base lg:relative lg:after:content-[''] lg:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                    }
                                >
                                    Projects
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link
                                    className={
                                        " pt-6 text-mainFont text-white lg:text-fontColor font-bold text-base lg:relative lg:after:content-[''] lg:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                    }
                                >
                                    Achievements
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link
                                    className={
                                        " pt-6 text-mainFont text-white lg:text-fontColor font-bold text-base lg:relative lg:after:content-[''] lg:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                    }
                                >
                                    Portfolio
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Link
                                    className={
                                        "pt-6 text-mainFont text-white lg:text-fontColor font-bold text-base lg:relative lg:after:content-[''] lg:after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300"
                                    }
                                >
                                    Contact
                                </Link>
                            </ListItem>
                        </List>
                    </Flex>
                </nav>
            </Container>
        </div>
    );
};

export default Navbar;
