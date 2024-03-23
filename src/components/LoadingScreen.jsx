import React from 'react'
import Flex from './Flex'

const LoadingScreen = () => {
;
  return (
    <Flex id='loading' className='fixed top-0 left-0 w-[100vw] h-[100vh] z-50 bg-secondaryColor flex-col justify-center items-center gap-6 transition-opacity ease-in-out duration-500'>
        <h2 className='text-[#DFDFDF] font-mainFont lg:text-4xl md:text-3xl'>Loading</h2>
        <Flex className={'relative md:w-16 w-12'}>
            <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 md:w-4 md:h-4 w-3 h-3 bg-[#D9D9D9] animate-[growLeft_3s_ease-in-out_infinite]'></div>
            <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 md:w-4 md:h-4 w-3 h-3 bg-[#D9D9D9] animate-[growRight_3s_ease-in-out_infinite]'></div>
            
        </Flex>
    </Flex>
  )
}

export default LoadingScreen