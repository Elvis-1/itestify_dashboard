
import React, { useState, useContext } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { DarkModeContext } from '../../context/DarkModeContext';
import picturesData from '../../data/picsData'
import picBackground from '../../assets/images/picBackground.png'
import { Modal } from 'antd'

function HomeInspirationalPic({status, numberOfTestimonies}) {
    const {isDarkMode} = useContext(DarkModeContext)
    const [sortConfig, setSortConfig] = useState(null);
    const [data, setData] = useState(() => {
        const initialData = picturesData;
        const hiddenItems = JSON.parse(localStorage.getItem('hiddenPicturesItems') || '{}');
        return initialData.map(item => ({
            ...item,
            shouldShow: !hiddenItems[item.id]
        }));
    })

    const [CallToActionModal, setCallToActionModal] = useState(false)
    const [homePictureDetails, setHomePictureDetails] = useState("")
    const [homeViewDetailsModal, setHomeViewDetailsModal] = useState(false)
    const [homePictureRemoveModal, setHomePictureRemoveModal] = useState(false)

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    function handleDetails(id) {
        let detailData = data.find((item) => item.id === id)
        setHomePictureDetails(detailData)
    }

    function handleRemoveFromHomePage(id) {
        const hiddenItems = JSON.parse(localStorage.getItem('hiddenPicturesItems') || '{}');
        hiddenItems[id] = true;
        localStorage.setItem('hiddenPicturesItems', JSON.stringify(hiddenItems));
        
        setData(prevData => {
            const updatedData = prevData.map(item => {
                if (item.id === id) {
                    return {...item, shouldShow: false};
                }
                return item;
            });
            return updatedData;
        });
    }

    function handleCloseModal() {
        setCallToActionModal(false)
        setHomeViewDetailsModal(false)
        setHomePictureRemoveModal(false)
    }

  return (
    <>

    <Modal
        open={CallToActionModal}
        onCancel={handleCloseModal}
        footer={null}
        closeIcon={null}
        styles={{
            content: {
                backgroundColor: '#292929',
                width: '120px',
                height: '60px',
                color: 'white',
                margin: '0 auto',
                borderRadius: '8px',
                marginLeft: '140%',
                marginTop: '250px'
            },
            body: {
                color: 'white',
            },
        }}
        >
            <div className='mt-[-13px] pb-2'>
                <p onClick={() => {
                    handleDetails(homePictureDetails)
                    setHomeViewDetailsModal(true)
                    setCallToActionModal(false)
                }}
                className='pb-1 text-[13px] ml-[-10px] cursor-pointer'>View</p>
                <p onClick={() => {
                    handleDetails(homePictureDetails)
                    setHomePictureRemoveModal(true)
                    setCallToActionModal(false)
                }}
                className='text-[13px] text-red ml-[-10px] cursor-pointer'>Remove</p>
            </div>
    </Modal>

    {/* all pictures details modal */}
    <Modal
            open={homeViewDetailsModal}
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
            {homePictureDetails ? (

                <div>
                    <h2 className='mt-[-10px] text-[20px] font-sans pb-2'>Pictures Details</h2>
                    <hr className='opacity-[0.6] w-[113%] ml-[-23px] '/> 

                    <div className='mt-10'>
                        <img src={picBackground} alt="" />
                    </div>

                    {homePictureDetails.status === 'Uploaded' &&
                    <div>
                        <div className='flex items-center justify-between mt-5'>
                            <p>Uploaded By</p>
                            <p>{homePictureDetails.uploaded_by}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Uploaded Date</p>
                            <p>{homePictureDetails.date_uploaded}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Source</p>
                            <p>{homePictureDetails.source}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of downloads</p>
                            <p>{homePictureDetails.downloads}</p>
                        </div>
                        <div className='flex items-center justify-between mt-3'>
                            <p>Number of shares</p>
                            <p>{homePictureDetails.shares}</p>
                        </div>
                    </div>}

                    {homePictureDetails.status === 'Schedule' 
                    && <div>
                    <div className='flex items-center justify-between mt-5'>
                        <p>Schedule Date</p>
                        <p>{homePictureDetails.date_scheduled}</p>
                    </div>
                    <div className='flex items-center justify-between mt-3'>
                        <p>Schedule Time</p>
                        <p>{homePictureDetails.time}</p>
                    </div>
                    <div className='flex items-center justify-between mt-3'>
                        <p>Source</p>
                        <p>{homePictureDetails.source}</p>
                    </div>
                    </div>}

                    {homePictureDetails.status === 'Draft' 
                    && <div>

                    <div className='flex items-center justify-between mt-3'>
                        <p>Source</p>
                        <p>{homePictureDetails.source}</p>
                    </div>
                    </div>}
                    
                </div>
            ) : (
            <p>No details available</p>
            )}
    </Modal>

    <div className='w-[97%] m-[auto] mt-2 pb-4 h-auto bg-[#171717] rounded-xl'>
        <h2 className='text-[14px] px-4 mt-5 py-3 opacity-[0.6]'>{status}</h2>
        {/* Table Header Section */}
        <div className={`w-[100%] h-[50px] m-[auto] text-[11px] bg-[#313131] grid grid-cols-8 items-center justify-between
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
            <div className='p-2 flex items-center ml-[-20px]'>
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
            <div className='p-2 flex items-center ml-[-7px]'>
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
            <div className='p-2 flex items-center ml-[-15px]'>
                Downloads
                <div className='flex flex-col'>
                    <IoIosArrowUp
                    onClick={() => sortData('downloads')}
                    size={10}
                    className='ml-2 cursor-pointer'
                    />
                    <IoIosArrowDown
                    onClick={() => sortData('downloads')}
                    size={10}
                    className='ml-2 cursor-pointer'
                    />
                </div>
            </div>
            <div className='p-2 flex items-center'>
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
            
            <div className='p-2 flex items-center'>
                Action
            </div>
        </div>
        {/* end of table header section */}

        <div>
            {/* Data Rows */}
            {data.filter(item => item.shouldShow !== false)
            .slice(0, numberOfTestimonies).map((item, index) => (
                <div onClick={() => {
                    setHomePictureDetails(item.id)
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
                    <div onClick={() => setCallToActionModal(true)}
                    className='p-2 flex items-center ml-3'>{item.action}</div>
                </div>
            ))}
            {/* end of Data row */}
        </div>
    </div>
    </>
  )
}

export default HomeInspirationalPic