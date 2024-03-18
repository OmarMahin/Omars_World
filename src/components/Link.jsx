import React from 'react'

const Link = ({children, className}) => {
  return (
    <a className={className} href = '#'>{children}</a>
  )
}

export default Link