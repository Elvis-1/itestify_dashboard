import React, { useState, useContext, useRef, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoFilterOutline } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io';
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import {Button, Modal } from 'antd';
import axios from 'axios';
import { DarkModeContext } from '../../context/DarkModeContext';
import { notification } from 'antd';
import LoadingState from '../LoadingState';
import VideoPlayer from './VideoPlayer';

function DraftTest({all, setAll, uploaded, setUploaded, scheduled, setScheduled, draft, setDraft}) {
    const {isDarkMode} = useContext(DarkModeContext)
    const [getDetail, setGetDetail] = useState(false)
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [details, setDetails] = useState(null)
    const [videoActionModal, setVideoActionModal] = useState(false)
    const [openVideoViewModal, setVideoViewModal] = useState(false)
    const [filterDropDown, setFilterDropDown] = useState(false)
    const [editCategoryDropDown, setEditCategoryDropDown] = useState(false) // Separate state for edit modal
    const [filterDate1, setFilterDate1] = useState('')
    const [filterDate2, setFilterDate2] = useState('')
    const [selectTestType, setSelectTestType] = useState('Select')
    const [editCategory, setEditCategory] = useState('Select') // Separate state for edit modal
    const [ApprovalStatus, setApprovalStatus] = useState('');
    const [filterModal, setFilterModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [editDetails, setEditDetails] = useState(null)
    const [deleteDetails, setDeleteDetails] = useState(null)
    const [editDate, setEditDate] = useState('')
    const [editTime, setEditTime] = useState('')
    const [deleteVideoTestModal, setDeleteVideoTest] = useState(false)
    const [getStatus, setGetStatus] = useState('')
    const [deleteSuccessful, setDeleteSuccessful] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);
    const [editSuccessfully, setEditSuccessfully] = useState(false)
    const [AllVideo, setAllVideo] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [inputValue, setInputValue] = useState("")

    const categories = ['Healing', 'Deliverance', 'Breakthrough', 'Faith', 'Salvation', 'Finance', 'Career', 'Marriage Restoration'];

    async function fetchAllVideos() {
        const token = localStorage.getItem('token');
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get(
                'https://itestify-backend-38u1.onrender.com/testimonies/videos/?upload_status=drafts',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 10000,
                }
            );

            const videos = res?.data?.data?.data || [];
            setAllVideo(videos);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to fetch videos');
            setAllVideo([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllVideos();
    }, []);

    useEffect(() => {
        if (editDetails && openEditModal) {
            setInputValue(editDetails.title || '');
            setEditCategory(editDetails.category || 'Select');
            if (editDetails.upload_status === 'scheduled_for_now') {
                setEditDate(editDetails.scheduled_date || '');
                setEditTime(editDetails.scheduled_time || '');
            }
        }
    }, [editDetails, openEditModal]);

    const itemsPerPage = 6;
    const startIndex = (page - 1) * itemsPerPage;
    const totalPages = Math.ceil((AllVideo?.length ?? 0) / itemsPerPage);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const searchedData = React.useMemo(() => {
        const dataToSearch = (getFilteredData.length > 0 || 
                            selectTestType !== 'Select' || 
                            filterDate1 || 
                            filterDate2 || 
                            ApprovalStatus) ? getFilteredData : AllVideo;

        if (searchQuery.trim() !== "") {
            const filteredData = dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.title.toLowerCase().includes(lowerCaseQuery) ||
                    (item.category && item.category.toLowerCase().includes(lowerCaseQuery)) ||
                    (item.upload_status && item.upload_status.toLowerCase().includes(lowerCaseQuery))
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, AllVideo, searchQuery]);

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

    async function handleDetail(id) {
        try {
            setLoading(true);
            setVideoViewModal(true);
            
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `https://itestify-backend-38u1.onrender.com/testimonies/videos/${id}/`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (response?.data?.data) {
                const videoDetail = response.data.data;
                setDetails(videoDetail);
                setEditDetails(videoDetail);
                setGetStatus(videoDetail.upload_status);
                setDeleteDetails(videoDetail);
            } else {
                console.error("Unexpected API response format:", response);
                notification.error({
                    message: 'Error',
                    description: 'Unexpected data format from server',
                    placement: 'topRight'
                });
            }
        } catch (error) {
            console.error("Error fetching video details:", error);
            notification.error({
                message: 'Error',
                description: 'Failed to load video details',
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };
        
    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };
    
    const handleCloseModal = () => {
        setVideoActionModal(false);
        setVideoViewModal(false);
        setFilterModal(false);
        setOpenEditModal(false);
        setDeleteVideoTest(false);
        setEditCategoryDropDown(false);
        setFilterDropDown(false);
    };

    const handleChange = (event) => {
        setApprovalStatus(event.target.value);
    }
    
    function handleReset() {
        setSelectTestType('Select');
        setApprovalStatus('');
        setFilterDate1('');
        setFilterDate2('');
        setGetFilterData([]);
    }

    const handleSelectCategory = (category) => {
        setSelectTestType(category);
        setFilterDropDown(false);
    };

    const handleEditCategorySelect = (category) => {
        setEditCategory(category);
        setEditCategoryDropDown(false);
    };
    
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleUploadEdit = async (id) => {
        if (!id) {
            notification.error({
                message: 'Error',
                description: 'No testimony ID provided',
                placement: 'topRight'
            });
            return;
        }
      
        if (!inputValue || editCategory === 'Select') {
            notification.error({
                message: 'Error',
                description: 'Title and category are required',
                placement: 'topRight'
            });
            return;
        }
      
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
        
            const requestData = {
                title: inputValue,
                category: editCategory,
                upload_status: 'upload_now',
            };
        
            const response = await axios.put(
                `https://itestify-backend-38u1.onrender.com/testimonies/videos/${id}/`,
                requestData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
        
            notification.success({
                message: 'Success',
                description: 'Testimony updated successfully',
                placement: 'topRight'
            });
        
            handleCloseModal();
            fetchAllVideos();
            
            if (handleEditSuccessful) {
                handleEditSuccessful();
            }
        
        } catch (error) {
            console.error('Update error:', error);
            
            let errorMessage = 'Failed to update testimony';
            if (error.response) {
                errorMessage = error.response.data.message || 
                            error.response.data.detail || 
                            (error.response.data.errors ? 
                            JSON.stringify(error.response.data.errors) : 
                            'Unknown error');
            } else if (error.request) {
                errorMessage = 'No response from server';
            } else {
                errorMessage = error.message || 'Network error';
            }
        
            notification.error({
                message: 'Error',
                description: errorMessage,
                placement: 'topRight',
                duration: 5
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editDetails?.id) {
            notification.error({
                message: 'Error',
                description: 'No testimony ID provided',
                placement: 'topRight'
            });
            return;
        }

        if (!inputValue || editCategory === 'Select') {
            notification.error({
                message: 'Error',
                description: 'Title and category are required',
                placement: 'topRight'
            });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const requestData = {
                title: inputValue,
                category: editCategory,
                upload_status: editDetails.upload_status
            };

            if (editDetails.upload_status === 'scheduled_for_now') {
                if (!editDate || !editTime) {
                    notification.error({
                        message: 'Error',
                        description: 'Date and time are required for scheduled videos',
                        placement: 'topRight'
                    });
                    return;
                }
                
                requestData.scheduled_date = editDate;
                requestData.scheduled_time = editTime;
            }

            const response = await axios.put(
                `https://itestify-backend-38u1.onrender.com/testimonies/videos/${editDetails.id}/`,
                requestData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            notification.success({
                message: 'Success',
                description: 'Testimony updated successfully',
                placement: 'topRight'
            });

            handleCloseModal();
            fetchAllVideos();

        } catch (error) {
            console.error('Update error:', error);
            
            let errorMessage = 'Failed to update testimony';
            if (error.response) {
                errorMessage = error.response.data.message || 
                            error.response.data.detail || 
                            JSON.stringify(error.response.data);
            }

            notification.error({
                message: 'Error',
                description: errorMessage,
                placement: 'topRight',
                duration: 5
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVideoTest = async (id, e) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (!id || isDeleting) return;

        setIsDeleting(true);
        const token = localStorage.getItem('token');
        
        try {
            await axios.delete(
                `https://itestify-backend-38u1.onrender.com/testimonies/videos/${id}/`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            fetchAllVideos();
            handleDeleteSuccessful();
        } catch (error) {
            console.error('Full error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                config: error.config
            });
            message.error(error.response?.data?.message || 'Failed to delete testimony');
        } finally {
            setIsDeleting(false);
        }
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
            setPage(1);
            return;
        }

        const filteredData = AllVideo.filter((item) => {
            const itemDate = new Date(item.created_at);
            const startDate = filterDate1 ? new Date(filterDate1) : null;
            const endDate = filterDate2 ? new Date(filterDate2) : null;

            const isWithinDateRange =
                (!startDate || itemDate >= startDate) &&
                (!endDate || itemDate <= new Date(endDate.setHours(23, 59, 59, 999)));

            const matchesCategory = selectTestType === 'Select' || 
                                  item.category.toLowerCase() === selectTestType.toLowerCase();

            const matchesStatus = !ApprovalStatus || 
                                item.upload_status.toLowerCase() === ApprovalStatus.toLowerCase();

            return isWithinDateRange && matchesCategory && matchesStatus;
        });

        setGetFilterData(filteredData);
        setFilterModal(false);
        setPage(1);
    }
    
    function EditUploadedModalFooterButton() {
        return (
            <div className='mt-[50px]' key="edit-footer">
                <button 
                    onClick={
                        editDetails?.upload_status === 'upload_now'
                            ? handleCloseModal
                            : () => handleUploadEdit(editDetails?.id)
                    }
                    className='border border-[#9966CC] p-2 rounded w-[90px]
                    text-white text-[13px] outline-none
                            hover:!bg-primary-light-mode hover:!text-white 
                            transition-colors duration-200 ease-in-out'
                >
                    {editDetails?.upload_status === 'upload_now' ? 'Cancel' : 'Upload'}
                </button>
                
                <Button 
                    loading={loading}
                    onClick={handleSaveEdit}
                    className='bg-[#9966CC] text-white ml-2 border-none outline-none rounded p-2 w-[auto] h-[40px]
                    hover:!bg-primary-light-mode hover:!text-white 
                            transition-colors duration-200 ease-in-out'
                >
                    Save Changes
                </Button>
            </div>
        );
    }

    function handleDeleteSuccessful() {
        setDeleteSuccessful(true);
        setDeleteVideoTest(false);

        let successTimer = setTimeout(() => {
            setDeleteSuccessful(false);
        }, 2000);

        return () => {
            clearTimeout(successTimer);
        };
    }

    function handleEditSuccessful() {
        setOpenEditModal(false);
        setEditSuccessfully(true);
        let successTimer = setTimeout(() => {
            setEditSuccessfully(false);
        }, 2000);

        return () => {
            clearTimeout(successTimer);
        };
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
        <div className={`${!isDarkMode ? 'border rounded-xl w-[98%] m-[auto]' : 'border-none'}`}>
            {/* Filter Modal */}
            {filterModal && (
                <>
                    <div onClick={handleCloseModal} className="fixed inset-0 bg-black bg-opacity-50 z-40" />
                    <div className="fixed z-50"
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
                        <div className={`${isDarkMode ? 'bg-[#131313]' : 'bg-gray-200'} h-[60px] w-full rounded-t-lg flex items-center justify-between px-5 sticky top-0 z-10`}>
                            <h3 className={isDarkMode ? 'text-white' : 'text-black'}>Filter</h3>
                            <button onClick={handleCloseModal} className={isDarkMode ? 'text-white' : 'text-black'}>X</button>
                        </div>
                        <div className="scroll-container" style={{
                            height: 'calc(450px - 120px)',
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            padding: '0 24px',
                            position: 'relative'
                        }}>
                            <div className="pt-2 pb-20">
                                <hr className={`w-full mb-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                                <div className='flex items-center justify-between mb-2'>
                                    <h3 className={`text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Date Range</h3>
                                    <button onClick={() => { setFilterDate1(''); setFilterDate2(''); }} className='outline-none border-none p-1 text-[#9966CC] rounded'>Clear</button>
                                </div>
                                <div className='flex items-center justify-between mt-4 gap-2'>
                                    <div>
                                        <p className={isDarkMode ? 'text-white' : 'text-black'}>From</p>
                                        <div className={`flex items-center rounded-xl w-[150px] p-1 mt-1 cursor-pointer ${isDarkMode ? 'bg-[#171717]' : 'border border-[#9966CC]'}`}>
                                            <CalendarOutlined onClick={handleFromDateIconClick} className={`${isDarkMode ? 'text-white ml-2' : 'text-black ml-2'}`} />
                                            <input type="date" ref={dateInputRef1} value={filterDate1} onChange={handleFilterDate1} className={`no-icon cursor-pointer ${isDarkMode ? 'bg-[#171717] text-white' : 'bg-white'}`} style={{ border: 'none', outline: 'none', width: '100%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className={isDarkMode ? 'text-white' : 'text-black'}>To</p>
                                        <div className={`flex items-center rounded-xl w-[150px] p-1 mt-1 cursor-pointer ${isDarkMode ? 'bg-[#171717]' : 'border border-[#9966CC]'}`}>
                                            <CalendarOutlined onClick={handleToDateIconClick} className={`${isDarkMode ? 'text-white ml-2' : 'text-black ml-2'}`} />
                                            <input type="date" ref={dateInputRef2} value={filterDate2} onChange={handleFilterDate2} className={`no-icon cursor-pointer ${isDarkMode ? 'bg-[#171717] text-white' : 'bg-white'}`} style={{ border: 'none', outline: 'none', width: '100%' }} />
                                        </div>
                                    </div>
                                </div>
                                <hr className={`w-full mt-4 mr-5 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                                <div className='flex items-center justify-between mt-4'>
                                    <h3 className={`text-[14px] ${isDarkMode ? 'text-white' : 'text-black'}`}>Category</h3>
                                    <button onClick={() => setSelectTestType('Select')} className='outline-none border-none p-1 text-[#9966CC] rounded'>Clear</button>
                                </div>
                                <div onClick={() => setFilterDropDown(!filterDropDown)} className={`flex items-center justify-between p-2 rounded-xl cursor-pointer mt-2 ${isDarkMode ? 'bg-[#171717]' : 'bg-white border border-[#9966CC]'}`}>
                                    <p className={`font-sans ${isDarkMode ? 'text-white' : 'text-black'}`}>{selectTestType}</p>
                                    {filterDropDown ? <FaCaretUp className={isDarkMode ? 'text-white' : 'text-black'} /> : <FaCaretDown className={isDarkMode ? 'text-white' : 'text-black'} />}
                                </div>
                                {filterDropDown && (
                                    <div className={`flex flex-col rounded-xl cursor-pointer p-1 mt-3 border ${isDarkMode ? 'bg-[#171717] border-gray-600' : 'bg-white border-[#9966CC]'}`}>
                                        {categories.map((category) => (
                                            <div key={category} onClick={() => handleSelectCategory(category)} className='w-full py-2 px-4 border-b last:border-b-0 hover:bg-opacity-50 hover:bg-gray-600'>
                                                <span className={isDarkMode ? 'text-white' : 'text-black'}>{category}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`absolute bg-[#0B0B0B] z-10 bottom-0 left-0 right-0 py-3 px-6 ${isDarkMode ? 'border-gray-600 bg-green' : 'border-gray-300 bg-white'} flex justify-end`}>
                            <button onClick={handleReset} className='border border-[#9966CC] outline-none p-1 rounded w-[100px] text-[#9966CC] mr-2'>Clear All</button>
                            <button onClick={handleFiltering} className='bg-[#9966CC] text-white border-none outline-none rounded p-1 w-[100px]'>Apply</button>
                        </div>
                    </div>
                </>
            )}
    
            {/* Video Details Modal */}
            <Modal
                open={openVideoViewModal}
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
                {details ? (
                    <div>
                        <h2 className='mt-[-10px] text-[20px] font-sans pb-2'>Video Details</h2>
                        <hr className='opacity-[0.6] w-[113%] ml-[-23px]'/> 
                        <div className='w-[113%] ml-[-16px] rounded-xl overflow-hidden h-[230px] mt-6 relative'>
                            <VideoPlayer videoUrl={details.video_file}>
                                <video poster={details.thumbnail || 'No thumbnail available'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </VideoPlayer>
                        </div>
                        {details?.upload_status === 'upload_now' && (
                            <div className='w-[110%] ml-[-13px] mt-2 text-[11px] h-[auto] text-white'>
                                <div className='flex items-center justify-between p-2'>
                                    <h2 className='opacity-[0.6]'>Title</h2>
                                    <p>{details.title || 'N/A'}</p>
                                </div>
                                <div className='flex items-center justify-between p-2 pt-1'>
                                    <h2 className='opacity-[0.6]'>Category</h2>
                                    <p>{details.category || 'N/A'}</p>
                                </div>
                                <div className='flex items-center justify-between p-2 pt-1'>
                                    <h2 className='opacity-[0.6]'>Source</h2>
                                    <p>{details.source || 'N/A'}</p>
                                </div>
                                <div className='flex items-center justify-between p-2 pt-1'>
                                    <h2 className='opacity-[0.6]'>Upload Date</h2>
                                    <p>
                                        {details.created_at ? new Date(details.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                                <div className='flex items-center justify-between p-2 pt-1'>
                                    <h2 className='opacity-[0.6]'>Uploaded By</h2>
                                    <p>{details.uploaded_by?.full_name ? details.uploaded_by?.full_name : details.uploaded_by?.email || 'N/A'}</p>
                                </div>
                            </div>
                        )}
                        {details?.upload_status === 'drafts' && (
                            <div className='w-[110%] ml-[-13px] mt-2 text-[11px] h-[175px] text-white'>
                                <div className='flex items-center justify-between p-2'>
                                    <h2 className='opacity-[0.6]'>Title</h2>
                                    <p>{details.title}</p>
                                </div>
                                <div className='flex items-center justify-between p-2 pt-1'>
                                    <h2 className='opacity-[0.6]'>Category</h2>
                                    <p>{details.category}</p>
                                </div>
                                <div className='flex items-center justify-between p-2 pt-1'>
                                    <h2 className='opacity-[0.6]'>Source</h2>
                                    <p>{details.source}</p>
                                </div>
                                <div className='flex items-center justify-between p-2 pt-1'>
                                    <h2 className='opacity-[0.6]'>Status</h2>
                                    <p className={`${details.upload_status === 'drafts' && 'border border-gray-600 text-gray-600 w-[70px] text-center rounded-xl text-[10px] p-[3px]'}`}>{details.upload_status}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-white text-center p-4">
                        <p>Loading video details...</p>
                    </div>
                )}
            </Modal>
                    
            {/* Video Action Modal */}
            <Modal
                open={videoActionModal}
                onCancel={handleCloseModal}
                footer={null}
                closeIcon={null}
                styles={{
                    content: {
                        backgroundColor: `${isDarkMode ? '#171717' : '#fff'}`,
                        width: '150px',
                        height: 'auto',
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                        margin: '0 auto',
                        borderRadius: '8px',
                        marginLeft: '135%',
                        marginTop: '180px',
                        fontWeight: 'semi-bold'
                    },
                    body: {
                        color: `${isDarkMode ? '#fff' : 'black'}`,
                    },
                }}
            >
                <div className='flex flex-col'>
                    <div className='border-b w-[150%] ml-[-25px] pb-2'>
                        <button onClick={() => { handleDetail(details?.id); setVideoActionModal(false); setVideoViewModal(true); }} className='pl-2'>View</button>
                    </div>
                    <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2'>
                        <button onClick={() => { handleDetail(editDetails?.id); setOpenEditModal(true); setVideoActionModal(false); setVideoViewModal(false); }} className='pl-2'>Edit</button>
                    </div>
                    <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2'>
                        <button onClick={() => { setOpenEditModal(true); setVideoActionModal(false); setVideoViewModal(false); }} className='pl-2'>Upload</button>
                    </div>
                    <div className='w-[150%] ml-[-25px] mb-[-6px] cursor-pointer'>
                        <button onClick={() => { setDeleteVideoTest(true); setVideoActionModal(false); }} className='pl-2 pt-4 text-red'>Delete</button>
                    </div>
                </div>
            </Modal>
    
            {/* Edit Modal */}
            <Modal
                open={openEditModal}
                onCancel={handleCloseModal}
                footer={EditUploadedModalFooterButton}
                closeIcon={<span style={{ color: 'white', fontSize: '12px' }}>X</span>}
                styles={{
                    content: {
                        backgroundColor: '#0B0B0B',
                        width: '330px',
                        maxHeight: '80vh',
                        color: 'white',
                        margin: '0 auto',
                        borderRadius: '8px',
                        padding: '20px'
                    },
                    body: {
                        color: 'white',
                        padding: '0'
                    },
                }}
                confirmLoading={loading}
            >
                <div className="space-y-4">
                    <h3 className='text-white text-lg font-medium pb-2'>Edit Video Testimony</h3>
                    <hr className='border-gray-700'/>
                    <form className="space-y-4">
                        <div>
                            <label className='block text-white text-sm mb-1'>Title</label>
                            <input 
                                value={inputValue}
                                placeholder='Edit your title'
                                onChange={handleInputChange}
                                className='w-full bg-[#171717] text-white rounded-lg p-2 outline-none border border-gray-700 focus:border-[#9966CC]'
                                required
                            />
                        </div>
                        <div>
                            <label className='block text-white text-sm mb-1'>Category</label>
                            <div 
                                onClick={() => setEditCategoryDropDown(!editCategoryDropDown)} 
                                className='flex items-center justify-between w-full bg-[#171717] p-2 rounded-lg border border-gray-700 cursor-pointer hover:border-[#9966CC]'
                            >
                                <span className='text-white capitalize'>
                                    {editCategory || 'Select category'}
                                </span>
                                {editCategoryDropDown ? <FaCaretUp className="text-gray-400" /> : <FaCaretDown className="text-gray-400" />}
                            </div>
                            {editCategoryDropDown && (
                                <div className='mt-1 space-y-1 rounded-lg border border-gray-700 overflow-hidden bg-[#171717]'>
                                    {categories.map((category) => (
                                        <div
                                            key={category}
                                            onClick={() => handleEditCategorySelect(category)}
                                            className="w-full px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer"
                                        >
                                            <span className="capitalize text-white">
                                                {category}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {editDetails?.upload_status === 'scheduled_for_now' && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="edited-date" className='block text-white text-sm mb-1'>Scheduled Date</label>
                                    <input 
                                        type='date'
                                        id='edited-date'
                                        onChange={(e) => setEditDate(e.target.value)}
                                        value={editDate} 
                                        className='w-full bg-[#171717] text-white rounded-lg p-2 outline-none border border-gray-700 focus:border-[#9966CC]'
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="edited-time" className='block text-white text-sm mb-1'>Scheduled Time</label>
                                    <input 
                                        type='time'
                                        id='edited-time'
                                        onChange={(e) => setEditTime(e.target.value)}
                                        value={editTime}
                                        className='w-full bg-[#171717] text-white rounded-lg p-2 outline-none border border-gray-700 focus:border-[#9966CC]'
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={deleteVideoTestModal}
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
                        {deleteDetails?.upload_status === 'schedule_for_later' && 
                            <>
                                <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                                <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                    Are you sure you want to delete this Scheduled testimony? This action will 
                                    removed this testimony permanently, and it will not 
                                    be uploaded on the scheduled date and time.' 
                                </p>
                                <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteVideoTest(deleteDetails?.id, e); }}
                                    disabled={isDeleting}
                                    className={`mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2 ${isDeleting ? 'opacity-50' : ''}`}
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes delete'}
                                </button>
                            </>
                        }
                        {deleteDetails?.upload_status === 'upload_now' && 
                            <>
                                <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                                <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                    Are you sure you want to delete this Uploaded testimony? Once deleted the 
                                    testimony will be remove from the platform and will no longer be visible to users.
                                    This action cannot be undone 
                                </p>
                                <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px] hover:bg-[#8a5ac4] hover:text-white'>Cancel</button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteVideoTest(deleteDetails?.id, e); }}
                                    disabled={isDeleting}
                                    className={`mt-3 rounded bg-[#E53935] hover:bg-[#c45a5a] hover:text-white p-2 w-[120px] ml-2 ${isDeleting ? 'opacity-50' : ''}`}
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes delete'}
                                </button>
                            </>
                        }
                        {deleteDetails?.upload_status === 'drafts' && 
                            <>
                                <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                                <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                    Are you sure you want to delete this draft? This action will permernently remove this 
                                    testimony from your drafts and cannot be undone 
                                </p>
                                <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px] hover:bg-[#8a5ac4] hover:text-white'>Cancel</button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteVideoTest(deleteDetails?.id, e); }}
                                    disabled={isDeleting}
                                    className={`mt-3 rounded bg-[#E53935] hover:bg-[#c45a5a] p-2 w-[120px] ml-2 ${isDeleting ? 'opacity-50' : ''}`}
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes delete'}
                                </button>
                            </>
                        }
                    </div>
                </div>
            </Modal>
    
            {/* Success Modals */}
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
                        <p className='text-[20px] text-center pt-3'>Testimony deleted successfully</p>
                    </div>
                </div> 
            </Modal>
    
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
                }}
            >
                <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
                    <div className='bg-[#9966CC] w-[50px] h-[50px] rounded-full flex items-center justify-center'>
                        <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                    </div>
                    <div>
                        <p className='text-[20px] text-center pt-3'>Changes Save successfully!</p>
                    </div>
                </div> 
            </Modal>
    
            {/* Main Content */}
            <div className={`${isDarkMode ? 'w-[100%]' : 'w-[100%]'} h-[510px] m-[auto] bg-[#171717] rounded-xl ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
                <div className={`flex items-center justify-between p-3 ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
                    <div className={`flex items-center gap-5 cursor-pointer`}>
                        <h3 onClick={() => { setAll(true); setUploaded(false); setScheduled(false); setDraft(false); }} className={`font-sans ${all && isDarkMode ? 'text-white border-b-4 border-b-[#9966CC]': all && !isDarkMode ? 'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>All</h3>
                        <h3 onClick={() => { setAll(false); setUploaded(true); setScheduled(false); setDraft(false); }} className={`font-sans ${uploaded && isDarkMode ? 'text-white border-b-4 border-b-[#9966CC]': uploaded && !isDarkMode ? 'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>Uploaded</h3>
                        <h3 onClick={() => { setAll(false); setUploaded(false); setScheduled(true); setDraft(false); }} className={`font-sans ${scheduled && isDarkMode ? 'text-white border-b-4 border-b-[#9966CC]': scheduled && !isDarkMode ? 'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>Sheduled</h3>
                        <h3 onClick={() => { setAll(false); setUploaded(false); setScheduled(false); setDraft(true); }} className={`font-sans ${draft && isDarkMode ? 'text-white border-b-4 border-b-[#9966CC]': draft && !isDarkMode ? 'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>Drafts</h3>
                    </div>
                    <div className='flex gap-2'>
                        <div className={`p-1 text-[12px] rounded-xl flex items-center gap-1 ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border border-slate-200"}`}>
                            <CiSearch size={20}/>
                            <input 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                value={searchQuery}
                                type="search" 
                                placeholder='Search by name,category'
                                className={`w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none ${isDarkMode ? "text-white" : "text-black"}`} 
                            />
                        </div>
                        <div onClick={() => setFilterModal(true)} className='flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'>
                            <IoFilterOutline />
                            <button className='text-[12px] outline-none border-none'>Filter</button>
                        </div>
                    </div>    
                </div>

                <div className='w-[98%] mx-auto h-[360px] overflow-y-auto'>
  {/* Table Header */}
  <div className={`w-full h-[50px] text-xs bg-[#313131] grid grid-cols-12 sticky top-0 z-10 ${
    isDarkMode ? "text-white" : "bg-slate-100 text-black border-b border-slate-200"
  }`}>
    {/* S/N Column */}
    <div className='col-span-1 flex items-center px-2 border-gray-500'>
      <span className='mr-1'>S/N</span>
      <div className='flex flex-col space-y-0.5'>
        <IoIosArrowUp onClick={() => sortData('id')} className='text-xs cursor-pointer hover:text-blue-400' />
        <IoIosArrowDown onClick={() => sortData('id')} className='text-xs cursor-pointer hover:text-blue-400' />
      </div>
    </div>
    
    {/* Thumbnail Column */}
    <div className='col-span-2 flex items-center px-2 border-gray-600'>
      <span className='mr-1'>Thumbnail</span>
      <div className='flex flex-col space-y-0.5'>
        <IoIosArrowUp onClick={() => sortData('thumbnail')} className='text-xs cursor-pointer hover:text-blue-400' />
        <IoIosArrowDown onClick={() => sortData('thumbnail')} className='text-xs cursor-pointer hover:text-blue-400' />
      </div>
    </div>
    
    {/* Title Column */}
    <div className='col-span-3 flex items-center px-2 border-gray-600'>
      <span className='mr-1'>Title</span>
      <div className='flex flex-col space-y-0.5'>
        <IoIosArrowUp onClick={() => sortData('title')} className='text-xs cursor-pointer hover:text-blue-400' />
        <IoIosArrowDown onClick={() => sortData('title')} className='text-xs cursor-pointer hover:text-blue-400' />
      </div>
    </div>
    
    {/* Category Column */}
    <div className='col-span-3 flex items-center px-2 border-gray-600'>
      <span className='mr-1'>Category</span>
      <div className='flex flex-col space-y-0.5'>
        <IoIosArrowUp onClick={() => sortData('category')} className='text-xs cursor-pointer hover:text-blue-400' />
        <IoIosArrowDown onClick={() => sortData('category')} className='text-xs cursor-pointer hover:text-blue-400' />
      </div>
    </div>
    
    {/* Source Column */}
    <div className='col-span-2 flex items-center px-2  border-gray-600'>
      <span className='mr-1'>Source</span>
      <div className='flex flex-col space-y-0.5'>
        <IoIosArrowUp onClick={() => sortData('source')} className='text-xs cursor-pointer hover:text-blue-400' />
        <IoIosArrowDown onClick={() => sortData('source')} className='text-xs cursor-pointer hover:text-blue-400' />
      </div>
    </div>
    
    {/* Action Column */}
    <div className='col-span-1 flex items-center justify-center px-2'>
      Action
    </div>
  </div>
  
  {/* Data Rows */}
  {loading ? (
    <LoadingState />
  ) : Array.isArray(sortedData) && sortedData.length > 0 ? (
    sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
      <div 
        key={item.id}
        className={`w-full h-[60px] text-xs grid grid-cols-12 items-center ${
          isDarkMode ? 
            "text-white border-b border-white hover:bg-gray-600" : 
            "bg-white text-black border-b border-slate-200 hover:bg-slate-50"
        }`}
      >
        {/* S/N Cell */}
        <div className="col-span-1 px-2 h-full flex items-center">
          {startIndex + index + 1}
        </div>
        
        {/* Thumbnail Cell */}
        <div className="col-span-2 px-2 h-full flex items-center">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt="thumbnail" 
              className="max-w-[50px] max-h-[50px] object-contain" 
            />
          ) : (
            <div className="w-[50px] h-[50px] flex items-center justify-center  text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>
        
        {/* Title Cell */}
        <div className="col-span-3 px-2 h-full flex items-center truncate">
          {item.title || "No title"}
        </div>
        
        {/* Category Cell */}
        <div className="col-span-3 px-2 h-full flex items-center truncate">
          {item.category || "N/A"}
        </div>
        
        {/* Source Cell */}
        <div className="col-span-2 px-2 h-full flex items-center  truncate">
          {item.source || "No source"}
        </div>
        
        {/* Action Cell */}
        <div 
          className="col-span-1 px-2 h-full flex items-center justify-center cursor-pointer hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setDetails(item);
            setEditDetails(item);
            setDeleteDetails(item);
            setVideoActionModal(true);
          }}
        >
          <IoIosMore className="text-lg" />
        </div>
      </div>
    ))
  ) : (
    <div className='w-full h-[200px] flex items-center justify-center'>
      <div className={`p-4 rounded-lg ${
        isDarkMode ? "bg-gray-700 text-gray-300" : "bg-slate-100 text-slate-600"
      }`}>
        {(selectTestType !== 'Select' || filterDate1 || filterDate2 || ApprovalStatus || searchQuery) ? (
          "No matching results found"
        ) : (
          "No data available"
        )}
      </div>
    </div>
  )}
</div>

                {/* Pagination */}
                <div className='flex justify-between items-center mt-6'>
                    <div className={`text-[12px] ml-[10px] ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                        Showing {Math.min(startIndex + 1, searchedData.length)}-{Math.min(startIndex + itemsPerPage, searchedData.length)} of {searchedData.length}
                    </div>
                    <div className='text-[13px] mr-5 flex items-center gap-3'>
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1 || searchedData.length === 0}
                            className={`w-[90px] p-2 rounded-xl hover:bg-[#8a5ac4] hover:text-white ${page === 1 || searchedData.length === 0 ? 'opacity-[0.5] text-gray-500 border border-gray-500' : "border border-[#9966CC] text-[#9966CC]"}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={page === Math.ceil(searchedData.length / itemsPerPage) || searchedData.length === 0}
                            className={`w-[90px] p-2 rounded-xl hover:bg-[#8a5ac4] hover:text-white ${page === Math.ceil(searchedData.length / itemsPerPage) || searchedData.length === 0 ? 'opacity-[0.5] text-gray-500 border border-gray-500' : "border border-[#9966CC] text-[#9966CC]"}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default DraftTest;