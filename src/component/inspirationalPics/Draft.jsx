import React, { useState, useContext, useEffect } from 'react'
import { DarkModeContext } from '../../context/DarkModeContext';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import picturesData from '../../data/picsData'
import picBackground from '../../assets/images/picBackground.png'
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { Modal } from 'antd';



function Draft({searchQuery, setSearchQuery}) {

    const {isDarkMode} = useContext(DarkModeContext)


    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([{}])

    const [draftPicActionModal, setDraftPicActionModal] = useState(false)
    const [draftPicViewModal, setDraftPicViewModal] = useState(false)
    const [draftPicEditModal, setDraftPicEditModal] = useState(false)
    const [draftPicUploadModal, setDraftPicUploadModal] = useState(false)
    const [draftPicDeleteModal, setDraftPicDeletModal] = useState(false)
    const [draftDetails, setDraftDetails] = useState('')

    const [showRole, setShowRole] = useState(false)
    const [role, setRole] = useState('Admin')

    useEffect(() => {
        let draftData = picturesData.filter((item) => {
            return item.status === 'Draft'
        })
        setGetFilterData(draftData)
    },[])

    const itemsPerPage = 3;

    const startIndex = (page - 1) * itemsPerPage;
    getFilteredData.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(getFilteredData.length / itemsPerPage)

    const [formData, setFormData] = useState({
        source: '',
    });

     //sort data logic
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // search Data logic
    const searchedData = React.useMemo(() => {
        const dataToSearch = getFilteredData?.length > 0 ? getFilteredData : picturesData;

        if (searchQuery.trim() !== "") {
            const filteredData = dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.source.toLowerCase().includes(lowerCaseQuery)
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, searchQuery]);

    const sortedData = React.useMemo(() => {
        const dataToSort = searchedData;

        if (sortConfig !== null) {
        const sorted = [...dataToSort].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sorted;
        }
        return dataToSort;
    }, [searchedData, sortConfig]);

    const handleNextPage = () => {
        if (page < totalPages) {
        setPage((prev) => prev + 1);
        }
    };
        
    // function to handle prev page pagination
    const handlePrevPage = () => {
        if (page > 1) {
          setPage((prev) => prev - 1);
        }
    };

    function handleCloseModal() {
        setDraftPicViewModal(false)
        setDraftPicEditModal(false)
        setDraftPicUploadModal(false)
        setDraftPicDeletModal(false)
        setDraftPicActionModal(false)
    }

    function handleDetail(id) {
        const videoDetail = getFilteredData.find((item) => item.id === id)
        if(videoDetail) {
            setDraftDetails(videoDetail)    
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

   const handleUploadSubmit = (e) => {
    e.preventDefault()
    setRole(e.target.value)
    setDraftPicUploadModal(false)
    setRole("Admin")
    console.log(`Role: ${role}`)
   }

  return (
    <>

         {/* draft pictures action modal */}
         <Modal
            open={draftPicActionModal}
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
                    marginLeft: '94%',
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
                        handleDetail(draftDetails)
                        setDraftPicViewModal(true)
                        setDraftPicActionModal(false)
                    }}
                    className='pl-2'>View</button>
                </div>

                <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                    <button
                    onClick={() => {
                        handleDetail(draftDetails)
                        setDraftPicEditModal(true)
                        setDraftPicActionModal(false)
                    }} 
                    className='pl-2'>Edit</button>
                </div>

                <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                    <button
                    onClick={() => {
                        handleDetail(draftDetails)
                        setDraftPicUploadModal(true)
                        setDraftPicActionModal(false)
                    }} 
                    className='pl-2'>Upload</button>
                </div>

                <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                    <button onClick={() => {
                        handleDetail(draftDetails)
                        setDraftPicDeletModal(true)
                        setDraftPicActionModal(false)
                    }}
                    className='pl-2 pt-4 text-red'>Delete</button>
                </div>
            </div>
        
        </Modal>

        {/* draft pictures details modal */}
        <Modal
            open={draftPicViewModal}
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
            {draftDetails ? (

                <div>
                    <h2 className='mt-[-10px] text-[20px] font-sans pb-2'>Pictures Details</h2>
                    <hr className='opacity-[0.6] w-[113%] ml-[-23px] '/> 

                    <div className='mt-10'>
                        <img src={picBackground} alt="" />
                    </div>

                    <div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Source</p>
                            <p>{draftDetails.source}</p>
                        </div>
                    </div>
                </div>
            ) : (
            <p>No details available</p>
            )}
        </Modal>

        {/*draft inspirational  pictures Edit modal */}
        <Modal
            open={draftPicEditModal}
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
                    Edit Draft Picture
                </h3>
                <hr className='opacity-[0.2] text-gray-300 w-[115%] ml-[-25px] '/>

                <div>
                    <form onSubmit={handleSaveEdit}>
                    <div className=''>
                        <p className='mt-5 ml-[-10px]'>Source</p>
                        <input
                        name="source"
                        value={formData.source}
                        placeholder='Edit source'
                        onChange={handleInputChange}
                        className='bg-[#171717] mb-5 text-white 
                        rounded-xl p-2 w-[110%] 
                        ml-[-15px] outline-none border-none'/>
                    </div>

                    <div className='flex items-center justify-end mt-10'>
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

         {/*draft inspirational  pictures Upload modal */}
         <Modal
            open={draftPicUploadModal}
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
                marginLeft: '30%',
                marginTop: '50px'
            },
            body: {
                backgroundColor: '#1717171',
                color: 'white',
                
            },
        }}
        >

            <div>
                <h3 className='text-white text-[18px] font-sans pb-2 mt-[15px] text-center'>
                    Upload Drafted Picture
                </h3>
                
                <p className='text-center mt-3'>You are about to upload this picture. Once uploaded it will immediately be visible to all
                    users, and the original draft will be canceled, do you wish to proceed
                </p>

                <div>
                    <form onSubmit={handleUploadSubmit}>

                        <div className='flex items-center justify-between mt-5'>

                            <div onClick={()=> setShowRole(!showRole)}
                               className='bg-[#171717] w-[100%] h-[30px]
                                mr-[-10px] rounded'>
                                <div className='pl-2 pt-1 flex items-center justify-between'>
                                {role}
                                {showRole ? <FaCaretUp/> : <FaCaretDown/>}
                                
                                </div>
                                {showRole &&
                                <div className=''>
                                <input type="button"
                                name='admin'
                                value="Admin"
                                onClick={()=> setRole("Admin")}
                                className='bg-[#171717] w-[100%] cursor-pointer'/>
                                <input type="button"
                                name='super admin'
                                value="Super Admin"
                                onClick={()=> setRole("Super Admin")}
                                className='bg-[#171717] w-[100%] cursor-pointer'/>
                                </div>
                                }
                            </div>
                            
                        </div> 

                        <div className='flex items-center justify-end mt-16'>
                            <button  onClick={() => setDraftPicUploadModal(false)}
                            className='border border-[#9966CC] 
                            outline-none p-1
                            rounded w-[100px] mr-4 hover:bg-[#9966CC] 
                            text-[#9966CC] hover:text-white'>Cancel</button>
                            <button type='submit' className='border border-[#9966CC] 
                            outline-none p-1 
                            rounded w-[130px] text-[#9966CC]
                            hover:bg-[#9966CC] hover:text-white'>yes upload</button>
                        </div>
                    </form>
                </div>
            </div>

        </Modal>

        {/* draft Inspirational pictures delete  modal */}
        <Modal
            open={draftPicDeleteModal}
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
                    <>
                    <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                    <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                        Are you sure you want to delete this Scheduled testimony? Once deleted the 
                        testimony will be remove from the platform and will no longer be visible to users.
                        This action cannot be undone 
                    </p>
                    <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                    <button
                        className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                    </>
                </div>
            </div>

        </Modal>
        
        <div>
            <div className='w-[100%] h-[240px] m-[auto]'>
            {/* table header begins */}
            <div className={` h-10 grid grid-cols-4 text-[11px]
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
            <div className='p-2 flex items-center'>Action</div>
            
            </div>


            {/* Data Rows */}
            {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                <div onClick={() => {
                    setDraftPicActionModal(true)
                    setDraftDetails(item.id)
                }}
                key={item.id}
                className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-4
                    ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                    <div className='p-2 flex items-center'>{item.id}</div>
                    <div className='p-2 flex items-center ml-[-10px]'>
                        <img src={item.thumbnail} alt="" />
                    </div>
                    <div className='pl-2 flex items-center'>{item.source}</div>
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
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, getFilteredData.length)} of {getFilteredData.length}
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

export default Draft