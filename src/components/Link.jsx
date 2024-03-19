import React from 'react'
import Flex from './Flex'

const Link = ({children, className, flexClassName, href}) => {
  return (
    <a className={className} href = {href ? href : '#'} target = '_blank'>
      <Flex className={flexClassName}>{children}</Flex>
      
      </a>
  )
}

export default Link