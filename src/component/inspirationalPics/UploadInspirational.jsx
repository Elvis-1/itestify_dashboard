import React, { useState } from 'react'
import {Button, Upload} from 'antd'
import { FaPlay } from "react-icons/fa";
import { FaCaretDown, FaCaretUp} from "react-icons/fa6";

function  UploadInspirational() {
  const [uploadStatus, setUploadStatus] = useState('Upload')
  const [role, setRole] = useState('Select Role')
  const [roleDropDown, setRoleDropDown] = useState(false)
  const [uploadType, setUploadType] = useState('')
  const [timePeriod, setTimePeriod] = useState('PM')
  const [showTimePeriod, setShowTimePeriod] = useState(false)

  const [formData, setFormData] = useState({
    source: '',
    date_scheduled: '',
    time: '',
  });

  function handleChange(e) {
    setUploadStatus(e.target.value)
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData((prevData) => ({...prevData, [name]: value}))
  };

  return (
    <div>
      <div className='w-[90%] m-[auto] p-5 mt-4 flex items-center justify-between'>
        <h2>Upload Pictures</h2>
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
            <div className={`w-[16px] h-[16px] rounded-full 
              border border-[#9966CC] mr-1 cursor-pointer
              ${uploadType === 'Custom Upload' ? 
              'bg-[#9966CC]' : 'bg-transparent'}`}></div>
              <input type="radio" 
              name='thumbnail' 
              value="Custom Upload" 
              id='custom'
              checked={uploadType === 'Custom Upload'}
              onChange={(e) => setUploadType(e.target.value)}
              className='hidden peer'/>
              <label htmlFor="custom" className='text-[12px] mt-1 cursor-pointer'>Custom Upload</label>
            </div>
           
            <div className='flex items-center ml-4 gap-1 mb-4'>
            <div className={`w-[16px] h-[16px] rounded-full 
              border border-[#9966CC] mr-1 cursor-pointer
              ${uploadType === 'Auto Generate' ? 
              'bg-[#9966CC]' : 'bg-transparent'}`}></div>

              <input type="radio" name='thumbnail' 
              value="Auto Generate" 
              id='auto'
              checked={uploadType === 'Auto Generate'}
              onChange={(e) => setUploadType(e.target.value)}
              className='hidden peer'/>
              <label htmlFor="auto" className='text-[12px] mt-1 cursor-pointer'>Auto Generate</label>
            </div>
            
          </div>
         
        </div>

        <div className='w-[450px] h-[auto] rounded-xl bg-[#171717]'>
          <div className='p-2 mt-2'>
            <p className='text-[12px]'>Source</p>
            <input 
            className='w-[100%] p-1 rounded bg-[#292929] text-[12px] border-none outline-none' 
            type="text" placeholder='Enter Picture Source' />
          </div>

          <div className='mt-4 mb-2 pb-3'>
            <p className='pl-2 pb-3'>Upload Status</p>
            <div className='flex items-center gap-5'>
              <div className='flex items-center text-[15px] ml-2 gap-2'>
                <div className={`w-[16px] h-[16px] rounded-full 
                border border-[#9966CC] mr-1 cursor-pointer
                ${uploadStatus === 'Upload' ? 
                'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                <input type="radio" 
                name='status' 
                value='Upload'
                id='Upload'
                checked={uploadStatus === 'Upload'}
                onChange={handleChange}
                className='hidden peer' />
                <label 
                htmlFor='Upload' 
                className='cursor-pointer'
                onClick={() => setUploadStatus('Upload')}>Upload Now</label>
              </div>

              <div className='flex items-center text-[15px] ml-2 gap-2'>
              <div className={`w-[16px] h-[16px] rounded-full 
                border border-[#9966CC] mr-1 cursor-pointer
                ${uploadStatus === 'Schedule' ? 
                'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                <input type="radio" 
                name='status' 
                id='Schedule'
                value='Schedule'
                checked={uploadStatus === 'Schedule'}
                onChange={handleChange}
                className='hidden peer'
                />
                <label htmlFor='Schedule' 
                className='cursor-pointer'
                onClick={() => setUploadStatus('Schedule')}
                >Schedule For Later</label>
              </div>

              <div className='flex items-center text-[15px] ml-2 gap-2 cursor-pointer'>
              <div className={`w-[16px] h-[16px] rounded-full 
                border border-[#9966CC] mr-1 cursor-pointer
                ${uploadStatus === 'Draft' ? 
                'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                <input type="radio" 
                name='status'
                value="Draft"
                checked={uploadStatus === 'Draft'}
                onChange={handleChange}
                id='draft' 
                className='hidden peer'/>
                <label htmlFor='draft' 
                className='cursor-pointer'
                onClick={() => setUploadStatus('Draft')}>Draft</label>
              </div>
            </div>
          </div>

        {uploadStatus === 'Upload' &&
        <div className='p-2 mt-2 mb-4'>
            <p className='text-[12px]'>Role</p>
            <div onClick={() => setRoleDropDown(!roleDropDown)}
            className='flex items-center cursor-pointer bg-[#292929] p-1 rounded'>
                <input 
                className='w-[100%] p-1 rounded text-left bg-[#292929] text-[14px] border-none outline-none' 
                type="button" value={role} />
                {roleDropDown  ? <FaCaretUp/> : <FaCaretDown/>}
            </div>
           
        </div>}

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

          {uploadStatus === 'Schedule' &&
             <>
                <div>
                    <p className='mt-10 mb-3 ml-[8px]'>Schedule Date</p>
                    <input
                    name="date_scheduled"
                    type='date'
                    value={formData.date_scheduled} 
                    placeholder=''
                    onChange={handleInputChange}
                    className='bg-[#2D2D2D] mb-5 text-white 
                    rounded-xl p-2 w-[94%] 
                    ml-[15px] outline-none border-none'/>
                </div>
            
                <div className='flex items-center justify-between'>
                    <div className='bg-[#2D2D2D] overflow-hidden w-[40%] h-[30px] ml-[15px] mb-5 rounded'>
                        <input type="time"
                        name='time'
                        value={formData.time} 
                        onChange={handleInputChange} 
                        className='text-white bg-[#2D2D2D] w-[100%] pt-1 p-1'/>
                    </div>

                    <div onClick={()=> setShowTimePeriod(!showTimePeriod)}
                    className='bg-[#2D2D2D] w-[40%] h-[30px]
                        mr-[15px] rounded mb-5'>
                        <div className='pl-2 pt-1 flex items-center justify-between'>
                        {timePeriod}
                        {showTimePeriod ? <FaCaretUp/> : <FaCaretDown/>}
                        
                        </div>
                        {showTimePeriod &&
                        <div className='flex flex-col items-start mt-3 mb-5 rounded overflow-hidden '>
                            <input type="button" 
                            value="PM"
                            onClick={()=> setTimePeriod("PM")}
                            className='bg-[#2D2D2D] w-[100%] cursor-pointer'/>
                            <input type="button" 
                            value="AM"
                            onClick={()=> setTimePeriod("AM")}
                            className='bg-[#2D2D2D] w-[100%] cursor-pointer'/>
                        </div>
                        }
                    </div>
                    
                </div> 
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default UploadInspirational