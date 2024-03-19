import React from 'react'

const ListItem = ({link, children, className}) => {
  return (
    <li className = {`flex items-end ${className}`}>
      {children}
    </li>
  )
}

export default ListItem