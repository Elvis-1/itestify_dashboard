import React, { useState, useContext } from 'react'
// import { CiSearch } from 'react-icons/ci'
// import { IoFilterOutline } from 'react-icons/io5'
// import { IoTrashOutline } from "react-icons/io5";
// import videoData from '../data/TestimonyVideoData';

// import { Modal } from 'antd';

import { DarkModeContext } from '../../context/DarkModeContext';

import AllVideoTest from './AllVideoTest';
import UploadedTest from './UploadedTest';
import ScheduledTest from './ScheduledTest';
import DraftTest from './DraftTest';




function TestimonyVideo() {

  const {isDarkMode} = useContext(DarkModeContext)

    const [all, setAll] = useState(true)
    const [uploaded, setUploaded] = useState(false)
    const [scheduled, setScheduled] = useState(false)
    const [draft, setDraft] = useState(false)
    
  return (
    
    <div className={`w-[98%] h-[350px] m-[auto] bg-[#171717] rounded-xl
    ${isDarkMode ? "text-white" : "bg-white text-black border-b border-b-slate-200"}`}>
       {all &&
        <AllVideoTest all={all}
        setAll={setAll}
        uploaded={uploaded}
        setUploaded={setUploaded}
        draft={draft}
        setDraft={setDraft}
        scheduled={scheduled}
        setScheduled={setScheduled}
        />}

        {uploaded && <UploadedTest
        all={all}
        setAll={setAll}
        uploaded={uploaded}
        setUploaded={setUploaded}
        draft={draft}
        setDraft={setDraft}
        scheduled={scheduled}
        setScheduled={setScheduled}
        />}

        {scheduled && <ScheduledTest
        all={all}
        setAll={setAll}
        uploaded={uploaded}
        setUploaded={setUploaded}
        draft={draft}
        setDraft={setDraft}
        scheduled={scheduled}
        setScheduled={setScheduled}
        />}

        {draft && <DraftTest
        all={all}
        setAll={setAll}
        uploaded={uploaded}
        setUploaded={setUploaded}
        draft={draft}
        setDraft={setDraft}
        scheduled={scheduled}
        setScheduled={setScheduled}
        />}
    </div>

     
  )
}

export default TestimonyVideo