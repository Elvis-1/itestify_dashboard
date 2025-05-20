import React, { useState, useContext } from 'react'
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io'
import { DarkModeContext } from '../../context/DarkModeContext';
import { Button, Modal } from 'antd';
import { openDB } from 'idb';

import uploadedVideo from '../../data/UploadedVideo';
import VideoPlayer from './VideoPlayer';
import vid1 from '../../assets/vid1.mp4'


function HomeVideoTest({status, numberOfTestimonies}) {
    const {isDarkMode} = useContext(DarkModeContext)
    const [sortConfig, setSortConfig] = useState(null);
    const [data, setData] = useState(() => {
        const initialData = uploadedVideo;
        const hiddenItems = JSON.parse(localStorage.getItem('hiddenVideoItems') || '{}');
        return initialData.map(item => ({
            ...item,
            shouldShow: !hiddenItems[item.id]
        }));
    })
    const [CallToActionModal, setCallToActionModal] = useState(false)
    const [homeVideoDetails, setHomeVideoDetails] = useState("")
    const [homeViewDetailsModal, setHomeViewDetailsModal] = useState(false)
    const [homeVideoRemoveModal, setHomeVideoRemoveModal] = useState(false)


    //sort data logic
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    function handleDetails(id) {
        let detailData = data.find((item) => item.id === id)
        setHomeVideoDetails(detailData)
    }

    function handleRemoveFromHomePage(id) {
        const hiddenItems = JSON.parse(localStorage.getItem('hiddenVideoItems') || '{}');
        hiddenItems[id] = true;
        localStorage.setItem('hiddenVideoItems', JSON.stringify(hiddenItems));
        
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

    // function restoreHiddenItems() {
    //     // Clear localStorage
    //     localStorage.removeItem('hiddenVideoItems');
        
    //     // Reset all items to visible
    //     setData(prevData => prevData.map(item => ({
    //         ...item,
    //         shouldShow: true
    //     })));
    // }

    function handleCloseModal() {
        setCallToActionModal(false)
        setHomeViewDetailsModal(false)
        setHomeVideoRemoveModal(false)
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
                    handleDetails(homeVideoDetails)
                    setHomeViewDetailsModal(true)
                    setCallToActionModal(false)
                }}
                className='pb-1 text-[13px] ml-[-10px] cursor-pointer'>View</p>
                <p onClick={() => {
                    handleDetails(homeVideoDetails)
                    setHomeVideoRemoveModal(true)
                    setCallToActionModal(false)
                }}
                className='text-[13px] text-red ml-[-10px] cursor-pointer'>Remove</p>
            </div>
        </Modal>

        {/* home view details modal */}
         <Modal
            open={homeViewDetailsModal}
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
                margin: '-50px auto',
                borderRadius: '8px',
                },
                body: {
                backgroundColor: '#171717',
                color: 'white',
                },
            }}
            >
            {homeVideoDetails ? (
                <div>
                    <h2 className='mt-[-10px] text-[20px] font-sans pb-2'>Video Details</h2>
                    <hr className='opacity-[0.6] w-[118%] ml-[-23px]'/> 
                    
                    {/* Video Player Section */}
                    <div className='w-[113%] ml-[-16px] rounded-xl overflow-hidden h-[230px] mt-6 relative'>
                    <VideoPlayer videoUrl={vid1}>
                    <video 
                        poster={homeVideoDetails.thumbnail || 'No thumbnail avialable'}
                        style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                        }}
                    />
                    </VideoPlayer>
                    </div>
                
                    {/* Details Sections */}
                    <div className='w-[290px] ml-[-20px] mt-3 text-[12px]'>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Title</h2>
                            <p>{homeVideoDetails.title || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Category</h2>
                            <p>{homeVideoDetails.category || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Source</h2>
                            <p>{homeVideoDetails.source || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Upload Date</h2>
                            <p>{homeVideoDetails.date_uploaded || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Upload By</h2>
                            <p>{homeVideoDetails.uploaded_by || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Number of Views</h2>
                            <p>{homeVideoDetails.views || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Likes</h2>
                            <p>{homeVideoDetails.likes || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Comment</h2>
                            <p>{homeVideoDetails.comments || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Shares</h2>
                            <p>{homeVideoDetails.shares || 'N/A'}</p>
                        </div>
                        <div className='flex items-center justify-between w-[100%] p-1'>
                            <h2 className='opacity-[0.6]'>Status</h2>
                            <p>{homeVideoDetails.status || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-white text-center p-4">
                <p>Loading video details...</p>
                </div>
            )}
        </Modal>

        <Modal
            open={homeVideoRemoveModal}
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
                    marginTop: '130px'
                },
                body: {
                    backgroundColor: '#1717171',
                    color: 'white',
                    
                },
            }}
            > 
            <div className='flex flex-col w-[128%] ml-[-20px]  mt-5 items-center justify-center'>
                <div>
                    <p className='text-[15px] ml-[-20px] mt-[-10px] text-center pt-1'>Remove from Home Page?</p>
                    <p className='text-[12px] opacity-[0.6] mt-2 text-center w-[300px] ml-[-45px]'>
                        This will remove the testimony from the home page lineup. it will still be available in the 
                        testimonies section and users can view it. 
                        Are you sure you want to proceed?
                    </p>
                </div>

                <div className='flex items-center pb-2 justify-end gap-5 mt-5'>
                    <button className='border border-[#9966CC] outline-none p-1 w-[100px] rounded text-[#9966CC]'>Cancel</button>
                    <button onClick={() => {
                        handleRemoveFromHomePage(homeVideoDetails.id)
                        setHomeVideoRemoveModal(false)
                    }}
                    className='bg-red border-none outline-none p-1.5 rounded w-[120px]'>Yes remove</button>
                </div>
            </div>
        </Modal>
        

        <div className='w-[97%] m-[auto] mt-2 h-auto pb-4 bg-[#171717] rounded-xl'>
            <h2 className='text-[14px] px-4 mt-5 py-3 opacity-[0.6]'>{status}</h2>
            {/* <button onClick={restoreHiddenItems}>Restore</button> */}
            {/* Table Header Section */}
            <div className={`w-[100%] h-[50px] text-[11px] m-[auto] bg-[#313131] grid grid-cols-4
                ${isDarkMode ? "text-white" : "bg-slate-100 text-black border-b border-b-slate-200"}`
            }>
                <div className='flex items-center gap-4 w-[100%]'>
                    <div className='p-2 flex h-[50px] items-center'>
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
                    <div className='p-2 flex  h-[50px] items-center'>
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
                    <div className='pl-5 flex  h-[50px] items-center'>
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
                
                
                <div className='flex items-center w-[100%]'>
                    <div className='p-2 flex h-[50px] items-center'>
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
                    <div className='p-2 flex h-[50px] items-center'>
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
                    <div className='pl-1 flex text-[11px] h-[50px] items-center'>
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

                <div className='flex items-center gap-3 w-[100%]'>
                    <div className='p-2 flex h-[50px] items-center'>
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
                    <div className='p-2 flex h-[50px] items-center'>
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
                    <div className='p-2 flex h-[50px] items-center'>
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

                <div className='flex items-center gap-4 w-[100%]'>
                    <div className='p-2 flex h-[50px] items-center'>
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
                    <div className='p-2 flex h-[50px] items-center'>
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
                    <div className='p-2 flex h-[50px] items-center'>
                    Action
                    </div>
                </div>
            </div>
            {/* end of table header section */}

            <div>
                {data.filter(item => item.shouldShow !== false)
                .slice(0, numberOfTestimonies).map((item) => (
                    <div onClick={() => {
                        setHomeVideoDetails(item.id)
                    }}
                    className='grid grid-cols-12 w-[100%] text-[11px] border-b'>
                        <div className='p-2 flex w-[30px] ml-[5px] h-[50px] items-center'>{item.id}</div>
                        <div className='p-2 flex w-[60px] ml-[-15px] h-[50px] items-center'><img src={item.thumbnail} alt="" /></div>
                        <div className='pl-2 flex ml-[-20px] w-[120px] h-[50px] items-center'>
                        {item.title.length > 12 ? `${item.title.slice(0, 12)}...` : item.title}
                        </div>
                        <div className='p-2 flex ml-[-1px] h-[50px] items-center'>{item.category}</div>
                        <div className='p-2 flex ml-[-10px] h-[50px] items-center'>{item.source}</div>
                        <div className='flex items-center ml-[-17px] text-[11px]  h-[50px]'>
                        {item.date_uploaded}
                        </div>
                        <div className='p-2 h-[50px] flex items-center'>{item.uploaded_by}</div>
                        <div className='p-2 h-[50px] flex items-center justify-center'>{item.views || 0}</div>
                        <div className='p-2 h-[50px] flex items-center justify-center'>{item.likes || 0}</div>
                        <div className='p-2 h-[50px] flex items-center justify-center'>{item.comments || 0}</div>
                        <div className='p-2 h-[50px] flex items-center justify-center'>{item.shares || 0}</div>
                        <div onClick={() => {
                            setCallToActionModal(!CallToActionModal)
                        }}
                        className='p-2 ml-[-8px] cursor-pointer h-[50px] flex items-center justify-center'>
                            <IoIosMore />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}

export default HomeVideoTest