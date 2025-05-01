import React, {useState, useContext, useRef, useEffect} from 'react'
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io'
import { IoTrashOutline } from "react-icons/io5";
import videoData from '../../data/TestimonyVideoData';
import { Button, Modal } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { CiSearch } from 'react-icons/ci'
import { IoFilterOutline } from 'react-icons/io5'


import { CheckOutlined } from "@ant-design/icons";

import '../../App.css'
import VideoPlayer from './VideoPlayer';
import vid1 from '../../assets/vid1.mp4'

import { DarkModeContext } from '../../context/DarkModeContext';
import axios from 'axios';
import { notification } from 'antd';
import { uploadTestContext } from '../../context/UploadTestimonyContext';


function UploadedTest({all, setAll, uploaded, setUploaded, scheduled, setScheduled, draft, setDraft}) {
    const {isDarkMode} = useContext(DarkModeContext)
    // const {uploadTestFn, setUploadTestFn} = useContext(uploadTestContext)

    const [getDetail, setGetDetail] = useState(false)
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [details, setDetails] = useState(null)
    const [videoActionModal, setVideoActionModal] = useState(false)
    const [openVideoViewModal, setVideoViewModal] = useState(false)
    const [filterDropDown, setFilterDropDown] = useState(false)
    const [filterDate1, setFilterDate1] = useState('')
    const [filterDate2, setFilterDate2] = useState('')
    const [selectTestType, setSelectTestType] = useState('Select')
    const [ApprovalStatus, setApprovalStatus] = useState('');
    const [filterModal, setFilterModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [editDetails, setEditDetails] = useState('')
    const [deleteDetails, setDeleteDetails] = useState('')
    const [editDate, setEditDate] = useState('08/08/24')
    const [editTime, setEditTime] = useState('08:00')
    const [deleteVideoTestModal, setDeleteVideoTest] = useState(false)
    const [getStatus, setGetStatus] = useState('')
    const [deleteSuccessful, setDeleteSuccessful] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);
    const [editSuccessfully, setEditSuccessfully] = useState(false)
    const [AllVideo, setAllVideo] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [inputValue, setInputValue] = useState("")
    const [formData, setFormData] = useState({
        title: '',
        category: '',
    });


    async function fetchAllVideos() {
        const token = localStorage.getItem('token');
        setLoading(true);
        setError(null);
        
        try {
            let response = await axios.get('https://itestify-backend-nxel.onrender.com/testimonies/videos/?type=upload_now',
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            
            // Combine all responses
            const allVideos = response.data.data;
            setAllVideo(allVideos);
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setError("Failed to fetch some videos");
            setAllVideo([]);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchAllVideos();
    }, []);


    // useEffect to populate form when editDetails changes
    useEffect(() => {
        if (editDetails && openEditModal) {
            setInputValue(editDetails.title || '');
            setSelectTestType(editDetails.category || 'Select');
            setFormData({
                title: editDetails.title || '',
                category: editDetails.category || ''
            });
            if (editDetails.upload_status === 'scheduled_for_now') {
                setEditDate(editDetails.scheduled_date || '');
                setEditTime(editDetails.scheduled_time || '');
            }
        }
    }, [editDetails, openEditModal]);


    const itemsPerPage = 3;

    const startIndex = (page - 1) * itemsPerPage;
    AllVideo?.slice(startIndex, startIndex + itemsPerPage) || []
    const totalPages = Math.ceil((AllVideo?.length || 0) / itemsPerPage);

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
        const dataToSearch = getFilteredData.length > 0 ? getFilteredData : AllVideo;

        if (searchQuery.trim() !== "") {
            const filteredData = dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.title.toLowerCase().includes(lowerCaseQuery) ||
                    item.category.toLowerCase().includes(lowerCaseQuery) ||
                    item.upload_status.toLowerCase().includes(lowerCaseQuery)
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, AllVideo, searchQuery]);


    //sorted data logic
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

    //function to handle details
    async function handleDetail(id) {
        try {
            const token = localStorage.getItem('token');
            setLoading(true); // Set loading state
            
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
                const videoDetail = response.data;
                
                setDetails(videoDetail);
                setEditDetails(videoDetail);
                setGetStatus(videoDetail.upload_status);
                setDeleteDetails(videoDetail.upload_status);
            } else {
                console.error("Unexpected API response format:", response);
                throw new Error("Unexpected API response format");
            }
        } catch (error) {
            console.error("Error fetching video details:", error);
            // More detailed error logging
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
            
            setError("Failed to load video details");
        } finally {
            setLoading(false);
        }
    }

    //function to handle nextpage pagination
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
        setVideoActionModal(false)
        setVideoViewModal(false)
        setFilterModal(false)
        setOpenEditModal(false)
        setDeleteVideoTest(false)
    };

    //handleChange for approvalStatus
    const handleChange = (event) => {
        setApprovalStatus(event.target.value);
    }
    
    // function for filtering fields reset
    function handleReset() {
        setSelectTestType('Select')
        setApprovalStatus('')
        setFilterDate1('')
        setFilterDate2('')
    }

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
            title: newValue 
        }));
    };

    const handleUploadEdit = async (id) => {
        // Validate ID
        if (!id) {
          notification.error({
            message: 'Error',
            description: 'No testimony ID provided',
            placement: 'topRight'
          });
          return;
        }
      
        // Validate required fields
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
      
          // Prepare request data
          const requestData = {
            title: inputValue,
            category: selectTestType,
            upload_status: 'upload_now',
            ...(editDetails?.upload_status === 'scheduled_for_now' && {
              scheduled_date: editDate,
              scheduled_time: editTime
            })
          };
      
          // API call
          const response = await axios.put(
            `https://itestify-backend-nxel.onrender.com/testimonies/videos/${id}/`,
            requestData,
            {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
      
          // Handle success
          notification.success({
            message: 'Success',
            description: 'Testimony updated successfully',
            placement: 'topRight'
          });
      
          // Close modal and refresh data
          handleCloseModal();
          fetchAllVideos();
          
          // Call any additional success handler
          if (handleEditSuccessful) {
            handleEditSuccessful();
          }
      
        } catch (error) {
          console.error('Update error:', error);
          
          // Enhanced error handling
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

    const handleSaveEdit = async (id) => {
        if (!id) {
            notification.error({
                message: 'Error',
                description: 'No testimony ID provided',
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
                ...(editDetails.upload_status === 'scheduled_for_now' && {
                    scheduled_date: editDate,
                    scheduled_time: editTime
                })
            };

            const response = await axios.put(
                `https://itestify-backend-nxel.onrender.com/testimonies/videos/${id}/`,
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
            fetchAllVideos()

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

    const handleDeleteVideoTest = async (id) => {
        setIsDeleting(true)
        if (!id) {
            console.error('No ID provided for deletion');
            message.error('No testimony selected for deletion');
            return;
        }
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Verify token exists
        console.log('Deleting video ID:', id); // Verify ID is correct
        
        try {
            const response = await axios.delete(
                `https://itestify-backend-nxel.onrender.com/testimonies/videos/${id}/`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log('Delete response:', response);
            fetchAllVideos()
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
        }finally{
            setIsDeleting(false)
        }
    };

    function handleFilterDate1(event) {
        setFilterDate1(event.target.value)
    }
    
    //function handling the second date input
    function handleFilterDate2(event) {
        setFilterDate2(event.target.value)
    }

     //function handling the filtering logic
     function handleFiltering() {
        const getFilterData = AllVideo.filter((item) => {
            const itemDate = new Date(item.date_uploaded);
         
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
                return (item.date_uploaded === filterDate1 || item.date_uploaded === filterDate2
                    || item.category === selectTestType || item.status === ApprovalStatus
                )
            }
           
        });
    
        setGetFilterData(getFilterData); // Update filtered data
        setFilterModal(false); // Close filter modal
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
    
    //function fo filter modal footer button
    function EditUploadedModalFooterButton() {
        return (
          <div className='mt-[50px]' key="edit-footer">
            <button 
              onClick={
                editDetails?.upload_status === 'upload_now'
                  ? handleCloseModal
                  : () => handleUploadEdit(editDetails?.id)
              }
              className='border border-[#9966CC] outline-none p-2 rounded w-[90px] text-[#9966CC]'
            >
              {editDetails?.upload_status === 'upload_now' ? 'Cancel' : 'Upload'}
            </button>
            
            <Button 
              loading={loading}
              onClick={() => handleSaveEdit(editDetails?.id)}
              className='bg-[#9966CC] ml-2 border-none outline-none rounded p-2 w-[auto] h-[40px]'
            >
              Save Changes
            </Button>
          </div>
        );
      }


    function handleDeleteSuccessful() {
        setDeleteSuccessful(true)
        setDeleteVideoTest(false)

        let successTimer = setTimeout(() => {
            setDeleteSuccessful(false)
        },2000)

        return () => {
            clearTimeout(successTimer)
        }
    }

    function handleEditSuccessful() {
       setOpenEditModal(false)
       setEditSuccessfully(true)
        let successTimer = setTimeout(() => {
            setEditSuccessfully(false)
        },2000)

        return () => {
            clearTimeout(successTimer)
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

    // const renderCategoryDropdown = () => (
    //     <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[110%] ml-[-13px]'>
    //         {['healing', 'deliverance', 'faith', 'salvation'].map((category) => (
    //             <div
    //                 key={category}
    //                 onClick={() => {
    //                     handleSelectCategory(category);
    //                     setFilterDropDown(false);
    //                 }}
    //                 className="w-[110%] ml-[-15px] border-b pl-5 pb-1 hover:bg-gray-700"
    //             >
    //                 <button 
    //                     type="button"
    //                     className="w-full text-left p-2 capitalize"
    //                 >
    //                     {category}
    //                 </button>
    //             </div>
    //         ))}
    //     </div>
    // );

    
    return (
        <div className={`${!isDarkMode ? 'border h-[350px] rounded-xl' : 'border-none'}`}> 
            {/* all video filter modal */}
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
    
                       {/* Approval status section */}
                        <div className='flex items-center justify-between mt-3'>
                            <h3 className='text-[14px]'>Approval Status</h3>
                        </div>
    
                        <div className='flex items-center gap-5'>
                            <div className="flex gap-6 ml-[10px] mt-5">
                                <div className="flex items-center cursor-pointer">
                                    <div className={`w-[16px] h-[16px] rounded-full 
                                        border border-[#9966CC] mr-1
                                        ${ApprovalStatus === 'Uploaded' ? 
                                        'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                    <input
                                    type="radio"
                                    id="uploaded"
                                    name="status"
                                    value="Uploaded"
                                    checked={ApprovalStatus === 'Uploaded'}
                                    onChange={handleChange}
                                    className="hidden peer cursor-pointer"
                                    />
                                    <label
                                        className='cursor-pointer'
                                        htmlFor="uploaded"
                                        >
                                        Uploaded
                                    </label>
                                </div>
                                <div className="flex items-center cursor-pointer">
                                    <div className={`w-[16px] h-[16px] rounded-full 
                                        border border-[#9966CC] mr-1 cursor-pointer
                                        ${ApprovalStatus === 'Scheduled' ? 
                                        'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                    <input
                                    type="radio"
                                    id="scheduled"
                                    name="status"
                                    value="Scheduled"
                                    checked={ApprovalStatus === 'Scheduled'}
                                    onChange={handleChange}
                                    className="hidden peer"
                                    />
                                    <label
                                    className='cursor-pointer'
                                    htmlFor="scheduled"
                                    >
                                    Scheduled
                                    </label>
                                </div>
                                <div className="flex items-center cursor-pointer">
                                    <div className={`w-[16px] h-[16px] rounded-full 
                                        border border-[#9966CC] mr-1
                                        ${ApprovalStatus === 'Draft' ? 
                                        'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                    <input
                                    type="radio"
                                    id="draft"
                                    name="status"
                                    value="Draft"
                                    checked={ApprovalStatus === 'Draft'}
                                    onChange={handleChange}
                                    className="hidden peer"
                                    />
                                    <label
                                    className='cursor-pointer'
                                    htmlFor="draft"
                                    >
                                    Draft
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    
            </Modal>
    
             {/* testimony video details modal */}
             <Modal
                open={openVideoViewModal}
                onCancel={handleCloseModal}
                footer={null}
                closable={true}
                closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-10px' }}>X</span>}
                styles={{
                    content: {
                    backgroundColor: '#171717',
                    width: '300px',
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
                    <hr className='opacity-[0.6] w-[118%] ml-[-23px]'/> 
                    
                    {/* Video Player Section */}
                    <div className='w-[113%] ml-[-16px] rounded-xl overflow-hidden h-[230px] mt-6 relative'>
                    <VideoPlayer videoUrl={details.video_file}>
                    <video 
                        poster={details.thumbnail || 'No thumbnail avialable'}
                        style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                        }}
                    />
                    </VideoPlayer>
                    </div>
                    
                    {/* Details Sections */}
                    {details.upload_status === 'upload_now' && (
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
                            {details.created_at ? 
                                new Date(details.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                                }) : 'N/A'
                            }
                            </p>
                        </div>
                        <div className='flex items-center justify-between p-2 pt-1'>
                            <h2 className='opacity-[0.6]'>Uploaded By</h2>
                            <p>{details.uploaded_by?.full_name || 'N/A'}</p>
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
                    
            {/* all video action modal */}
            <Modal
                open={videoActionModal}
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
                        marginLeft: '133%',
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
                            handleDetail(getDetail)// Pass just the ID here
                            setVideoViewModal(true)

                        }}
                        className='pl-2'>View</button>
                    </div>

                    <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                        <button 
                        onClick={() => {
                            handleDetail(editDetails) // Pass just the ID here
                            setOpenEditModal(true)
                            setVideoActionModal(false)
                            setVideoViewModal(false)
                        }}
                        className='pl-2'>Edit</button>
                    </div>

                    <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                        <button onClick={() => {
                            
                            setDeleteVideoTest(true)
                            setVideoActionModal(false)
                        }}
                        className='pl-2 pt-4 text-red'>Delete</button>
                    </div>
                </div>
            </Modal>
    
             {/*all video Edit modal */}
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

                        {/* Conditional Scheduled Fields */}
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


            {/* all video delete  modal */}
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
                        
    
                        {deleteDetails === 'upload_now' && 
                            <>
                            <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                            <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                Are you sure you want to delete this Uploaded testimony? Once deleted the 
                                testimony will be remove from the platform and will no longer be visible to users.
                                This action cannot be undone 
                            </p>
                            <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                            <button 
                                onClick={() => handleDeleteVideoTest(details?.id)}
                                disabled={isDeleting}
                                className={`mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2 ${isDeleting ? 'opacity-50' : ''}`}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes delete'}
                            </button>
                            </>
                        }
                    </div>
                </div>
    
            </Modal>
    
            {/* all video success modal */}
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
                    <p className='text-[20px] text-center pt-3'>Testimony deleted successfully</p>
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
            }}
            >
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
    
            
            <div className={`flex items-center justify-between p-3
                ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
                <div className={`flex items-center gap-5 cursor-pointer`}>
                    <h3 onClick={() => {
                        setAll(true)
                        setUploaded(false)
                        setScheduled(false)
                        setDraft(false)
                    }}
                    className={`font-sans ${all && isDarkMode ? 
                    'text-white border-b-4 border-b-[#9966CC]': all && !isDarkMode ? 
                    'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>All</h3>
                    <h3 onClick={() => {
                        setAll(false)
                        setUploaded(true)
                        setScheduled(false)
                        setDraft(false)
                    }}
                    className={`font-sans ${uploaded && isDarkMode ? 
                        'text-white border-b-4 border-b-[#9966CC]': uploaded && !isDarkMode ? 
                        'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>Uploaded</h3>
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
                    className={`font-sans ${draft && isDarkMode ? 
                        'text-white border-b-4 border-b-[#9966CC]': draft && !isDarkMode ? 
                        'text-black border-b-4 border-b-[#9966CC]' : 'text-gray-400 opacity-[0.5]'}`}>Drafts</h3>
                </div>
                <div className='flex gap-2'>
                <div className={`p-1 text-[12px] rounded-xl flex items-center gap-1
                    ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border border-slate-200"}`}>
                    <CiSearch size={20}/>
                    <input 
                    onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}
                        type="search" 
                    placeholder='Search by name,category'
                    className={` w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none
                    ${isDarkMode ? "text-white" : " text-black"}`} />
                </div>
                <div onClick={() => setFilterModal(true)} className='flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'>
                    <IoFilterOutline />
                    <button 
                    className='text-[12px] outline-none border-none'>Filter</button>
                </div>
               </div>    
            </div>
    
             <div className='w-[100%] m-[auto] h-[220px]'> 
                {/* Table Header Section */}
                <div className={`w-[100%] h-[50px] text-[11px] m-[auto] bg-[#313131] grid grid-cols-4
                    ${isDarkMode ? "text-white" : "bg-slate-100 text-black border-b border-b-slate-200"}`
                }>
                    <div className='flex items-center w-[260px]'>
                        <div className='p-2 flex w-[50px] h-[50px] items-center'>
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
                        <div className='p-2 flex w-[86.6px] h-[50px] items-center'>
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
                        <div className='pl-5 flex w-[150px] h-[50px] items-center'>
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
                    </div>
                    
                    
                    <div className='flex items-center w-[265px]  ml-[-25px]'>
                        <div className='p-2 flex w-[150px] h-[50px] items-center'>
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
                        <div className='p-2 flex w-[160px] h-[50px] items-center'>
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
                        <div className='pl-1 flex text-[11px] w-[200px] h-[50px] items-center'>
                            Date Uploaded
                            <div className='flex flex-col'>
                                <IoIosArrowUp
                                onClick={() => sortData('created_at')}
                                size={8}
                                className='ml-1 cursor-pointer'
                                />
                                <IoIosArrowDown
                                onClick={() => sortData('created_at')}
                                size={8}
                                className='ml-1 cursor-pointer'
                                />
                            </div>
                        </div>
                    </div>
    
                    <div className='flex items-center w-[250px] ml-[-30px]'>
                        <div className='p-2 flex flex-[2] w-[50px] h-[50px] items-center'>
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
                        <div className='p-2 flex flex-1 w-[50px] h-[50px] items-center ml-[-27px]'>
                            Views
                            <div className='flex flex-col'>
                                <IoIosArrowUp
                                onClick={() => sortData('views')}
                                size={10}
                                className='ml-2 cursor-pointer'
                                />
                                <IoIosArrowDown
                                onClick={() => sortData('views')}
                                size={10}
                                className='ml-2 cursor-pointer'
                                />
                            </div>
                        </div>
                        <div className='p-2 flex flex-1 w-[50px] h-[50px] items-center ml-[-13px]'>
                            Likes
                            <div className='flex flex-col ml-[-3px] '>
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
                    </div>
    
                    <div className='flex items-center w-[360px] ml-[-80px]'>
                        <div className='p-2 flex w-[90px] h-[50px] items-center ml-[5px]'>
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
                        <div className='p-2 flex w-[90px] h-[50px] items-center'>
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
                        <div className='p-2 flex w-[90px] h-[50px] items-center'>
                            Status
                        </div>
                        <div className='p-2 flex w-[90px] h-[50px] items-center'>
                        Action
                        </div>
                    </div>
                </div>
                {/* end of table header section */}
    
                
    
                 {/* Data Rows */}
                 {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                <div
                onClick={() => {
                    // setGetDetail(item.id)
                    // setEditDetails(item.id)
                    // setDeleteDetails(item.upload_status)
                    setGetDetail(item.id)
                    setEditDetails(item) // Set the entire item object
                    setDeleteDetails(item.upload_status)
                    setDetails(item) 
                }}
                key={item.id}
                className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] flex items-center
                 ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                    <div onClick={() => setDeleteDetails(item.upload_status)} className='flex items-center w-[260px]'>
                        <div className='p-2 flex w-[60px] h-[50px] items-center'>{startIndex + index + 1}</div>
                        <div className='p-2 flex w-[103px] h-[50px] items-center'>
                            <img src={item.thumbnail} alt="" />
                        </div>
                        <div className='pl-2 flex w-[150px] h-[50px] items-center'>
                        {item.title.length > 12 ? `${item.title.slice(0, 12)}...` : item.title}
                        </div>
                    </div>
    
                    
                    <div className='flex items-center  w-[263px]'>
                        <div className='p-2 flex w-[150px] ml-[-15px] h-[50px] items-center'>{item.category}</div>
                        <div className='p-2 flex  w-[153px] h-[50px] items-center'>{item.source}</div>
                        <div className='pl-1 flex text-[11px] w-[205px] h-[50px] items-center'>
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                        </div>
                    </div>
    
                    <div className='flex items-center w-[216px]'>
                        <div className='p-2 ml-[-5px] flex  flex-[2]  w-[50px] h-[50px] items-center'>{item.uploaded_by?.full_name}</div>
                        <div className='p-2 ml-[5px] flex flex-1  w-[130px] h-[50px] items-center'>{item.views || 0}</div>
                        <div className='p-2 ml-[5px] flex flex-1 w-[50px] h-[50px] items-center'>{item.likes || 0}</div>
                    </div>
    
                    <div className='flex items-center w-[320px]'>
                        <div className='p-2 flex  w-[90px] h-[50px] pl-5 items-center'>{item.comments || 0}</div>
                        <div className='p-2 flex w-[90px] h-[50px] pl-5 items-center'>{item.shares || 0}</div>
                        <div className={`p-2 flex  w-[120px] h-[30px] pl-2 items-center font-semibold ${item.upload_status === 'upload_now' ?
                            'border border-green-500 text-green-700 rounded-xl p-1 pl-3 outline-none' :
                            item.upload_status === 'schedule_for_later' ?  'border w-[120px] border-yellow-500 text-yellow-500 rounded-xl p-1' :
                            'border border-gray-500 text-gray-500 pl-9 rounded-xl'
                         }`}>
                            {item.upload_status.charAt(0).toUpperCase() + item.upload_status.slice(1)}
                        </div>
                        <div onClick={() => {
                            setVideoActionModal(true)
                        }} 
                        className='p-2 flex w-[90px] h-[50px] pl-10 items-center'>
                            <IoIosMore />
                        </div>
                    </div>
                </div>
                 ))}
                {/* end of Data row */}
            </div>
    
              {/* Pagination */}
              <div className='flex justify-between items-center mt-6'>
                <div className={`text-[12px] ml-[10px]
                        ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, AllVideo.length)} of {AllVideo.length}
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
    )
}

export default UploadedTest