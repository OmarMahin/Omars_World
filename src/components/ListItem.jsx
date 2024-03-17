import React from 'react'

const ListItem = ({link, children, className}) => {
  return (
    <li className = {` ${className}`}>
      {children}
    </li>
  )
}

export default ListItem