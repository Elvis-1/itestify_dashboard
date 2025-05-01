import React, { useState, useContext } from 'react'
import { IoIosArrowDown, IoIosArrowUp, IoIosMore } from 'react-icons/io'
import { DarkModeContext } from '../../context/DarkModeContext';
import testimonyData from '../../data/Testimonydata';

import modalpic from '../../assets/images/modalPic.png'
import { Modal } from 'antd';

function HomeTextTest({status, numberOfTestimonies}) {
    const {isDarkMode} = useContext(DarkModeContext)
    const [sortConfig, setSortConfig] = useState(null);
    const [data, setData] = useState(() => {
        const initialData = testimonyData;
        const hiddenItems = JSON.parse(localStorage.getItem('hiddenTextItems') || '{}');
        return initialData.map(item => ({
            ...item,
            shouldShow: !hiddenItems[item.id]
        }));
    })
    const [CallToActionModal, setCallToActionModal] = useState(false)
    const [homeTextDetails, setHomeTextDetails] = useState("")
    const [homeViewDetailsModal, setHomeViewDetailsModal] = useState(false)
    const [homeTextRemoveModal, setHomeTextRemoveModal] = useState(false)


    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    function handleDetails(id) {
        let detailData = data.find((item) => item.id === id)
        setHomeTextDetails(detailData)
    }

    function handleRemoveFromHomePage(id) {
        const hiddenItems = JSON.parse(localStorage.getItem('hiddenTextItems') || '{}');
        hiddenItems[id] = true;
        localStorage.setItem('hiddenTextItems', JSON.stringify(hiddenItems));
        
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
        setHomeTextRemoveModal(false)
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
                    handleDetails(homeTextDetails)
                    setHomeViewDetailsModal(true)
                    setCallToActionModal(false)
                }}
                className='pb-1 text-[13px] ml-[-10px] cursor-pointer'>View</p>
                <p onClick={() => {
                    handleDetails(homeTextDetails)
                    setHomeTextRemoveModal(true)
                    setCallToActionModal(false)
                }}
                className='text-[13px] text-red ml-[-10px] cursor-pointer'>Remove</p>
            </div>
        </Modal>

          {/* testimony details modal */}
        <Modal
            open={homeViewDetailsModal}
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
           {homeTextDetails ? (

                <div>
                    <div className='bg-[#313131] 
                    w-[116%] h-[50px] ml-[-24px] mt-[-22px] 
                    rounded-tl-xl rounded-tr-xl'>
                    </div>
                    <div className='w-[50px] h-[50px] m-[auto] z-[1000]'>
                        <img className='w-[50px] h-[50px] m-[auto] mt-[-25px]' src={modalpic} alt="" />
                    </div>
                    <div className='flex border rounded-2xl border-gray-100 items-center justify-between w-[110%] h-[70px] m-[auto] ml-[-15px] mt-[20px]'>
                        <div className='text-center ml-5 opacity-[0.6] border-r h-[50px] pr-3 font-sans'>
                            <p className='text-[10px]'>Name</p>
                            <p className='text-[9px]'>{homeTextDetails.name || "N/A"}</p>
                        </div>
                        <div className='text-center ml-2 text-[12px] opacity-[0.6] w-[100%] h-[50px] m-[auto] border-r pr-3 font-sans'>
                            <p>Email</p>
                            <p className='ml-3 w-[130px]'>elvis@gmail.com</p>
                        </div>
                        <div className='text-center text-[9px] opacity-[0.6] w-[100%] h-[45px] m-[auto] pr-4 font-sans'>
                            <p className='mb-1'>Status</p>
                            <p className={`w-[70px] ml-1.5 p-[2px] rounded ${
                            homeTextDetails.status === 'pending' ? 
                                'text-yellow-400 border border-yellow-500' :
                            homeTextDetails.status === 'Approved' ? 
                                'text-green-500 border border-green-500' : 
                                'text-red border border-red'
                            }`}>
                            {homeTextDetails.status}
                             </p>
                        </div>
                    </div>

                    <div className='mt-3 mb-7'>
                        <h3 className='text-white font-sans text-[11px]'>{homeTextDetails.category || "no title"}</h3>
                        <p className='text-[11px] text-white pt-2'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Vitae aspernatur deserunt ea veniam laboriosam id 
                            asperiores commodi unde nisi quas, ratione, 
                            quos fugiat consequatur voluptate aperiam totam? 
                            Culpa, nesciunt asperiores!
                        </p>
                    </div>    
                </div>
            ) : (
            <p>No details available</p>
            )}
        </Modal>
        
        <Modal
            open={homeTextRemoveModal}
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
                        handleRemoveFromHomePage(homeTextDetails.id)
                        setHomeTextRemoveModal(false)
                    }}
                    className='bg-red border-none outline-none p-1.5 rounded w-[120px]'>Yes remove</button>
                </div>
            </div>
        </Modal>

        <div className='w-[97%] m-[auto] mt-2 h-auto pb-4 bg-[#171717] rounded-xl'>
            <h2 className='text-[14px] px-4 mt-5 py-3 opacity-[0.6]'>{status}</h2>
            {/* Table Header Section */}
            <div className={`w-[100%] h-[50px] m-[auto] text-[12px] bg-[#313131] grid grid-cols-8 items-center justify-between
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
                    Name
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('full_name')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('full_name')}
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
                <div className='p-2 flex items-center ml-2'>
                    Date Submited
                    <div className='flex flex-col'>
                        <IoIosArrowUp
                        onClick={() => sortData('created_at')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                        <IoIosArrowDown
                        onClick={() => sortData('created_at')}
                        size={10}
                        className='ml-2 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='p-2 flex items-center'>
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
                <div className='p-2 flex items-center ml-[-15px]'>
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
            {data.filter(item => item.shouldShow !== false)
            .slice(0,numberOfTestimonies).map((item, index) => (
                <div
                onClick={() => {
                    setHomeTextDetails(item.id)
                }}
                key={item.id}
                className={`text-[13px] pb-2 w-[100%] cursor-pointer h-auto m-[auto] grid grid-cols-8
                    ${isDarkMode ? "text-white border-b border-b-slate-200" : "bg-white text-black border-b border-b-slate-200"}`}
                >
                    <div className='ml-[15px] mt-4'>{item.id}</div>
                    <div className='ml-[-15px] text-[12px] w-[200px] mt-4'>{item.name}</div>
                    <div className='ml-[15px] mt-4'>{item.category}</div>
                    <div className='ml-[19px] mt-4'>{item.date}</div>
                    <div className='ml-[20px] mt-4'>{item.likes || 0}</div>
                    <div className='ml-[20px] mt-4'>{item.comments || 0}</div>
                    <div className='ml-[20px] mt-4'>{item.shares || 0}</div>
                    <div onClick={() => {
                        setCallToActionModal(true)
                    }} className='ml-[17px] mt-4 cursor-pointer'><IoIosMore /></div>
                </div>
            ))}
            </div>
            {/* end of Data row */}
        </div>
    </>
  )
}

export default HomeTextTest