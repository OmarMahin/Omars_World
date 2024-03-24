import React from 'react'
import Flex from './Flex'

const LoadingScreen = () => {
;
  return (
    <Flex id='loading' className='fixed top-0 left-0 w-[100vw] h-[100vh] z-50 bg-secondaryColor flex-col  items-center justify-center gap-6 transition-opacity ease-in-out duration-500 '>
        <h2 className='text-[#DFDFDF] font-mainFont text-5xl'>Loading</h2>
        <Flex className={'relative md:w-16 w-12 h-10'}>
            <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#D9D9D9] animate-[growLeft_3s_ease-in-out_infinite]'></div>
            <div className='absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#D9D9D9] animate-[growRight_3s_ease-in-out_infinite]'></div>
            
        </Flex>
    </Flex>
  )
}

export default LoadingScreen