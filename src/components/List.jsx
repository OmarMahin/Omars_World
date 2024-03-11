import React from 'react'

const List = ({children}) => {
  return (
    <ul className='flex'>
        {children}
    </ul>
  )
}

export default List