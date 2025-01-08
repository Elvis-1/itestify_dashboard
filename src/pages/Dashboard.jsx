import React, { useContext, useState } from 'react'

import { AppstoreOutlined, 
        CaretDownFilled, 
        CaretUpFilled, 
        PictureOutlined, 
        UsergroupAddOutlined 
      } from '@ant-design/icons'

import { Switch, Typography } from 'antd'
import { MoonOutlined } from "@ant-design/icons";

import logo from '../assets/icons/Logo.png'

import { IoIosNotificationsOutline } from "react-icons/io"
import { IoIosLogOut } from "react-icons/io"

import { CiSun } from "react-icons/ci"
import { CiChat1 } from "react-icons/ci"

import { MdOutlineAnalytics } from "react-icons/md"
import { MdOutlinePrivacyTip } from "react-icons/md"
import { MdOutlineSettings } from "react-icons/md"

import { FaRegUser } from "react-icons/fa6"
import { FaRegMoneyBill1 } from "react-icons/fa6"

import { Link, Outlet, useNavigate } from 'react-router-dom'
import { DarkModeContext } from '../context/DarkModeContext';

function Dashbord() {
  const [showTestimonyMenu, setShowTestimonyMenu] = useState(false)
  const [showAnalyticsMenu, setShowAnalyticsMenu] = useState(false)
  const [showInspirationalMenu, setShowInspirationalMenu] = useState(false)
  const [showAllTestimonies, setShowAllTestimonies] = useState(true)
  
  const {isDarkMode, toggleTheme} = useContext(DarkModeContext)

  const navigate = useNavigate()

  function handleTestimonies() {
    setShowAllTestimonies(!showAllTestimonies)
    if(showAllTestimonies){
        navigate('all-testimonies')
    }else{
      navigate('upload-testimonies')
    }
  }

  return (
    <div className={`flex min-h-screen border fixed overflow-hidden w-[100%] ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>

      {/* whole side bar starts here */}
      <div className={`flex-1 w-[100%] min-h-screen ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border-r border-r-slate-100"}`}>

        {/* side bar header starts here */}
        <div className={`flex items-center 
        p-3 gap-2 h-[50px] w-[244.5px] m-[auto] 
        font-sans font-bold fixed top-0 z-[1000]
        ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border-r border-r-slate-100"}`}>
            <img src={logo}  className='w-[35px]' alt='' />
            <p className='font-sans  text-[15px] w-[100%]'>iTestified</p>
        </div>
        {/* sidebar header ends here */}

        {/* sidebar main section starts here */}
        <div className={`${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black "} pt-5`}>

            <div className='p-3 text-[13px] mt-8 font-sans opacity-[0.7]'>
              <h1 className='p-1 font-sans'>MAIN MENU</h1>
            </div>
          
          <Link to=''>
            <div className='font-sans flex items-center gap-1 p-3 text-[13px] hover:bg-[#9966CC] active:bg-[#9966CC]'>
              <AppstoreOutlined style={{ fontSize: '18px' }}/>
              <p className='opacity-[0.7]'>Overview</p>
            </div>
          </Link>

          <div className='font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]'>
             <UsergroupAddOutlined style={{ fontSize: '20px' }} />
             <p className='opacity-[0.7]'>Users</p>
          </div>

          <div className='font-sans flex items-center gap-1 p-3 text-[13px] hover:bg-[#9966CC] active:bg-[#9966CC]'>
            <CiChat1 style={{ fontSize: '20px' }} />
             <div onClick={() => setShowTestimonyMenu(!showTestimonyMenu)} className='flex items-center justify-between w-[100%] cursor-pointer'>
                <p className='opacity-[0.7]'>Testimonies</p>
                {showTestimonyMenu ?
                  <CaretUpFilled style={{ fontSize: '15px' }}/>
                  :<CaretDownFilled style={{ fontSize: '15px' }} />
                }
             </div>
          </div>
          {showTestimonyMenu ?
          <div className=' cursor-pointer text-[13px] flex flex-col items-center'>
            {/* dynamically navigating to each testimonies component */}
            <Link to='all-testimonies'>
              <input type='button' value={'All Testimonies'}
              placeholder='All Testimonies' 
              className='ml-[-65px] border-none outline-none p-2 bg-tranparent cursor-pointer'
              onClick={handleTestimonies}/>
            </Link>
            <Link to='upload-testimonies'>
              <input type='button' value={'Upload Testimonies'} 
              placeholder='upload Testimonies' 
              className='ml-[-40px] border-none outline-none p-2 bg-transparent cursor-pointer'
              onClick={handleTestimonies}/>
            </Link>

          </div>:""
          }


          <div className='font-sans flex items-center gap-1 p-3 text-[13px]'>
             <PictureOutlined style={{ fontSize: '17px' }}/>
             <div onClick={() => setShowInspirationalMenu(!showInspirationalMenu)} className='flex items-center justify-between w-[100%] cursor-pointer'>
                <p className='opacity-[0.7]'>Inspirational Pictures</p>
                {showInspirationalMenu ?
                  <CaretUpFilled style={{ fontSize: '15px' }}/>
                  :<CaretDownFilled style={{ fontSize: '15px' }} />
                }
             </div>
          </div>
          {showInspirationalMenu ?
          <div className=' cursor-pointer text-[13px] flex flex-col items-center'>
            <input type='button' value={'All Pictures'}  className='ml-[-85px] border-none outline-none p-2 bg-tranparent'/>
          </div>: ""
          }

          <div className='font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]'>
            <FaRegMoneyBill1 style={{ fontSize: '20px' }}/>
            <p className='opacity-[0.7]'>Donations</p>
          </div>

          <div className='font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]'>
            <IoIosNotificationsOutline style={{ fontSize: '24px' }}/>
            <div className='flex items-center justify-between w-[100%]'>
                <p className='opacity-[0.7]'>Notification</p>
                <div className='flex items-center justify-center 
                bg-red-800  w-[30px] h-[30px] p-2 rounded-full text-center'>
                  <p className={`font-sans text-[12px] text-center text-white`}>10</p>
                </div>
            </div>
          </div>
        
          <div className='flex items-center gap-2 w-[90%] m-[auto] font-sans mt-2'>
            <CiChat1 style={{ fontSize: '20px' }} />
            <p className='font-sans text-[13px] mb-2 opacity-[0.8]'>Reviews</p>
          </div>


          <div className='font-sans flex items-center gap-1 p-3 text-[13px]'>
             <MdOutlineAnalytics style={{ fontSize: '20px' }} />
             <div onClick={() => setShowAnalyticsMenu(!showAnalyticsMenu)} className='flex items-center justify-between w-[100%] cursor-pointer'>
                <p className='opacity-[0.7] font-sans'>Analytics</p>
                {showAnalyticsMenu ?
                  <CaretUpFilled style={{ fontSize: '15px' }}/>
                  :<CaretDownFilled style={{ fontSize: '15px' }} />
                }
             </div>
          </div>
          {showAnalyticsMenu ?
          <div className=' cursor-pointer text-[13px] flex flex-col items-center'>
            <input type='button' value={'Users'}  className='ml-[-155px] border-none outline-none p-2 bg-tranparent'/>
            <input type='button' value={'Testimonies'} placeholder='' className='ml-[-120px] border-none outline-none p-2 bg-transparent'/>
            <input type='button' value={'Donations'} placeholder='' className='ml-[-125px] border-none outline-none p-2 bg-transparent'/>
          </div>: ""
          }

          {/* settings section starts here */}
          <h1 className='p-3 text-[13px] mt-5 font-sans opacity-[0.7]'>SETTINGS</h1>
          <div className='cursor-pointer font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]'>
            <FaRegUser style={{ fontSize: '15px' }}/>
            <p className='opacity-[0.7]'>My Profile</p>
          </div>

          <div className='cursor-pointer font-sans flex items-center gap-1 p-3 text-[13px] ml-[-5px] active:bg-[#9966CC]'>
            <IoIosNotificationsOutline style={{ fontSize: '24px' }}/>
            <p className='opacity-[0.7]'>Notification settings</p>
          </div>

          <div className='cursor-pointer font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]'>
            <MdOutlinePrivacyTip style={{ fontSize: '20px' }}/>
            <p className='opacity-[0.7]'>Privacy and security</p>
          </div>

          <div className='cursor-pointer font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]'>
            <MdOutlineSettings style={{ fontSize: '20px' }}/>
            <p className='opacity-[0.7]'>General</p>
          </div>

          <div className='cursor-pointer font-sans flex items-center gap-1 p-3 text-[13px] active:bg-[#9966CC]'>
            <IoIosLogOut style={{ fontSize: '20px' }}/>
            <p className='opacity-[0.7]'>Logout</p>
          </div>

        </div>
        {/* sidebar main section ends here */}

      </div>
      {/* whole side bar ends here */}

        {/* main dashboard section starts here */}
        <div className='flex-[6] min-h-screen'>

          {/* main dashboard section header starts here */}
          <div className={`flex items-center justify-between w-[85.5%] h-[50px]
             fixed z-[1000] top-0 p-3 mb-[100px]
             ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
              <div className='h-[50px] opacity-[0.7] w-[130px] mt-5 font-sans'>
                <h4 className='text-[13px]'>Hello Admin</h4>
                <p className='text-[10px]'>How are you doing today?</p>
              </div>

              <div className='flex items-center gap-2'>
                <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<CiSun size={20} />}
                className="my-switch"
                />
                <div className={`bg-[#787878] w-[30px] 
                h-[30px] rounded-full flex items-center justify-center
                ${isDarkMode ? "text-white" : "text-black"}`}>
                  <IoIosNotificationsOutline style={{ fontSize: '20px'}}/>
                </div>
                <div className='flex items-center gap-2'>
                  <div className={`bg-[#787878] w-[30px] 
                  h-[30px] rounded-full flex items-center justify-center
                  ${isDarkMode ? "text-white" : "text-black"}`}>
                    <PictureOutlined style={{ fontSize: '15px'}}/>
                  </div>
                   <p className='text-[12px] w-[100px] font-bold'>Elvis Igiebor Admin</p>
                </div>
              </div>
          </div><br/><br/>
          {/* main dashboard section header ends here sec*/}
          <Outlet/>
        </div>
        {/* main dashboard section ends here */}
    </div>
  )
}

export default Dashbord