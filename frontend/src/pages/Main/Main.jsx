import React from 'react'
import '../../index.css'
import ParticlesBackground from './../Home/ParticlesBackground';
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
            <ParticlesBackground />

            <div className='grid w-full place-items-center py-4 z-10'>
                <img src="https://res.cloudinary.com/dztkzhtla/image/upload/v1692620524/html%20mailer/Fst_Mailer_wpqpda.png" className='w-11/12 md:w-96' alt="" />
            </div>

            <div className='grid w-full place-items-center py-4 z-10 text-[#015a73] px-4 mt-12'>
                <p className='text-4xl md:text-8xl font-[Poppins] font-bold py-2'>Presenting <span className='bg-gradient-to-r from-blue-600 to-lime-600 bg-clip-text text-transparent'>FST Mailer</span></p>

                <p className='text-2xl md:text-5xl font-[Poppins] font-bold py-2 flex flex-wrap'>Elevate Your <span className='bg-gradient-to-r from-blue-600 to-lime-600 bg-clip-text text-transparent px-1'>Email Communication</span>  with FST Mailer.</p>

                <p className='text-2xl md:text-4xl font-[Poppins] font-bold py-2 flex flex-wrap'>Code-Free <span className='bg-gradient-to-r from-blue-600 to-lime-600 bg-clip-text text-transparent px-1'>HTML Mails</span>Made Effortless!</p>

                <Link className='font-[Poppins] py-2' to='/login'>
                    <Button bg="#0082a7" color="white" _hover={{ bg: '#015a73' }} borderColor='#0082a7'
                        _active={{
                            bg: '#015a73',
                            transform: 'scale(0.98)',
                            borderColor: '#0082a7',
                        }}
                        _focus={{
                            boxShadow:
                                'none',
                        }}
                    >
                        Click here to Start!
                    </Button>
                </Link>
            </div>


            <div className='grid w-full place-items-center py-4 z-10 text-gray-500 px-4 mt-4'>

                <p className='text-md md:text-xl font-[Poppins] font-bold py-2 flex flex-wrap'>OR</p>

                <div className='font-[Poppins] py-2' >
                    <Button bg="#a50000" color="white" _hover={{ bg: '#bc0303' }} borderColor='#a50000'
                        _active={{
                            bg: '#bc0303',
                            transform: 'scale(0.98)',
                            borderColor: '#a50000',
                        }}
                        _focus={{
                            boxShadow:
                                'none',
                        }}
                    >
                        Enquire Now!
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Main