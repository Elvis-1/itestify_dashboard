import React, {useContext, useState} from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { DarkModeContext } from '../../context/DarkModeContext';
import picturesData from '../../data/picsData'
import picBackground from '../../assets/images/picBackground.png'
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";


import { Modal } from 'antd';

function All({sortData, sortedData, 
    startIndex, itemsPerPage, handleNextPage, 
    page, handlePrevPage, totalPages}) {

    const {isDarkMode} = useContext(DarkModeContext)

    const [allPicActionModal, setAllPicActionModal] = useState(false)
    const [allPicViewModal, setAllPicViewModal] = useState(false)
    const [allPicEditModal, setAllPicEditModal] = useState(false)
    const [allPicDeleteModal, setAllPicDeletModal] = useState(false)
    const [allDetails, setAllDetails] = useState('')

    const [timePeriod, setTimePeriod] = useState('PM')
    const [showTimePeriod, setShowTimePeriod] = useState(false)

    const [formData, setFormData] = useState({
        source: '',
        date_scheduled: '',
        time: '',
    });

    function handleCloseModal() {
        setAllPicViewModal(false)
        setAllPicEditModal(false)
        setAllPicDeletModal(false)
        setAllPicActionModal(false)
    }

    function handleDetail(id) {
        const videoDetail = picturesData.find((item) => item.id === id)
        if(videoDetail) {
            setAllDetails(videoDetail)
            // setEditDetails(videoDetail)
            // setGetStatus(videoDetail.status)
            // setDeleteDetails(videoDetail.status)
            
        }
       
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({...prevData, [name]: value}))
    };

   const handleSaveEdit = (e) => {
    e.preventDefault()
    console.log(formData);
   };
    

  return (
    <>
        {/* all pictures action modal */}
        <Modal
            open={allPicActionModal}
            onCancel={handleCloseModal}
            footer={null}
            closeIcon={null}
            styles={{
                content: {
                    backgroundColor: '#0B0B0B',
                    width: '150px',
                    height: '130px',
                    color: 'white',
                    margin: '0 auto',
                    borderRadius: '8px',
                    marginLeft: '125%',
                    marginTop: '120px'
                },
                body: {
                    backgroundColor: '#1717171',
                    color: 'white',
                    
                },
            }}
            >
        
                
            <div className='flex flex-col'>
                <div className='border-b w-[150%] ml-[-25px] pb-2 opacity-[0.6]'>
                    <button 
                    onClick={() => {
                        handleDetail(allDetails)
                        setAllPicViewModal(true)
                        setAllPicActionModal(false)
                    }}
                    className='pl-2'>View</button>
                </div>

                <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                    <button
                    onClick={() => {
                        handleDetail(allDetails)
                        setAllPicEditModal(true)
                        setAllPicActionModal(false)
                    }} 
                    className='pl-2'>Edit</button>
                </div>

                <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                    <button onClick={() => {
                        handleDetail(allDetails)
                        setAllPicDeletModal(true)
                        setAllPicActionModal(false)
                    }}
                    className='pl-2 pt-4 text-red'>Delete</button>
                </div>
            </div>
        
        </Modal>

        {/* all pictures details modal */}
        <Modal
            open={allPicViewModal}
            onCancel={handleCloseModal}
            footer={null}
            closable={true}
            closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-10px' }}>X</span>}
            styles={{
                content: {
                    backgroundColor: '#171717',
                    width: '400px',
                    height: 'auto',
                    color: 'white',
                    margin: '-40px auto',
                    borderRadius: '8px',
                },
                body: {
                    backgroundColor: '#171717',
                    color: 'white',
                    
                },
            }}
        >
            {allDetails ? (

                <div>
                    <h2 className='mt-[-10px] text-[20px] font-sans pb-2'>Pictures Details</h2>
                    <hr className='opacity-[0.6] w-[113%] ml-[-23px] '/> 

                    <div className='mt-10'>
                        <img src={picBackground} alt="" />
                    </div>

                    {allDetails.status === 'Uploaded' &&
                    <div>
                        <div className='flex items-center justify-between mt-5'>
                            <p>Uploaded By</p>
                            <p>{allDetails.uploaded_by}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Uploaded Date</p>
                            <p>{allDetails.date_uploaded}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Source</p>
                            <p>{allDetails.source}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of downloads</p>
                            <p>{allDetails.downloads}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of shares</p>
                            <p>{allDetails.shares}</p>
                        </div>
                    </div>}

                    {allDetails.status === 'Schedule' 
                    && <div>
                    <div className='flex items-center justify-between mt-5'>
                        <p>Schedule Date</p>
                        <p>{allDetails.date_scheduled}</p>
                    </div>
                    <div className='flex items-center justify-between mt-3'>
                        <p>Schedule Time</p>
                        <p>{allDetails.time}</p>
                    </div>
                    <div className='flex items-center justify-between mt-3'>
                        <p>Source</p>
                        <p>{allDetails.source}</p>
                    </div>
                    </div>}

                    {allDetails.status === 'Draft' 
                    && <div>

                    <div className='flex items-center justify-between mt-3'>
                        <p>Source</p>
                        <p>{allDetails.source}</p>
                    </div>
                    </div>}
                    
                </div>
            ) : (
            <p>No details available</p>
            )}
        </Modal>

        {/*all inspirational  pictures Edit modal */}
        <Modal
            open={allPicEditModal}
            onCancel={handleCloseModal}
            footer={null}
            closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-7px' }}>X</span>}
            styles={{
            content: {
                backgroundColor: '#0B0B0B',
                width: '380px',
                height: 'auto',
                color: 'white',
                margin: '0 auto',
                borderRadius: '8px',
                marginLeft: '50%',
                marginTop: '50px'
            },
            body: {
                backgroundColor: '#1717171',
                color: 'white',
                
            },
        }}
        >

            <div>
                <h3 className='text-white text-[18px] font-sans pb-2 mt-[-10px]'>
                    {allDetails.status === 'Uploaded' && 'Edit Uploaded Picture'}
                    {allDetails.status === 'Schedule' && 'Edit Scheduled Picture'}
                    {allDetails.status === 'Draft' && 'Edit Draft Picture'}
                </h3>
                <hr className='opacity-[0.2] text-gray-300 w-[115%] ml-[-25px] '/>

                <div>
                    <form onSubmit={handleSaveEdit}>
                    <div className=''>
                        <p className='mt-5 ml-[-10px]'>Source</p>
                        <input
                        name="source"
                        value={formData.source || allDetails.source}
                        placeholder='Edit source'
                        onChange={handleInputChange}
                        className='bg-[#171717] mb-5 text-white 
                        rounded-xl p-2 w-[110%] 
                        ml-[-15px] outline-none border-none'/>
                    </div>

                    {allDetails.status === 'Schedule' && 
                    <>
                        <div>
                            <p className='mt-5 ml-[-10px]'>Schedule Date</p>
                            <input
                            name="date_scheduled"
                            type='date'
                            value={formData.date_scheduled || allDetails.date_scheduled} 
                            placeholder=''
                            onChange={handleInputChange}
                            className='bg-[#171717] mb-5 text-white 
                            rounded-xl p-2 w-[110%] 
                            ml-[-15px] outline-none border-none'/>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className='bg-[#171717] overflow-hidden w-[50%] h-[30px] ml-[-10px] rounded'>
                                <input type="time"
                                name='time'
                                value={formData.time || allDetails.time} 
                                onChange={handleInputChange} 
                                className='text-white bg-[#171717] w-[100%] pt-1 p-1'/>
                            </div>

                            <div onClick={()=> setShowTimePeriod(!showTimePeriod)}
                            className='bg-[#171717] w-[50%] h-[30px]
                             mr-[-10px] rounded'>
                               <div className='pl-2 pt-1 flex items-center justify-between'>
                                {timePeriod}
                                {showTimePeriod ? <FaCaretUp/> : <FaCaretDown/>}
                                
                                </div>
                                {showTimePeriod &&
                               <div className='flex flex-col items-start mt-3 rounded overflow-hidden '>
                                <input type="button" 
                                value="PM"
                                onClick={()=> setTimePeriod("PM")}
                                className='bg-[#171717] w-[100%] cursor-pointer'/>
                                <input type="button" 
                                value="AM"
                                onClick={()=> setTimePeriod("AM")}
                                className='bg-[#171717] w-[100%] cursor-pointer'/>
                               </div>
                               }
                            </div>
                            
                        </div> 
                    </>
                    }

                    <div className='flex items-center justify-end mt-16'>
                        <button className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[100px] mr-4 hover:bg-[#9966CC] 
                        text-[#9966CC] hover:text-white'>Cancel</button>
                        <button type='submit' className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[130px] text-[#9966CC]
                      hover:bg-[#9966CC] hover:text-white'>Save Changes</button>
                    </div>
                    </form>
                </div>
            </div>

        </Modal>

        {/* all Inspirational pictures delete  modal */}
        <Modal
            open={allPicDeleteModal}
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
            <div className='flex flex-col w-[128%] ml-[-20px] mt-[-5px] items-center justify-center'>
                <div>
                    {allDetails.status === 'Schedule' && 
                        <>
                        <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                        <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                            Are you sure you want to delete this Scheduled testimony? This action will 
                            removed this testimony permanently, and it will not 
                            be uploaded on the scheduled date and time.' 
                        </p>
                        <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                        <button
                        className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                        </>
                    }

                    {allDetails.status === 'Uploaded' && 
                        <>
                        <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                        <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                            Are you sure you want to delete this Uploaded testimony? Once deleted the 
                            testimony will be remove from the platform and will no longer be visible to users.
                            This action cannot be undone 
                        </p>
                        <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                        <button
                            className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                        </>
                    }

                    {allDetails.status === 'Draft' && 
                        <>
                        <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                        <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                            Are you sure you want to delete this draft? This action will permernently remove this 
                            testimony from your drafts and cannot be undone 
                        </p>
                        <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                        <button
                            className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                        </>
                    }
                </div>
            </div>

        </Modal>

        <div>
            <div className='w-[100%] h-[240px] m-[auto]'>
            {/* table header begins */}
            <div className={` h-10 grid grid-cols-9 text-[11px]
                ${isDarkMode ? "bg-[#313131] text-white" : "bg-slate-100 text-black border-b border-b-slate-200"}`}>
                <div className='p-2 flex items-center'>
                    S/N
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('id')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('id')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center ml-[-15px]'>
                    Thumbnail
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('thumbnail')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('thumbnail')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
                    Source
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('source')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('source')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
                    Date Uploaded
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('date_uploaded')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('date_uploaded')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
                    Uploaded By
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('uploaded_by')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('uploaded_by')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center ml-[-10px]'>
                    Downloads
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('downloads')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('downloads')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
                    Shares
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('shares')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('shares')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
                    Status
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('status')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('status')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                    </div>
                </div>
            <div className='p-2 flex items-center'>Action</div>
            
            </div>


            {/* Data Rows */}
            {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                <div
                onClick={() => {
                    setAllPicActionModal(true)
                    setAllDetails(item.id)
                }}
                key={item.id}
                className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-9
                    ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                    <div className='p-2 flex items-center'>{item.id}</div>
                    <div className='p-2 flex items-center ml-[-10px]'>
                        <img src={item.thumbnail} alt="" />
                    </div>
                    <div className='pl-2 flex items-center'>{item.source}</div>

                    <div className='p-2 flex items-center'>{item.date_uploaded}</div>
                    <div className='p-2 flex items-center'>{item.uploaded_by}</div>
                    <div className='pl-1 flex items-center'>{item.downloads}</div>

            
                    <div className='p-2 flex items-center'>{item.shares}</div>
                    <div className={`p-2 flex w-[90px] pl-5 h-[30px] mt-3 items-center ${item.status === 'Uploaded' ?
                        'border border-green-500 text-green-700 rounded-xl p-1 outline-none' :
                        item.status === 'Schedule' ? 'border border-yellow-500 text-yellow-500 rounded-xl p-1' :
                        'border border-gray-500 text-gray-500 pl-7 rounded-xl'
                        }`}>
                        {item.status}
                    </div>
                    <div
                    className='p-2 flex items-center ml-3'>{item.action}</div>
                </div>
            ))}
            {/* end of Data row */}
            </div> 
        </div>

        {/* Pagination */}
        <div className='flex justify-between items-center mt-1'>
            <div className={`text-[12px] ml-[10px]
                ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, picturesData.length)} of {picturesData.length}
            </div>
            <div className='text-[13px] mr-5 flex items-center gap-3'>
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`w-[90px] p-2 rounded-xl ${page === 1 ? 
                        'opacity-[0.5] text-gray-500 border border-gray-500' : 
                        "border border-[#9966CC] text-[#9966CC]"}`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className={`w-[90px] p-2 rounded-xl ${page === totalPages ? 
                        'opacity-[0.5] text-gray-500 border border-gray-500' : 
                        "border border-[#9966CC] text-[#9966CC]"}`}
                >
                    Next
                </button>
            </div>
        </div>
        {/* end of Pagination */}
    </>
  )
}

export default All