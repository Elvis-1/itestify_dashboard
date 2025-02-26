import { CalendarOutlined } from '@ant-design/icons'
import React, {useContext, useState} from 'react'
import { DarkModeContext } from '../context/DarkModeContext'
import AnalyticTextTestimony from '../component/testimonies/AnalyticTextTestimony'
import AnalyticVideoTestimony from '../component/testimonies/AnalyticVideoTestimony'

function TestimonyAnalytics() {

    const {isDarkMode} = useContext(DarkModeContext)
    const [textTestimonyAnalytic, setTextTestimonyAnalytic] = useState(true)
    const [videoTestimonyAnalytic, setVideoTestimonyAnalytic] = useState(false)

  return (
    <div>
        <div className='flex items-center justify-between w-[97%] m-auto mt-5'>
            <h3>Analytics</h3>
            <div className="bg-[#171717] w-[170px] p-1 rounded">
                <input className="bg-[#171717] text-[12px]"  type='text' 
                placeholder='Tuesday Nov 10 2024'/>
                <CalendarOutlined size={4}/>
            </div>
           
        </div>

        <div className='flex items-center justify-between w-[98%] m-auto mt-3'>
            <div className={`w-[460px] h-[70px] 
            rounded-xl p-2 ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border"}`}>
              <p className='text-[13px] pl-3 opacity-[0.7]'>Total Testimonies</p>
              <hr className='w-[95%] m-[auto] mt-1 opacity-[0.5]' />
              <p className='text-[13px] pl-3 pt-3 opacity-[0.5]'>100</p>
            </div>
            <div className={`w-[460px] h-[70px] 
            rounded-xl p-2 ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border"}`}>
              <p className='text-[13px] pl-3 opacity-[0.7]'>New Testimonies</p>
              <hr className='w-[95%] m-[auto] mt-1 opacity-[0.6]' />
              <p className='text-[13px] pl-3 pt-3 opacity-[0.6]'>10</p>
            </div>
        </div>

        <div className='w-[98%] m-auto mt-3 bg-[#121212] h-[430px]'>
            <div className='flex item-center justify-between p-4' >
                <h3 className='text-[14px]'>Distribution by Categories</h3>
                <div className='flex items-center gap-2'>
                    <h3 onClick={() => {
                        setTextTestimonyAnalytic(true)
                        setVideoTestimonyAnalytic(false)
                    }}
                    className={`text-[14px] cursor-pointer ${textTestimonyAnalytic ? 'border-b-2 border-b-[#9966CC] text-white' : 
                    'opacity-[0.6]'}`}>
                        Text Testimonies
                    </h3>
                    <h3 onClick={() => {
                        setTextTestimonyAnalytic(false)
                        setVideoTestimonyAnalytic(true)
                    }}
                    className={`text-[14px] cursor-pointer ${videoTestimonyAnalytic ? 'border-b-2 border-b-[#9966CC] text-white' : 
                    'opacity-[0.6]'}`}>
                        Video Testimonies
                    </h3>
                </div>
            </div>

            <hr className='h-10 opacity-[0.6]'/>

            <div>
              {textTestimonyAnalytic ? <AnalyticTextTestimony/> : <AnalyticVideoTestimony/>}
            </div>
        </div>
    </div>
  )
}

export default TestimonyAnalytics