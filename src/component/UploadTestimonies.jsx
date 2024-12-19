import React, { useState } from 'react'
import {Button, Upload} from 'antd'
import { FaPlay } from "react-icons/fa";
import { FaCaretDown, FaCaretUp, FaS } from "react-icons/fa6";

function UploadTestimonies() {
  const [uploadStatus, setUploadStatus] = useState('Upload')
  const [uploadCategory, setUploadCategory] = useState('Select Category')
  const [uploadDropDown, setUploadDropDown] = useState(false)
  const [role, setRole] = useState('Select Role')
  const [roleDropDown, setRoleDropDown] = useState(false)

  function handleChange(e) {
    setUploadStatus(e.target.value)
  }

  return (
    <div>
      <div className='w-[90%] m-[auto] p-5 mt-4 flex items-center justify-between'>
        <h2>Upload Video Testimonies</h2>
        <button className='bg-[#9966CC] border-none outline-none p-1 w-[120px] rounded-xl'>{uploadStatus}</button>
      </div>

      <div className='flex items-center gap-24 w-[90%] m-[auto]'>
        <div className='w-[450px] h-[auto] ml-5 rounded-2xl bg-[#171717]'>
          <div className='w-[420px] h-[250px] m-[auto] mt-4 text-white rounded-xl'>
            <Upload.Dragger style={{color: 'white'}}>
              <div className='w-[35px] h-[35px] rounded-xl mb-2 m-[auto] p-2 bg-[#313131]'><FaPlay size={20} 
              style={{color: '#9966CC', border: '2px solid #9966CC', padding: '2px'}}/></div>
              Drag and drop or<span className='text-[#9966CC]'> choose file</span> here to upload
              <p>MP4, Max size(200mb)</p>
            </Upload.Dragger>
          </div>

          <div>
            <h2 className='ml-4 mt-8 text-[12px]'>Thumbnail</h2>
            <div className='flex items-center ml-4 gap-1'>
              <input type="radio" name='thumbnail' value="Custom Upload" id='custom'/>
              <label htmlFor="custom" className='text-[12px] mt-1'>Custom Upload</label>
            </div>
           
            <div className='flex items-center ml-4 gap-1 mb-4'>
              <input type="radio" name='thumbnail' value="Auto Generate" id='auto'/>
              <label htmlFor="auto" className='text-[12px] mt-1'>Auto Generate</label>
            </div>
            
          </div>
         
        </div>
        <div className='w-[450px] h-[auto] rounded-xl bg-[#171717]'>
          <div className='p-2 mt-2'>
            <p className='text-[12px]'>Title</p>
            <input 
            className='w-[100%] p-1 rounded bg-[#292929] text-[12px] border-none outline-none' 
            type="text" placeholder='Enter Video Title' />
          </div>

          <div className='p-2 mt-2'>
            <p className='text-[12px]'>Source</p>
            <input 
            className='w-[100%] p-1 rounded bg-[#292929] text-[12px] border-none outline-none' 
            type="text" placeholder='Enter Video Source' />
          </div>

          <div className='p-2 mt-2'>
            <p className='text-[12px]'>Category</p>
            <div onClick={() => setUploadDropDown(!uploadDropDown)}
            className='flex items-center cursor-pointer bg-[#292929] p-1 rounded'>
                <input 
                className='w-[100%] p-1 rounded text-left bg-[#292929] text-[14px] border-none outline-none' 
                type="button" value={uploadCategory} />
                {uploadDropDown  ? <FaCaretUp/> : <FaCaretDown/>}
            </div>
           
          </div>

          {uploadDropDown &&
          <div className='pt-2 border mt-2 w-[97%] m-[auto] rounded-xl'>
            <p onClick={() => {
              setUploadCategory('Healing')
              setUploadDropDown(false)
            }} 
            className='border-b w-[100%] pl-2 cursor-pointer'>Healing</p>
            <p onClick={() => {
              setUploadCategory('Deliverance')
              setUploadDropDown(false)
            }} 
            className='border-b w-[100%] pl-2 cursor-pointer'>Deliverance</p>
            <p onClick={() => {
              setUploadCategory('Faith')
              setUploadDropDown(false)
            }}
            className='border-b w-[100%] pl-2 cursor-pointer'>Faith</p>
            <p onClick={() => {
              setUploadCategory('Salvation')
              setUploadDropDown(false)
            }}
            className='pl-2 cursor-pointer'>Salvation</p>
          </div>}

          <div className='mt-4 mb-2'>
            <p className='pl-2 pb-1'>Upload Status</p>
            <div className='flex items-center gap-5'>
              <div className='flex items-center text-[15px] ml-2 gap-2'>
                <input type="radio" 
                name='status' 
                value='Upload'
                id='Upload'
                onChange={handleChange} />
                <label 
                htmlFor='Upload' 
                className='cursor-pointer'
                onClick={() => setUploadStatus('Upload')}>Upload Now</label>
              </div>

              <div className='flex items-center text-[15px] ml-2 gap-2'>
                <input type="radio" 
                name='status' 
                id='Schedule'
                value='Schedule'
                onChange={handleChange} 
                />
                <label htmlFor='Schedule' 
                className='cursor-pointer'
                onClick={() => setUploadStatus('Schedule')}
                >Schedule For Later</label>
              </div>

              <div className='flex items-center text-[15px] ml-2 gap-2 cursor-pointer'>
                <input type="radio" 
                name='status'
                value="Draft"
                onChange={handleChange}
                id='draft' />
                <label htmlFor='draft' 
                className='cursor-pointer'
                onClick={() => setUploadStatus('Draft')}>Draft</label>
              </div>
            </div>
          </div>


          <div className='p-2 mt-2 mb-4'>
            <p className='text-[12px]'>Role</p>
            <div onClick={() => setRoleDropDown(!roleDropDown)}
            className='flex items-center cursor-pointer bg-[#292929] p-1 rounded'>
                <input 
                className='w-[100%] p-1 rounded text-left bg-[#292929] text-[14px] border-none outline-none' 
                type="button" value={role} />
                {roleDropDown  ? <FaCaretUp/> : <FaCaretDown/>}
            </div>
           
          </div>

          {roleDropDown &&
          <div className='pt-2 border mt-2 w-[97%] m-[auto] rounded-xl mb-4'>
            <p onClick={() => {
              setRole('Super Admin')
              setRoleDropDown(false)
            }} 
            className='border-b w-[100%] pl-2 cursor-pointer'>Super Admin</p>
            <p onClick={() => {
              setRole('Admin')
              setRoleDropDown(false)
            }} 
            className='w-[100%] pl-2 cursor-pointer'>Admin</p>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default UploadTestimonies