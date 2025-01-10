import React, {useState, useContext, useRef} from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { IoTrashOutline } from "react-icons/io5";
import videoData from '../data/TestimonyVideoData';
import { Modal } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { CiSearch } from 'react-icons/ci'
import { IoFilterOutline } from 'react-icons/io5'


import { CheckOutlined } from "@ant-design/icons";

import '../App.css'
import VideoPlayer from './VideoPlayer';
import vid1 from '../assets/vid1.mp4'

import { DarkModeContext } from '../context/DarkModeContext';


function AllVideoTest({all, setAll, uploaded, setUploaded, scheduled, setScheduled, draft, setDraft}) {
    const {isDarkMode} = useContext(DarkModeContext)

    const [getDetail, setGetDetail] = useState(false)
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([])
    const [searchQuery, setSearchQuery] = useState("");
    const [details, setDetails] = useState('')
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
    const [editSuccessfully, setEditSuccessfully] = useState(false)

    const [inputValue, setInputValue] = useState("")
    const [formData, setFormData] = useState({
        title: '',
        category: '',
    });

    

    const itemsPerPage = 3;

    const startIndex = (page - 1) * itemsPerPage;
    videoData.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(videoData.length / itemsPerPage)

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
        const dataToSearch = getFilteredData.length > 0 ? getFilteredData : videoData;

        if (searchQuery.trim() !== "") {
            const filteredData = dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.title.toLowerCase().includes(lowerCaseQuery) ||
                    item.category.toLowerCase().includes(lowerCaseQuery) ||
                    item.status.toLowerCase().includes(lowerCaseQuery)
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, videoData, searchQuery]);


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
    function handleDetail(id) {
        const videoDetail = videoData.find((item) => item.id === id)
        if(videoDetail) {
            setDetails(videoDetail)
            setEditDetails(videoDetail)
            setGetStatus(videoDetail.status)
            setDeleteDetails(videoDetail.status)
            
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
        setFormData((prev) => ({ ...prev, category }));
    };

    
    //handleChange for edit modal
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setFormData((prev) => ({ ...prev, title: newValue }));
    };

   const handleSaveEdit = () => {
    console.log(formData);
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
        const getFilterData = videoData.filter((item) => {
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
        return[
            <div className='mt-[50px]'>
                <button 
                onClick={handleCloseModal}
                className='border border-[#9966CC] outline-none p-2 rounded w-[90px] text-[#9966CC]'>
                    {editDetails.status === 'Uploaded' ? 'Cancel' : 'Upload'}
                </button>
                <button
                onClick={() => {
                    // handleFiltering()
                    handleEditSuccessful()
                    handleSaveEdit()
                }}
                className='bg-[#9966CC] ml-2 
                border-none outline-none 
                rounded p-2 w-[auto] h-[40px]'>Save Changes</button>
            </div>
        ]
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
                        height: `${details.status === 'Uploaded' ? "620px" : 
                            details.status === 'Scheduled' ? '520px' : '490px'}`,
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
                       <hr className='opacity-[0.6] w-[118%] ml-[-23px] '/> 
    
                       <div className='w-[113%] ml-[-16px] rounded-xl overflow-hidden h-[230px] mt-6'>
                        <div className=''>
                        <VideoPlayer>
                            <video src={vid1} poster={details.mycover}/>
                        </VideoPlayer>
                        </div>
                        
                       </div>
    
                        {details.status === 'Uploaded' &&
                       <div className='w-[110%] ml-[-13px] mt-2 text-[11px] h-[250px] text-white'>
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
                                <h2 className='opacity-[0.6]'>Upload Date</h2>
                                <p>{details.date_uploaded}</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Uploaded By</h2>
                                <p>{details.uploaded_by}</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Number of Views</h2>
                                <p>0</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Number of Likes</h2>
                                <p>0</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Number of Comments</h2>
                                <p>0</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Number of Shares</h2>
                                <p>0</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Status</h2>
                                <p className={`${details.status === 'Uploaded' ? 
                                'border border-green-900 text-green-700 p-1 rounded-xl' : 
                                details.status === 'Scheduled' ? 'border border-yellow-600 text-yellow-600' : 
                                'border border-gray-400 text-gray-400'}`}>{details.status}</p>
                            </div>
                       </div>}
    
                       {details.status === 'Scheduled' && 
                        <div className='w-[110%] ml-[-13px] mt-2 text-[11px] h-[200px] text-white'>
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
                                <h2 className='opacity-[0.6]'>Scheduled Date</h2>
                                <p>08/08/24</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Scheduled Time</h2>
                                <p>03:40pm</p>
                            </div>
                            <div className='flex items-center justify-between p-2 pt-1'>
                                <h2 className='opacity-[0.6]'>Status</h2>
                                <p className={`${details.status === 'Scheduled' && 
                                    'border border-yellow-600 text-yellow-600 w-[70px] text-center rounded-xl text-[10px] p-[3px]'}`}>{details.status}</p>
                            </div>
                        </div>
                       }
    
                       {details.status === 'Draft' && 
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
                                <p className={`${details.status === 'Draft' && 
                                    'border border-gray-600 text-gray-600 w-[70px] text-center rounded-xl text-[10px] p-[3px]'}`}>{details.status}</p>
                            </div>
                        </div>
                       }
                    </div>
                ) : (
                <p>No details available</p>
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
                            handleDetail(getDetail)
                            setVideoViewModal(true)
                            setVideoActionModal(false)
                        }}
                        className='pl-2'>View</button>
                    </div>
    
                    <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                        <button 
                        onClick={() => {
                            handleDetail(editDetails)
                            setOpenEditModal(true)
                            setVideoActionModal(false)
                        }}
                        className='pl-2'>Edit</button>
                    </div>
    
                    <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                        <button onClick={() => {
                            handleDetail(deleteDetails)
                            setDeleteVideoTest(true)
                            setVideoActionModal(false)
                        }}
                        className='pl-2 pt-4 text-red-700'>Delete</button>
                    </div>
                </div>
    
            </Modal>
    
             {/*all video Edit modal */}
             <Modal
                open={openEditModal}
                onCancel={handleCloseModal}
                footer={EditUploadedModalFooterButton}
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
            >
    
                <div>
                    <h3 className='text-white text-[18px] font-sans pb-2 mt-[-10px]'>
                        Edit Video Testimony
                    </h3>
                    <hr className='opacity-[0.2] text-gray-300 w-[117%] ml-[-25px] '/>
    
                    <div>
                        <form>
                        <div className=''>
                            <p className='mt-5 ml-[-10px]'>Title</p>
                            <input 
                            value={inputValue}
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
    
                        {editDetails.status === 'Scheduled' &&
                          <>
                            <div className='mt-3'>
                            <label htmlFor="edited-date" className='ml-[-10px]'>Scheduled Date</label>
                            <input type='date' 
                            onChange={(e) => setEditDate(e.target.value)}id='edited-date'
                            value={editDate} onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            placeholder='08/08/24'
                            className='bg-[#171717] w-[110%] ml-[-15px] p-2 border-none outline-none rounded-xl' 
                            />
                          </div>
    
    
                            <div className='mt-3 flex flex-col'>
                                <label htmlFor="datePicker" className='ml-[-10px]'>Scheduled Time</label>
                                <div>
                                    <input onChange={(e) => setEditTime(e.target.value)}
                                    type='time' placeholder='08:00PM' value={editTime} 
                                    className='bg-[#171717] w-[110%] ml-[-15px] p-2 border-none outline-none rounded-xl'/>
                                </div>
                            </div>
                        </>
                        }
                       </form>
                    </div>
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
                        {deleteDetails === 'Scheduled' && 
                            <>
                            <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                            <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                Are you sure you want to delete this Scheduled testimony? This action will 
                                removed this testimony permanently, and it will not 
                                be uploaded on the scheduled date and time.' 
                            </p>
                            <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                            <button onClick={handleDeleteSuccessful}
                            className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                            </>
                        }
    
                        {deleteDetails === 'Uploaded' && 
                            <>
                            <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                            <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                Are you sure you want to delete this Uploaded testimony? Once deleted the 
                                testimony will be remove from the platform and will no longer be visible to users.
                                This action cannot be undone 
                            </p>
                            <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                            <button onClick={handleDeleteSuccessful}
                             className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                            </>
                        }
    
                        {deleteDetails === 'Draft' && 
                            <>
                            <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                            <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                                Are you sure you want to delete this draft? This action will permernently remove this 
                                testimony from your drafts and cannot be undone 
                            </p>
                            <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                            <button onClick={handleDeleteSuccessful}
                             className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
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
                    
                    
                    <div className='flex items-center w-[265px] ml-[-25px]'>
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
                                onClick={() => sortData('date_uploaded')}
                                size={8}
                                className='ml-1 cursor-pointer'
                                />
                                <IoIosArrowDown
                                onClick={() => sortData('date_uploaded')}
                                size={8}
                                className='ml-1 cursor-pointer'
                                />
                            </div>
                        </div>
                    </div>
    
                    <div className='flex items-center w-[250px] ml-[-45px]'>
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
                        <div className='p-2 flex flex-1 w-[50px] h-[50px] items-center'>
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
                        <div className='p-2 flex flex-1 w-[50px] h-[50px] items-center'>
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
                    </div>
    
                    <div className='flex items-center w-[360px] ml-[-80px]'>
                        <div className='p-2 flex w-[90px] h-[50px] items-center'>
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
                    setGetDetail(item.id)
                    setEditDetails(item.id)
                    setDeleteDetails(item.status)
                }}
                key={item.id}
                className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] flex items-center
                 ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                    <div onClick={() => setDeleteDetails(item.status)} className='flex items-center w-[260px]'>
                        <div className='p-2 flex w-[60px] h-[50px] items-center'>{item.id}</div>
                        <div className='p-2 flex w-[103px] h-[50px] items-center'>
                            <img src={item.thumbnail} alt="" />
                        </div>
                        <div className='pl-2 flex w-[150px] h-[50px] items-center'>{item.title}</div>
                    </div>
    
                    
                    <div className='flex items-center w-[263px]'>
                        <div className='p-2 flex  w-[150px] h-[50px] items-center'>{item.category}</div>
                        <div className='p-2 flex  w-[153px] h-[50px] items-center'>{item.source}</div>
                        <div className='pl-1 flex text-[11px] w-[205px] h-[50px] items-center'>{item.date_uploaded}</div>
                    </div>
    
                    <div className='flex items-center w-[246px]'>
                        <div className='p-2 flex flex-[2]  w-[50px] h-[50px] items-center'>{item.uploaded_by}</div>
                        <div className='p-2 flex flex-1  w-[50px] h-[50px] items-center'>{item.views}</div>
                        <div className='p-2 flex flex-1 w-[50px] h-[50px] items-center'>{item.likes}</div>
                    </div>
    
                    <div className='flex items-center w-[360px]'>
                        <div className='p-2 flex  w-[90px] h-[50px] pl-5 items-center'>{item.comments}</div>
                        <div className='p-2 flex w-[90px] h-[50px] pl-5 items-center'>{item.shares}</div>
                        <div className={`p-2 flex w-[90px] pl-5 h-[30px] items-center ${item.status === 'Uploaded' ?
                            'border border-green-500 text-green-700 rounded-xl p-1 outline-none' :
                            item.status === 'Scheduled' ? 'border border-yellow-500 text-yellow-500 rounded-xl p-1' :
                            'border border-gray-500 text-gray-500 pl-7 rounded-xl'
                         }`}>
                            {item.status}
                        </div>
                        <div onClick={() => {
                            setVideoActionModal(true)
                        }} 
                        className='p-2 flex w-[90px] h-[50px] pl-5 items-center'>{item.action}</div>
                    </div>
                </div>
                 ))}
                {/* end of Data row */}
            </div>
    
              {/* Pagination */}
              <div className='flex justify-between items-center mt-6'>
                <div className={`text-[12px] ml-[10px]
                        ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, videoData.length)} of {videoData.length}
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

export default AllVideoTest