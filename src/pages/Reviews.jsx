import React, {useState, useContext, useRef} from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoFilterOutline } from 'react-icons/io5'

import { DarkModeContext } from '../context/DarkModeContext'
import reviews from '../data/reviewsData'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'

import modalpic from '../assets/images/modalPic.png'

import { Modal } from 'antd';
import { CalendarOutlined } from '@ant-design/icons'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6'

function Reviews() {

    const {isDarkMode} = useContext(DarkModeContext)

    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([])
    const [checkedItems, setCheckedItems] = useState({});

    const [reviewFilterModal, setReviewFilterModal] = useState(false)
    const [reviewActionModal, setReviewActionModal] = useState(false)
    const [reviewViewModal, setReviewViewModal] = useState(false)
    const [reviewDetails, setReviewDetails] = useState('')
    const [reviewDeleteModal, setReviewDeleteModal] = useState(false)

    const [filterDropDown, setFilterDropDown] = useState(false)
    const [filterDate1, setFilterDate1] = useState('')
    const [filterDate2, setFilterDate2] = useState('')
    const [ratingType, setRatingType] = useState("Select")



    const itemsPerPage = 3;
    
 

    const startIndex = (page - 1) * itemsPerPage;
    reviews.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(reviews.length / itemsPerPage)

    const allChecked = Object.keys(checkedItems).length === reviews.length &&
                      Object.values(checkedItems).every(Boolean);

    const singleChecked = Object.values(checkedItems).filter(Boolean).length === 1;


    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // search Data logic
    const searchedData = React.useMemo(() => {
        const dataToSearch = getFilteredData?.length > 0 ? getFilteredData : reviews;

        if (searchQuery.trim() !== "") {
            const filteredData = dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.name.toLowerCase().includes(lowerCaseQuery)
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, reviews, searchQuery]);

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

    const handleCheckboxChange = (id) => {
        setCheckedItems((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
    }
    
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

    function handleCloseModal() {
        setReviewActionModal(false)
        setReviewViewModal(false)
        setReviewDeleteModal(false)
        setReviewFilterModal(false)
    }

    function handleDetail(id) {
        const reviewDetail = reviews.find((item) => item.id === id)
        if(reviewDetail) {
           setReviewDetails(reviewDetail)  
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
        const getFilterData = reviews.filter((item) => {
            const itemDate = new Date(item.date_submitted);
         
            if(filterDate1 !== "" && filterDate2 !== "" 
                && ratingType !== "") {

                const isWithinDateRange =
                (!filterDate1 || itemDate >= new Date(filterDate1)) &&
                (!filterDate2 || itemDate <= new Date(filterDate2));

                const matchesCategory =
                !ratingType || item.rating === ratingType;

    
                return (
                    isWithinDateRange &&
                    matchesCategory
                );

            }else{
                return (item.date_submitted === filterDate1 || item.date_submitted === filterDate2
                    || item.rating === ratingType
                )
            }
           
        });
    
        setGetFilterData(getFilterData); // Update filtered data
        setFilterModal(false); // Close filter modal
    }
    // function for filtering fields reset
    function handleReset() {
        setRatingType('Select')
        setFilterDate1('')
        setFilterDate2('')
    }

  return (
    <div className={`w-[98%] h-[350px] m-[auto] mt-8 bg-[#171717] rounded-xl`}>


        {/* filter modal */}
        <Modal
        open={reviewFilterModal}
        onCancel={handleCloseModal}
        footer={null}
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

            <div className='p-2'>
                <h3 className='text-white text-[13px] font-sans pb-2 mt-[-10px]'>Filter</h3>
                <hr className='opacity-[0.2] text-gray-300 w-[124%] ml-[-31px] '/>

                 {/* rating category section */}
                <div className='flex items-center justify-between mt-2 w-[115%] ml-[-15px]'>
                    <h3 className='text-[14px]'>Rating</h3>
                    <button 
                    onClick={() => setRatingType('Select')}
                    className='outline-none 
                    border-none p-1 text-[#9966CC] rounded'>Clear</button>
                </div>

                <div onClick={() => setFilterDropDown(!filterDropDown)} 
                    className='flex items-center justify-center w-[115%] 
                    ml-[-20px] bg-[#171717] p-1 rounded-xl cursor-pointer'>
                    <p className='text-white font-sans p-1 w-[100%] rounded flex items-center'>
                        {ratingType === 'Select' ? "Select"
                            : [...Array(ratingType)].map((_, i) => (
                                <AiFillStar className='text-[#9966CC]' key={i} />
                            ))
                        }
                        {ratingType < 5 && [...Array(5 - ratingType)].map((_, i) => (
                            <AiOutlineStar className='text-[#9966CC]' key={i} />
                        ))}
                    </p>
                    {filterDropDown ? <FaCaretUp /> : <FaCaretDown />}
                </div>


                {filterDropDown ? 
                <div className='flex flex-col rounded-xl cursor-pointer p-1 opacity-[0.6] mt-3 border overflow-hidden w-[115%] ml-[-20px]'>
                    {[5, 4, 3, 2, 1].map(rating => (
                        <div 
                            onClick={() => {
                                setRatingType(rating)
                                setFilterDropDown(false)
                            }}
                            className='w-[110%] ml-[-15px] border-b pl-5 pb-1'
                            key={rating}>
                            <div className='flex item-center'>
                                {[...Array(rating)].map((_, i) => (
                                    <AiFillStar className='text-[#9966CC]' key={i} />
                                ))}
                                {[...Array(5 - rating)].map((_, i) => (
                                    <AiOutlineStar className='text-[#9966CC]' key={i} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div> 
                : ""}

                <hr className='opacity-[0.2] mt-5 text-gray-300 w-[124%] ml-[-31px] '/>

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
                </div>

                <div className='mt-[50px] flex items-center justify-end'>
                    <button 
                    onClick={handleReset}
                    className='border border-[#9966CC]outline-none p-1 rounded w-[100px] text-[#9966CC]'>Clear All</button>
                    <button
                    onClick={handleFiltering}
                    className='bg-[#9966CC] ml-2 
                    border-none outline-none 
                    rounded p-1 w-[100px]'>Apply</button>
                </div>
            </div>

        </Modal>
        
        {/* review action modal */}
        <Modal
            open={reviewActionModal}
            onCancel={handleCloseModal}
            footer={null}
            closeIcon={null}
            styles={{
                content: {
                    backgroundColor: '#0B0B0B',
                    width: '120px',
                    height: 'auto',
                    color: 'white',
                    margin: '0 auto',
                    borderRadius: '8px',
                    marginLeft: '125%',
                    marginTop: '100px',
                },
                body: {
                    backgroundColor: '#1717171',
                    color: 'white',
                },
            }}
            >
    
               
                <div className='flex flex-col'>
                    <div className='border-b w-[170%] ml-[-25px] opacity-[0.6]'>
                        <button onClick={() => {
                            handleDetail(reviewDetails)
                            setReviewViewModal(true)
                            setReviewActionModal(false)
                        }}
                        className='pl-2 pb-2'>View</button>
                    </div>

    
                    <div className='w-[150%] ml-[-25px] opacity-[0.6] cursor-pointer'>
                        <button onClick={() =>{
                            setReviewDeleteModal(true)
                            handleDetail(reviewDetails)
                        }}
                        className='pl-2 pt-2 text-red'>Delete</button>
                    </div>
                </div>
    
        </Modal>

        {/* review details modal */}
        <Modal
            open={reviewViewModal}
            onCancel={handleCloseModal}
            footer={null}
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

                <div>
                    <div className='bg-[#313131] 
                    w-[116%] h-[50px] ml-[-24px] mt-[-22px] 
                    rounded-tl-xl rounded-tr-xl'>
                    </div>
                    <div lassName='w-[50px] h-[50px] m-[auto] z-[1000]'>
                        <img className='w-[50px] h-[50px] m-[auto] mt-[-25px]' src={modalpic} alt="" />
                    </div>
                    <div className='flex border rounded-2xl border-gray-900 items-center justify-between w-[110%] h-[50px] m-[auto] ml-[-15px] mt-[20px]'>
                        <div className='text-center ml-5 opacity-[0.6] border-r  h-[40px] pr-3 font-sans mt-1'>
                            <p className='text-[10px]'>Name</p>
                            <p className='text-[11px] w-[70px] ml-[-10px] pt-1'>{reviewDetails.name}</p>
                        </div>
                        <div className='text-center ml-3 text-[12px] opacity-[0.6] w-[100%] h-[40px] m-[auto] border-r pr-3 font-sans'>
                            <p>Date</p>
                            <p className='ml-3'>{reviewDetails.date_submitted}</p>
                        </div>
                        <div className='text-center text-[9px] opacity-[0.6] w-[100%] h-[35px] m-[auto] font-sans'>
                            <p className='mb-1'>Rating</p>
                            <p className='flex items-center justify-center mt-3'>{[...Array(reviewDetails.rating)].map((_, i) => (
                               <AiFillStar className='text-[#9966CC]'/>
                            ))}</p>
                        </div>
                    </div>

                    <div className='mt-3 mb-7'>
                        <h3 className='text-white font-sans text-[11px]'>Review</h3>
                        <p className='text-[11px] text-white pt-2'>{reviewDetails.review}</p>
                    </div>    
                </div>
        </Modal>
        {/* end of review details modal */}

        
        {/* delete alert modal */}
        <Modal
        open={reviewDeleteModal}
        onCancel={handleCloseModal}
        closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-30px' }}>X</span>}
        footer={null}
        styles={{
            content: {
                backgroundColor: 'black',
                width: '350px',
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
        
        {(!singleChecked ? 
        <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
            <div className='w-[80%] ml-[-45px]'>
                <p className='text-[20px] text-center pt-1'>Delete all Reviews?</p>
                <p className='text-[15px] text-center pt-3'>
                    Are you sure you want to delete all selected reviews? this action 
                    cannot be undone, all reviews will be permanently remove from the system
                </p>
            </div>
        </div> :  
        <div className='flex flex-col w-[128%] ml-[-20px] mt-5 items-center justify-center'>
            <div>
                <p className='text-[20px] text-center pt-1'>Delete Review?</p>
                <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                    Are you sure you want to delete this review? This action cannot be undone
                </p>
                
            </div>
        </div>)}


        <div className='w-[335px] mt-5 flex items-center justify-end pr-3'>
            <button 
            onClick={handleCloseModal}
            className='border border-[#9966CC] outline-none 
            text-[#9966CC] w-[100px] p-1 rounded ml-[-20px] mr-2'>Cancel
            </button>
            <button 
            className='border-none outline-none
                bg-red w-[100px] rounded p-1 mr-2 pl-3'>Yes delete
            </button>
        </div>

        </Modal>

        <div className={`flex items-center justify-between p-3
        ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
            <div className={`flex items-center gap-5 cursor-pointer`}>
                <h3>Reviews</h3>
            </div>
            <div className='flex gap-2'>
                {allChecked && (
                    <button onClick={()=> {
                        setReviewDeleteModal(true)
                    }}
                    className="p-2 text-[12px] rounded-xl w-[110px] cursor-pointer bg-red text-white">
                    Delete
                    </button>
                )}
                <div className={`p-1 text-[12px] rounded-xl flex items-center gap-1
                    ${isDarkMode ? "bg-[#313131] text-white" : "bg-white text-black border border-slate-200"}`}>
                    <CiSearch size={20}/>
                    <input 
                    onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery}
                        type="search" 
                    placeholder='Search by name'
                    className={` w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none
                    ${isDarkMode ? "text-white" : " text-black"}`} />
                </div>

                <div  className='flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'>
                    <IoFilterOutline />
                    <button onClick={() => {
                        setReviewFilterModal(true)
                    }}
                    className='text-[12px] outline-none border-none'>Filter</button>
                </div>
            </div>   
        </div>

        <div>
            <div className='w-[100%] h-[240px] m-[auto]'>
                {/* table header begins */}
                <div className={` h-10 grid grid-cols-7 text-[11px]
                    ${isDarkMode ? "bg-[#313131] text-white" : "bg-slate-100 text-black border-b border-b-slate-200"}`}>

                    <div className='p-2 flex items-center'>
                    <input
                    className='cursor-pointer'
                    type="checkbox"
                    checked={allChecked}
                    onChange={() => {
                    const newCheckedState = allChecked
                        ? {} // Uncheck all
                        : Object.fromEntries(reviews.map((item) => [item.id, true])); // Check all
                    setCheckedItems(newCheckedState);
                    }}
                    />
                    </div> 

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
                        Name
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('name')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('name')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center'>
                        Reviews
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('review')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('review')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center'>
                        Ratings
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('rating')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('rating')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='p-2 flex items-center'>
                        Date Submitted
                        <div className='flex flex-col'>
                            <IoIosArrowUp
                            onClick={() => sortData('date_submitted')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                            <IoIosArrowDown
                            onClick={() => sortData('date_submitted')}
                            size={10}
                            className='ml-2 cursor-pointer'
                            />
                        </div>
                    </div>
                    
                <div className='p-2 flex items-center'>Action</div>
                
                </div>


                {/* Data Rows */}
                {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                    <div 
                    onClick={() => {
                        setReviewDetails(item.id)
                    }}
                    key={item.id}
                    className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-7
                        ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                    >
                        <div className='p-2 flex items-center'>
                        <input
                        className='cursor-pointer'
                        type="checkbox"
                        checked={checkedItems[item.id] || false}
                        onChange={() => handleCheckboxChange(item.id)}
                        />
                        </div>
                        <div className='p-2 flex items-center'>{item.id}</div>
                        <div className='p-2 flex items-center ml-[-10px]'>
                            <p>{item.name}</p>
                        </div>
                        <div className='pl-2 flex items-center'>{item.review}</div>

                        <div className='p-2 flex items-center'>
                            {[...Array(item.rating)].map((_, i) => (
                               <AiFillStar className='text-[#9966CC]'/>
                            ))} 
                        </div>
                        <div className='p-2 flex items-center'>{item.date_submitted}</div>
                        <div onClick={() => setReviewActionModal(!reviewActionModal)}
                        className='p-2 flex items-center ml-3'>{item.action}</div>
                    </div>
                ))}
                {/* end of Data row */}
            </div> 
        </div>

        {/* Pagination */}
        <div className='flex justify-between items-center mt-1'>
            <div className={`text-[12px] ml-[10px]
                ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, reviews.length)} of {reviews.length}
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

export default Reviews