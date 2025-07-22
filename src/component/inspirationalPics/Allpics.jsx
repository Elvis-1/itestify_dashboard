import React, { useState, useContext, useEffect, useRef } from 'react'
import { DarkModeContext } from '../../context/DarkModeContext';
import { IoFilterOutline } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';


import picturesData from '../../data/picsData'
import All from './All';
import Uploaded from './Uploaded';
import Schedule from './Schedule';
import Draft from './Draft';
import { Button, Modal } from 'antd';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa6';
import { CalendarOutlined } from '@ant-design/icons';

function Allpics() {

    const {isDarkMode} = useContext(DarkModeContext)

    const [all, setAll] = useState(true)
    const [uploaded, setUploaded] = useState(false)
    const [scheduled, setScheduled] = useState(false)
    const [draft, setDraft] = useState(false)

    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([])
    const [allInspirationalPicsData, setAllInspirationalPicsData] = useState([])
    const [filterModal, setFilterModal] = useState(false)
    const [filterDropDown, setFilterDropDown] = useState(false)
    const [filterDate1, setFilterDate1] = useState('')
    const [filterDate2, setFilterDate2] = useState('')
    const [selectTestType, setSelectTestType] = useState('Select')
    const [ApprovalStatus, setApprovalStatus] = useState('')
    const [inputValue, setInputValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

     const itemsPerPage = 6;

   const startIndex = (page - 1) * itemsPerPage;
   const currentPageData = Array.isArray(allInspirationalPicsData) 
    ? allInspirationalPicsData.slice(startIndex, startIndex + itemsPerPage) 
    : [];
   const totalPages = Math.ceil((Array.isArray(allInspirationalPicsData) ? allInspirationalPicsData.length : 0) / itemsPerPage);


    const fetchInspirationalPics = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            try {
                if(!token) {
                    console.error('No token found in localStorage');
                    return;
                }
                    const response = await axios.get('https://itestify-backend-38u1.onrender.com/inspirational/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                    )
                    console.log('API Response:', response);
                    setAllInspirationalPicsData(response?.data?.data.data || response?.data || []);
            } catch (error) {
                console.log('Error fetching inspirational pictures:', error);
                setError('Failed to all fetch inspirational pictures');
                setAllInspirationalPicsData([]);
            }finally {
                setLoading(false);
            }
    }
    useEffect(()=> {
        fetchInspirationalPics()
    }, [])
   

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
        const dataToSearch = Array.isArray(getFilteredData) && getFilteredData.length > 0 
            ? getFilteredData 
            : Array.isArray(allInspirationalPicsData) 
                ? allInspirationalPicsData 
                : [];
    
        if (searchQuery.trim() !== "") {
            return dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item?.source?.toLowerCase().includes(lowerCaseQuery)
                );
            });
        }
    
        return dataToSearch;
    }, [getFilteredData, allInspirationalPicsData, searchQuery]);
        

    const sortedData = React.useMemo(() => {
        const dataToSort = Array.isArray(searchedData) ? searchedData : [];
        
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
    
    function handleFilterDate1(event) {
        setFilterDate1(event.target.value)
    }
        
    //function handling the second date input
    function handleFilterDate2(event) {
        setFilterDate2(event.target.value)
    }

    //function handling the filtering logic
    function handleFiltering() {
        const getFilterData = allInspirationalPicsData.filter((item) => {
            const itemDate = new Date(item.created_at);
            
            if(filterDate1 !== "" && filterDate2 !== "" 
                && selectTestType !== "" && ApprovalStatus !== "") {
    
                const isWithinDateRange =
                (!filterDate1 || itemDate >= new Date(filterDate1)) &&
                (!filterDate2 || itemDate <= new Date(filterDate2));
    
                // const matchesCategory =
                // !selectTestType || item.category === selectTestType;
    
                const matchesStatus =
                !ApprovalStatus || item.status === ApprovalStatus;
    
                return (
                    isWithinDateRange && matchesStatus
                    // matchesCategory &&
                );
    
            }else{
                return (item.created_at === filterDate1 || item.created_at === filterDate2  || item.status === ApprovalStatus
                )
            }
            
        });
    
        setGetFilterData(getFilterData); // Update filtered data
        setFilterModal(false); // Close filter modal
    }

    function handleCloseModal() {
        setFilterModal(false)
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

     //handleChange for approvalStatus
    const handleChange = (event) => {
        setApprovalStatus(event.target.value);
    }

    function handleReset() {
        setApprovalStatus('')
        setFilterDate1('')
        setFilterDate2('')
    }
        
  return (
    <>
         {/* all inspirational pictures filter modal */}
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
                    {/* <div className='flex items-center justify-between mt-2 w-[110%] ml-[-15px]'>
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
                    </div>: ""} */}

                    {/* Approval status section */}
                    <div className='flex items-center justify-between mt-3'>
                        <h3 className='text-[14px]'>Approval Status</h3>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className="flex gap-6 ml-[10px] mt-5">
                            <div className="flex items-center cursor-pointer">
                                <div className={`w-[16px] h-[16px] rounded-full 
                                    border border-[#9966CC] mr-1
                                    ${ApprovalStatus === 'upload_now' ? 
                                    'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                <input
                                type="radio"
                                id="uploaded"
                                name="status"
                                value="upload_now"
                                checked={ApprovalStatus === 'upload_now'}
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
                                    ${ApprovalStatus === 'drafts' ? 
                                    'bg-[#9966CC]' : 'bg-transparent'}`}></div>
                                <input
                                type="radio"
                                id="draft"
                                name="status"
                                value="drafts"
                                checked={ApprovalStatus === 'drafts'}
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
        <div className='flex items-center justify-end mt-5 mr-4 mb-5'>
           <button className='bg-[#9966CC] text-[14px] p-1 rounded text-white'> 
            <span className='pl-1 pr-1'>+</span>Upload New Picture
           </button>
        </div>
        <div className={`w-[98%] h-[400px] m-[auto] bg-[#171717] rounded-xl`}>
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
                {all &&
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
                    {all &&
                    <div  className='flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'>
                        <IoFilterOutline />
                        <button onClick={() => {
                            setFilterModal(true)
                        }}
                        className='text-[12px] outline-none border-none'>Filter</button>
                    </div>}
                </div>}    
            </div>

            {all &&
            <All sortData={sortData} sortedData={sortedData} 
            startIndex={startIndex} itemsPerPage={itemsPerPage}
            handleNextPage={handleNextPage} handlePrevPage={handlePrevPage}
            page={page} allInspirationalPicsData={allInspirationalPicsData}
            setAllInspirationalPicsData={setAllInspirationalPicsData} totalPages={totalPages}
            loading={loading} error={error} fetchInspirationalPics={fetchInspirationalPics} />}

            {uploaded && 
            <Uploaded searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}

            {scheduled && <Schedule searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}

            {draft && <Draft searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}

        </div>
    </>
  )
}

export default Allpics