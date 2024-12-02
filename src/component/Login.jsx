import React, { useState } from 'react'
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import logo from '../assets/icons/Logo.png'

import '../App.css'
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate()

    const onFinish = (values) => {
        console.log({values})
        navigate('/create-password')
    }

  return (
    <div className='w-[250px] h-[320px]'>
        <div className='w-[50%] m-[auto] mt-4 pt-3 mb-3'>
            <img className='w-[50px] m-[auto]' src={logo} alt="" />
            <p className='font-sans text-white text-center pt-2'>Welcome!</p>
        </div>

        <Form onFinish={onFinish} layout='vertical'>
            <label className='text-white pl-1'>Email Address</label>
            <Form.Item name='email' rules={[{required:true, message:'email is reqiured'}]}>
                <Input
                id='email'
                placeholder='Enter you email'
                className='border-none outline-none' 
                prefix={<MailOutlined className='text-white' />}
                style={{backgroundColor:'#313131', color: 'white'}}
                />
            </Form.Item>

            <label className='text-white pl-1'>Entry Code</label>
            <Form.Item name='password' rules={[{required:true, message:'entry code is reqiured'}]}>
                <Input.Password
                id='password'
                className='border-none outline-none'
                placeholder='Enter code'
                prefix={<LockOutlined className='text-white'/>}
                style={{backgroundColor:'#313131', color: 'white'}} 
                />
            </Form.Item>

            <Form.Item style={{marginTop: '30px'}}>
                <Button  block htmlType='submit' className='bg-[#9966CC] text-white text-[13px] outline-none border-none'>Login</Button>
            </Form.Item>
        </Form>
        
    </div>
     
  )
}

export default Login