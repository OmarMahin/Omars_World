import React from "react";

const Button = ({ text , className}) => {
  return (
    <button className={`w-40 h-9 lg:w-48 lg:h-10 bg-secondaryColor rounded-full hover:bg-transparent border-4 border-secondaryColor transition ease-in hover:ease-in font-semibold lg:font-bold text-white text-[14px]  text-mainFont tracking-widest hover:text-secondaryColor ${className}`}>
      {text}
    </button>
  );
};

export default Button;
