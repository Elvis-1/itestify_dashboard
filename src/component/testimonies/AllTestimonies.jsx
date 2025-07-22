import React, {useContext, useState} from "react"
import TestimonyText from "./TestimonyText"

import { IoAddOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci"
import TestimonyVideo from "./TestimonyVideo";
import { Modal, Switch } from "antd";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Link } from "react-router-dom";



const columns = [
    {
        name: 'S/N',
        selector: row => row.id 
    },
    {
        name: 'Name',
        selector: row => row.name,
        wrap: true,
        sortable: true,
    },
    {
        name: 'Category',
        selector: row => row.category,
        sortable: true,
    },
    {
        name: 'Date',
        selector: row => row.date,
        sortable: true,
    },
    {
        name: 'Likes',
        selector: row => row.likes,
        sortable: true, 
    },
    {
        name: 'Comment',
        selector: row => row.comments,
        sortable: true, 
    },
    {
        name: 'Share',
        selector: row => row.shares,
        sortable: true,
    },
    {
        name: 'Status',
        selector: row  => row.status,
        cell: (row) => (
            <span style={getStatusStyle(row.status)}>
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </span>
        ),
        sortable: true,

    },
    {
        name: 'Action',
        selector: row => row.action,
        sortable: true, 
    },
]

// const customStyles = {
//     rows: {
//         style: {
//             backgroundColor: '#000000', // Black background for rows
//             color: '#FFFFFF',
//             borderBottom: '1px solid #FFFFFF !important',
//             fontSize: '12px'      // White text color for better visibility
//         },
//     },

//     headCells: {
//         style: {
//           backgroundColor: '#313131',
//           color: '#FFFFFF',
//           fontWeight: 'bold',
//         },
//     },

//     pagination: {
//         style: {
//           backgroundColor: '#171717',
//           color: '#FFFFFF',
//           display: 'flex',
//           justifyContent: 'space-between'
//         },
//     },
// }



function AllTestimonies() {
    const {isDarkMode} = useContext(DarkModeContext)

    const[showVideoTestimonies, setShowVideoTestimonies] = useState(false)
    const [manageSettingsModal, setManageSettingsModal] = useState(false)

    // function ManageSettingsUploadVideo() {
    //     setManageSettings(!manageSettings)
    //     setUploadVideo(!uploadVideo)
    // }

    //function to handle manage settings modal
    function settingModal() {
        setManageSettingsModal(!manageSettingsModal)
    }

    //function to handle the closing of manage settings modal
    function handleCloseModal() {
        setManageSettingsModal(false)
    }
    return (
        <>
        {/* manage settings modal */}
        <Modal
        open={manageSettingsModal}
        onCancel={handleCloseModal}
        closeIcon={<span style={{ color: `${isDarkMode ? '#fff' : 'black'}`, fontSize: '20px', marginTop: `${isDarkMode ? '15px' : ''}` }}>X</span>}
        footer={null}
        styles={{
            content: {
                backgroundColor: `${isDarkMode ? '#0B0B0B' : '#fff'}`,
                width: '450px',
                height: 'auto',
                color: `${isDarkMode ? '#fff' : 'black'}`,
                margin: '0 auto',
                borderRadius: '8px',
                marginLeft: '80%',
                marginTop: '10px'
            },
            body: {
                
                color: `${isDarkMode ? '#fff' : 'black'}`,
               
            },
        }}>
            <div>
                <h1 className="text-[25px]">Testimony Settings</h1>
                {/* <hr className="w-[112%] ml-[-25px] mt-5 bg-gray-300 h-[0.1px]"/> */}

                <div className="mt-7">
                    {/* <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-[17px]">Allow likes on testimonies</h2>
                            <p className="text-gray-300 text-[11px]" >Enable or disable likes on testimonies</p>
                        </div>

                        <div>
                        <Switch className="manage-settings-switch"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-[17px]">Allow comments on testimonies</h2>
                            <p className="text-gray-300 text-[11px]" >Enable or disable comments on testimonies</p>
                        </div>

                        <div>
                        <Switch className="manage-settings-switch"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-[17px]">Allow shares of testimonies</h2>
                            <p className="text-gray-300 text-[11px]" >Enable or disable shares on testimonies</p>
                        </div>

                        <div>
                        <Switch className="manage-settings-switch"/>
                        </div>
                    </div> */}

                    {/* <hr className="w-[100%] ml-[-5px] mt-5 bg-gray-300 h-[0.1px]"/> */}

                    <div className="flex items-center justify-between mb-3 mt-3">
                        <div>
                            <h2 className="text-[17px]">
                                Notify admin of new written testimonies
                            </h2>
                            <p className="text-gray-300 text-[11px]" >
                                Admin will recieve notification of new testimonies posted by users
                            </p>
                        </div>

                        <div>
                        <Switch className="manage-settings-switch"/>
                        </div>
                    </div>

                    {/* <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-[17px]">
                                Notify Users of Rejected Testimonies
                            </h2>
                            <p className="text-gray-300 text-[11px]" >
                                users will recieve notification  with the reason for rejection as posted by the admin
                            </p>
                        </div>

                        <div>
                        <Switch className="manage-settings-switch"/>
                        </div>
                    </div> */}
                </div>

                <div className="flex items-center justify-end gap-2 mt-5">
                    <div className="p-3 w-[120px] 
                    text-center text-[16px] text-[#9966CC] 
                    rounded border border-[#9966CC] hover:text-white hover:bg-[#9966CC]">
                        <button className="border-none outline-none">Cancel</button>
                    </div>
                    <div className="p-3 w-[120px] text-center 
                    text-[16px] text-[#9966CC] rounded 
                    border border-[#9966CC] hover:text-white hover:bg-[#9966CC]">
                        <button className="border-none outline-none">Save Settings</button>
                    </div>
                </div>
                
            </div>

        </Modal>


         {/* all testimonies header */}
         <div className='p-3 flex items-center justify-between'>
         <div className={`rounded overflow-hidden text-[12px] p-1 h-[45px] w-[147px] ${isDarkMode ? 'bg-[#787878]' : 'bg-white' }`}>
            <div className={`rounded w-[100%] overflow-hidden ${!isDarkMode ? 'mt-[-0.5px]' : ' mt-[-0.5px]'}`}>
                <button 
                    onClick={() => setShowVideoTestimonies(false)}
                    className={`${!showVideoTestimonies ? 
                    `text-white bg-[#9966CC] p-1.5 w-[50%] h-[38px] mt-[-2.33px] ${isDarkMode && 'mt-[-1px]'}` : 
                    `p-1.5 w-[50%] mt-[-2.3px] h-[38px] ${isDarkMode ? 'bg-[#787878] text-white' : 'bg-white text-[#9966CC]' }`}`}>
                        Text
                </button>

                <button 
                    onClick={() => setShowVideoTestimonies(true)}
                    className={`${showVideoTestimonies ? 
                    `text-white bg-[#9966CC] p-1.5 w-[50%] h-[38px] mt-[-2.33px] ${isDarkMode && 'mt-[-1px]'}` :
                    `p-1.5 w-[50%] mt-[-2.3px] h-[38px] ${isDarkMode ? 'bg-[#787878] text-white' : 'bg-white text-[#9966CC]' }`}`}>
                        Video
                </button>
            </div>
            
             
         </div>

         <div className='flex items-center gap-5'>
            <div className='flex items-center p-1 rounded border border-[#9966CC] text-white'>
                 <CiSettings />
                 <button onClick={settingModal}
                  className='text-[12px] border-none outline-none'>Manage Settings</button>
            </div>

            <Link to='/dashboard/activity-log' className='flex items-center gap-2 p-1 rounded text-white'>
                <div className="bg-[#9966CC] text-white p-1 rounded flex items-center justify-center gap-2 w-[120px]">
                    <button className="text-white border-none outline-none text-[12px]">View Activity log</button>
                </div>
            </Link>
         </div>
     </div>
     {/* all testimonies header ends here */}
     {!showVideoTestimonies ? <TestimonyText/> : <TestimonyVideo/>}
     
    </> 
    )
}

export default AllTestimonies