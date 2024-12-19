import React, {useState, useContext} from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoFilterOutline } from 'react-icons/io5'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

import draftVideo from '../data/DraftVideo';
import { DarkModeContext } from '../context/DarkModeContext';

import { Modal } from 'antd';

function DraftTest({all, setAll, uploaded, setUploaded, scheduled, setScheduled, draft, setDraft}) {
    const {isDarkMode} = useContext(DarkModeContext)
    
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([])

    const [draftActionModal, setDraftActionModal] = useState(false)
    const [draftEditModal, setDraftEditModal] = useState(false)
    const [draftDetails, setDraftDetails] = useState([])
    const [draftUploadModal, setDraftUploadModal] = useState(false)
    const [draftDeleteModal, setDraftDeleteModal] = useState(false)

    const [filterDropDown, setFilterDropDown] = useState(false)
    const [selectTestType, setSelectTestType] = useState('select')
    const [role, setRole] = useState('Select Role')

    const itemsPerPage = 3;

    const startIndex = (page - 1) * itemsPerPage;
    draftVideo.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(draftVideo.length / itemsPerPage)

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
        
    // function to handle prev page pagination
    const handlePrevPage = () => {
        if (page > 1) {
          setPage((prev) => prev - 1);
        }
    };

    const handleCloseModal = () => {
        setDraftActionModal(false)
        setDraftEditModal(false)
        setDraftUploadModal(false)
        setDraftDeleteModal(false)
    };

    function handleDetail(id) {
        const draftVideoDetail = draftVideo.find((item) => item.id === id)
        if(draftVideoDetail) {
            setDraftDetails(draftVideoDetail)
        }
       
    }

    function EditDraftModalFooterButton() {
        return[
            <div className='mt-[50px]'>
                <button 
                onClick={handleCloseModal}
                className='border border-[#9966CC] outline-none p-2 rounded w-[90px] text-[#9966CC]'>
                    Upload
                </button>
                <button
               
                className='bg-[#9966CC] ml-2 
                border-none outline-none 
                rounded p-2 w-[auto] h-[40px]'>Save Changes</button>
            </div>
        ]
    }

  return (
    <div className={`${!isDarkMode ? 'border h-[350px] rounded-xl' : 'border-none'}`}>
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
            }}
        >

           
            <div className='flex flex-col'>
                <div className='border-b w-[150%] ml-[-25px] pb-2 opacity-[0.6]'>
                    <button onClick={() => {
                        handleDetail(draftDetails)
                        setDraftEditModal(true)
                        setDraftActionModal(false)
                    }}
                    className='pl-2'>Edit</button>
                </div>

                <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                    <button
                    onClick={() => {
                        handleDetail(draftDetails)
                        setDraftUploadModal(true)
                        setDraftActionModal(false)
                    }}
                    className='pl-2'>Upload</button>
                </div>

                <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                    <button onClick={() => {
                        handleDetail(draftDetails)
                        setDraftDeleteModal(true)
                        setDraftActionModal(false)
                    }}
                    className='pl-2 pt-4 text-red-700'>Delete</button>
                </div>
            </div>

        </Modal>


         {/* draft Edit modal */}
         <Modal
            open={draftEditModal}
            onCancel={handleCloseModal}
            footer={EditDraftModalFooterButton}
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
                    <div className=''>
                        <p className='mt-5 ml-[-10px]'>Title</p>
                        <p className='bg-[#171717] mb-5 text-white rounded-xl p-2 w-[110%] ml-[-15px]'>{draftDetails.title}</p>
                    </div>

                    {/* category section */}
                    <p className='ml-[-10px]'>Category</p>
                    <div onClick={() => setFilterDropDown(!filterDropDown)} 
                    className='flex items-center justify-center w-[110%] 
                    ml-[-15px] bg-[#171717] p-1 rounded-xl cursor-pointer'>
                       <p className=' text-white
                       font-sans p-1 w-[100%] rounded'>{selectTestType !== "select" ? 
                        selectTestType : draftDetails.category }</p>
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
                      <>
                    </>
                </div>
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
            }}
        >
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
            }}
        >
            <div className='flex flex-col w-[128%] ml-[-20px] mt-[-5px] items-center justify-center'>
                <div> 
                    <>
                    <p className='text-[20px] text-center pt-1'>Delete testimony?</p>
                    <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                        Are you sure you want to delete this draft testimony? This action will 
                        permanently remove this testimony from your draft, and it cannot be undone' 
                    </p>
                    <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                    <button
                    className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                    </>
                </div>
            </div>

        </Modal>

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
                className={`font-sans ${scheduled ? 'text-white border-b-4 border-b-[#9966CC]':'text-gray-400 opacity-[0.5]'}`}>Sheduled</h3>
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
                placeholder='search by name,category'
                className='w-[187px] bg-transparent pl-[10px] p-1 outline-none border-none' />
            </div>
            <div className='flex items-center justify-center w-[60px] rounded border border-[#9966CC] text-[#9966CC]'>
                <IoFilterOutline />
                <button className='text-[12px] outline-none border-none'>Filter</button>
            </div>
           </div>    
        </div>

         {/* table header begins */}
        <div className={`bg-[#313131] h-10 grid grid-cols-6 text-[11px]
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

         {/* Data Rows */}
         {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
            <div onClick={() => {
                setDraftDetails(item.id)
            }}
            key={item.id}
            className={`text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-6
                ${isDarkMode ? "text-white border-b border-b-slate-200" : "bg-white text-black border-b border-b-slate-200"}`}
            >
                    <div className='p-2 flex items-center'>{item.id}</div>
                    <div className='p-2 flex items-center ml-[-10px]'>
                        <img src={item.thumbnail} alt="" />
                    </div>
                    <div className='pl-2 flex items-center'>{item.title}</div>

                    <div className='p-2 flex items-center'>{item.category}</div>
                    <div className='p-2 flex items-center'>{item.source}</div>
                    <div onClick={() => setDraftActionModal(true)}
                    className='p-2 flex items-center ml-3'>{item.action}</div>
            </div>
          ))}
        {/* end of Data row */}


        {/* Pagination */}
            <div className='flex justify-between items-center mt-10'>
                    <div className={`text-[12px] ml-[10px]
                    ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
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
  )
}

export default DraftTest