import React, {useState, useContext, useEffect} from 'react'
import { DarkModeContext } from '../../context/DarkModeContext';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import picturesData from '../../data/picsData'
import picBackground from '../../assets/images/picBackground.png'

import { Modal } from 'antd';


function Uploaded({searchQuery, setSearchQuery}) {

    const {isDarkMode} = useContext(DarkModeContext)

    const [uploadedPicActionModal, setUploadedPicActionModal] = useState(false)
    const [uploadedPicViewModal, setUploadedPicViewModal] = useState(false)
    const [uploadedPicEditModal, setUploadedPicEditModal] = useState(false)
    const [uploadedPicDeleteModal, setUploadedPicDeletModal] = useState(false)
    const [uploadedDetails, setUploadedDetails] = useState('')

    const [formData, setFormData] = useState({
        source: '',
        uploaded_by: '',
    });

    
    const [sortConfig, setSortConfig] = useState(null);
    const [page, setPage] = useState(1)
    const [getFilteredData, setGetFilterData] = useState([{}])

    useEffect(() => {
        let uploadedData = picturesData.filter((item) => {
            return item.status === 'Uploaded'
        })
        setGetFilterData(uploadedData)
    },[])

    const itemsPerPage = 3;
    
 

    const startIndex = (page - 1) * itemsPerPage;
    getFilteredData.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(getFilteredData.length / itemsPerPage)

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
        const dataToSearch = getFilteredData?.length > 0 ? getFilteredData : picturesData;

        if (searchQuery.trim() !== "") {
            const filteredData = dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item.source.toLowerCase().includes(lowerCaseQuery)
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, searchQuery]);

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

    function handleCloseModal() {
        setUploadedPicViewModal(false)
        setUploadedPicEditModal(false)
        setUploadedPicDeletModal(false)
        setUploadedPicActionModal(false)
    }

    function handleDetail(id) {
        const videoDetail = getFilteredData.find((item) => item.id === id)
        if(videoDetail) {
            setUploadedDetails(videoDetail)
            // setEditDetails(videoDetail)
            // setGetStatus(videoDetail.status)
            // setDeleteDetails(videoDetail.status)
            
        }
       
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({...prevData, [name]: value}))
    };

   const handleSaveEdit = (e) => {
    e.preventDefault()
    console.log(formData);
   };

  return (
    <>
        {/* uploaded pictures action modal */}
        <Modal
            open={uploadedPicActionModal}
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
                    marginLeft: '125%',
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
                    <button 
                    onClick={() => {
                        handleDetail(uploadedDetails)
                        setUploadedPicViewModal(true)
                        setUploadedPicActionModal(false)
                    }}
                    className='pl-2'>View</button>
                </div>

                <div className='border-b w-[150%] ml-[-25px] pt-2 pb-2 opacity-[0.6]'>
                    <button
                    onClick={() => {
                        handleDetail(uploadedDetails)
                        setUploadedPicEditModal(true)
                        setUploadedPicActionModal(false)
                    }} 
                    className='pl-2'>Edit</button>
                </div>

                <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                    <button onClick={() => {
                        handleDetail(uploadedDetails)
                        setUploadedPicDeletModal(true)
                        setUploadedPicActionModal(false)
                    }}
                    className='pl-2 pt-4 text-red'>Delete</button>
                </div>
            </div>
        
        </Modal>

         {/* uploaded pictures details modal */}
        <Modal
            open={uploadedPicViewModal}
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
            {uploadedDetails ? (

                <div>
                    <h2 className='mt-[-10px] text-[20px] font-sans pb-2'>Pictures Details</h2>
                    <hr className='opacity-[0.6] w-[113%] ml-[-23px] '/> 

                    <div className='mt-10'>
                        <img src={picBackground} alt="" />
                    </div>

                    {uploadedDetails.status === 'Uploaded' &&
                    <div>
                        <div className='flex items-center justify-between mt-5'>
                            <p>Uploaded By</p>
                            <p>{uploadedDetails.uploaded_by}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Uploaded Date</p>
                            <p>{uploadedDetails.date_uploaded}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Source</p>
                            <p>{uploadedDetails.source}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of downloads</p>
                            <p>{uploadedDetails.downloads}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of shares</p>
                            <p>{uploadedDetails.shares}</p>
                        </div>
                    </div>}
                </div>
            ) : (
            <p>No details available</p>
            )}
        </Modal>

         {/*uploaded inspirational  pictures Edit modal */}
        <Modal
            open={uploadedPicEditModal}
            onCancel={handleCloseModal}
            footer={null}
            closeIcon={<span style={{ color: 'white', fontSize: '12px', marginTop: '-7px' }}>X</span>}
            styles={{
            content: {
                backgroundColor: '#0B0B0B',
                width: '380px',
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
                    Edit Uploaded Picture
                </h3>
                <hr className='opacity-[0.2] text-gray-300 w-[115%] ml-[-25px] '/>

                <div>
                    <form onSubmit={handleSaveEdit}>
                    <div className=''>
                        <p className='mt-5 ml-[-10px]'>Source</p>
                        <input
                        name="source"
                        value={formData.source}
                        placeholder='Edit source'
                        onChange={handleInputChange}
                        className='bg-[#171717] mb-5 text-white 
                        rounded-xl p-2 w-[110%] 
                        ml-[-15px] outline-none border-none'/>
                    </div>

                    <div className=''>
                        <p className='mt-5 ml-[-10px]'>Uploaded By</p>
                        <input
                        name="uploaded_by"
                        value={formData.uploaded_by}
                        placeholder='Edit uploaded by'
                        onChange={handleInputChange}
                        className='bg-[#171717] mb-5 text-white 
                        rounded-xl p-2 w-[110%] 
                        ml-[-15px] outline-none border-none'/>
                    </div>

                    <div className='flex items-center justify-end mt-10'>
                        <button className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[100px] mr-4 hover:bg-[#9966CC] 
                        text-[#9966CC] hover:text-white'>Cancel</button>
                        <button type='submit' className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[130px] text-[#9966CC]
                        hover:bg-[#9966CC] hover:text-white'>Save Changes</button>
                    </div>
                    </form>
                </div>
            </div>

        </Modal>

         {/* uploaded Inspirational pictures delete  modal */}
        <Modal
            open={uploadedPicDeleteModal}
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
                        Are you sure you want to delete this Uploaded testimony? Once deleted the 
                        testimony will be remove from the platform and will no longer be visible to users.
                        This action cannot be undone 
                    </p>
                    <button onClick={handleCloseModal} className='border border-[#9966CC] mt-3 rounded text-[#9966CC] p-2 w-[120px]'>Cancel</button>
                    <button
                        className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>Yes delete</button>
                    </>
                </div>
            </div>

        </Modal>

        <div>
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
                <div className='p-2 flex items-center'>
                    Date Uploaded
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('date_uploaded')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('date_uploaded')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
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
                <div className='p-2 flex items-center ml-[-10px]'>
                    Downloads
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('downloads')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('downloads')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
                    Shares
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('shares')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('shares')}
                        size={10}
                        className='ml-1 cursor-pointer'
                        />
                    </div>
                </div>
            <div className='p-2 flex items-center'>Action</div>
            
            </div>


            {/* Data Rows */}
            {sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                <div onClick={() => {
                    setUploadedPicActionModal(true)
                    setUploadedDetails(item.id)
                }}
                key={item.id}
                className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-8
                    ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                    <div className='p-2 flex items-center'>{item.id}</div>
                    <div className='p-2 flex items-center ml-[-10px]'>
                        <img src={item.thumbnail} alt="" />
                    </div>
                    <div className='pl-2 flex items-center'>{item.source}</div>

                    <div className='p-2 flex items-center'>{item.date_uploaded}</div>
                    <div className='p-2 flex items-center'>{item.uploaded_by}</div>
                    <div className='pl-1 flex items-center'>{item.downloads}</div>

            
                    <div className='p-2 flex items-center'>{item.shares}</div>
                    <div
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
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, getFilteredData.length)} of {getFilteredData.length}
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
    </>
  )
}

export default Uploaded