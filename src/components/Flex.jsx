import React from 'react'

const Flex = ({children, className, onClick, id}) => {
  return (
    <div className={`flex ${className}`} onClick = {onClick} id = {id}>{children}</div>
  )
}

export default Flex