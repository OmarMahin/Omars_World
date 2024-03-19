import React from "react";
import Container from "./Container";
import Flex from "./Flex";
import FooterList from "./FooterList";
import Link from "./Link";
import { IoMail } from "react-icons/io5";
import ListItem from "./ListItem";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa6";
import { FiGithub } from "react-icons/fi";

const Footer = () => {
    return (
        <div className='w-full bg-backgroundColor pb-20'>
            <div className='w-full h-[2px] bg-secondaryBackgroundColor mb-7'></div>
            <Container>
                <Flex className={'justify-center gap-10 lg:gap-32 flex-wrap 480B:flex-nowrap'}>
                    <FooterList headline={"Explore"}>
                        <ListItem>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                            >
                                Projects
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                            >
                                Blog
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                            >
                                Tutorials
                            </Link>
                        </ListItem>
                    </FooterList>

                    <FooterList headline={"About me"}>
                        <ListItem>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                            >
                                Achievements
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                            >
                                Passion
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                            >
                                Portfolio
                            </Link>
                        </ListItem>
                    </FooterList>

                    <FooterList headline={"Social Links"}>
                        <ListItem>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                                flexClassName = {'items-center gap-2'}
                            >
                                <IoMail className="text-secondaryColor w-7 h-6"/>
                                <p className="text-mainFont font-bold text-lightFontColor text-base ">okmahin2@gmail.com</p>
                            </Link>
                        </ListItem>
                        <ListItem className={'gap-3 ml-[3px] mt-2'}>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                                href = {'https://www.instagram.com/ok_mahin_r/'}
                            >
                                <FaInstagram className="p-[2px] bg-secondaryColor rounded text-white h-6 w-6 hover:text-secondaryColor hover:bg-backgroundColor border-2 border-secondaryColor duration-150"/>
                            </Link>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                                href={'https://www.linkedin.com/in/md-omar-karim/'}
                            >
                                <FaLinkedinIn className="p-[2px] bg-secondaryColor rounded text-white h-6 w-6 hover:text-secondaryColor hover:bg-backgroundColor border-2 border-secondaryColor duration-150"/>
                            </Link>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                                href = {'https://www.facebook.com/anduin02'}
                            >
                                <FaFacebookF className="p-[2px] bg-secondaryColor rounded text-white h-6 w-6 hover:text-secondaryColor hover:bg-backgroundColor border-2 border-secondaryColor duration-150"/>
                            </Link>
                            <Link
                                className={"text-mainFont font-bold text-lightFontColor text-base"}
                                href = {'https://github.com/OmarMahin'}
                            >
                                <FiGithub className="p-[2px] bg-secondaryColor rounded text-white h-6 w-6 hover:text-secondaryColor hover:bg-backgroundColor border-2 border-secondaryColor duration-150"/>
                            </Link>
                            
                        </ListItem>
                    </FooterList>
                </Flex>
            </Container>
        </div>
    );
};

export default Footer;
