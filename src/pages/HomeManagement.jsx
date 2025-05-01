import React, { useState } from 'react'
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import HomeVideoTest from '../component/testimonies/HomeVideoTest';
import HomeTextTest from '../component/testimonies/HomeTextTest';
import HomeInspirationalPic from '../component/testimonies/HomeInspirationalPic';

function HomeManagement() {
    const [videoTestimony, setVideoTestimony] = useState(true)
    const [textTestimony, setTextTestimony] = useState(false)
    const [inspirationalPictures, setInspirationalPictures] = useState(false)

    const [testimonyState, setTestimonyState] = useState(['Trending Testimony'])
    const [showTestState, setShowTestState] = useState(false)
    const [numberOfTestimonies, setNumberOfTestimonies] = useState(5)
    const [inputValue, setInputValue] = useState(5)

    function handleTestPage() {
        setNumberOfTestimonies(inputValue)
        parseInt(numberOfTestimonies)
    }

  return (
    <div>
        <h1 className='px-4'>Home Page Management</h1>
        <div className='bg-[#171717] flex items-center w-fit py-1 px-1 mx-4 mt-3 rounded gap-3 text-[13px] text-gray-500 '>
            <p onClick={() => {
                setVideoTestimony(true)
                setTextTestimony(false)
                setInspirationalPictures(false)
            }}
            className={`cursor-pointer ${videoTestimony ? 'text-white bg-[#9966CC] py-2 px-2 rounded' : ''}`}>
                Video Testimonies
            </p>
            <p onClick={() => {
                setTextTestimony(true)
                setVideoTestimony(false)
                setInspirationalPictures(false)
            }}
            className={`cursor-pointer ${textTestimony ? 'text-white bg-[#9966CC] py-2 px-2 rounded' : ''}`}>
                Text Testimonies
            </p>
            <p onClick={() => {
                setInspirationalPictures(true)
                setTextTestimony(false)
                setVideoTestimony(false)}}
            className={`cursor-pointer ${inspirationalPictures ? 'text-white bg-[#9966CC] py-2 px-2 rounded' : ''}`}>
                Inspirational Pictures
            </p>
        </div>

        <div className='mx-4 flex items-center justify-between bg-[#171717] rounded-xl px-4 mt-4 w-[97%] h-[70px]'>
            <div className='py-1'>
                <p className='text-[14px]'>Display Rules</p>
                <div onClick={() => {
                    setShowTestState(!showTestState)
                }} className='cursor-pointer relative rounded mt-1 flex items-center justify-between bg-[#333] w-[260px] p-1.5'>
                    <p className='text-[13px] opacity-[0.6]'>{testimonyState}</p>
                    {!showTestState ? <FaCaretDown/> : <FaCaretUp/>}
                </div>
                
                {showTestState &&
                <div className='absolute z-[999] bg-[#333] w-[260px] mt-2 cursor-pointer rounded p-1'>
                {['Trending Testimonies', 'Latest Published', 'Most Liked'].map((item) => (
                    <p onClick={() => {
                        setTestimonyState(item)
                        setShowTestState(false)
                    }} className='hover:bg-[#131313] cursor-pointer p-1 opacity-[0.6]'>{item}</p>
                ))}
                </div>}
              
                
            </div>

            <div className='py-1'>
                <p className='text-[14px]'>Number of Testimonies</p>
                <input type="text" name='numtestimony' value={inputValue}
                onChange={(e)=> setInputValue(e.target.value)}
                className='bg-[#333] p-1 w-[260px] rounded outline-none border-none mt-1' />
            </div>

            <button onClick={handleTestPage}
            className='outline-none border-none bg-[#9966CC] p-1.5 w-[70px] rounded'>Apply</button>
        </div>

        {videoTestimony && <HomeVideoTest status={testimonyState} numberOfTestimonies={numberOfTestimonies}/>}
        {textTestimony && <HomeTextTest status={testimonyState} numberOfTestimonies={numberOfTestimonies}/>}
        {inspirationalPictures && <HomeInspirationalPic status={testimonyState} numberOfTestimonies={numberOfTestimonies}/>}
    </div>
  )
}

export default HomeManagement