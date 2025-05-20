import React, { useState, useContext } from 'react'
import { DarkModeContext } from '../../context/DarkModeContext';
import { IoFilterOutline } from 'react-icons/io5';
import { CiSearch } from 'react-icons/ci';


import picturesData from '../../data/picsData'
import All from './All';
import Uploaded from './Uploaded';
import Schedule from './Schedule';
import Draft from './Draft';

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

    const itemsPerPage = 3;

    const startIndex = (page - 1) * itemsPerPage;
    picturesData.slice(startIndex, startIndex + itemsPerPage)
    const totalPages = Math.ceil(picturesData.length / itemsPerPage)

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
                    item.source.toLowerCase().includes(lowerCaseQuery) ||
                    item.uploaded_by.toLowerCase().includes(lowerCaseQuery)
                );
            });
            return filteredData;
        }

        return dataToSearch;
    }, [getFilteredData, picturesData, searchQuery]);

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
        
  return (
    <>
        <div className='flex items-center justify-end mt-5 mr-4 mb-5'>
           <button className='bg-[#9966CC] text-[14px] p-1 rounded text-white'> 
            <span className='pl-1 pr-1'>+</span>Upload New Picture
           </button>
        </div>
        <div className={`w-[98%] h-[350px] m-[auto] bg-[#171717] rounded-xl`}>
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
                        <button 
                        className='text-[12px] outline-none border-none'>Filter</button>
                    </div>}
                </div>}    
            </div>

            {all &&
            <All sortData={sortData} sortedData={sortedData} 
            startIndex={startIndex} itemsPerPage={itemsPerPage}
            handleNextPage={handleNextPage} handlePrevPage={handlePrevPage}
            page={page} />}

            {uploaded && 
            <Uploaded searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}

            {scheduled && <Schedule searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}

            {draft && <Draft searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}

        </div>
    </>
  )
}

export default Allpics