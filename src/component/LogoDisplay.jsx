import React from 'react'
import logo from '../assets/icons/Logo.png'

function LogoDisplay() {
  return (
    <div>
        <div className='flex items-center gap-2'>
            <img className='w-[50px]' src={logo} alt="" />
            <p className='font-sans text-[#fff]'>iTestified</p>
        </div>
    </div>
  )
}

export default LogoDisplay