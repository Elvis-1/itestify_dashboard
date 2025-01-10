
import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePassword from "./pages/CreatePassword";
import Dashboard from "./pages/Dashboard";
import Overview from "./component/Overview";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import Users from "./pages/Users";
import Donations from "./pages/Donations";
import { Button } from 'antd';
import AllTestimonies from './component/AllTestimonies';
import UploadTestimonies from './component/UploadTestimonies';
import VideoPlayer from './component/VideoPlayer';


function App() {
  return (
    <div>
      <DarkModeContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-password" element={<CreatePassword />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="" element={<Overview />} />
              <Route path='all-testimonies' element={<AllTestimonies/>}/>
              <Route path='upload-testimonies' element={<UploadTestimonies/>}/>
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/donations" element={<Donations />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DarkModeContextProvider>
    </div>
  );
}

export default App;
