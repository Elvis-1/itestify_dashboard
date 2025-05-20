import React, {useState, useContext, useRef, useEffect} from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoFilterOutline } from 'react-icons/io5'
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io'
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { CalendarOutlined, CheckOutlined } from '@ant-design/icons';

import { Modal } from 'antd';
import { notification } from 'antd';
import axios from 'axios';
import { DarkModeContext } from '../../context/DarkModeContext';

function ScheduledTest({all, setAll, uploaded, setUploaded, scheduled, setScheduled, draft, setDraft}) {
    const {isDarkMode} = useContext(DarkModeContext)

    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([])
    const [scheduledActionModal, setScheduledActionModal] = useState(false)
    const [scheduledEditModal, setScheduledEditModal] = useState(false)
    const [scheduledDetails, setScheduledDetails] = useState([])
    const [editDetails, setEditDetails] = useState(null);
    const [scheduledVideo, setScheduledVideo] = useState([])
    const [scheduledUploadModal, setScheduleUploadModal] = useState(false)
    const [scheduledDeleteModal, setScheduleDeleteModal] = useState(false)
    const [scheduleFilterModal, setScheduleFilterModal] = useState(false)
    const [filterDate1, setFilterDate1] = useState('')
    const [filterDate2, setFilterDate2] = useState('')

    const [filterDropDown, setFilterDropDown] = useState(false)
    const [selectTestType, setSelectTestType] = useState('select')
     const [scheduleSuccessfully, setScheduleSuccessfully] = useState(false);
    const [editTime, setEditTime] = useState('08:00')
    const [editDate, setEditDate] = useState('')
    const [role, setRole] = useState('Select Role')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [inputValue, setInputValue] = useState("");
    const [formData, setFormData] = useState({
    title: '',
    category: '',
    schedule_date: '',
    schedule_time: ''
    });

    async function fetchScheduledVideo() {
        let token = localStorage.getItem('token');
        try {
            setLoading(true);
            setError(null);
    
            let response = await axios.get(
                'https://itestify-backend-nxel.onrender.com/testimonies/videos/?type=schedule_for_later', 
                { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                }
            );
            let scheduledVideos = response.data.data;
            setScheduledVideo(scheduledVideos);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setError("Failed to fetch some videos");
            setScheduledVideo([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchScheduledVideo();
    },[])

    useEffect(() => {
        if (editDetails && scheduledEditModal) {
            setInputValue(editDetails.title || '');
            setSelectTestType(editDetails.category || 'Select');
            setFormData({
                title: editDetails.title || '',
                category: editDetails.category || '',
                schedule_date: editDetails?.scheduled_datetime ? new Date(editDetails?.scheduled_datetime).toLocaleDateString() : '',
                schedule_time: editDetails?.scheduled_datetime ? new Date(editDetails?.scheduled_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
            });
        }
    }, [editDetails, scheduledEditModal]);

    const itemsPerPage = 3;

    const startIndex = (page - 1) * itemsPerPage;
    const totalPages = Math.ceil(scheduledVideo.length / itemsPerPage);


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
        const dataToSearch = getFilteredData?.length > 0 ? getFilteredData : scheduledVideo;

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
    }, [getFilteredData, scheduledVideo, searchQuery]);

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

    const handleCloseModal = () => {
       setScheduledActionModal(false)
       setScheduledEditModal(false)
       setScheduleUploadModal(false)
       setScheduleDeleteModal(false)
       setScheduleFilterModal(false)
    };

    // const handleDetail = async (id) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         setLoading(true);
            
    //         const response = await axios.get(
    //             `https://itestify-backend-nxel.onrender.com/testimonies/videos/${id}/`,
    //             { 
    //                 headers: { 
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 } 
    //             }
    //         );
            
    //         if (response.data) {
    //             const schDetail = response.data;
    //             setScheduledDetails(schDetail);
    //             setEditDetails(schDetail);
    //         } else {
    //             console.error("Unexpected API response format:", response);
    //             throw new Error("Unexpected API response format");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching video details:", error);
    //         if (error.response) {
    //             console.error("Response data:", error.response.data);
    //             console.error("Response status:", error.response.status);
    //         } else if (error.request) {
    //             console.error("No response received:", error.request);
    //         } else {
    //             console.error("Request setup error:", error.message);
    //         }
    //         setError("Failed to load video details");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                const schDetail = response.data;
                setScheduledDetails(schDetail);
                
                // Extract date and time from scheduled_datetime
                const scheduledDate = schDetail.scheduled_datetime 
                    ? new Date(schDetail.scheduled_datetime).toISOString().split('T')[0]
                    : '';
                    
                const scheduledTime = schDetail.scheduled_datetime
                    ? new Date(schDetail.scheduled_datetime).toTimeString().substring(0, 5)
                    : '08:00';
                    
                setEditDetails({
                    ...schDetail,
                    schedule_date: scheduledDate,
                    schedule_time: scheduledTime
                });
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

    function EditScheduleModalFooterButton() {
        return[
            <div className='mt-[50px]'>
                <button 
                onClick={handleCloseModal}
                className='border border-[#9966CC] outline-none p-2 rounded w-[90px] text-[#9966CC]'>
                    Upload
                </button>
                <button 
                    loading={loading}
                    onClick={() => {
                        handleSaveEdit()
                    }}
                    disabled={loading}
                    className={`bg-[#9966CC] ml-2 rounded p-2 h-[40px] ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    Save Changes
                </button>
            </div>
        ]
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

    function handleFiltering() {
        const getFilterData = scheduledVideo.filter((item) => {
            const itemDate = new Date(item.date_uploaded);
         
            if(filterDate1 !== "" && filterDate2 !== "" 
                && selectTestType !== "") {
    
                const isWithinDateRange =
                (!filterDate1 || itemDate >= new Date(filterDate1)) &&
                (!filterDate2 || itemDate <= new Date(filterDate2));
    
                const matchesCategory =
                !selectTestType || item.category === selectTestType;
    
                return (
                    isWithinDateRange &&
                    matchesCategory
                );
    
            }else{
                return (item.date_uploaded === filterDate1 || item.date_uploaded === filterDate2
                    || item.category === selectTestType
                )
            }
           
        });
    
        setGetFilterData(getFilterData); // Update filtered data
        setFilterModal(false); // Close filter modal
    }
    
    function handleReset() {
        setSelectTestType('Select')
        setFilterDate1('')
        setFilterDate2('')
    }
    function handleFilterDate1(event) {
        setFilterDate1(event.target.value)
    }
    
    //function handling the second date input
    function handleFilterDate2(event) {
        setFilterDate2(event.target.value)
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

    const handleSelectCategory = (category) => {
        setSelectTestType(category);
        setFormData(prev => ({ 
            ...prev, 
            category 
        }));
    };

    //handleChange for edit modal
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setFormData(prev => ({ 
            ...prev, 
            title: newValue,
        }));
    };

    //function to handle when the editted value is save
    const handleSaveEdit = async () => {
        if (!editDetails?.id) {
            notification.error({
                message: 'Error',
                description: 'No testimony selected for editing',
                placement: 'topRight'
            });
            return;
        }
    
        setLoading(true);
        setError(null);
    
        let controller;
        let timeoutId;
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }
    
            // Prepare request data with validation
            const requestData = {
                title: editDetails.title,
                category: editDetails.category,
            };
    
            // Only add scheduled_datetime if both date and time exist
            if (editDetails.schedule_date && editDetails.schedule_time) {
                const dateStr = `${editDetails.schedule_date}T${editDetails.schedule_time}`;
                const date = new Date(dateStr);
                
                if (isNaN(date.getTime())) {
                    throw new Error('Invalid date/time combination');
                }
                
                requestData.scheduled_datetime = date.toISOString();
            }
    
            // Setup abort controller and timeout
            controller = new AbortController();
            timeoutId = setTimeout(() => {
                controller.abort();
                throw new Error('Request timeout - server took too long to respond');
            }, 15000); // 15 second timeout
    
            console.log('Submitting data:', requestData);
    
            const response = await axios.put(
                `https://itestify-backend-nxel.onrender.com/testimonies/videos/${editDetails.id}/`,
                requestData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    signal: controller.signal
                }
            );
    
            fetchScheduledVideo();
            handleCloseModal();
            handleEditSuccessful()
            
            
    
        } catch (error) {
            console.error('Save error:', error);
            
            let errorMessage = 'Failed to update testimony';
            
            if (error.name === 'AbortError' || error.message.includes('timeout')) {
                errorMessage = 'Server took too long to respond. Please try again.';
            } else if (error.response) {
                // Handle HTTP error responses
                if (error.response.status === 401) {
                    errorMessage = 'Session expired - please login again';
                    localStorage.removeItem('token');
                } else if (error.response.data) {
                    errorMessage = error.response.data.message || 
                                 error.response.data.detail || 
                                 `Server error (${error.response.status})`;
                }
            } else if (error.request) {
                errorMessage = 'No response from server - check your connection';
            } else {
                errorMessage = error.message || 'Unknown error occurred';
            }
    
            notification.error({
                message: 'Error',
                description: errorMessage,
                placement: 'topRight',
                duration: 5
            });
    
            setError(errorMessage);
        } finally {
            // Cleanup
            if (timeoutId) clearTimeout(timeoutId);
            setLoading(false);
        }
    };
    

    const handleEditSuccessful = () => {
        setScheduledEditModal(false);
        setScheduleSuccessfully(true);
        const successTimer = setTimeout(() => {
            setScheduleSuccessfully(false);
        }, 2000);
        return () => {
            clearTimeout(successTimer);
        };
    };


  return (
    <div className={`${!isDarkMode ? 'border h-[350px] rounded-xl' : 'border-none'}`}>

         {/* Schedule filter modal */}
        <Modal
        open={scheduleFilterModal}
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
                                <CalendarOutlined onClick={handleFromDateIconClick} className="text-white ml-2"/>
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
                            onClick={() => setSelectTestType('Healing')}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1'>
                            <input type='button' 
                            value='Healing'
                            onClick={() => setSelectTestType('Healing')} />
                        </div>
                        <div 
                            onClick={() => setSelectTestType('Deliverance')}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1 cursor-pointer'>
                            <input  type='button' 
                            value='Deliverance'
                            onClick={() => setSelectTestType('Deliverance')} />
                        </div>
                        <div
                            onClick={() => setSelectTestType('Faith')}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1'>
                            <input type='button' 
                            value='Faith'
                            onClick={() => setSelectTestType('Faith')} />
                        </div>
                        <div 
                            onClick={() => setSelectTestType('Salvation')}
                            className='w-[110%] ml-[-15px] pl-5 pb-1'>
                            <input type='button' 
                            value='Salvation' 
                            onClick={() => setSelectTestType('Salvation')}/>
                        </div>
                    </div>: ""}
                </div>
            </div>

        </Modal>
        
        {/* call to action modal */}
        <Modal
            open={scheduledActionModal}
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
            }}
        >

           
            <div className='flex flex-col'>
                <div className='border-b w-[150%] ml-[-25px] pb-2 opacity-[0.6]'>
                    <button onClick={() => {
                        handleDetail(scheduledDetails.id)
                        setScheduledEditModal(true)
                        setScheduledActionModal(false)
                    }}
                    className='pl-2'>Edit</button>
                </div>

                <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                    <button
                    onClick={() => {
                        handleDetail(scheduledDetails.id)
                        setScheduleUploadModal(true)
                        setScheduledActionModal(false)
                    }}
                    className='pl-2'>Upload</button>
                </div>

                <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                    <button onClick={() => {
                        handleDetail(scheduledDetails.id)
                        setScheduleDeleteModal(true)
                        setScheduledActionModal(false)
                    }}
                    className='pl-2 pt-4 text-red-700'>Delete</button>
                </div>
            </div>

        </Modal>

        {/* Edit modal */}
        <Modal
            open={scheduledEditModal}
            onCancel={handleCloseModal}
            footer={EditScheduleModalFooterButton}
            closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-7px' }}>X</span>}
            styles={{
            content: {
                backgroundColor: '#0B0B0B',
                width: '330px',
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
        confirmLoading={loading}>

            <div>
                <h3 className='text-white text-[18px] font-sans pb-2 mt-[-10px]'>
                    Edit Video Testimony
                
                </h3>
                <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] '/>
            
                <div>
                    <div className=''>
                        <p className='mt-5 ml-[-10px]'>Title</p>
                        <input 
                        value={inputValue}
                        name='title'
                        placeholder='Edit your title'
                        onChange={handleInputChange}
                        className='bg-[#171717] mb-5 text-white 
                        rounded-xl p-2 w-[110%] 
                        ml-[-15px] outline-none border-none'/>
                    </div>

                    {/* category section */}
                    <p className='ml-[-10px]'>Category</p>
                    <div onClick={() => setFilterDropDown(!filterDropDown)} 
                    className='flex items-center justify-center w-[110%] 
                    ml-[-15px] bg-[#171717] p-1 rounded-xl cursor-pointer'>
                       <p className=' text-white
                       font-sans p-1 w-[100%] rounded'>{selectTestType}</p>
                       {filterDropDown  ? <FaCaretUp/> : <FaCaretDown/>}
                    </div>

                    {filterDropDown ? 
                    <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[110%] ml-[-13px]'>
                       {['Healing', 'Deliverance', 'Faith', 'Salvation'].map((category) => (
                            <div
                                key={category}
                                onClick={() => {
                                    handleSelectCategory(category)
                                    setFilterDropDown(false)
                                }}
                                className="w-[110%] ml-[-15px] border-b pl-5 pb-1"
                            >
                                <input type="button" value={category} />
                            </div>
                        ))}
                    </div>: ""}

                    
                      <>
                      <div className='mt-3'>
                        <label htmlFor="edited-date" className='ml-[-10px]'>Scheduled Date</label>
                        <input 
                            type="date"
                            value={editDetails?.schedule_date || ''}
                            onChange={(e) => setEditDetails(prev => ({
                                ...prev, 
                                schedule_date: e.target.value
                            }))}
                            className='bg-[#171717] w-[110%] ml-[-15px] p-2 rounded-xl'
                        />
                    </div>


                        <div className='mt-3 flex flex-col'>
                            <label htmlFor="datePicker" className='ml-[-10px]'>Scheduled Time</label>
                            <div>
                                <input 
                                    type="time"
                                    value={editDetails?.schedule_time || '08:00'}
                                    onChange={(e) => setEditDetails(prev => ({
                                        ...prev, 
                                        schedule_time: e.target.value
                                    }))}
                                    className='bg-[#171717] w-[110%] ml-[-15px] p-2 rounded-xl'
                                />
                            </div>
                        </div>
                    </>
                    
                    
                </div>
            </div>

        </Modal>

       {/* scheduled upload modal */}
        <Modal
            open={scheduledUploadModal}
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
            }}
        >
            <div className='flex flex-col w-[128%] ml-[-30px] mt-[-5px] items-center justify-center'>
                <div>
                    <>
                    <p className='text-[20px] text-center pt-1 ml-[-15px]'>Upload testimony?</p>
                    <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[390px] ml-[-55px]'>
                        You are about to update this testimony ahead of the scheduled date and time.
                        Once uploaded it will immediately become visisble to all users, and the original 
                        scheduled will be canceled, do you wish to proceed 
                    </p>

                    {/* role section */}
                    <p className='ml-[-40px] mt-5'>Role</p>
                    <div onClick={() => setFilterDropDown(!filterDropDown)} 
                    className='flex items-center justify-center w-[110%] 
                    ml-[-50px] bg-[#171717] p-1 rounded-xl cursor-pointer'>
                       <p className=' text-white
                       font-sans p-1 w-[100%] rounded'>{role}</p>
                       {filterDropDown  ? <FaCaretUp/> : <FaCaretDown/>}
                    </div>

                    {filterDropDown ? 
                    <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[110%] ml-[-50px]'>
                        <div 
                            onClick={() => setRole('Super Admin')}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1'>
                            <input type='button' 
                            value='Super Admin'
                            onClick={() => setRole('Healing')} />
                        </div>
                        <div 
                            onClick={() => setRole('Admin')}
                            className='w-[110%] ml-[-15px] pl-5 pb-1 cursor-pointer'>
                            <input  type='button' 
                            value='Admin'
                            onClick={() => setRole('Admin')} />
                        </div>
                    </div>: ""}
                    <div className='ml-[80px] mt-10'>
                        <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                        <button
                        className='mt-3 rounded bg-[#9966CC] p-2 w-[120px] ml-2'>Yes Upload</button>
                    </div>
                    </>
                </div>
            </div>

        </Modal>

        <Modal
            open={scheduleSuccessfully}
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

         {/* schedule delete modal */}
         <Modal
            open={scheduledDeleteModal}
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
                        Are you sure you want to delete this Scheduled testimony? This action will 
                        removed this testimony permanently, and it will not 
                        be uploaded on the scheduled date and time.' 
                    </p>
                    <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                    <button
                    className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                    </>
                </div>
            </div>

        </Modal>

        <div>
        <div className='flex items-center justify-between p-3'>
            <div className='flex items-center gap-5 cursor-pointer'>
                <h3 onClick={() => {
                    setAll(true)
                    setUploaded(false)
                    setScheduled(false)
                    setDraft(false)
                }}
                className={`font-sans ${all ? 'text-white border-b-4 border-b-[#9966CC]':'text-gray-400 opacity-[0.5]'}`}>All</h3>
                <h3 onClick={() => {
                    setAll(false)
                    setUploaded(true)
                    setScheduled(false)
                    setDraft(false)
                }}
                className={`font-sans ${uploaded ? 'text-white border-b-4 border-b-[#9966CC]':'text-gray-400 opacity-[0.5]'}`}>Uploaded</h3>
                <h3 onClick={() => {
                    setAll(false)
                    setUploaded(false)
                    setScheduled(true)
                    setDraft(false)
                }}
                className={`font-sans ${scheduled && isDarkMode ? 
                    'text-white border-b-4 border-b-[#9966CC]': scheduled && !isDarkMode ? 
                    'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>Sheduled</h3>
                <h3 onClick={() => {
                    setAll(false)
                    setUploaded(false)
                    setScheduled(false)
                    setDraft(true)
                }}
                className={`font-sans ${draft ? 'text-white border-b-4 border-b-[#9966CC]':'text-gray-400 opacity-[0.5]'}`}>Drafts</h3>
            </div>
            <div className='flex gap-2'>
            <div className={`p-1 text-[12px] rounded-xl flex items-center gap-1
                ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border border-slate-200"}`}>
                <CiSearch size={20}/>
                <input 
                onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}
                type="search" 
                placeholder='Search by name,category'
                className='w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none' />
            </div>
            <div onClick={()=> setScheduleFilterModal(true)} className='flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'>
                <IoFilterOutline />
                <button className='text-[12px] outline-none border-none'>Filter</button>
            </div>
           </div>    
        </div>

        <div className='w-[100%] h-[240px] m-[auto]'>
            {/* table header begins */}
            <div className={` h-10 grid grid-cols-8 text-[11px]
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
            <div className='p-2 flex items-center ml-[-10px]'>
                    Scheduled Date
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('scheduled_date')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('scheduled_date')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                    </div>
            </div>
            <div className='p-2 flex items-center'>
                    Time
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('time')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('time')}
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
                    setScheduledDetails(item.id)
                    handleDetail(item.id)
                }}
                key={item.id}
                className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-8
                    ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                        <div className='p-2 flex items-center'>{startIndex + index + 1}</div>
                        <div className='p-2 flex items-center ml-[-10px] w-[70px]'>
                            <img src={item.thumbnail} alt="" />
                        </div>
                        <div className='pl-2 flex items-center'>{item.title.slice(0,10) + "..."}</div>

                        <div className='p-2 flex items-center'>{item.category}</div>
                        <div className='p-2 flex items-center'>{item.source.slice(0,10) + "..."}</div>
                        <div className='pl-1 flex items-center'>
                            {item.scheduled_datetime ? new Date(item.scheduled_datetime).toLocaleDateString() : ''}
                        </div>

                
                        <div className='p-2 flex items-center'>
                            {item.scheduled_datetime ? new Date(item.scheduled_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </div>

                        <div onClick={() => {
                            setScheduledDetails(item)
                            setScheduledActionModal(true)
                        }}
                        className='p-2 flex items-center ml-3'><IoIosMore /></div>
                </div>
            ))}
            {/* end of Data row */}
        </div>


        {/* Pagination */}
        <div className='flex justify-between items-center mt-1'>
            <div className={`text-[12px] ml-[10px]
                ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, scheduledVideo.length)} of {scheduledVideo.length}
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
    </div>
  )
}

export default ScheduledTest