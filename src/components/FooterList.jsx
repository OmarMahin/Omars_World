import React from "react";
import Flex from "./Flex";
import List from "./List";

const FooterList = ({ className, children, headline }) => {
    return (
        <List>
            <h3 className='text-mainFont font-bold text-fontColor text-xl lg:text-2xl mb-5'>{headline}</h3>
            <Flex className={"flex-col gap-2"}>{children}</Flex>
        </List>
    );
};

export default FooterList;
