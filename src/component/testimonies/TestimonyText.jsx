import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { CheckOutlined } from "@ant-design/icons";
import { CalendarOutlined } from '@ant-design/icons';
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io';
import { Modal } from 'antd';
import modalpic from '../../assets/images/modalPic.png';
import { DarkModeContext } from '../../context/DarkModeContext';
import { ClipLoader } from "react-spinners";
import axios from 'axios';
import LoadingState from '../LoadingState';

const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

function TestimonyText() {
    const { isDarkMode } = useContext(DarkModeContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState(null);
    const [details, setDetails] = useState('');
    const [getStatus, setGetStatus] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [rejectionReasonModal, setRejectionReasonModal] = useState(false);
    const [statusAlert, setStatusAlert] = useState(false);
    const [isApproved, setIsApproved] = useState(null);
    const [filterModal, setFilterModal] = useState(false);
    const [ApprovalStatus, setApprovalStatus] = useState('');
    const [filterDropDown, setFilterDropDown] = useState(false);
    const [selectTestType, setSelectTestType] = useState('Select');
    const [filterDate1, setFilterDate1] = useState('');
    const [filterDate2, setFilterDate2] = useState('');
    const [actionModal, setActionModal] = useState(false);
    const [controlDetail, setControlDetail] = useState(false);
    const [getFilteredData, setGetFilterData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [deleteSuccessful, setDeleteSuccessful] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonies = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("You are not logged in. Please log in to access testimonies.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    "https://itestify-backend-38u1.onrender.com/testimonies/texts/",
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

                setTestimonies(testimoniesWithDefaults || []);
            } catch (error) {
                console.error("Failed to fetch testimonies:", error.response ? error.response.data : error.message);
                setError("Failed to fetch testimonies. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonies();
    }, []);

    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil((getFilteredData.length > 0 ? getFilteredData : testimonies).length / itemsPerPage);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const searchedData = useMemo(() => {
        if ((selectTestType !== 'Select' || filterDate1 || filterDate2 || ApprovalStatus) && getFilteredData?.length === 0) {
            return [];
        }

        if (getFilteredData?.length > 0) {
            const dataToSearch = getFilteredData;
            if (searchQuery.trim() !== "") {
                return dataToSearch.filter(item => 
                    item.full_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.category?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.status?.toLowerCase()?.includes(searchQuery.toLowerCase())
                );
            }
            return dataToSearch;
        }

        if (testimonies?.length > 0) {
            if (searchQuery.trim() !== "") {
                return testimonies.filter(item => 
                    item.full_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.category?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.status?.toLowerCase()?.includes(searchQuery.toLowerCase())
                );
            }
            return testimonies;
        }

        return [];
    }, [getFilteredData, testimonies, searchQuery, selectTestType, filterDate1, filterDate2, ApprovalStatus]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return searchedData;

        return [...searchedData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [searchedData, sortConfig]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    async function handleDetail(id) {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }

            const response = await axios.get(
                `https://itestify-backend-38u1.onrender.com/testimonies/texts/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                const testimonyDetails = response?.data?.data;

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

    const handleCloseModal = () => {
        setOpenModal(false);
        setRejectionReasonModal(false);
        setStatusAlert(false);
        setFilterModal(false);
        setActionModal(false);
        setDeleteAlert(false);
        setDeleteSuccessful(false);
    };

    function handleModalFooterButton() {
        if (getStatus === 'pending') {
            return [
                <button
                    key="reject"
                    onClick={() => {
                        setRejectionReason('');
                        handleRejectionReason();
                    }}
                    className='text-[12px] border border-red-600 text-red p-1 w-[100px] rounded'
                >
                    Reject Testimony
                </button>,
                <button
                    key="approve"
                    onClick={async () => {
                        const success = await handleTestimonyStatus(controlDetail, "approve");
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
                `https://itestify-backend-38u1.onrender.com/text-testimonies/${id}/review/`,
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
            return false;
        }
    }

    function handleRejectionReason() {
        setRejectionReasonModal(true);
        setOpenModal(false);
    }

    function RejectionModalFooterButton() {
        return [
            <button 
                onClick={handleCloseModal}
                className='border border-[#9966CC] p-1 w-[80px] text-[#9966CC] rounded mr-4'
            >
                Cancel
            </button>,
            <button 
                key='Rejected' 
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
                className='bg-[#9966CC] p-1 w-[80px] text-[#FFFFFF] rounded'
            >
                Confirm
            </button>
        ];
    }

    function showStatusAlert() {
        setStatusAlert(true);
        setOpenModal(false);
        setRejectionReasonModal(false);
        setRejectionReason('');

        const alertTimer = setTimeout(() => {
            handleCloseModal();
        }, 2000);

        return () => {
            clearTimeout(alertTimer);
        };
    }

    function showFilterModal() {
        setFilterModal(true);
    }

    function filterModalFooterButton() {
        return [
            <div className='mt-[50px]'>
                <button 
                    onClick={handleReset}
                    className='border border-[#9966CC] outline-none p-1 rounded w-[100px] text-[#9966CC]'
                >
                    Clear All
                </button>
                <button
                    onClick={handleFiltering}
                    className='bg-[#9966CC] ml-2 border-none outline-none rounded p-1 w-[100px]'
                >
                    Apply
                </button>
            </div>
        ];
    }

    const handleChange = (event) => {
        setApprovalStatus(event.target.value);
    };

    function handleFilterDate1(event) {
        setFilterDate1(event.target.value);
    }

    function handleFilterDate2(event) {
        setFilterDate2(event.target.value);
    }

    function handleFiltering() {
        if (selectTestType === 'Select' && !filterDate1 && !filterDate2 && !ApprovalStatus) {
            setGetFilterData([]);
            setFilterModal(false);
            setCurrentPage(1);
            return;
        }

        const filteredData = testimonies.filter((item) => {
            const itemDate = new Date(item.created_at);
            const startDate = filterDate1 ? new Date(filterDate1) : null;
            const endDate = filterDate2 ? new Date(filterDate2) : null;

            const isWithinDateRange =
                (!startDate || itemDate >= startDate) &&
                (!endDate || itemDate <= new Date(endDate.setHours(23, 59, 59, 999)));

            const matchesCategory = selectTestType === 'Select' || item.category === selectTestType;
            const matchesStatus = !ApprovalStatus || item.status === ApprovalStatus;

            return isWithinDateRange && matchesCategory && matchesStatus;
        });

        if ((selectTestType !== 'Select' || filterDate1 || filterDate2 || ApprovalStatus) && filteredData.length === 0) {
            setGetFilterData([]);
        } else {
            setGetFilterData(filteredData.length > 0 ? filteredData : []);
        }
        
        setFilterModal(false);
        setCurrentPage(1);
    }

    function handleReset() {
        setSelectTestType('Select');
        setApprovalStatus('');
        setFilterDate1('');
        setFilterDate2('');
        setGetFilterData([]);
        setCurrentPage(1);
    }

    function showDeleteNotification() {
        setDeleteAlert(true);
    }

    function handleDeleteAlertFooterButton() {
        return [
            deleteStatus === 'pending' ? 
                <button 
                    onClick={() => setDeleteAlert(false)}
                    className='mr-[110px] mt-3 bg-[#9966CC] border-none outline-none rounded w-[80px] p-1'
                >
                    Okay
                </button> :
                <div className='w-[335px] ml-[-15px] pr-3'>
                    <button 
                        onClick={handleCloseModal}
                        className='border border-[#9966CC] outline-none text-[#9966CC] w-[100px] p-1 rounded ml-[-20px] mr-2'
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            handleTestimonyDelete(controlDetail);
                            deleteSuccessFulModal();
                        }}
                        className='border-none outline-none bg-red w-[100px] rounded p-1 mr-2 pl-3'
                    >
                        Yes delete
                    </button>
                </div> 
        ];
    }

    function deleteSuccessFulModal() {
        setDeleteSuccessful(true);
        setDeleteAlert(false);
        const alertTimer = setTimeout(() => {
            handleCloseModal();
        }, 2000);

        return () => {
            clearTimeout(alertTimer);
        };
    }

    async function handleTestimonyDelete(id) {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            await axios.delete(
                `https://itestify-backend-38u1.onrender.com/testimonies/texts/${id}/`,
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
            <div className="w-[70%] m-auto">
                <LoadingState/>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={`${!isDarkMode ? 'border h-[400px] rounded-xl w-[98%] m-[auto]' : 'border-none'}`}>
            {/* Testimony Details Modal */}
            <Modal
                open={openModal}
                onCancel={handleCloseModal}
                footer={handleModalFooterButton()}
                closable={true}
                closeIcon={<span style={{ color: `${isDarkMode ? '#fff' : 'black'}`, fontSize: '12px', marginTop: '-30px' }}>X</span>}
                styles={{
                    content: {
                        backgroundColor: `${isDarkMode ? 'black' : 'white'}`,
                        width: '340px',
                        height: 'auto',
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                        margin: '0 auto',
                        borderRadius: '8px',
                        marginLeft: '200px'
                    },
                    body: {
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                    },
                }}
            >
                {details ? (
                    <div>
                        <div className={`w-[116%] h-[50px] ml-[-24px] mt-[-22px] rounded-tl-xl rounded-tr-xl ${isDarkMode ? 'bg-[#313131]' : 'bg-gray-200'}`}></div>
                        <div className='w-[50px] h-[50px] m-[auto] z-[1000]'>
                            <img className='w-[50px] h-[50px] m-[auto] mt-[-25px]' src={modalpic} alt="" />
                        </div>
                        <div className={`flex w-[110%] border-2 rounded-2xl border-gray-200 items-center justify-between h-[70px] m-[auto] ml-[-15px] mt-[20px]`}>
                            <div className='text-center  w-[33.33%] ml-5 opacity-[0.9] border-r h-[50px] pr-3 font-sans'>
                                <p className='text-[10px]'>Name</p>
                                <p className='text-[9px] font-extrabold'>{details?.uploaded_by.full_name || "N/A"}</p>
                            </div>
                            <div className='text-center ml-2 w-[33.33%] text-[12px] opacity-[0.9] h-[50px] m-[auto] border-r pr-3 font-sans'>
                                <p>Email</p>
                                <p className='font-extrabold'>{details.uploaded_by.email || "N/A"}</p>
                            </div>
                            <div className='text-center w-[33.33%] text-[9px] opacity-[0.9] h-[45px] m-[auto] pr-4 font-sans'>
                                <p className='mb-1'>Status</p>
                                <p className={`w-[100%] ml-[8px] m-auto p-[2px] rounded ${
                                    details.status === 'pending' ? 
                                        'text-yellow-400 border border-yellow-500' :
                                    details.status === 'approved' ? 
                                        'text-green-500 border border-green-500' : 
                                        'text-red border border-red'
                                }`}>
                                    {details.status}
                                </p>
                            </div>
                        </div>

                        <div className='mt-3 mb-7'>
                            <h3 className={`font-sans font-extrabold text-[11px] ${isDarkMode && 'text-white'}`}>{details.title || "no title"}</h3>
                            <p className={`text-[11px] pt-2 font-extrabold ${isDarkMode && 'text-white'}`}>
                                {details?.content?.slice(0, 500) + "..."}
                            </p>
                        </div>    
                    </div>
                ) : (
                    <p>No details available</p>
                )}
            </Modal>

            {/* Rejection Reason Modal */}
            <Modal
                open={rejectionReasonModal}
                onCancel={handleCloseModal}
                closeIcon={<span style={{ color: `${isDarkMode ? 'white' : 'black'}`, fontSize: '12px', marginTop: '-30px' }}>X</span>}
                footer={RejectionModalFooterButton()}
                styles={{
                    content: {
                        backgroundColor: `${isDarkMode ? 'black' : 'white'}`,
                        width: '340px',
                        height: '420px',
                        color: `${isDarkMode ? 'white' : 'black'}`,
                        margin: '0 auto',
                        borderRadius: '8px',
                    },
                    body: {
                        color: `${isDarkMode ? 'white' : 'black'}`,
                    },
                }}
            >
                <div>
                    <h3 className={`text-[18px] font-sans pb-2${isDarkMode && 'text-white'}`}>Reject Testimony</h3>
                    <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] '/>
                    <div className='h-[210px] mt-3'>
                        <h3 className='text-[12px] opacity-[0.5]'>Reason for rejection</h3>
                        <div className='mt-2'>
                            <textarea 
                                className={`rounded-xl w-[100%] h-[180px] indent-2 p-1 text-[12px] ${isDarkMode ? 'bg-[#313131]' : 'bg-white border border-[#9966CC]'}`} 
                                placeholder='Type here...'
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Status Alert Modal */}
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
                        <div className='bg-[#9966CC] w-[50px] h-[50px] rounded-full flex items-center justify-center'>
                            <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                        </div>
                        <div>
                            <p className='text-[20px] text-center pt-3'>Testimony Approved Successfully!</p>
                        </div>
                    </div> :  
                    <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
                        <div className='bg-[#9966CC] w-[50px] h-[50px] rounded-full flex items-center justify-center'>
                            <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                        </div>
                        <div>
                            <p className='text-[20px] text-center pt-3'>Testimony Rejected Successfully!</p>
                        </div>
                    </div> 
                }
            </Modal>

            {/* Filter Modal */}
            <Modal
                open={filterModal}
                onCancel={handleCloseModal}
                footer={filterModalFooterButton}
                closeIcon={<span style={{ color: `${isDarkMode ? '#fff' : 'black'}`, fontSize: '12px', marginTop: '-15px' }}>X</span>}
                styles={{
                    content: {
                        backgroundColor: `${isDarkMode ? '#0B0B0B' : '#fff'}`,
                        width: '330px',
                        height: 'auto',
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                        margin: '0 auto',
                        borderRadius: '8px',
                        marginLeft: '100%',
                        marginTop: '50px'
                    },
                    body: {
                        color: `${isDarkMode ? '#fff' : 'black'}`
                    },
                }}
            >
                <div>
                    <h3 className={`text-[13px] font-sans pb-2 mt-[-10px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Filter</h3>
                    <hr className={`w-[117%] ml-[-25px] ${isDarkMode ? 'text-gray-300 opacity-[0.2]' : 'text-black'} `}/>

                    <div>
                        {/* Date Range Section */}
                        <div className='flex items-center justify-between mb-[-15px] mt-2 w-[110%] ml-[-15px]'>
                            <h3 className={`text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Date Range</h3>
                            <button 
                                onClick={() => {
                                    setFilterDate1('');
                                    setFilterDate2('');
                                }}
                                className='outline-none border-none p-1 text-[#9966CC] rounded'
                            >
                                Clear
                            </button>
                        </div>

                        <div className='flex items-center justify-between mt-4 gap-2 ml-[-10px]'>
                            <div>
                                <p>From</p>
                                <div className={`flex items-center rounded-xl w-[150px] p-1 mt-1 cursor-pointer 
                                    ${isDarkMode ? 'bg-[#171717]' : 'border border-[#9966CC]'}`}>
                                    <CalendarOutlined 
                                        onClick={handleFromDateIconClick} 
                                        className={`${isDarkMode ? 'text-white ml-2' : 'text-black ml-2'}`} 
                                    />
                                    <input 
                                        type="date"
                                        ref={dateInputRef1}
                                        placeholder={`dd/mm/yyyy`}
                                        value={filterDate1}
                                        onChange={handleFilterDate1}
                                        className='no-icon border cursor-pointer'
                                    />
                                </div>
                            </div>
                           
                            <div>
                                <p>To</p>
                                <div className={`flex items-center rounded-xl w-[150px] p-1 mt-1 cursor-pointer 
                                    ${isDarkMode ? 'bg-[#171717]' : 'border border-[#9966CC]'}`}>
                                    <CalendarOutlined 
                                        onClick={handleToDateIconClick} 
                                        className={`${isDarkMode ? 'text-white ml-2' : 'text-black ml-2'}`}
                                    />
                                    <input 
                                        type="date"
                                        ref={dateInputRef2}
                                        placeholder='dd/mm/yyyy'
                                        value={filterDate2}
                                        onChange={handleFilterDate2}
                                        className='no-icon border cursor-pointer'
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className={`w-[117%] ml-[-25px] mt-[15px] ${isDarkMode ? 'text-gray-300 opacity-[0.2]' : 'text-black'} `}/>

                        {/* Category Section */}
                        <div className='flex items-center justify-between mt-2 w-[110%] ml-[-15px]'>
                            <h3 className='text-[14px]'>Category</h3>
                            <button 
                                onClick={() => setSelectTestType('Select')}
                                className='outline-none border-none p-1 text-[#9966CC] rounded'
                            >
                                Clear
                            </button>
                        </div>

                        <div 
                            onClick={() => setFilterDropDown(!filterDropDown)} 
                            className={`flex items-center justify-center w-[110%] ml-[-15px] p-1 rounded-xl cursor-pointer ${isDarkMode ? 'bg-[#171717]' : 'bg-white border border-[#9966CC]'}`}
                        >
                            <p className={`font-sans p-1 w-[100%] rounded ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectTestType}</p>
                            {filterDropDown ? <FaCaretUp/> : <FaCaretDown/>}
                        </div>

                        {filterDropDown && 
                            <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[110%] ml-[-13px]'>
                                <div 
                                    onClick={() => {
                                        setSelectTestType('Healing');
                                        setFilterDropDown(false);
                                    }}
                                    className='w-[110%] ml-[-15px] border-b pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Healing'
                                        onClick={() => {
                                            setSelectTestType('Healing');
                                            setFilterDropDown(false);
                                        }} 
                                    />
                                </div>
                                <div 
                                    onClick={() => {
                                        setSelectTestType('Deliverance');
                                        setFilterDropDown(false);
                                    }}
                                    className='w-[110%] ml-[-15px] border-b pl-5 pb-1 cursor-pointer'
                                >
                                    <input  
                                        type='button' 
                                        value='Deliverance'
                                        onClick={() => {
                                            setSelectTestType('Deliverance');
                                            setFilterDropDown(false);
                                        }} 
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        setSelectTestType('Faith');
                                        setFilterDropDown(false);
                                    }}
                                    className='w-[110%] ml-[-15px] border-b pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Faith'
                                        onClick={() => {
                                            setSelectTestType('Faith');
                                            setFilterDropDown(false);
                                        }} 
                                    />
                                </div>
                                <div 
                                    onClick={() => {
                                        setSelectTestType('Salvation');
                                        setFilterDropDown(false);
                                    }}
                                    className='w-[110%] ml-[-15px] pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Salvation' 
                                        onClick={() => {
                                            setSelectTestType('Salvation');
                                            setFilterDropDown(false);
                                        }}
                                    />
                                </div>

                                <div 
                                    onClick={() => {
                                        setSelectTestType('Finance');
                                        setFilterDropDown(false);
                                    }}
                                    className='w-[110%] ml-[-15px] pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Finance' 
                                        onClick={() => {
                                            setSelectTestType('Finance');
                                            setFilterDropDown(false);
                                        }}
                                    />
                                </div>
                                <div 
                                    onClick={() => {
                                        setSelectTestType('Career');
                                        setFilterDropDown(false);
                                    }}
                                    className='w-[110%] ml-[-15px] pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Career' 
                                        onClick={() => {
                                            setSelectTestType('Career');
                                            setFilterDropDown(false);
                                        }}
                                    />
                                </div>
                                <div 
                                    onClick={() => {
                                        setSelectTestType('Marriage Restoration');
                                        setFilterDropDown(false);
                                    }}
                                    className='w-[110%] ml-[-15px] pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Marriage Restoration' 
                                        onClick={() => {
                                            setSelectTestType('Marriage Restoration');
                                            setFilterDropDown(false);
                                        }}
                                    />
                                </div>
                            </div>
                        }

                        {/* Approval Status Section */}
                        <div className='flex items-center justify-between mt-3'>
                            <h3 className='text-[14px]'>Approval Status</h3>
                        </div>

                        <div className='flex items-center gap-5'>
                            <div className="flex gap-6 ml-[10px] mt-5">
                                <div className="flex items-center cursor-pointer">
                                    <div className={`w-[16px] h-[16px] rounded-full border border-[#9966CC] mr-1
                                        ${ApprovalStatus === 'pending' ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                                    </div>
                                    <input
                                        type="radio"
                                        id="pending"
                                        name="status"
                                        value="pending"
                                        checked={ApprovalStatus === 'pending'}
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
                                    <div className={`w-[16px] h-[16px] rounded-full border border-[#9966CC] mr-1 cursor-pointer
                                        ${ApprovalStatus === 'approved' ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                                    </div>
                                    <input
                                        type="radio"
                                        id="approved"
                                        name="status"
                                        value="approved"
                                        checked={ApprovalStatus === 'approved'}
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
                                    <div className={`w-[16px] h-[16px] rounded-full border border-[#9966CC] mr-1
                                        ${ApprovalStatus === 'Rejected' ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                                    </div>
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

            {/* Action Modal */}
            <Modal
                open={actionModal}
                onCancel={handleCloseModal}
                footer={null}
                closeIcon={null}
                styles={{
                    content: {
                        backgroundColor: `${isDarkMode ? '#0B0B0B' : '#fff'}`,
                        width: '170px',
                        height: '100px',
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                        margin: '0 auto',
                        borderRadius: '8px',
                        marginLeft: '125%',
                        marginTop: '140px'
                    },
                    body: {
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                    },
                }}
            >
                <div className='flex flex-col'>
                    <div className='border-b-2 w-[140%] ml-[-25px] pb-2 opacity-[0.9]'>
                        <button 
                            onClick={() => {
                                handleDetail(controlDetail);
                                setActionModal(false);
                            }} 
                            className='pl-2 font-extrabold'
                        >
                            View
                        </button>
                    </div>

                    <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.9] cursor-pointer'>
                        <button 
                            onClick={() => {
                                setActionModal(false);
                                showDeleteNotification();
                            }} 
                            className='pl-2 pt-4 text-red font-extrabold'
                        >
                            {loading ? <ClipLoader size={15} color="#ff0000" /> : 'Delete'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Alert Modal */}
            <Modal
                open={deleteAlert}
                onCancel={handleCloseModal}
                closeIcon={<span style={{ color: `${isDarkMode ? '#fff' : 'black'}`, fontSize: '12px', marginTop: '-30px' }}>X</span>}
                footer={handleDeleteAlertFooterButton()}
                styles={{
                    content: {
                        backgroundColor: `${isDarkMode ? 'black' : 'white'}`,
                        width: '350px',
                        height: '200px',
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                        margin: '0 auto',
                        borderRadius: '8px',
                        marginTop: '50px'
                    },
                    body: {
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                    },
                }}
            >
                {deleteStatus === 'pending' ? 
                    <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
                        <div className='w-[80%] ml-[-45px]'>
                            <p className='text-[15px] text-center pt-3'>Unable to delete Pending Testimonies!</p>
                            <p className='text-[12px] opacity-[0.6] mt-5'>
                                This Testimony is pending and cannot be deleted. 
                                Please approve or reject it first then proceed with deletion
                            </p>
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
                    </div> 
                }
            </Modal>

            {/* Delete Successful Modal */}
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
                    <div className='bg-[#9966CC] w-[50px] h-[50px] rounded-full flex items-center justify-center'>
                        <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                    </div>
                    <div>
                        <p className='text-[20px] text-center pt-3'>Testimony Deleted Successfully!</p>
                    </div>
                </div> 
            </Modal>
            
            {/* Main Content */}
            <div className={`${isDarkMode ? 'w-[98%]' : 'w-[100%]'} h-[430px] m-[auto] bg-[#171717] rounded-xl
                ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
                <div className='flex items-center justify-between p-3'>
                    <h3 className={`text-[13px]`}>Testimonies</h3>
                    <div className='flex gap-2'>
                        <div className={`p-1 text-[12px] rounded-xl flex items-center gap-1
                            ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border border-slate-200"}`}>
                            <CiSearch size={20}/>
                            <input 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                value={searchQuery} 
                                type="search" 
                                placeholder='Search by name,category'
                                className='w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none' 
                            />
                        </div>
                        <div 
                            onClick={showFilterModal} 
                            className='cursor-pointer flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'
                        >
                            <IoFilterOutline />
                            <button className='text-[12px] outline-none border-none'>Filter</button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className='w-[100%] m-[auto] h-[auto]'>
                    {/* Table Header */}
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

                    {/* Data Rows */}
                    {loading ? (
                        <LoadingState />
                    ) : sortedData?.length > 0 ? (
                        sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                            <div
                                key={item.id}
                                className={`text-[13px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-9
                                ${isDarkMode ? "text-white border-b border-b-slate-200" : "bg-white text-black border-b border-b-slate-200"}`}
                            >
                                <div 
                                    onClick={() => handleDetail(item.id)} 
                                    className='ml-[15px] mt-4'
                                >
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </div>
                                <div 
                                    className='ml-[-15px] text-[12px] w-[200px] mt-4'
                                >
                                    {item.uploaded_by?.full_name || 'N/A'}
                                </div>
                                <div className='ml-[15px] mt-4'>{item.category}</div>
                                <div className='ml-[10px] mt-4'>{formatDate(item.uploaded_by?.created_at)}</div>
                                <div className='ml-[20px] mt-4'>{item?.likes || 0}</div>
                                <div className='ml-[20px] mt-4'>{item?.comment || 0}</div>
                                <div className='ml-[20px] mt-4'>{item?.shares || 0}</div>
                                <div 
                                    className={`ml-[-5px] mt-3 w-[90%] m-[auto] text-center rounded-xl p-1 
                                    ${item.status === 'Rejected' ? 
                                        'text-red border border-red' : 
                                        item.status === 'pending' ? 
                                        'text-yellow-400 border border-yellow-500' : 
                                        'text-green-700 border border-green-700'}`}
                                >
                                    {item.status}
                                </div>
                                <div 
                                    onClick={() => {
                                        setControlDetail(item.id);
                                        setActionModal(true);
                                    }} 
                                    className='ml-[30px] mt-4 cursor-pointer'
                                >
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
                </div>

                {/* Pagination */}
                <div className='flex justify-between items-center mt-10'>
                    <div className={`text-[12px] ml-[10px]
                    ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, (getFilteredData.length > 0 ? getFilteredData : testimonies).length)} of {(getFilteredData.length > 0 ? getFilteredData : testimonies).length}
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
            </div>
        </div>
    );
}

export default TestimonyText