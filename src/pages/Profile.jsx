import React, { useState } from 'react'
import defaultImage from '../assets/images/defaultimage.png'

import { Button, Form, Input, message } from 'antd';
import { Modal } from 'antd';
import { CheckOutlined, UserOutlined } from "@ant-design/icons";
import { MailOutlined, LockOutlined } from '@ant-design/icons';

function Profile() {

    const [uploadProfilePic, setUploadProfilePic] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [profileDeleteModal, setProfileDeleteModal] = useState(false)

    const [oldpassword, setOldPassword] = useState('')
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
        console.log({values})

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

    function handleCloseModal() {
        setProfileDeleteModal(false)
    }


  return (

    <>
    {/* profile delete  modal */}
        <Modal
            open={profileDeleteModal}
            onCancel={handleCloseModal}
            closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-30px' }}>X</span>}
            footer={null}
            styles={{
                content: {
                    backgroundColor: 'black',
                    width: '350px',
                    height: '200px',
                    color: 'white',
                    margin: '0 auto',
                    borderRadius: '8px',
                    marginTop: '50px'
                },
                body: {
                    backgroundColor: '#1717171',
                    color: 'white',
                
                },
            }}
        >
            <div className='flex flex-col w-[100%] mt-[-5px] items-center justify-center'>
                <div>
                    <>
                    <p className='text-[20px] text-center pt-1'>Delete Profile picture?</p>
                    <p className='text-[12px] opacity-[0.6] mt-2 text-center mb-3 w-[300px]'>
                        Are you sure you want to delete your profile picture?
                        This action cannot be undone and your profile picture will be permanently removed.
                    </p>

                    <div className='flex items-center justify-end gap-3'>
                        <button onClick={handleCloseModal} 
                        className='border border-[#9966CC] mt-6 rounded text-[#9966CC] p-1 w-[120px]'>
                            Cancel
                        </button>
                        <button
                            className='mt-6 rounded bg-[#E53935] p-1.5 w-[120px]'>
                            Delete
                        </button>
                    </div>
                    
                    </>
                </div>
            </div>

        </Modal>
        <div className="flex p-6 w-[95%] h-[auto]">
            <div className="flex-[1]">
                <div className='bg-[#121212] w-[170px] h-[170px] m-auto mt-2 rounded-full'>
                    <img src={defaultImage} alt="" className='w-[50px] m-auto pt-[35%]' />
                </div>
                <p className='text-white font-semi-bold text-center mt-1'>Elvis Igiebor</p>
                <p className='text-[12px] text-center text-gray-100 opacity-[0.5]'>Admin</p>

                <div className='w-[90%] m-auto flex items-center gap-3 mt-2'>
                    <button onClick={() => {
                        setUploadProfilePic(false)
                        setProfileDeleteModal(true)
                    }}
                    className={`w-[100px] h-[30px] p-1 text-[11px] ${!uploadProfilePic ? 'bg-[#9966CC] text-white rounded border-none outline-none' 
                    : 'border border-white text-gray-500 opacity-[0.5] rounded'}`}>Delete Picture</button>

                    <label htmlFor='profile-pic' onClick={() => setUploadProfilePic(true)}
                        className={`w-[120px] h-[30px] pt-2 text-[11px] text-center ${uploadProfilePic ? 'bg-[#9966CC] text-white rounded' 
                        : 'border border-white text-gray-500 opacity-[0.5] rounded'}`}>Upload New Picture
                    </label>

                    <input type="file" id='profile-pic' className='hidden' />
                </div>
            </div>
            <div className="flex-[6] p-1">
                <h2>Personal Information</h2>

                <div className='mt-2'>
                    <Form onFinish={onFinish} layout='vertical'>
                    <label className='text-white pl-1'>Full Name</label>
                    <Form.Item name='email' rules={[{required:true, message:'email is reqiured'}]}>
                        <Input
                        id='email'
                        placeholder='Elvis Igiebor'
                        className='border-none outline-none' 
                        prefix={<UserOutlined className='text-white' />}
                        style={{backgroundColor:'#313131', color: 'white', width: '100%'}}
                        />
                    </Form.Item>

                    <label className='text-white pl-1'>Email Address</label>
                    <Form.Item name='email' rules={[{required:true, message:'email is reqiured'}]}>
                        <Input
                        id='email'
                        placeholder='elvisIigiebor@gmail.com'
                        className='border-none outline-none' 
                        prefix={<MailOutlined className='text-white' />}
                        style={{backgroundColor:'#313131', color: 'white', width: '100%'}}
                        />
                    </Form.Item>
                    </Form>
                </div>


                <button onClick={() => setShowChangePassword(!showChangePassword)}
                className='bg-[#9966CC] text-white text-[13px] outline-none border-none p-2 rounded mb-1'>
                    Change Password
                </button>
                    
                
            {showChangePassword &&
                <div>
                    <h2 className='text-white mb-2 mt-4'>Change Password</h2>
                    <Form onFinish={onFinish} layout='vertical'>
                        <div className='w-[100%] m-[auto] mt-3'>
                        <label className='text-white pl-1 font-sans'>Old Password</label>
                        <Form.Item >
                            <Input.Password
                            name='oldPassword'
                            value={oldpassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className='border-none outline-none'
                            placeholder='Enter Old Password'
                            prefix={<LockOutlined className='text-white'/>}
                            style={{backgroundColor:'#313131', color: 'white'}} 
                            />
                        </Form.Item>

                        <label className='text-white pl-1 font-sans'>New Password</label>
                        <Form.Item >
                            <Input.Password
                            name='newPassword'
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            className='border-none outline-none'
                            placeholder='Enter Password'
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
                            placeholder='Enter Password'
                            prefix={<LockOutlined className='text-white'/>}
                            style={{backgroundColor:'#313131', color: 'white'}} 
                            />
                        </Form.Item>

                        <div className='text-white text-[12px] mt-[-10px] ml-[20px] opacity-[0.7]'>
                            <ul className='list-disc'>
                            <li>
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
                                Password match
                                {
                                validations.match ?
                                <CheckOutlined style={{ fontSize: '15px', color: 'green' }} />: ""
                                }
                            </li>
                            </ul>
                        </div>

                        </div>
                    </Form>
                </div>
            }

                <div className='flex items-center justify-end mt-5 gap-3'>
                    <button className='border border-[#9966CC] p-2 w-[120px]
                    outline-none text-white text-[13px] rounded'>Cancel</button>
                    <button className='p-2 bg-[#9966CC] text-white 
                    w-[120px] rounded outline-none border-none text-[13px]'>Save Changes</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default Profile