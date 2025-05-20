import React, { useState, useContext, useRef, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoFilterOutline } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io';
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import axios from 'axios';
import { DarkModeContext } from '../../context/DarkModeContext';
import { notification } from 'antd';

function DraftTest({ all, setAll, uploaded, setUploaded, scheduled, setScheduled, draft, setDraft }) {
    const { isDarkMode } = useContext(DarkModeContext);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1);
    const [getFilteredData, setGetFilterData] = useState([]);
    const [filterDate1, setFilterDate1] = useState('');
    const [filterDate2, setFilterDate2] = useState('');

    const [draftActionModal, setDraftActionModal] = useState(false);
    const [draftEditModal, setDraftEditModal] = useState(false);
    const [editSuccessfully, setEditSuccessfully] = useState(false);
    const [draftVideo, setDraftVideo] = useState([]);
    const [draftDetails, setDraftDetails] = useState(null);
    const [editDetails, setEditDetails] = useState(null);
    const [draftUploadModal, setDraftUploadModal] = useState(false);
    const [draftDeleteModal, setDraftDeleteModal] = useState(false);
    const [draftFilterModal, setDraftFilterModal] = useState(false);

    const [filterDropDown, setFilterDropDown] = useState(false);
    const [selectTestType, setSelectTestType] = useState('select');
    const [role, setRole] = useState('Select Role');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [inputValue, setInputValue] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        category: '',
    });

    const dateInputRef1 = useRef(null);
    const dateInputRef2 = useRef(null);

    async function fetchDraftVideo() {
        let token = localStorage.getItem('token');
        try {
            setLoading(true);
            setError(null);
    
            let response = await axios.get(
                'https://itestify-backend-nxel.onrender.com/testimonies/videos/?type=drafts', 
                { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                }
            );
            let draftVideos = response.data.data;
            setDraftVideo(draftVideos);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setError("Failed to fetch some videos");
            setDraftVideo([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDraftVideo();
    }, []);

    useEffect(() => {
        if (editDetails && draftEditModal) {
            setInputValue(editDetails.title || '');
            setSelectTestType(editDetails.category || 'Select');
            setFormData({
                title: editDetails.title || '',
                category: editDetails.category || ''
            });
        }
    }, [editDetails, draftEditModal]);

    const itemsPerPage = 3;
    const startIndex = (page - 1) * itemsPerPage;
    const totalPages = Math.ceil(draftVideo.length / itemsPerPage);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const searchedData = React.useMemo(() => {
        const dataToSearch = getFilteredData?.length > 0 ? getFilteredData : draftVideo;

        if (searchQuery.trim() !== "") {
            const filteredData = dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.title.toLowerCase().includes(lowerCaseQuery) ||
                    item.category.toLowerCase().includes(lowerCaseQuery)
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, draftVideo, searchQuery]);

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
        
    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handleCloseModal = () => {
        setDraftActionModal(false);
        setDraftEditModal(false);
        setDraftUploadModal(false);
        setDraftDeleteModal(false);
        setDraftFilterModal(false);
    };

    const handleDetail = async (id) => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true);
            
            const response = await axios.get(
                `https://itestify-backend-nxel.onrender.com/testimonies/videos/${id}/`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (response.data) {
                const draftDetail = response.data;
                setDraftDetails(draftDetail);
                setEditDetails(draftDetail);
            } else {
                console.error("Unexpected API response format:", response);
                throw new Error("Unexpected API response format");
            }
        } catch (error) {
            console.error("Error fetching video details:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
            setError("Failed to load video details");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadEdit = async (id) => {
        // Use the passed id or fall back to draftDetails.id
        const testimonyId = id || draftDetails?.id;
        
        if (!testimonyId) {
            notification.error({
                message: 'Error',
                description: 'No testimony ID provided',
                placement: 'topRight'
            });
            return;
        }

        if (!inputValue || !selectTestType) {
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
                category: selectTestType,
                upload_status: 'upload_now',
                ...(editDetails?.upload_status === 'scheduled_for_now' && {
                    scheduled_date: editDate,
                    scheduled_time: editTime
                })
            };

            const response = await axios.put(
                `https://itestify-backend-nxel.onrender.com/testimonies/videos/${testimonyId}/`,
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
            fetchDraftVideo();
            
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
            console.error('No testimony ID provided');
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
                category: selectTestType,
            };

            await axios.put(
                `https://itestify-backend-nxel.onrender.com/testimonies/videos/${editDetails.id}/`,
                requestData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            handleCloseModal();
            handleEditSuccessful();
            fetchDraftVideo();
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
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditSuccessful = () => {
        setDraftEditModal(false);
        setEditSuccessfully(true);
        const successTimer = setTimeout(() => {
            setEditSuccessfully(false);
        }, 2000);
        return () => {
            clearTimeout(successTimer);
        };
    };

    const handleFilterDate1 = (event) => {
    setFilterDate1(event.target.value);
    };
    
    const handleFilterDate2 = (event) => {
        setFilterDate2(event.target.value);
    };

    const handleFiltering = () => {
        const getFilterData = draftVideo.filter((item) => {
            const itemDate = new Date(item.date_uploaded);
         
            if (filterDate1 !== "" && filterDate2 !== "" && selectTestType !== "") {
                const isWithinDateRange =
                    (!filterDate1 || itemDate >= new Date(filterDate1)) &&
                    (!filterDate2 || itemDate <= new Date(filterDate2));
    
                const matchesCategory =
                    !selectTestType || item.category === selectTestType;
    
                return isWithinDateRange && matchesCategory;
            } else {
                return (item.date_uploaded === filterDate1 || item.date_uploaded === filterDate2 ||
                    item.category === selectTestType);
            }
        });
    
        setGetFilterData(getFilterData);
        setDraftFilterModal(false);
    };

    const handleReset = () => {
        setSelectTestType('Select');
        setFilterDate1('');
        setFilterDate2('');
    };

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

    const handleSelectCategory = (category) => {
        setSelectTestType(category);
        setFormData(prev => ({ 
            ...prev, 
            category 
        }));
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setFormData(prev => ({ 
            ...prev, 
            title: newValue 
        }));
    };

    const EditDraftModalFooterButton = () => {
        return (
            <div className='mt-[50px]'>
                <button 
                    loading={loading}
                    onClick={() => {
                        handleUploadEdit(editDetails?.id);
                        handleCloseModal();
                    }}
                    className='border border-[#9966CC] outline-none p-2 rounded w-[90px] text-[#9966CC]'
                >
                    Upload
                </button>
                <button
                    loading={loading}
                    onClick={() => {
                        handleSaveEdit();
                        handleCloseModal();
                    }}
                    className='bg-[#9966CC] ml-2 border-none outline-none rounded p-2 w-[auto] h-[40px]'
                >
                    Save Changes
                </button>
            </div>
        );
    };

    const FilterModalFooterButton = () => {
        return (
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
        );
    };

    return (
        <div className={`${!isDarkMode ? 'border h-[350px] rounded-xl' : 'border-none'}`}>
            {/* Draft filter modal */}
            <Modal
                open={draftFilterModal}
                onCancel={handleCloseModal}
                footer={<FilterModalFooterButton />}
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
                }}>
                <div>
                    <h3 className='text-white text-[13px] font-sans pb-2 mt-[-10px]'>Filter</h3>
                    <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] '/>

                    <div>
                        {/* Date picker section */}
                        <div className='flex items-center justify-between mb-[-15px] mt-2 w-[110%] ml-[-15px]'>
                            <h3 className='text-[14px]'>Date Range</h3>
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
                                <div className='flex items-center rounded-xl w-[150px] p-1 bg-[#171717] mt-1 cursor-pointer'>
                                    <CalendarOutlined 
                                        onClick={handleFromDateIconClick} 
                                        className="text-white ml-2"
                                    />
                                    <input 
                                        type="date"
                                        ref={dateInputRef1}
                                        placeholder='dd/mm/yyyy'
                                        value={filterDate1}
                                        onChange={handleFilterDate1}
                                        className='no-icon border cursor-pointer'
                                    />
                                </div>
                            </div>

                            <div>
                                <p>To</p>
                                <div className='flex items-center rounded-xl w-[150px] p-1 bg-[#171717] mt-1 cursor-pointer'>
                                    <CalendarOutlined 
                                        onClick={handleToDateIconClick} 
                                        className="text-white ml-2"
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
                        <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] mt-3'/>

                        {/* category section */}
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
                            className='flex items-center justify-center w-[110%] ml-[-15px] bg-[#171717] p-1 rounded-xl cursor-pointer'
                        >
                            <p className='text-white font-sans p-1 w-[100%] rounded'>{selectTestType}</p>
                            {filterDropDown ? <FaCaretUp/> : <FaCaretDown/>}
                        </div>

                        {filterDropDown && (
                            <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[110%] ml-[-13px]'>
                                <div 
                                    onClick={() => setSelectTestType('Healing')}
                                    className='w-[110%] ml-[-15px] border-b pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Healing'
                                        onClick={() => setSelectTestType('Healing')} 
                                    />
                                </div>
                                <div 
                                    onClick={() => setSelectTestType('Deliverance')}
                                    className='w-[110%] ml-[-15px] border-b pl-5 pb-1 cursor-pointer'
                                >
                                    <input  
                                        type='button' 
                                        value='Deliverance'
                                        onClick={() => setSelectTestType('Deliverance')} 
                                    />
                                </div>
                                <div
                                    onClick={() => setSelectTestType('Faith')}
                                    className='w-[110%] ml-[-15px] border-b pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Faith'
                                        onClick={() => setSelectTestType('Faith')} 
                                    />
                                </div>
                                <div 
                                    onClick={() => setSelectTestType('Salvation')}
                                    className='w-[110%] ml-[-15px] pl-5 pb-1'
                                >
                                    <input 
                                        type='button' 
                                        value='Salvation' 
                                        onClick={() => setSelectTestType('Salvation')}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* draft call to action modal */}
            <Modal
                open={draftActionModal}
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
                        marginLeft: '118%',
                        marginTop: '120px'
                    },
                    body: {
                        backgroundColor: '#1717171',
                        color: 'white',
                    },
                }}>
                <div className='flex flex-col'>
                    <div className='border-b w-[150%] ml-[-25px] pb-2 opacity-[0.6]'>
                        <button 
                            onClick={() => {
                                handleDetail(draftDetails?.id);
                                setDraftEditModal(true);
                                setDraftActionModal(false);
                            }}
                            className='pl-2'
                        >
                            Edit
                        </button>
                    </div>

                    <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                        <button
                            onClick={() => {
                                handleDetail(draftDetails?.id);
                                setDraftUploadModal(true);
                                setDraftActionModal(false);
                            }}
                            className='pl-2'
                        >
                            Upload
                        </button>
                    </div>

                    <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                        <button 
                            onClick={() => {
                                handleDetail(draftDetails?.id);
                                setDraftDeleteModal(true);
                                setDraftActionModal(false);
                            }}
                            className='pl-2 pt-4 text-red-700'
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* draft video Edit modal */}
            <Modal
                open={draftEditModal}
                onCancel={handleCloseModal}
                footer={<EditDraftModalFooterButton />}
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
                confirmLoading={loading}>
                <div className="space-y-4">
                    <h3 className='text-white text-lg font-medium pb-2'>
                        Edit Video Testimony
                    </h3>
                    <hr className='border-gray-700'/>
                    
                    <form className="space-y-4">
                        {/* Title Input */}
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

                        {/* Category Section */}
                        <div>
                            <label className='block text-white text-sm mb-1'>Category</label>
                            <div 
                                onClick={() => setFilterDropDown(!filterDropDown)} 
                                className='flex items-center justify-between w-full bg-[#171717] p-2 rounded-lg border border-gray-700 cursor-pointer hover:border-[#9966CC]'
                            >
                                <span className='text-white capitalize'>
                                    {selectTestType || 'Select category'}
                                </span>
                                {filterDropDown ? <FaCaretUp className="text-gray-400" /> : <FaCaretDown className="text-gray-400" />}
                            </div>

                            {/* Category Dropdown */}
                            {filterDropDown && (
                                <div className='mt-1 space-y-1 rounded-lg border border-gray-700 overflow-hidden bg-[#171717]'>
                                    {['healing', 'deliverance', 'faith', 'salvation'].map((category) => (
                                        <div
                                            key={category}
                                            onClick={() => {
                                                handleSelectCategory(category);
                                                setFilterDropDown(false);
                                            }}
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
                    </form>
                </div>
            </Modal>

            {/* draft upload modal */}
            <Modal
                open={draftUploadModal}
                onCancel={handleCloseModal}
                closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-30px' }}>X</span>}
                footer={null}
                styles={{
                    content: {
                        backgroundColor: 'black',
                        width: '420px',
                        height: 'auto',
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
                <div className='flex flex-col w-[128%] ml-[-30px] mt-[-5px] items-center justify-center'>
                    <div>
                        <>
                            <p className='text-[20px] text-center pt-1 ml-[-15px]'>Upload testimony?</p>
                            <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[390px] ml-[-55px]'>
                                You are about to upload this testimony Once uploaded it will 
                                be visisble to all users, and cannot be reverted to draft, do you want to proceed 
                            </p>

                            {/* role section */}
                            <p className='ml-[-40px] mt-5'>Role</p>
                            <div 
                                onClick={() => setFilterDropDown(!filterDropDown)} 
                                className='flex items-center justify-center w-[110%] ml-[-50px] bg-[#171717] p-1 rounded-xl cursor-pointer'
                            >
                                <p className='text-white font-sans p-1 w-[100%] rounded'>{role}</p>
                                {filterDropDown ? <FaCaretUp/> : <FaCaretDown/>}
                            </div>

                            {filterDropDown && (
                                <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[110%] ml-[-50px]'>
                                    <div 
                                        onClick={() => setRole('Super Admin')}
                                        className='w-[110%] ml-[-15px] border-b pl-5 pb-1'
                                    >
                                        <input 
                                            type='button' 
                                            value='Super Admin'
                                            onClick={() => setRole('Super Admin')} 
                                        />
                                    </div>
                                    <div 
                                        onClick={() => setRole('Admin')}
                                        className='w-[110%] ml-[-15px] pl-5 pb-1 cursor-pointer'
                                    >
                                        <input  
                                            type='button' 
                                            value='Admin'
                                            onClick={() => setRole('Admin')} 
                                        />
                                    </div>
                                </div>
                            )}
                            <div className='ml-[80px] mt-10'>
                                <button 
                                    onClick={handleCloseModal} 
                                    className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUploadEdit(draftDetails?.id)}
                                    className='mt-3 rounded bg-[#9966CC] p-2 w-[120px] ml-2'
                                >
                                    Yes Upload
                                </button>
                            </div>
                        </>
                    </div>
                </div>
            </Modal>

            {/* draft delete modal */}
            <Modal
                open={draftDeleteModal}
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
                }}>
                <div className='flex flex-col w-[128%] ml-[-20px] mt-[-5px] items-center justify-center'>
                    <div> 
                        <>
                            <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                            <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                Are you sure you want to delete this draft testimony? This action will 
                                permanently remove this testimony from your draft, and it cannot be undone' 
                            </p>
                            <button 
                                onClick={handleCloseModal} 
                                className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'
                            >
                                Cancel
                            </button>
                            <button
                                className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'
                            >
                                Yes delete
                            </button>
                        </>
                    </div>
                </div>
            </Modal>

            {/* all video Edit success modal*/}
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
                    <div className='bg-[#9966CC] w-[50px] h-[50px] rounded-full flex items-center justify-center'>
                        <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                    </div>
                    <div>
                        <p className='text-[20px] text-center pt-3'>Changes Save successfully!</p>
                    </div>
                </div> 
            </Modal>

            <div className='flex items-center justify-between p-3'>
                <div className='flex items-center gap-5 cursor-pointer'>
                    <h3 
                        onClick={() => {
                            setAll(true);
                            setUploaded(false);
                            setScheduled(false);
                            setDraft(false);
                        }}
                        className={`font-sans ${all ? 'text-white border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}
                    >
                        All
                    </h3>
                    <h3 
                        onClick={() => {
                            setAll(false);
                            setUploaded(true);
                            setScheduled(false);
                            setDraft(false);
                        }}
                        className={`font-sans ${uploaded ? 'text-white border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}
                    >
                        Uploaded
                    </h3>
                    <h3 
                        onClick={() => {
                            setAll(false);
                            setUploaded(false);
                            setScheduled(true);
                            setDraft(false);
                        }}
                        className={`font-sans ${scheduled ? 'text-white border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}
                    >
                        Sheduled
                    </h3>
                    <h3 
                        onClick={() => {
                            setAll(false);
                            setUploaded(false);
                            setScheduled(false);
                            setDraft(true);
                        }}
                        className={`font-sans ${draft && isDarkMode ? 
                            'text-white border-b-4 border-b-[#9966CC]' : draft && !isDarkMode ? 
                            'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}
                    >
                        Drafts
                    </h3>
                </div>
                <div className='flex gap-2'>
                    <div className={`p-1 text-[12px] rounded-xl flex items-center gap-1
                        ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border border-slate-200"}`}
                    >
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
                        onClick={() => setDraftFilterModal(true)} 
                        className='flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'
                    >
                        <IoFilterOutline />
                        <button className='text-[12px] outline-none border-none'>Filter</button>
                    </div>
                </div>    
            </div>

            <div className='w-[100%] m-[auto] h-[220px]'>
                {/* table header begins */}
                <div className={`bg-[#313131] h-10 grid grid-cols-6 text-[11px]
                    ${isDarkMode ? "text-white" : "bg-slate-100 text-black border-b border-b-slate-200"}`}
                >
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
                        Title
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                                onClick={() => sortData('title')}
                                size={10}
                                className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                                onClick={() => sortData('title')}
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


                
                <div>
                    {/* Data Rows */}
                    {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                        <div 
                            key={item.id}
                            className={`text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-6
                                ${isDarkMode ? "text-white border-b border-b-slate-200" : "bg-white text-black border-b border-b-slate-200"}`}
                        >
                            <div className='p-2 flex items-center'>{startIndex + index + 1}</div>
                            <div className='p-2 flex items-center ml-[-10px]'>
                                <img src={item.thumbnail} alt="" className='w-8 h-8 object-cover' />
                            </div>
                            <div className='pl-2 flex items-center'>{item.title}</div>
                            <div className='p-2 flex items-center'>{item.category}</div>
                            <div className='p-2 flex items-center'>{item.source}</div>
                            <div 
                                onClick={() => {
                                    setDraftDetails(item);
                                    setDraftActionModal(true);
                                }}
                                className='p-2 flex items-center ml-3'
                            >
                                <IoIosMore />
                            </div>
                        </div>
                    ))}
                    {/* end of Data row */}
                </div>
                
            </div>

            {/* Pagination */}
            <div className='flex justify-between items-center mt-7'>
                <div className={`text-[12px] ml-[10px]
                    ${isDarkMode ? "text-white" : "bg-white text-black"}`}
                >
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, draftVideo.length)} of {draftVideo.length}
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
        </div>
    );
}

export default DraftTest;