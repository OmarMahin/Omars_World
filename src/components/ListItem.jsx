import React from 'react'

const ListItem = ({link, children, className}) => {
  return (
    <li className = {`flex items-end justify-between ${className}`}>
      {children}
    </li>
  )
}

export default ListItem