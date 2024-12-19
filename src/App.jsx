import React from 'react';
import { Button } from 'antd';
import './App.css'
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreatePassword from './pages/CreatePassword';
import Dashboard from './pages/Dashboard';
import Overview from './component/Overview';
import { DarkModeContextProvider } from './context/DarkModeContext';
import AllTestimonies from './component/AllTestimonies';
import UploadTestimonies from './component/UploadTestimonies';
import VideoPlayer from './component/VideoPlayer';


 function App() {

  return (
    <div>
      <DarkModeContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/create-password' element={<CreatePassword/>}/>
          <Route path='/dashboard' element={<Dashboard/>}>
              <Route path='' element={<Overview/>}/>
              <Route path='all-testimonies' element={<AllTestimonies/>}/>
              <Route path='upload-testimonies' element={<UploadTestimonies/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      </DarkModeContextProvider>
    </div>
  )
}

export default App
