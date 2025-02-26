import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePassword from "./pages/CreatePassword";
import Dashboard from "./pages/Dashboard";
import Overview from "./component/testimonies/Overview";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import Users from "./pages/Users";
import Donations from "./pages/Donations";


import DonationContext from "./context/DonationContext";
import Notifications from "./pages/Notifications";
import Reviews from "./pages/Reviews";

import { Button } from 'antd';
import AllTestimonies from './component/testimonies/AllTestimonies';
import UploadTestimonies from './component/testimonies/UploadTestimonies';
import VideoPlayer from './component/testimonies/VideoPlayer';
import Allpics from "./component/inspirationalPics/Allpics";
import UploadInspirational from "./component/inspirationalPics/UploadInspirational";
import TestimonyAnalytics from "./pages/TestimonyAnalytics";
import Profile from './pages/Profile';
import NotificationSettings from './pages/NotificationSettings';



function App() {
  return (
    <div>
      <DonationContext>
      <DarkModeContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-password" element={<CreatePassword />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="" element={<Overview />} />
              <Route path="all-testimonies" element={<AllTestimonies />} />
              <Route path="users" element={<Users />} />
              <Route path="donations" element={<Donations />} />
              <Route path="notifications" element={<Notifications/>}/>
              <Route path="review" element={<Reviews/>}/>
              <Route path='all-testimonies' element={<AllTestimonies/>}/>
              <Route path='upload-testimonies' element={<UploadTestimonies/>}/>
              <Route path="inspirational-pictures" element={<Allpics/>}/>
              <Route path="upload-inspirational-pictures" element={<UploadInspirational/>}/>
              <Route path="testimony-analytics" element={<TestimonyAnalytics/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="notification-settings" element={<NotificationSettings/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </DarkModeContextProvider>
      </DonationContext>
    </div>
  );
}

export default App;
