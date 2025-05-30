import React, { useState, useContext, useRef, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";

import { CheckOutlined } from "@ant-design/icons";
import { CalendarOutlined } from '@ant-design/icons';

import { FaCaretDown, FaCaretUp } from "react-icons/fa6";



import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io';


import { Modal } from 'antd';

import modalpic from '../../assets/images/modalPic.png'

import { DarkModeContext } from '../../context/DarkModeContext';
import { ClipLoader } from "react-spinners";
import axios from 'axios'


const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
};


function TestimonyText() {
    const {isDarkMode} = useContext(DarkModeContext)

    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState(null);
    const [details, setDetails] = useState('')
    const [getStatus, setGetStatus] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [rejectionReasonModal, setRejectionReasonModal] = useState(false)
    const [statusAlert, setStatusAlert] = useState(false)
    const [isApproved, setIsApproved] = useState(null)
    const [filterModal, setFilterModal] = useState(false)
    const [ApprovalStatus, setApprovalStatus] = useState('');
    const [filterDropDown, setFilterDropDown] = useState(false)
    const [selectTestType, setSelectTestType] = useState('Select')
    const [filterDate1, setFilterDate1] = useState('')
    const [filterDate2, setFilterDate2] = useState('')
    const [actionModal, setActionModal] = useState(false)
    const [controlDetail, setControlDetail] = useState(false)
    const [getFilteredData, setGetFilterData] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteAlert, setDeleteAlert] = useState(false)
    const [deleteStatus, setDeleteStatus] = useState(false)
    const [deleteSuccessful, setDeleteSuccessful] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')


    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchTestimonies = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("You are not logged in. Please log in to access testimonies.");
                    setLoading(false);
                    return;
                }
        
                const response = await axios.get(
                    "https://itestify-backend-nxel.onrender.com/testimonies/texts/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );           
                const testimoniesWithDefaults = response.data.data.data.map((item) => ({
                    ...item,
                    full_name: item.full_name ?? "Unknown",
                    category: item.category ?? "Uncategorized",
                    status: item.status ?? "Pending",
                }));
        
                setTestimonies(testimoniesWithDefaults);
            } catch (error) {
                console.error("Failed to fetch testimonies:", error.response ? error.response.data : error.message);
                setError("Failed to fetch testimonies. Please try again later.");
            } finally {
                setLoading(false); // Stop loading
            }
        };
    
        fetchTestimonies();
    }, []);

    useEffect(()=> {
        
    }, [testimonies])


    const itemsPerPage = 4;

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    testimonies.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(testimonies.length / itemsPerPage);


    // sortData logic
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // search Data logic
    const searchedData = React.useMemo(() => {
        const dataToSearch = getFilteredData.length > 0 ? getFilteredData : testimonies;
    
        if (searchQuery.trim() === "") {
            return dataToSearch;
        }
    
        const lowerCaseQuery = searchQuery.toLowerCase();
        return dataToSearch.filter((item) => {
            return (
                item.full_name.toLowerCase().includes(lowerCaseQuery) ||
                item.category.toLowerCase().includes(lowerCaseQuery) ||
                item.status.toLowerCase().includes(lowerCaseQuery)
            );
        });
    }, [getFilteredData, testimonies, searchQuery]);

    
    // sorted Data logic
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

    // function to handle next page pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
        }
    };
        
    // function to handle prev page pagination
    const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
    };

    // function to get testimony details on click
    async function handleDetail(id) {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }
    
            const response = await axios.get(
                `https://itestify-backend-nxel.onrender.com/testimonies/texts/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data) {
                const testimonyDetails = response.data;
    
                if (!testimonyDetails) {
                    console.error("No testimony details found in the response.");
                    return;
                }
    
                if (!testimonyDetails.uploaded_by) {
                    testimonyDetails.uploaded_by = {
                        full_name: "N/A",
                        email: "N/A",
                    };
                }

    
                setDetails(testimonyDetails);
                setOpenModal(true);
                setGetStatus(testimonyDetails.status);
                setActionModal(false);
            } else {
                console.error("No data found in the response.");
            }
        } catch (error) {
            console.error("Failed to fetch testimony details:", error.response ? error.response.data : error.message);
        }
    }
    
    

    // function to close testimony  modals
    const handleCloseModal = () => {
        setOpenModal(false)
        setRejectionReasonModal(false)
        setStatusAlert(false)
        setFilterModal(false)
        setActionModal(false)
        setDeleteAlert(false)
        setDeleteSuccessful(false)
    };

    // function to dynamically handle details modal footer buttons
    function handleModalFooterButton() {
        if (getStatus === 'pending') {
          return [
            <button
              key="reject"
              onClick={() => {
                setRejectionReason(''); // Clear previous rejection reason
                handleRejectionReason();
              }}
              className='text-[12px] border border-red-600 text-red p-1 w-[100px] rounded'
            >
              Reject Testimony
            </button>,
            <button
              key="approve"
              onClick={async () => {
                const success = await handleTestimonyStatus(controlDetail, "approve"); // Note: changed to "approve" to match your API
                if (success) {
                  setIsApproved(true);
                  showStatusAlert();
                }
              }}
              className='text-[12px] text-white bg-[#9966CC] p-1 w-[120px] rounded ml-2'
            >
              Approve Testimony
            </button>
          ];
        } else if (getStatus === 'Rejected') {
          return [
            <div key="reason" className='text-left'>
              <h3 className='text-[13px]'>Reason For Rejection</h3>
              <p className='text-[11px] opacity-[0.7]'>Use of Foul Languages</p>
            </div> 
          ];
        }
        return null;
    }

    async function handleTestimonyStatus(id, newStatus, reason = '') {
        const token = localStorage.getItem('token');
        try {
          const payload = { action: newStatus };
          if (newStatus === 'reject') {
            payload.rejection_reason = reason;
          }

          const response = await axios.post(
            `https://itestify-backend-nxel.onrender.com/text-testimonies/${id}/review/`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
      
          if (response.status === 200) {

            setTestimonies(prevTestimonies => 
              prevTestimonies.map(testimony => 
                testimony.id === id 
                  ? { ...testimony, status: newStatus === 'approve' ? 'Approved' : 'Rejected' } 
                  : testimony
              )
            );
            return true;
          }
          return false;

        } catch (error) {
          console.error('Error updating testimony status:', error);
          // You might want to show an error message to the user here
          return false;
        }
    }

    // function to handle reason for rejection modal
    function handleRejectionReason() {
        setRejectionReasonModal(true)
        setOpenModal(false)
    }

    //function to handle the rejection footer button
    function RejectionModalFooterButton() {
        
        return[
            <button 
            onClick={handleCloseModal}
            className='border 
            border-[#9966CC] p-1 w-[80px] 
            text-[#9966CC] rounded mr-4'>Cancel</button>,

            <button key='Rejected' 
            onClick={async () => {
                if (!rejectionReason.trim()) {
                  alert('Please provide a rejection reason');
                  return;
                }
                const success = await handleTestimonyStatus(controlDetail, "reject", rejectionReason);
                if (success) {
                  setIsApproved(false);
                  showStatusAlert();
                }
              }}
            className='bg-[#9966CC] p-1 w-[80px] 
            text-[#FFFFFF] rounded'>Confirm</button>
        ]
    }

    //function to show the status alert modal
    function showStatusAlert() {
        setStatusAlert(true)
        setOpenModal(false)
        setRejectionReasonModal(false)
        setRejectionReason('')

        const alertTimer = setTimeout(() => {
            handleCloseModal()
        },2000)

        return () => {
            clearTimeout(alertTimer)
        }

        
    }

    //function to handle filter modal 
    function showFilterModal() {
        setFilterModal(true)
    }

    //function fo filter modal footer button
    function filterModalFooterButton() {
        return[
            <div className='mt-[50px]'>
                <button 
                onClick={handleReset}
                className='border border-[#9966CC]outline-none p-1 rounded w-[100px] text-[#9966CC]'>Clear All</button>
                <button
                onClick={handleFiltering}
                className='bg-[#9966CC] ml-2 
                border-none outline-none 
                rounded p-1 w-[100px]'>Apply</button>
            </div>
        ]
    }

    //function handling drop down select in the filtering modal
    const handleChange = (event) => {
        setApprovalStatus(event.target.value);
    };

    //function handle the first date input
    function handleFilterDate1(event) {
        setFilterDate1(event.target.value)
    }

    //function handling the second date input
    function handleFilterDate2(event) {
        setFilterDate2(event.target.value)
    }

    //function handling the filtering logic
    function handleFiltering() {
        const getFilterData = testimonies.filter((item) => {
            const itemDate = new Date(item.date);
         
            if(filterDate1 !== "" && filterDate2 !== "" 
                && selectTestType !== "" && ApprovalStatus !== "") {

                const isWithinDateRange =
                (!filterDate1 || itemDate >= new Date(filterDate1)) &&
                (!filterDate2 || itemDate <= new Date(filterDate2));

                const matchesCategory =
                !selectTestType || item.category === selectTestType;

                const matchesStatus =
                !ApprovalStatus || item.status === ApprovalStatus;
    
                return (
                    isWithinDateRange &&
                    matchesCategory &&
                    matchesStatus
                );

            }else{
                return (item.created_at === filterDate1 || item.created_at === filterDate2
                    || item.category === selectTestType || item.status === ApprovalStatus
                )
            }
           
        });
    
        setGetFilterData(getFilterData); // Update filtered data
        setFilterModal(false); // Close filter modal
    }
    
    // function for filtering fields reset
    function handleReset() {
        setSelectTestType('Select')
        setApprovalStatus('')
        setFilterDate1('')
        setFilterDate2('')
    }

    //function handling delete modal
    function showDeleteNotification() {
        setDeleteAlert(true)
    }

    //function handling delete modal footer button
    function handleDeleteAlertFooterButton() {
        return [
            deleteStatus === 'Pending' ? <button onClick={() => setDeleteAlert(false)}
            className='mr-[110px] mt-3 bg-[#9966CC] 
            border-none outline-none rounded w-[80px] p-1'>Okay</button> :

            <div className='w-[335px] ml-[-15px] pr-3'>
                <button 
                onClick={handleCloseModal}
                className='border border-[#9966CC] outline-none 
                text-[#9966CC] w-[100px] p-1 rounded ml-[-20px] mr-2'>Cancel
                </button>
                <button 
                onClick={deleteSuccessFulModal}
                className='border-none outline-none
                    bg-red-600 w-[100px] rounded p-1 mr-2 pl-3'>Yes delete
                </button>
            </div> 
        ]
                
    }

    //function handle modal for successful deletion
     function deleteSuccessFulModal() {
        setDeleteSuccessful(true)
        setDeleteAlert(false)
         const alertTimer = setTimeout(() => {
            handleCloseModal()
        },2000)

        return () => {
            clearTimeout(alertTimer)
        }
    } 

    async function handleTestimonyDelete(id) {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            await axios.delete(
                `https://itestify-backend-nxel.onrender.com/testimonies/texts/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setTestimonies(prev => prev.filter(item => item.id !== id));
            setDeleteSuccessful(true);
            handleCloseModal();
        } catch (error) {
            console.error("Delete failed:", error);
            // You might want to show an error notification here
        } finally {
            setLoading(false);
        }
    }

    
    const dateInputRef1 = useRef(null);
    const dateInputRef2 = useRef(null);
    const handleFromDateIconClick = () => {
        if (dateInputRef1.current) {
            dateInputRef1.current.showPicker(); 
        }
    };

    const handleToDateIconClick = () => {
        if (dateInputRef2.current) {
            dateInputRef2.current.showPicker(); 
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#9966CC" size={50} />
            </div>
        );
    }


    if (error) {
    return <div>{error}</div>;
    }

   

  return (
    
    <div className={`${!isDarkMode ? 'border h-[400px] rounded-xl w-[98%] m-[auto]' : 'border-none'}`}>
        
        {/* testimony details modal */}
        <Modal
            open={openModal}
            onCancel={handleCloseModal}
            footer={handleModalFooterButton()}
            closable={true}
            closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-30px' }}>X</span>}
            styles={{
                content: {
                    backgroundColor: 'black',
                    width: '340px',
                    height: 'auto',
                    color: 'white',
                    margin: '0 auto',
                    borderRadius: '8px',
                },
                body: {
                    backgroundColor: '#1717171',
                    color: 'white',
                   
                },
            }}
        >
           {details ? (

                <div>
                    <div className='bg-[#313131] 
                    w-[116%] h-[50px] ml-[-24px] mt-[-22px] 
                    rounded-tl-xl rounded-tr-xl'>
                    </div>
                    <div className='w-[50px] h-[50px] m-[auto] z-[1000]'>
                        <img className='w-[50px] h-[50px] m-[auto] mt-[-25px]' src={modalpic} alt="" />
                    </div>
                    <div className='flex border rounded-2xl border-gray-100 items-center justify-between w-[110%] h-[70px] m-[auto] ml-[-15px] mt-[20px]'>
                        <div className='text-center ml-5 opacity-[0.6] border-r h-[50px] pr-3 font-sans'>
                            <p className='text-[10px]'>Name</p>
                            <p className='text-[9px]'>{details.uploaded_by.full_name || "N/A"}</p>
                        </div>
                        <div className='text-center ml-2 text-[12px] opacity-[0.6] w-[100%] h-[50px] m-[auto] border-r pr-3 font-sans'>
                            <p>Email</p>
                            <p className='ml-3 w-[130px]'>{details.uploaded_by.email || "N/A"}</p>
                        </div>
                        <div className='text-center text-[9px] opacity-[0.6] w-[100%] h-[45px] m-[auto] pr-4 font-sans'>
                            <p className='mb-1'>Status</p>
                            <p className={`w-[70px] ml-1.5 p-[2px] rounded ${
                            details.status === 'pending' ? 
                                'text-yellow-400 border border-yellow-500' :
                            details.status === 'Approved' ? 
                                'text-green-500 border border-green-500' : 
                                'text-red border border-red'
                            }`}>
                            {details.status}
                             </p>
                        </div>
                    </div>

                    <div className='mt-3 mb-7'>
                        <h3 className='text-white font-sans text-[11px]'>{details.title || "no title"}</h3>
                        <p className='text-[11px] text-white pt-2'>
                            {details.content.slice(0, 500) + "..."}
                        </p>
                    </div>    
                </div>
            ) : (
            <p>No details available</p>
            )}
        </Modal>
        {/* end of testimony details modal */}

        {/* reason for rejection modal */}
        <Modal
        open={rejectionReasonModal}
        onCancel={handleCloseModal}
        closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-30px' }}>X</span>}
        footer={RejectionModalFooterButton()}
        styles={{
            content: {
                backgroundColor: 'black',
                width: '340px',
                height: '420px',
                color: 'white',
                margin: '0 auto',
                borderRadius: '8px',
            },
            body: {
                backgroundColor: '#1717171',
                color: 'white',
               
            },
        }}
        >
        <div>
            <h3 className='text-white text-[18px] font-sans pb-2'>Reject Testimony</h3>
            <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] '/>
            <div className='h-[210px] mt-3'>
                <h3 className='text-[12px] opacity-[0.5]'>Reason for rejection</h3>

                <div className='mt-2'>
                    <textarea className='rounded-xl
                     bg-[#313131] w-[100%] 
                     h-[180px] indent-2 p-1 text-[12px]' placeholder='Type here...'
                     value={rejectionReason}
                     onChange={(e) => setRejectionReason(e.target.value)}/>
                </div>
            </div>
        </div>

        </Modal>

        {/* status alert modal */}
        <Modal
        open={statusAlert}
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
        }}
        >
        {isApproved ? 
        <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
            <div className='bg-[#9966CC] w-[50px] h-[50px] 
            rounded-full flex items-center justify-center'>
                <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
            </div>
            <div>
                <p className='text-[20px] text-center pt-3'>Testimony Approved Successfully!</p>
            </div>
        </div> :  
        <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
            <div className='bg-[#9966CC] w-[50px] h-[50px] 
                 rounded-full flex items-center justify-center'>
                <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
            </div>
            <div>
                <p className='text-[20px] text-center pt-3'>Testimony Rejected Successfully!</p>
            </div>
        </div> }

        </Modal>

        {/* filter modal */}
        <Modal
        open={filterModal}
        onCancel={handleCloseModal}
        footer={filterModalFooterButton}
        closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-15px' }}>X</span>}
        styles={{
            content: {
                backgroundColor: '#0B0B0B',
                width: '330px',
                height: 'auto',
                color: 'white',
                margin: '0 auto',
                borderRadius: '8px',
                marginLeft: '100%',
                marginTop: '50px'
            },
            body: {
                backgroundColor: '#1717171',
                color: 'white',
               
            },
        }}
        >

            <div>
                <h3 className='text-white text-[13px] font-sans pb-2 mt-[-10px]'>Filter</h3>
                <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] '/>

                <div>
                    {/* Date picker section */}
                    
                    <div className='flex items-center justify-between mb-[-15px] mt-2 w-[110%] ml-[-15px]'>
                        <h3 className='text-[14px]'>Date Range</h3>
                        <button 
                        onClick={() => {
                            setFilterDate1('')
                            setFilterDate2('')
                        }}
                        className='outline-none 
                        border-none p-1 text-[#9966CC] rounded'>Clear</button>
                    </div>

                    <div className='flex items-center justify-between mt-4 gap-2 ml-[-10px]'>
                        <div>
                            <p>From</p>
                            <div className='flex items-center rounded-xl w-[150px] p-1 bg-[#171717] mt-1 cursor-pointer'>
                                <CalendarOutlined onClick={handleFromDateIconClick} className="text-white ml-2" />
                                <input type="date"
                                ref={dateInputRef1}
                                placeholder='dd/mm/yyyy'
                                value={filterDate1}
                                onChange={handleFilterDate1}
                                className='no-icon border cursor-pointer'/>
                            </div>
                        </div>
                       
                        <div>
                            <p>To</p>
                            <div className='flex items-center rounded-xl w-[150px] p-1 bg-[#171717] mt-1 cursor-pointer'>
                                <CalendarOutlined onClick={handleToDateIconClick} className="text-white ml-2"/>
                                <input type="date"
                                ref={dateInputRef2}
                                placeholder='dd/mm/yyyy'
                                value={filterDate2}
                                onChange={handleFilterDate2}
                                className='no-icon border cursor-pointer'/>
                            </div>
                        </div>
                    </div>
                    <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] mt-3'/>

                    {/* category section */}
                    <div className='flex items-center justify-between mt-2 w-[110%] ml-[-15px]'>
                        <h3 className='text-[14px]'>Category</h3>
                        <button 
                        onClick={() => setSelectTestType('Select')}
                        className='outline-none 
                        border-none p-1 text-[#9966CC] rounded'>Clear</button>
                    </div>

                    <div onClick={() => setFilterDropDown(!filterDropDown)} 
                    className='flex items-center justify-center w-[110%] 
                    ml-[-15px] bg-[#171717] p-1 rounded-xl cursor-pointer'>
                       <p className=' text-white
                       font-sans p-1 w-[100%] rounded'>{selectTestType}</p>
                       {filterDropDown  ? <FaCaretUp/> : <FaCaretDown/>}
                    </div>

                    {filterDropDown ? 
                    <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[110%] ml-[-13px]'>
                        <div 
                            onClick={() => {
                                setSelectTestType('Healing')
                                setFilterDropDown(false)
                            }}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1'>
                            <input type='button' 
                            value='Healing'
                            onClick={() => {
                                setSelectTestType('Healing')
                                setFilterDropDown(false)
                            }} />
                        </div>
                        <div 
                            onClick={() => {
                                setSelectTestType('Deliverance')
                                setFilterDropDown(false)
                            }}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1 cursor-pointer'>
                            <input  type='button' 
                            value='Deliverance'
                            onClick={() => {
                                setSelectTestType('Deliverance')
                                setFilterDropDown(false)
                            }} />
                        </div>
                        <div
                            onClick={() => {
                                setSelectTestType('Faith')
                                setFilterDropDown(false)
                            }}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1'>
                            <input type='button' 
                            value='Faith'
                            onClick={() => {
                                setSelectTestType('Faith')
                                setFilterDropDown(false)
                            }} />
                        </div>
                        <div 
                            onClick={() => {
                                setSelectTestType('Salvation')
                                setFilterDropDown(false)
                            }}
                            className='w-[110%] ml-[-15px] pl-5 pb-1'>
                            <input type='button' 
                            value='Salvation' 
                            onClick={() => {
                                setSelectTestType('Salvation')
                                setFilterDropDown(false)
                            }}/>
                        </div>
                    </div>: ""}

                   {/* Approval status section */}
                    <div className='flex items-center justify-between mt-3'>
                        <h3 className='text-[14px]'>Approval Status</h3>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className="flex gap-6 ml-[10px] mt-5">
                            <div className="flex items-center cursor-pointer">
                                <div className={`w-[16px] h-[16px] rounded-full 
                                    border border-[#9966CC] mr-1
                                    ${ApprovalStatus === 'Pending' ? 
                                    'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                <input
                                type="radio"
                                id="pending"
                                name="status"
                                value="Pending"
                                checked={ApprovalStatus === 'Pending'}
                                onChange={handleChange}
                                className="hidden peer cursor-pointer"
                                />
                                <label
                                    className='cursor-pointer'
                                    htmlFor="pending"
                                    >
                                    Pending
                                </label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <div className={`w-[16px] h-[16px] rounded-full 
                                    border border-[#9966CC] mr-1 cursor-pointer
                                    ${ApprovalStatus === 'Approved' ? 
                                    'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                <input
                                type="radio"
                                id="approved"
                                name="status"
                                value="Approved"
                                checked={ApprovalStatus === 'Approved'}
                                onChange={handleChange}
                                className="hidden peer"
                                />
                                <label
                                className='cursor-pointer'
                                htmlFor="approved"
                                >
                                Approved
                                </label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <div className={`w-[16px] h-[16px] rounded-full 
                                    border border-[#9966CC] mr-1
                                    ${ApprovalStatus === 'Rejected' ? 
                                    'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                <input
                                type="radio"
                                id="rejected"
                                name="status"
                                value="Rejected"
                                checked={ApprovalStatus === 'Rejected'}
                                onChange={handleChange}
                                className="hidden peer"
                                />
                                <label
                                className='cursor-pointer'
                                htmlFor="rejected"
                                >
                                Rejected
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>

        {/* call to action modal */}
        <Modal
        open={actionModal}
        onCancel={handleCloseModal}
        footer={null}
        closeIcon={null}
        styles={{
            content: {
                backgroundColor: '#0B0B0B',
                width: '150px',
                height: '100px',
                color: 'white',
                margin: '0 auto',
                borderRadius: '8px',
                marginLeft: '130%',
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
                    <button onClick={() => {
                        handleDetail(controlDetail)
                        setActionModal(false)
                    }} className='pl-2'>View</button>
                </div>

                <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                    <button 
                    onClick={() => {
                        setActionModal(false);
                        handleTestimonyDelete(controlDetail);
                        showDeleteNotification(deleteStatus)
                    }} 
                    className='pl-2 pt-4 text-red'>
                       {loading ? <ClipLoader size={15} color="#ff0000" /> : 'Delete'}
                    </button>
                </div>
            </div>

        </Modal>

        {/* delete alert modal */}
        <Modal
        open={deleteAlert}
        onCancel={handleCloseModal}
        closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-30px' }}>X</span>}
        footer={handleDeleteAlertFooterButton()}
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
        {deleteStatus === 'Pending' ? 
        <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
            <div className='w-[80%] ml-[-45px]'>
                <p className='text-[15px] text-center pt-3'>Unable to delete Pending Testimonies!</p>
                <p className='text-[12px] opacity-[0.6] mt-5'>This Testimony is pending and cannot be deleted. 
                Please approve or reject it first then proceed with deletion</p>
            </div>
        </div> :  
        <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
            <div>
                <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                    Are you sure you want to delete this testimony? 
                    Once deleted the testimony will be removed from the system, This action cannot be undone
                </p>
            </div>
        </div> }

        </Modal>

        {/* on successful deletion modal */}
        <Modal
        open={deleteSuccessful}
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
        }}
        >
        <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
            <div className='bg-[#9966CC] w-[50px] h-[50px] 
            rounded-full flex items-center justify-center'>
                <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
            </div>
            <div>
                <p className='text-[20px] text-center pt-3'>Testimony Deleted Successfully!</p>
            </div>
        </div> 

        </Modal>
        
             
        <div className={`${isDarkMode ? 'w-[98%]' : 'w-[100%]'} h-[400px] m-[auto] bg-[#171717] rounded-xl
            ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
            <div className='flex items-center justify-between p-3'>
                <h3 className={`text-[13px]`}>Testimonies</h3>
                <div className='flex gap-2'>
                    <div className={`p-1 text-[12px] rounded-xl flex items-center gap-1
                        ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border border-slate-200"}`}>
                        <CiSearch size={20}/>
                        <input 
                        onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} type="search" 
                        placeholder='Search by name,category'
                        className='w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none' />
                    </div>
                    <div onClick={showFilterModal} className=' cursor-pointer flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'>
                        <IoFilterOutline />
                        <button 
                        onClick={showFilterModal}
                        className='text-[12px] outline-none border-none'>Filter</button>
                    </div>
                </div>
            </div>

            {/* table section begins here */}
            <div className='w-[100%] m-[auto] h-[250px]'>

                {/* Table Header Section */}
                <div className={`w-[100%] h-[50px] text-[14px] m-[auto] bg-[#313131] grid grid-cols-9 items-center justify-between
                    ${isDarkMode ? "text-white" : "bg-slate-100 text-black border-b border-b-slate-200"}`}>
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
                    <div className='p-2 flex items-center ml-[-20px]'>
                        Name
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('full_name')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('full_name')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center'>
                        Category
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('category')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('category')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center ml-2'>
                        Date
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('created_at')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('created_at')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center'>
                        Likes
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('likes')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('likes')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center ml-[-15px]'>
                        Comments
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('comments')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('comments')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center'>
                        Shares
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('shares')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('shares')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center'>
                        Status
                    </div>
                    <div className='p-2 flex items-center'>
                        Action
                    </div>
                </div>
                {/* end of table header section */}

                {/* Data Rows */}
                
                {testimonies.length > 0 ?
                <div>
                {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                    
                    <div
                    onClick={() => {
                        setControlDetail(item.id)
                        setDeleteStatus(item.status)
                    }}
                    key={item.id}
                    className={`text-[13px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-9
                        ${isDarkMode ? "text-white border-b border-b-slate-200" : "bg-white text-black border-b border-b-slate-200"}`}
                    >
                        <div onClick={()=>handleDetail(item.id)} className='ml-[15px] mt-4'>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                        <div className='ml-[-15px] text-[12px] w-[200px] mt-4'>{item.uploaded_by.full_name || 'N/A'}</div>
                        <div className='ml-[15px] mt-4'>{item.category}</div>
                        <div className='ml-[10px] mt-4'>{formatDate(item.uploaded_by.created_at)}</div>
                        <div className='ml-[20px] mt-4'>{item?.likes || 0}</div>
                        <div className='ml-[20px] mt-4'>{item?.comment || 0}</div>
                        <div className='ml-[20px] mt-4'>{item?.shares || 0}</div>
                        <div className={`ml-[-5px] mt-3 w-[90%]  m-[auto] text-center rounded-xl p-1 ${item.status === 'Rejected' ? 
                        'text-red border border-red' : item.status === 'pending' ? 
                        'text-yellow-400 border border-yellow-500' : 'text-green-700 border border-green-700'}`}>
                            {item.status}
                        </div>
                        <div  onClick={() => {
                            setActionModal(true)
                        }} className='ml-[30px] mt-4 cursor-pointer'><IoIosMore />

                        </div>
                    </div>
                ))}
                </div>: 
                <div className='flex items-center justify-center mt-24'>
                    <p>No Testimony available</p>
                </div>}
                {/* end of Data row */}

            </div>
            {/* table section ends here */}

            {/* Pagination */}
            <div className='flex justify-between items-center mt-10'>
                <div className={`text-[12px] ml-[10px]
                ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, testimonies.length)} of {testimonies.length}
                </div>
                <div className='text-[13px] mr-5 flex items-center gap-3'>
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`w-[90px] p-2 rounded-xl ${currentPage === 1 ? 
                        'opacity-[0.5] text-gray-500 border border-gray-500' : 
                        "border border-[#9966CC] text-[#9966CC]"}`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`w-[90px] p-2 rounded-xl ${currentPage === totalPages ? 
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

export default TestimonyText