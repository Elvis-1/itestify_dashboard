import React, {useContext, useEffect, useState} from 'react'
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io'
import { DarkModeContext } from '../../context/DarkModeContext';
import picBackground from '../../assets/images/picBackground.png'
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";


import { Modal } from 'antd';
import axios from 'axios';
import LoadingState from '../LoadingState';
import { CheckOutlined } from '@ant-design/icons';
import { set } from 'date-fns';

function All({sortedData, sortData, itemsPerPage, startIndex, 
    page, handleNextPage, handlePrevPage, selectTestType, allInspirationalPicsData,
    loading, fetchInspirationalPics,
   filterDate1, filterDate2, ApprovalStatus, searchQuery, searchedData, setError}) {

    const {isDarkMode} = useContext(DarkModeContext)

    const [allPicActionModal, setAllPicActionModal] = useState(false)
    const [allPicViewModal, setAllPicViewModal] = useState(false)
    const [allPicEditModal, setAllPicEditModal] = useState(false)
    const [allPicDeleteModal, setAllPicDeletModal] = useState(false)
    const [allDetails, setAllDetails] = useState('')
    const [editSuccessfully, setEditSuccessfully] = useState(false)
    const [deleteSuccessfully, setDeleteSuccessfully] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    
    

    const [timePeriod, setTimePeriod] = useState('PM')
    const [showTimePeriod, setShowTimePeriod] = useState(false)
    
    

    useEffect(() => {
    if (allPicEditModal && allDetails) {
        setFormData({
        source: allDetails.source || '',
        // date_scheduled: allDetails.date_scheduled || '',
        // time: allDetails.time || ''
        });
    }
    }, [allPicEditModal, allDetails]);

    const [formData, setFormData] = useState({
        source: ''
        // date_scheduled: '',
        // time: '',
    });

    function handleCloseModal() {
        setAllPicViewModal(false)
        setAllPicEditModal(false)
        setAllPicDeletModal(false)
        setAllPicActionModal(false)
    }

   

    const handleDetail = async (id) => {
        try {
            const response = await axios.get(`https://itestify-backend-38u1.onrender.com/inspirational/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setAllDetails(response.data);
            console.log('Details fetched:', response.data);
        } catch (error) {
            setError('Failed to fetch details');
            console.error('Error fetching details:', error);
        }
    }


     //handleChange for edit modal
   const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

   const handleSaveEdit = async (e) => {
    e.preventDefault();
        
        if (!allDetails?.id) {
            console.error('No ID found for the item to edit');
            return;
        }

    setButtonLoading(true);
    try {
        const token = localStorage.getItem('token');
        if (!token) {
        throw new Error('No authentication token found');
        }

        // Prepare the data to send
        const requestData = {
        source: formData.source,
        ...(allDetails.status === 'Schedule' && {
            date_scheduled: formData.date_scheduled,
            time: formData.time + ' ' + timePeriod // Combine time and period
        })
        };

        const response = await axios.put(
        `https://itestify-backend-38u1.onrender.com/inspirational/${allDetails.id}/`,
        requestData,
        {
            headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            }
        }
        );

        console.log('Update successful:', response.data);
        handleEditSuccessful();
        fetchInspirationalPics(); // Refresh the data
        handleCloseModal();

    } catch (error) {
        console.error('Update error:', error);
        let errorMessage = 'Failed to update inspirational picture';
        if (error.response) {
        errorMessage = error.response.data.message || 
                    error.response.data.detail || 
                    JSON.stringify(error.response.data);
        }
        // You might want to show this error to the user
        alert(errorMessage);
    } finally {
      setButtonLoading(false);
    }
   };

   const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }
    setButtonLoading(true);
    try {
        const response = await axios.delete(`https://itestify-backend-38u1.onrender.com/inspirational/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
       })
       setAllPicDeletModal(false);
       handleDeleteSuccessful()
       fetchInspirationalPics(); // Refresh the data after deletion
    } catch (error) {
        setError('Failed to delete inspirational picture');
    }finally {
        setButtonLoading(false);
        setAllPicDeletModal(false);
    }
  
    
   }
    function handleEditSuccessful() {
       setAllPicEditModal(false)
       setEditSuccessfully(true)
        let successTimer = setTimeout(() => {
            setEditSuccessfully(false)
        },2000)

        return () => {
            clearTimeout(successTimer)
        }
    }

    function handleDeleteSuccessful() {
    setAllPicEditModal(false)
    setDeleteSuccessfully(true)
    let successTimer = setTimeout(() => {
        setDeleteSuccessfully(false)
    },2000)

    return () => {
        clearTimeout(successTimer)
    }
   }
    
    
    

  return (
    <div className={`${!isDarkMode ? 'border  rounded-xl w-[98%] m-[auto]' : 'border-none'}`}>
       
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

                    <div className='mt-5'>
                        <img className='w-[400px] h-[300px]'
                         src={allDetails.thumbnail || picBackground } alt="" />
                    </div>

                    {allDetails.status === 'upload_now' &&
                    <div>
                        <div className='flex items-center justify-between mt-5'>
                            <p>Uploaded By</p>
                            <p>{allDetails.uploaded_by?.role}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Uploaded Date</p>
                            <p>{allDetails.created_at ?
                                new Date(allDetails.created_at).toLocaleDateString('en-Us',{
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }) : 'N/A'
                            }</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Source</p>
                            <p>{allDetails.source || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of downloads</p>
                            <p>{allDetails.downloads_count}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of shares</p>
                            <p>{allDetails.shares_count}</p>
                        </div>
                    </div>}

                    {allDetails.status === 'Schedule' 
                    && <div>
                    <div className='flex items-center justify-between mt-5'>
                        <p>Schedule Date</p>
                        <p>{allDetails.date_scheduled || 'N/A'}</p>
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

                    {allDetails.status === 'drafts' 
                    && <div>

                    <div className='flex items-center justify-between mt-3'>
                        <p>Source</p>
                        <p>{allDetails.source || 'N/A'}</p>
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
                    {allDetails.status === 'upload_now' && 'Edit Uploaded Picture'}
                    {allDetails.status === 'Schedule' && 'Edit Scheduled Picture'}
                    {allDetails.status === 'drafts' && 'Edit Draft Picture'}
                </h3>
                <hr className='opacity-[0.2] text-gray-300 w-[115%] ml-[-25px] '/>

                <div>
                    <form onSubmit={ handleSaveEdit}>
                    <div className='w-[100%]'>
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
                        <button onClick={handleCloseModal} className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[100px] mr-4 hover:bg-[#9966CC] 
                        text-[#9966CC] hover:text-white'>Cancel</button>
                        <button onClick={()=> handleSaveEdit(allDetails.id)} type='submit' className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[130px] text-[#9966CC]
                      hover:bg-[#9966CC] hover:text-white'>
                        {buttonLoading ? 'Saving...' : 'Save Changes'}
                        </button>
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
                        <p className='text-[20px] text-center pt-1'>Delete Inspirational Pics?</p>
                        <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                            Are you sure you want to delete this Scheduled pictures? This action will 
                            removed this pictures permanently, and it will not 
                            be uploaded on the scheduled date and time.' 
                        </p>
                        <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                        <button
                        className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                        </>
                    }

                    {allDetails.status === 'upload_now' && 
                        <>
                        <p className='text-[20px] ml-[-5px] text-center pt-1'>Delete Inspirationals pictures?</p>
                        <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                            Are you sure you want to delete this Uploaded pictures? Once deleted the 
                            picture will be remove from the platform and will no longer be visible to users.
                            This action cannot be undone 
                        </p>
                        <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                        <button onClick={() => handleDelete(allDetails.id)}
                            className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2
                            hover:text-[14px] hover:w-[130px] transition-all duration-200'>
                            {buttonLoading ? 'Deleting...' : 'Yes Delete'}
                        </button>
                        </>
                    }

                    {allDetails.status === 'drafts' && 
                        <>
                        <p className='text-[20px] ml-[-3px] text-center pt-1'>Delete Inspirational Pictures?</p>
                        <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                            Are you sure you want to delete this draft? This action will permernently remove this 
                            picture from your drafts and cannot be undone 
                        </p>
                        <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                        <button onClick={()=> handleDelete(allDetails.id)}
                            className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2
                            hover:text-[14px] hover:w-[130px] transition-all duration-200'>
                                {buttonLoading ? 'Deleting...' : 'Yes Delete'}
                        </button>
                        </>
                    }
                </div>
            </div>

        </Modal>

         {/* all pictures Edit success modal*/}
        <Modal
            open={editSuccessfully}
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
                marginTop: '50px'
            },
            body: {
                backgroundColor: '#1717171',
                color: 'white',
                
            },
            }}>
            <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
                <div className='bg-[#9966CC] w-[50px] h-[50px] 
                rounded-full flex items-center justify-center'>
                    <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                </div>
                <div>
                    <p className='text-[20px] text-center pt-3'>Changes Save successfully!</p>
                </div>
            </div> 

        </Modal>

        {/* all pictures delete success modal*/}
        <Modal
            open={deleteSuccessfully}
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
                marginTop: '50px'
            },
            body: {
                backgroundColor: '#1717171',
                color: 'white',
                
            },
            }}>
            <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
                <div className='bg-[#9966CC] w-[50px] h-[50px] 
                rounded-full flex items-center justify-center'>
                    <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                </div>
                <div>
                    <p className='text-[20px] text-center pt-3'>Deleted successfully!</p>
                </div>
            </div> 

        </Modal>

        <div className={`${isDarkMode ? 'w-[100%]' : 'w-[100%]'} h-[450px] m-[auto] bg-[#171717] rounded-xl
                ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>


            <div className='w-[100%] h-[400px] m-[auto]'>
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
                </div>
            <div className='p-2 flex items-center'>Action</div>
            
            </div>


            {/* Data Rows */}
                {loading ? (
                    <LoadingState />
                ) : Array.isArray(sortedData) && sortedData.length > 0 ?  (
                    sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                        <div
                            onClick={() => {
                                setAllDetails(item)
                            }}
                            key={item.id}
                            className={`border-b border-white text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-9
                                ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                        >
                            <div className='p-2 flex items-center'>
                                {startIndex + index + 1}
                            </div>
                            <div className="p-2 flex items-center justify-center w-[50px] h-[50px] overflow-hidden rounded">
                                <img 
                                    className="w-full h-full object-cover"
                                    src={item.thumbnail || '/path/to/default-image.jpg'} 
                                    alt={item.title || 'image'}
                                />
                            </div>
                           <div className="pl-2 mt-4 truncate max-w-[100px]">{item.source || '...'}</div>

                            <div className='p-2 flex items-center'>
                                {item.created_at
                                    ? new Date(item.created_at).toLocaleDateString('en-Us',{
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }) : 'N/A'
                                }
                            </div>
                            <div className='p-2 flex items-center'>{item.uploaded_by?.role}</div>
                            <div className='pl-1 flex items-center ml-3'>{item.downloads_count}</div>

                            <div className='p-2 flex items-center ml-3'>{item.shares_count}</div>

                            <div
                                className={`p-2 flex w-[100px] h-[30px] mt-3 ml-[-10px] pl-2 items-center justify-center font-semibold ${
                                item.status === "upload_now"
                                    ? "border border-green-500 text-green-700 rounded-xl p-1 pl-3 outline-none"
                                    : item.status === "schedule_for_later"
                                    ? "border w-[120px] border-yellow-500 text-yellow-500 rounded-xl p-1"
                                    : "border border-gray-500 text-gray-500 rounded-xl"
                                }`}
                            >
                                {item.status
                                    ? item.status
                                        .split("_")
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")
                                    : "N/A"}
                            </div>

                            <div onClick={() => {
                                setAllPicActionModal(true)
                            }} className='p-2 flex items-center ml-3'>
                                <IoIosMore />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex items-center justify-center mt-24'>
                        {(selectTestType !== 'Select' || filterDate1 || filterDate2 || ApprovalStatus || searchQuery) ? (
                            <div className="p-2 flex items-center">No Matching Results Found</div>
                        ) : (
                            <div className="p-2 flex items-center">No Data Available</div>
                        )}
                    </div>
                )}
            {/* end of Data row */}
            </div> 

            {/* Pagination */}
            <div className='flex justify-between items-center mt-1'>
                <div className={`text-[12px] ml-[10px]
                    ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                    Showing {Math.min(startIndex + 1, searchedData.length)}-{Math.min(startIndex + itemsPerPage, searchedData.length)} of {searchedData.length}
                </div>
                <div className='text-[13px] mr-5 flex items-center gap-3'>
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1 || searchedData.length === 0}
                        className={`w-[90px] p-2 rounded-xl ${page === 1 || searchedData.length === 0  ? 
                            'opacity-[0.5] text-gray-500 border border-gray-500' : 
                            "border border-[#9966CC] text-[#9966CC]"}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={page === Math.ceil(searchedData.length / itemsPerPage) || searchedData.length === 0}
                        className={`w-[90px] p-2 rounded-xl ${page === Math.ceil(searchedData.length / itemsPerPage) || searchedData.length === 0 ? 
                            'opacity-[0.5] text-gray-500 border border-gray-500' : 
                            "border border-[#9966CC] text-[#9966CC]"}`}
                    >
                        Next
                    </button>
                </div>
            </div>
            {/* end of Pagination */}
        </div>

       
    </div>
  )
}

export default All