import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { CheckOutlined } from "@ant-design/icons";

function CreatePassword() {
  const navigate = useNavigate()

  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')


  const validations = {
    length: password1.length >= 8,
    number: /\d/.test(password1),
    uppercase: /[A-Z]/.test(password1),
    lowercase: /[a-z]/.test(password1),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password1),
    match: password1 === password2 && password2 !== "",
  };
  

  const onFinish = (values) => {

    // create password validations
     let regEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{8}$/;
     if(!validations.length 
      || !validations.lowercase 
      || !validations.match || !validations.number 
      || !validations.specialChar || !validations.uppercase){
        message.error("Invalid credentials")
      }else{
        navigate('/dashboard')
      }
     
     
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-slate-800'>
        <div className='w-[300px]  h-[430px] rounded-xl bg-black'>
          <div className='text-white w-[80%] m-[auto] mt-6'>
              <h1 className='font-sans text-white text-center'>Create New Password</h1>
              <p className='text-[10px] font-sans text-center opacity-[0.6]'>For security reasons please change your password</p>
          </div>
           
          <Form onFinish={onFinish} layout='vertical'>
            <div className='w-[80%] m-[auto] mt-3'>
              <label className='text-white pl-1 font-sans'>New Password</label>
              <Form.Item >
                  <Input.Password
                  name='newPassword'
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  className='border-none outline-none'
                  placeholder='Enter code'
                  prefix={<LockOutlined className='text-white'/>}
                  style={{backgroundColor:'#313131', color: 'white'}} 
                  />
              </Form.Item>

              <label className='text-white pl-1 font-sans'>Confirm New Password</label>
              <Form.Item>
                  <Input.Password
                  name='confirmPassword'
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className='border-none outline-none'
                  placeholder='Enter code'
                  prefix={<LockOutlined className='text-white'/>}
                  style={{backgroundColor:'#313131', color: 'white'}} 
                  />
              </Form.Item>

              <div className='text-white text-[12px] mt-[-10px] opacity-[0.7]'>
                <ul>
                  <li className='flex items-center gap-1'>
                    Password must be atleast 8 characters
                    {
                      validations.length ?
                      <CheckOutlined style={{ fontSize: '15px', color: 'green' }} />: ""
                    }
                  </li>
                  <li>
                    Atleast one uppercase letter
                    {
                      validations.uppercase ?
                      <CheckOutlined style={{ fontSize: '15px', color: 'green' }} />: ""
                    }
                  </li>
                  <li>
                    Atleast one lowercase letter
                    {
                      validations.lowercase ?
                      <CheckOutlined style={{ fontSize: '15px', color: 'green' }} />: ""
                    }
                  </li>
                  <li>
                    Atleast one number
                    {
                      validations.number ?
                      <CheckOutlined style={{ fontSize: '15px', color: 'green' }} />: ""
                    }
                  </li>
                  <li>
                    Atleast one special character
                    {
                      validations.specialChar ?
                      <CheckOutlined style={{ fontSize: '15px', color: 'green' }} />: ""
                    }
                  </li>
                  <li>
                    password match
                    {
                      validations.match ?
                      <CheckOutlined style={{ fontSize: '15px', color: 'green' }} />: ""
                    }
                  </li>
                </ul>
              </div>

              <Form.Item style={{marginTop: '30px'}}>
                <Button  block htmlType='submit' className='bg-[#9966CC] font-sans text-white text-[13px] outline-none border-none'>Update Password</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
    </div>
  )
}

export default CreatePassword