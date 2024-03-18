import React from 'react'

const Flex = ({children, className, onClick}) => {
  return (
    <div className={`flex ${className}`} onClick = {onClick}>{children}</div>
  )
}

export default Flex