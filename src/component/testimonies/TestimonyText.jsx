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
    const [operationLoading, setOperationLoading] = useState(false);

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
                    "https://itestify-backend-38u1.onrender.com/text-testimonies/",
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
                    item.uploaded_by?.full_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.category?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                    item.status?.toLowerCase()?.includes(searchQuery.toLowerCase())
                );
            }
            return testimonies;
        }

        return [];
    }, [getFilteredData, testimonies, searchQuery]);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page on search
    }, [searchQuery]);

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

    async function handleDetail(id, openModal = true) {
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
                setGetStatus(testimonyDetails.status);
                setDeleteStatus(testimonyDetails.status);
                setActionModal(false);

                if(openModal){
                    setOpenModal(true);
                }
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
        if (getStatus.toLowerCase() === 'pending') {
            return [
                <button
                    key="reject"
                    onClick={() => {
                        setRejectionReason('');
                        handleRejectionReason();
                    }}
                    className='text-[12px] border border-red-600 text-red p-1 w-[120px] rounded 
                    hover:text-[13px] hover:w-[130px] transition-all duration-200'
                >
                    Reject Testimony
                </button>,
                <button
                    key="approve"
                    onClick={async () => {
                        setOperationLoading(true);
                        const success = await handleTestimonyStatus(controlDetail, "approve");
                        setOperationLoading(false);
                        if (success) {
                            setIsApproved(true);
                            showStatusAlert();
                        }
                    }}
                    className='text-[12px] text-white bg-[#9966CC] p-1 w-[120px] rounded ml-2
                     hover:text-[13px] hover:w-[130px] transition-all duration-200'
                >
                    {operationLoading ? 
                    <div className='flex items-center gap-2'>
                        <ClipLoader size={14} color="#ffffff" /> 
                        <span className='text-[12px] p-1'>Approving...</span>
                    </div>
                     : 'Approve Testimony'}
                </button>
            ];
        } else if (getStatus.toLowerCase() === 'rejected') {
            return [
                <div key="reason" className='text-left'>
                    <h3 className='text-[13px]'>Reason For Rejection</h3>
                    <p className='text-[11px] opacity-[0.7]'>{details?.rejection_reason || 'No reason provided'}</p>
                </div> 
            ];
        }
        return null;
    }

    async function handleTestimonyStatus(id, newStatus, reason = '') {
        const token = localStorage.getItem('token');
        try {
            const payload = { action: newStatus };
            if (newStatus.toLowerCase() === 'reject') {
                payload.rejection_reason = reason;
            }

            const response = await axios.post(
                `https://itestify-backend-38u1.onrender.com/testimonies/texts/${id}/review/`,
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
                            ? { 
                                ...testimony, 
                                status: newStatus.toLowerCase() === 'approve' ? 'approved' : 'rejected',
                                rejection_reason: reason || testimony.rejection_reason
                            } 
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
                className='border border-[#9966CC] p-1 w-[80px] text-[#9966CC] rounded mr-4
                 hover:text-[15px] hover:w-[90px] transition-all duration-200'
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
                    setOperationLoading(true);
                    const success = await handleTestimonyStatus(controlDetail, "reject", rejectionReason);
                    setOperationLoading(false);
                    if (success) {
                        setIsApproved(false);
                        showStatusAlert();
                    }
                }}
                className='bg-[#9966CC] p-1 w-[80px] text-[#FFFFFF] rounded
                hover:text-[15px] hover:w-[90px] transition-all duration-200'
            >
                {operationLoading ? 
                <div className='flex items-center gap-2'>
                    <span className='text-[12px] p-1'>Rejecting...</span>
                </div>
                
                : 'Confirm'}
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
        const selectedTestimony = testimonies.find(item => item.id === controlDetail);
        if (selectedTestimony?.status === 'pending') {
            setDeleteStatus('pending');
        } else {
            setDeleteStatus('confirm');
        }
        setDeleteAlert(true);
    }

    function handleDeleteAlertFooterButton() {
        return [
            getStatus.toLowerCase() === 'pending' ? 
                <button 
                    onClick={() => setDeleteAlert(false)}
                    className='mr-[110px] mt-3 bg-[#9966CC] border-none outline-none rounded w-[80px] p-1
                    hover:text-[15px] hover:w-[90px] transition-all duration-200'
                >
                    Okay
                </button> :
                <div className='w-[335px] ml-[-15px] pr-3'>
                    <button 
                        onClick={handleCloseModal}
                        className='border border-[#9966CC] outline-none text-[#9966CC] w-[100px] p-1 rounded ml-[-20px] mr-2
                        hover:text-[15px] hover:w-[110px] transition-all duration-200'
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={async () => {
                            setOperationLoading(true);
                            await handleTestimonyDelete(controlDetail);
                            setOperationLoading(false);
                            deleteSuccessFulModal();
                        }}
                        className='border-none hover:p-2 outline-none bg-red w-[100px] rounded p-1 mr-2 pl-3
                        hover:text-[13px] hover:w-[110px] transition-all duration-200'
                    >
                        {operationLoading ? 
                        <div className='flex items-center gap-2'>
                            <ClipLoader size={14} color="#ffffff" />
                            <span className='text-[12px] p-1'>Deleting...</span>
                        </div>
                         : 'Yes delete'}
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
            await axios.delete(
                `https://itestify-backend-38u1.onrender.com/testimonies/texts/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setTestimonies(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
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

    
    return (
        <div className={`${!isDarkMode ? 'border h-[400px] rounded-xl w-[98%] m-[auto]' : 'border-none'}`}>
            {/* Testimony Details Modal */}
            {openModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleCloseModal}
                >
                    <div
                    className={`relative rounded-lg overflow-hidden ${
                        isDarkMode ? 'bg-[#0B0B0B] text-white' : 'bg-white text-black'
                    }`}
                    style={{
                        width: '400px',
                        height: '420px',
                        marginLeft: '200px',
                        border:'2px solid grey',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onClick={(e) => e.stopPropagation()}
                    >
                    {/* Fixed Header */}
                    <div
                        className={`w-full h-[80px] flex items-center justify-center relative ${
                        isDarkMode ? 'bg-[#313131]' : 'bg-gray-200'
                        }`}
                        style={{
                        position: 'sticky',
                        top: 0,
                        flexShrink: 0,
                        zIndex: 10,
                        }}
                    >
                        {/* Image inside header */}
                        <img
                        src={modalpic}
                        alt="Modal Pic"
                        className="w-[50px] h-[50px] rounded-full absolute top-20 transform -translate-y-1/2"
                        />

                        {/* Close Button */}
                        <button
                        onClick={handleCloseModal}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                        }}
                        >
                        X
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-4 overflow-y-auto no-scrollbar" style={{ flex: 1 }}>
                        {details ? (
                        <div>
                            <div className="rounded-3xl px-5 py-4 border border-gray-600 w-full mt-5">
                            <div className="mb-2">
                                <h3>Name</h3>
                                <p>{details?.uploaded_by.full_name || 'N/A'}</p>
                            </div>
                            <div className="mb-2">
                                <h3>Email</h3>
                                <p>{details.uploaded_by.email || 'N/A'}</p>
                            </div>
                            <div className="flex items-center gap-3 text-[12px] h-[45px] font-sans">
                                <p className="mb-1">Status</p>
                                <p
                                className={`w-[100px] text-center p-[3px] rounded ${
                                    details.status.toLowerCase() === 'pending'
                                    ? 'text-yellow-400 border border-yellow-500'
                                    : details.status.toLowerCase() === 'approved'
                                    ? 'text-green-500 border border-green-500'
                                    : 'text-red-500 border border-red-500'
                                }`}
                                >
                                {details.status.charAt(0) + details.status.slice(1).toLowerCase()}
                                </p>
                            </div>
                            </div>

                            {details.status.toLowerCase() === 'approved' &&
                                <div className='border border-gray-600 rounded-xl mt-5 p-3'>
                                    <h3 className='text-[13px]'>Engagement Analytics</h3>
                                    <div className='flex items-center gap-16 text-[11px] mt-2'>
                                        <div className='max-w-fit text-center p-1.5'>
                                            <p>Likes</p>
                                            <p>{details.likes || 0 }</p>
                                        </div>
                                        <div className='max-w-fit text-center p-1.5'>
                                            <p>Comments</p>
                                            <p>{details.comments || 0}</p>
                                        </div>
                                        <div className='max-w-fit text-center p-1.5'>
                                            <p>Shares</p>
                                            <p>{details.shares || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="mt-3 mb-7">
                                <h3 className="font-sans text-[11px]">{details.title || 'no title'}</h3>
                                <p className="text-[11px] pt-2">
                                    {details?.content}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-4 float-right pb-3">{handleModalFooterButton()}</div>
                        </div>
                        ) : (
                        <p>No details available</p>
                        )}
                    </div>
                    </div>
                </div>
            )}

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
             {filterModal && (
                <>
                    {/* Overlay */}
                    <div
                    onClick={handleCloseModal}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    />

                    {/* Modal Content */}
                    <div
                    className="fixed z-50"
                    style={{
                        top: '150px',
                        left: '75%',
                        transform: 'translateX(-50%)',
                        backgroundColor: isDarkMode ? '#0B0B0B' : '#fff',
                        width: '400px',
                        height: '400px',
                        color: isDarkMode ? '#fff' : 'black',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        padding: 0
                    }}
                    >
                    {/* Header */}
                    <div className={`${isDarkMode ? 'bg-[#131313]' : 'bg-gray-200'} h-[60px] w-full rounded-t-lg flex items-center justify-between px-5 sticky top-0 z-10`}>
                        <h3 className={isDarkMode ? 'text-white' : 'text-black'}>Filter</h3>
                        <button 
                        onClick={handleCloseModal}
                        className={isDarkMode ? 'text-white' : 'text-black'}
                        >
                        X
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div 
                        className="scroll-container"
                        style={{
                        height: 'calc(450px - 120px)',
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        padding: '0 24px',
                        position: 'relative'
                        }}
                    >
                        <div className="pt-2 pb-20">
                        <hr className={`w-full mb-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />

                        {/* Date Range */}
                        <div className='flex items-center justify-between mb-2'>
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

                        <div className='flex items-center justify-between mt-4 gap-2'>
                            <div>
                            <p className={isDarkMode ? 'text-white' : 'text-black'}>From</p>
                            <div className={`flex items-center rounded-xl w-[150px] p-1 mt-1 cursor-pointer 
                                ${isDarkMode ? 'bg-[#171717]' : 'border border-[#9966CC]'}`}>
                                <CalendarOutlined 
                                onClick={handleFromDateIconClick} 
                                className={`${isDarkMode ? 'text-white ml-2' : 'text-black ml-2'}`} 
                                />
                                <input 
                                type="date"
                                ref={dateInputRef1}
                                value={filterDate1}
                                onChange={handleFilterDate1}
                                className={`no-icon cursor-pointer ${isDarkMode ? 'bg-[#171717] text-white' : 'bg-white'}`}
                                style={{ border: 'none', outline: 'none', width: '100%' }}
                                />
                            </div>
                            </div>

                            <div>
                            <p className={isDarkMode ? 'text-white' : 'text-black'}>To</p>
                            <div className={`flex items-center rounded-xl w-[150px] p-1 mt-1 cursor-pointer 
                                ${isDarkMode ? 'bg-[#171717]' : 'border border-[#9966CC]'}`}>
                                <CalendarOutlined 
                                onClick={handleToDateIconClick} 
                                className={`${isDarkMode ? 'text-white ml-2' : 'text-black ml-2'}`}
                                />
                                <input 
                                type="date"
                                ref={dateInputRef2}
                                value={filterDate2}
                                onChange={handleFilterDate2}
                                className={`no-icon cursor-pointer ${isDarkMode ? 'bg-[#171717] text-white' : 'bg-white'}`}
                                style={{ border: 'none', outline: 'none', width: '100%' }}
                                />
                            </div>
                            </div>
                        </div>

                        <hr className={`w-full mt-4 mr-5 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />

                        {/* Category */}
                        <div className='flex items-center justify-between mt-4'>
                            <h3 className={`text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Category</h3>
                            <button 
                            onClick={() => setSelectTestType('Select')}
                            className='outline-none border-none p-1 text-[#9966CC] rounded'
                            >
                            Clear
                            </button>
                        </div>

                        <div 
                            onClick={() => setFilterDropDown(!filterDropDown)} 
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer mt-2 ${isDarkMode ? 'bg-[#171717]' : 'bg-white border border-[#9966CC]'}`}
                        >
                            <p className={`font-sans ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            {selectTestType}
                            </p>
                            {filterDropDown ? 
                            <FaCaretUp className={isDarkMode ? 'text-white' : 'text-black'} /> : 
                            <FaCaretDown className={isDarkMode ? 'text-white' : 'text-black'} />
                            }
                        </div>

                        {filterDropDown && (
                            <div className={`flex flex-col rounded-xl cursor-pointer p-1 mt-3 border ${isDarkMode ? 'bg-[#171717] border-gray-600' : 'bg-white border-[#9966CC]'}`}>
                            {['Healing', 'Deliverance', 'Faith', 'Salvation', 'Finance', 'Career', 'Marriage Restoration'].map((category) => (
                                <div 
                                key={category}
                                onClick={() => {
                                    setSelectTestType(category);
                                    setFilterDropDown(false);
                                }}
                                className='w-full py-2 px-4 border-b last:border-b-0 hover:bg-opacity-50 hover:bg-gray-600'
                                >
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>
                                    {category}
                                </span>
                                </div>
                            ))}
                            </div>
                        )}

                        <hr className={`w-full mt-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />

                        {/* Approval Status */}
                        <div className='flex items-center justify-between mt-4 mb-3'>
                            <h3 className={`text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Approval Status</h3>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {['pending', 'approved', 'rejected'].map((status) => (
                            <div key={status} className="flex items-center cursor-pointer">
                                <div className={`w-[16px] h-[16px] rounded-full border border-[#9966CC] mr-1 flex items-center justify-center
                                ${ApprovalStatus === status ? 'bg-[#9966CC]' : 'bg-transparent'}`}>
                                {ApprovalStatus === status && (
                                    <div className="w-[8px] h-[8px] rounded-full bg-white"></div>
                                )}
                                </div>
                                <input
                                type="radio"
                                id={status}
                                name="status"
                                value={status}
                                checked={ApprovalStatus === status}
                                onChange={handleChange}
                                className="hidden"
                                />
                                <label
                                className={`cursor-pointer text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}
                                htmlFor={status}
                                >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                </label>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`absolute bg-[#0B0B0B] z-10 bottom-0 left-0 right-0 py-3 px-6 ${isDarkMode ? 'border-gray-600 bg-green' : 'border-gray-300 bg-white'} flex justify-end`}>
                        <button 
                        onClick={handleReset}
                        className='border border-[#9966CC] outline-none p-1 rounded w-[100px] text-[#9966CC] mr-2'
                        >
                        Clear All
                        </button>
                        <button
                        onClick={handleFiltering}
                        className='bg-[#9966CC] text-white border-none outline-none rounded p-1 w-[100px]'
                        >
                        Apply
                        </button>
                    </div>
                    </div>
                </>
            )}


            {/* Action Modal */}
            <Modal
                open={actionModal}
                onCancel={handleCloseModal}
                footer={null}
                closeIcon={null}
                styles={{
                    content: {
                        backgroundColor: `${isDarkMode ? '#171717' : '#fff'}`,
                        width: '170px',
                        height: '100px',
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                        margin: '0 auto',
                        borderRadius: '8px',
                        marginLeft: '120%',
                        marginTop: '180px'
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
                            className='pl-2 font-bold'
                        >
                            View
                        </button>
                    </div>

                    <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.9] cursor-pointer'>
                        <button 
                             onClick={async () => {
                                await handleDetail(controlDetail, false); // fetch latest data
                                console.log(details.status)
                                setActionModal(false);             // close the 3-dot menu
                                showDeleteNotification();          // open delete modal
                            }} 
                            className='pl-2 pt-4 text-red font-bold'
                        >
                            Delete
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
                {details.status === 'PENDING' ? 
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
            <div className={`${isDarkMode ? 'w-[98%]' : 'w-[100%]'} h-[510px] m-[auto] bg-[#171717] rounded-xl
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
                <div className='w-[100%] m-[auto] h-[390px]'>
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
                                className={`text-[13px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-9 transition-colors duration-150
                                ${isDarkMode 
                                    ? "text-white border-b border-b-slate-200 hover:bg-[#1e1e1e]" 
                                    : "bg-white text-black border-b border-b-slate-200 hover:bg-slate-200"}`}
                            >
                                <div 
                                    onClick={() => {
                                        handleDetail(item.id)
                                    }} 
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
                                <div className='ml-[10px] mt-4'>{formatDate(item?.created_at)}</div>
                                <div className='ml-[20px] mt-4'>{item?.likes || 0}</div>
                                <div className='ml-[20px] mt-4'>{item?.comment || 0}</div>
                                <div className='ml-[20px] mt-4'>{item?.shares || 0}</div>
                                <div 
                                    className={`ml-[-5px] mt-3 w-[90%] m-[auto] text-center rounded-xl p-1 
                                    ${item.status.toLowerCase() === 'rejected' ? 
                                        'text-red border border-red' : 
                                        item.status.toLowerCase() === 'pending' ? 
                                        'text-yellow-400 border border-yellow-500' : 
                                        'text-green-700 border border-green-700'}`}
                                >
                                    {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                                </div>
                                <div 
                                    onClick={(e) => {
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
                <div className='flex justify-between items-center mt-4'>
                    <div className={`text-[12px] ml-[10px] ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                        Showing {Math.min(startIndex + 1, searchedData.length)}-{Math.min(startIndex + itemsPerPage, searchedData.length)} of {searchedData.length}
                    </div>
                    <div className='text-[13px] mr-5 flex items-center gap-3'>
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || searchedData.length === 0}
                            className={`w-[90px] p-2 rounded-xl ${currentPage === 1 || searchedData.length === 0 ? 
                                'opacity-[0.5] text-gray-500 border border-gray-500' : 
                                "border border-[#9966CC] text-[#9966CC]"}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === Math.ceil(searchedData.length / itemsPerPage) || searchedData.length === 0}
                            className={`w-[90px] p-2 rounded-xl ${currentPage === Math.ceil(searchedData.length / itemsPerPage) || searchedData.length === 0 ? 
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

export default TestimonyText;