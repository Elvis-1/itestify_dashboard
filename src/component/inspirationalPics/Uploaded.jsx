import React, {useState, useContext, useEffect} from 'react'
import { DarkModeContext } from '../../context/DarkModeContext';
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io'
import picturesData from '../../data/picsData'
import picBackground from '../../assets/images/picBackground.png'

import { Modal } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
import LoadingState from '../LoadingState';


function Uploaded() {

    const {isDarkMode} = useContext(DarkModeContext)

    const [uploadedPicActionModal, setUploadedPicActionModal] = useState(false)
    const [uploadedPicViewModal, setUploadedPicViewModal] = useState(false)
    const [uploadedPicEditModal, setUploadedPicEditModal] = useState(false)
    const [uploadedPicDeleteModal, setUploadedPicDeletModal] = useState(false)

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [getFilteredData, setGetFilterData] = useState([])
    const [uploadedPicsData, setUploadedPicsData] = useState([]);
    const [uploadedDetails, setUploadedDetails] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [editSuccessfully, setEditSuccessfully] = useState(false)
    const [deleteSuccessfully, setDeleteSuccessfully] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    

    useEffect(() => {
        if (uploadedPicEditModal && uploadedDetails) {
            setFormData({
            source: uploadedDetails.source || '',
            uploaded_by: uploadedDetails.uploaded_by || ''
            // date_scheduled: allDetails.date_scheduled || '',
            // time: allDetails.time || ''
            });
        }
    }, [uploadedPicEditModal, uploadedDetails]);

    const [formData, setFormData] = useState({
        source: '',
        uploaded_by: '',
    });

    
   
     const fetchUploadedPics = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            if(!token) {
                console.error('No token found in localStorage');
                return;
            }
             const response = await axios.get(`https://itestify-backend-38u1.onrender.com/get-inspirational-by-status/?status=upload_now`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
             )
             console.log('API Response:', response.data);
             setUploadedPicsData(response?.data?.data?.data || response?.data || []);
        } catch (error) {
            console.log('Error fetching inspirational pictures:', error);
            setError('Failed to fetch uploaded inspirational pictures');
            setUploadedPicsData([]);
        }finally {
            setLoading(false);
        }
    }
    useEffect(()=> {
        fetchUploadedPics()
    }, [])

    const itemsPerPage = 6;
    
 

    const startIndex = (page - 1) * itemsPerPage;
   const currentPageData = Array.isArray(uploadedPicsData) 
    ? uploadedPicsData.slice(startIndex, startIndex + itemsPerPage) 
    : [];
   const totalPages = Math.ceil((Array.isArray(uploadedPicsData) ? uploadedPicsData.length : 0) / itemsPerPage);

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
            : Array.isArray(uploadedPicsData) 
                ? uploadedPicsData 
                : [];
    
        if (searchQuery.trim() !== "") {
            return dataToSearch.filter((item) => {
                const lowerCaseQuery = searchQuery.toLowerCase();
                return (
                    item?.source?.toLowerCase().includes(lowerCaseQuery) ||
                    item?.status?.toLowerCase().includes(lowerCaseQuery)
                );
            });
        }
    
        return dataToSearch;
     }, [getFilteredData, uploadedPicsData, searchQuery]);
        
        
        //sorted data logic
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

    function handleCloseModal() {
        setUploadedPicViewModal(false)
        setUploadedPicEditModal(false)
        setUploadedPicDeletModal(false)
        setUploadedPicActionModal(false)
    }

    const handleDetail = async (id) => {
        try {
            const response = await axios.get(`https://itestify-backend-38u1.onrender.com/inspirational/${id}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setUploadedDetails(response.data);
            console.log('Details fetched:', response.data);
        } catch (error) {
            setError('Failed to fetch details');
            console.error('Error fetching details:', error);
        }
    }

    //handleChange for edit modal
    const handleInputChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({...prevData, [name]: value}))
    };

      
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        
        if (!uploadedDetails?.id) {
            console.error('No ID found for the item to edit');
            return;
        }

        setButtonLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
            throw new Error('No authentication token found');
            }

            // Prepare the data to send
            const requestData = {
            source: formData.source,
            uploaded_by: formData.uploaded_by,
            // ...(allDetails.status === 'Schedule' && {
            //     date_scheduled: formData.date_scheduled,
            //     time: formData.time + ' ' + timePeriod // Combine time and period
            // })
            };

            const response = await axios.put(
            `https://itestify-backend-38u1.onrender.com/inspirational/${uploadedDetails.id}/`,
            requestData,
            {
                headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
                }
            }
            );

            console.log('Update successful:', response.data);
            fetchUploadedPics(); // Refresh the data
            setEditSuccessfully(true)

        } catch (error) {
            console.error('Update error:', error);
            let errorMessage = 'Failed to update inspirational picture';
            if (error.response) {
            errorMessage = error.response.data.message || 
                        error.response.data.detail || 
                        JSON.stringify(error.response.data);
            }
            // You might want to show this error to the user
            alert(errorMessage);
        } finally {
            setButtonLoading(false);
            setEditSuccessfully(false)
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }
        setButtonLoading(true);
        try {
            const response = await axios.delete(`https://itestify-backend-38u1.onrender.com/inspirational/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
           })
           setUploadedPicDeletModal(false);
           handleDeleteSuccessful()
           fetchUploadedPics(); // Refresh the data after deletion
        } catch (error) {
            setError('Failed to delete inspirational picture');
        }finally {
            setButtonLoading(false);
            setUploadedPicDeletModal(false)
        }
      
        
    }

    function handleEditSuccessful() {
        setUploadedPicEditModal(false)
        setEditSuccessfully(true)
            let successTimer = setTimeout(() => {
                setEditSuccessfully(false)
            },2000)

            return () => {
                clearTimeout(successTimer)
            }
    }

    function handleDeleteSuccessful() {
        setUploadedPicDeletModal(false)
        setDeleteSuccessfully(true)
        let successTimer = setTimeout(() => {
            setDeleteSuccessfully(false)
        },2000)

        return () => {
            clearTimeout(successTimer)
        }
    }

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
                    backgroundColor: '#131313',
                    width: '150px',
                    height: '130px',
                    color: 'white',
                    margin: '0 auto',
                    borderRadius: '8px',
                    marginLeft: '125%',
                    marginTop: '170px'
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
                        // handleDetail(uploadedDetails)
                        setUploadedPicEditModal(true)
                        setUploadedPicActionModal(false)
                    }} 
                    className='pl-2'>Edit</button>
                </div>

                <div className='w-[150%] ml-[-25px] pb-2 opacity-[0.6] cursor-pointer'>
                    <button onClick={() => {
                        // handleDetail(uploadedDetails)
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

                    <div className='mt-5'>
                        <img className='w-[400px] h-[300px]' 
                        src={uploadedDetails.thumbnail_url || picBackground} alt="" />
                    </div>

                    {uploadedDetails.status === 'upload_now' &&
                    <div>
                        <div className='flex items-center justify-between mt-5'>
                            <p>Uploaded By</p>
                            <p>{uploadedDetails.uploaded_by}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Uploaded Date</p>
                            <p>{uploadedDetails.created_at ?
                                new Date(uploadedDetails.created_at).toLocaleDateString('en-Us',{
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'N/A'
                            }</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Source</p>
                            <p>{uploadedDetails.source}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of downloads</p>
                            <p>{uploadedDetails.downloads_count}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of shares</p>
                            <p>{uploadedDetails.shares_count}</p>
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
                    <form onSubmit={() => {
                        handleSaveEdit()
                    }}>
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
                        <button onClick={handleCloseModal} className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[100px] mr-4 hover:bg-[#9966CC] 
                        text-[#9966CC] hover:text-white'>
                            Cancel
                        </button>
                        <button type='submit' className='border border-[#9966CC] 
                        outline-none p-3 
                        rounded w-[130px] text-[#9966CC]
                        hover:bg-[#9966CC] hover:text-white'>
                        {buttonLoading ? 'Saving...' : 'Save Changes'}
                        </button>
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
                    <button onClick={() => {
                        handleDelete(uploadedDetails.id)
                    }}
                        className='mt-3 rounded bg-[#E53935] p-2 w-[120px] ml-2'>
                            {buttonLoading ? 'Deleting...' : 'Yes Delete'}
                        </button>
                    </>
                </div>
            </div>

        </Modal>

        {/* all pictures Edit success modal*/}
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
                <div className='bg-[#9966CC] w-[50px] h-[50px] 
                rounded-full flex items-center justify-center'>
                    <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                </div>
                <div>
                    <p className='text-[20px] text-center pt-3'>Changes Save successfully!</p>
                </div>
            </div> 

        </Modal>

        {/* all pictures delete success modal*/}
        <Modal
            open={deleteSuccessfully}
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
                <div className='bg-[#9966CC] w-[50px] h-[50px] 
                rounded-full flex items-center justify-center'>
                    <CheckOutlined style={{color: 'white', fontSize: '30px'}}/>
                </div>
                <div>
                    <p className='text-[20px] text-center pt-3'>Deleted successfully!</p>
                </div>
            </div> 

        </Modal>

        <div className={`${isDarkMode ? 'w-[100%]' : 'w-[100%]'} h-[450px] m-[auto] bg-[#171717] rounded-xl
                ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>

            <div className='w-[100%] h-[400px] m-[auto]'>
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
            {loading ? (
                <LoadingState/>
            ):
            Array.isArray(sortedData) && sortedData.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                <div onClick={() => {
                    setUploadedDetails(item)
                }}
                key={item.id}
                className={`border-b border-white  text-[11px] w-[100%] cursor-pointer h-[50px] m-[auto] grid grid-cols-8
                    ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                    <div className='p-2 flex items-center'>{startIndex + index + 1}</div>
                    <div className="p-2 flex items-center justify-center w-[50px] h-[50px] overflow-hidden rounded">
                        <img 
                            className="w-full h-full object-cover"
                            src={item.thumbnail_url || '/path/to/default-image.jpg'} 
                            alt={item.title || 'image'}
                        />
                    </div>
                    <div className='pl-2 flex items-center'>{item.source}</div>

                    <div className='p-2 flex items-center'>{item.created_at ?
                        new Date(item.created_at).toLocaleDateString('en-Us', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : 'N/A'
                    }</div>
                    <div className='p-2 flex items-center'>{item.uploaded_by}</div>
                    <div className='pl-1 flex items-center ml-4'>{item.downloads_count}</div>

            
                    <div className='p-2 flex items-center ml-4'>{item.shares_count}</div>
                    <div onClick={() => {
                        setUploadedPicActionModal(true)

                    }} className='p-2 flex items-center ml-3'>
                        <IoIosMore />
                    </div>
                </div>
            ))}

            {error && <div className='flex items-center justify-center mt-[15%]'>{error}</div>}
            {/* end of Data row */}
            </div> 


            {/* Pagination */}
            <div className='flex justify-between items-center mt-1'>
            <div className={`text-[12px] ml-[10px]
                ${isDarkMode ? "text-white" : "bg-white text-black"}`}>
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, Array.isArray(uploadedPicsData) ? uploadedPicsData.length : 0)} of 
                        {Array.isArray(uploadedPicsData) ? uploadedPicsData.length : 0}
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

        
    </>
  )
}

export default Uploaded