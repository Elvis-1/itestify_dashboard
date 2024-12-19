import React, {useState} from "react"
import TestimonyText from "./TestimonyText"

import { IoAddOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci"
import TestimonyVideo from "./TestimonyVideo";

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
    const[showVideoTestimonies, setShowVideoTestimonies] = useState(false)
    const[manageSettings, setManageSettings] = useState(true)
    const[uploadVideo, setUploadVideo] = useState(false)

    function ManageSettingsUploadVideo() {
        setManageSettings(!manageSettings)
        setUploadVideo(!uploadVideo)
    }
    return (
        <>
         {/* all testimonies header */}
         <div className='p-3 flex items-center justify-between'>
         <div className='rounded overflow-hidden bg-[#787878] text-[12px] p-1'>
             <button 
             onClick={() => setShowVideoTestimonies(false)}
             className={`${!showVideoTestimonies ? 
             'text-white bg-[#9966CC] p-1 w-[60px] rounded' : 
             'text-white bg-[#787878] p-1 w-[60px]'}`}>Text</button>
             <button 
             onClick={() => setShowVideoTestimonies(true)}
             className={`${showVideoTestimonies ? 
             'text-white bg-[#9966CC] p-1 w-[60px] rounded' : 
             'text-white bg-[#787878] p-1 w-[60px]'}`}>Video</button>
         </div>

         <div className='flex items-center gap-5'>
             <div 
             onClick={ManageSettingsUploadVideo}
             className={`flex items-center p-1 rounded ${manageSettings ? 'bg-[#9966CC] text-white' : 
             'bg-black text-[#9966CC] border border-[#9966CC]'}`}>
                 <CiSettings />
                 <button className='text-[12px] border-none outline-none'>Manage Settings</button>
             </div>
         </div>
     </div>
     {/* all testimonies header ends here */}
     {!showVideoTestimonies ? <TestimonyText/> : <TestimonyVideo/>}
     
    </> 
    )
}

export default AllTestimonies