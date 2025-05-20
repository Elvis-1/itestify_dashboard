import React, { useState } from 'react'
import { Modal, Switch } from "antd";
import { CheckOutlined } from '@ant-design/icons';

function NotificationSettings() {
    const [notificationSettingSuccessModal, setNotificationSettingSuccessModal] = useState(false)

    function handleNotSettingsSuccessful() {
        setNotificationSettingSuccessModal(true)
         let successTimer = setTimeout(() => {
             setNotificationSettingSuccessModal(false)
         },2000)
 
         return () => {
             clearTimeout(successTimer)
         }
     }

    return (
        <div className=''>
             {/* notification settings success modal*/}
             <Modal
                open={notificationSettingSuccessModal}
                closeIcon={null}
                footer={null}
                styles={{
                content: {
                    backgroundColor: 'black',
                    width: '200px',
                    height: '200px',
                    color: 'white',
                    margin: '0 auto',
                    borderRadius: '8px',
                    marginTop: '50px',
                    padding: '10px'
                },
                body: {
                    backgroundColor: '#1717171',
                    color: 'white',
                   
                },
            }}
            >
            <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
                <div className='bg-[#9966CC] w-[50px] h-[50px] 
                rounded-full flex items-center justify-center'>
                    <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                </div>
                <div>
                    <p className='text-[20px] text-center pt-3'>Settings Save successfully!</p>
                </div>
            </div> 
    
            </Modal>
            
            <div className='w-[73%] ml-5 mt-3 pt-2'>
               <h3>Notification Settings</h3>
               <p className='text-[13px] pt-1 opacity-[0.6]'>Manage your notification preference here. choose how and where you want to recieve
                updates, so you stay inform about the latest activity on the dashboard.
               </p>
            </div>
            <hr className='w-[96%] ml-5 mt-2 opacity-[0.5]'/>

            <div className='flex items-center justify-between ml-5 mt-3 pt-2'>
                <div>
                    <h3>Enable Browser Notifications</h3>
                    <p className='text-[13px] pt-1 opacity-[0.6]'>
                        When enabled, you'll recieve notification directly within the dashbord.
                    </p>
                </div>
                <div className='mr-6'>
                    <Switch className="manage-settings-switch"/>
                </div>
            </div>
            <hr className='w-[96%] ml-5 mt-2 opacity-[0.5]'/>

            <div className='flex items-center justify-between ml-5 mt-3 pt-2'>
                <div>
                    <h3>Enable Email Notifications</h3>
                    <p className='text-[13px] pt-1 opacity-[0.6]'>
                        When enabled, you'll recieve notification directly to your email.
                    </p>
                </div>
                <div className='mr-6'>
                    <Switch className="manage-settings-switch"/>
                </div>
            </div>


            <div className='mt-10 flex items-center justify-end gap-3 w-[97%] m-auto'>
                <button className='border border-[#9966CC] rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                <button onClick={handleNotSettingsSuccessful}
                className='bg-[#9966CC] text-white rounded p-2 w-[120px]'>Save settings</button>
            </div>
        </div>
    )
}

export default NotificationSettings