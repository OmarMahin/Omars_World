import React from 'react'

const List = ({children, className, id}) => {
  return (
    <ul className={` ${className}`} id = {`${id}`}>
        {children}
    </ul>
  )
}

export default List