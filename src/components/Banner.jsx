import React from 'react'
import Container from 'react-bootstrap/Container';
import Button from './Button';

const Banner = () => {
    return (
        <div class='absolute top-0 left-0 w-full pb-96 bg-backgroundColor z-20'>
            <div class="container mx-auto">
                <div class=' pl-[250px] mt-52'>
                    <h3 class=" text-[40px] font-subHeading text-[#1B1B1B]">Hi! Welcome to</h3>

                    <div class='ml-16 '>
                        <h1 class=" text-[100px] font-mainHeading text-fontColor">Omar’s World</h1>

                        <p class='mt-6 w-[650px] text-mainFont font-bold text-[#3C3C3C] leading-8 text-lg'>My name is Omar.
                            I love to play with codes and make my own mechanical buddies, like the one you are
                            seeing here, right on top of the word ‘World’. (<span class='text-[#5B5B5B]'>The letter ‘o’ in ‘World’ looks
                                a bit suspicious. I wonder what happens if you move it far away....</span>)
                            Learn more...
                        </p>
                        <div class = 'mt-11'>
                            <Button text={'About me'} />
                            <Button text={'About the robot'} />
                        </div>


                    </div>

                </div>

            </div>
        </div>
    )
}

export default Banner