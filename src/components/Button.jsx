import React from "react";

const Button = ({ text }) => {
  return (
    <button class=" w-48 h-10 bg-secondaryColor rounded-full hover:bg-transparent border-4 border-secondaryColor transition ease-in hover:ease-in font-bold text-white text-sm text-mainFont tracking-widest hover:text-secondaryColor mr-7">
      {text}
    </button>
  );
};

export default Button;
