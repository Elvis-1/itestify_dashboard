import React, { useEffect, useState } from 'react'
import Login from '../component/Login'
import LogoDisplay from '../component/LogoDisplay'

function Home() {
    const [showLogo, setShowLogo] = useState(true)

    useEffect(() => {
      const timer = setTimeout(() => {
            setShowLogo(false)
      },3000)

      return () => {
        clearTimeout(timer)
      }
    },[])
    
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-950'>
        {showLogo ? <LogoDisplay/> : <Login/>}
    </div>
  )
}

export default Home