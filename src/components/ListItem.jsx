import React from 'react'

const ListItem = ({link, children}) => {
  return (
    <li className = 'text-mainFont text-fontColor font-bold text-base pt-6 mr-7 relative after:content-[""] after:absolute after:bottom-[-10px]  after:left-1/2 after:w-[0px] after:h-1 after:bg-secondaryColor after:translate-x-[-50%] after:rounded-s-full after:hover:w-[50px]  after:hover:ease-out after:hover:duration-300'>
      {children}
    </li>
  )
}

export default ListItem