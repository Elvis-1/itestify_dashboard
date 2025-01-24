import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePassword from "./pages/CreatePassword";
import Dashboard from "./pages/Dashboard";
import Overview from "./component/testimonies/Overview";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import Users from "./pages/Users";
import Donations from "./pages/Donations";
import { Button } from "antd";
import AllTestimonies from "./component/testimonies/AllTestimonies";
import UploadTestimonies from "./component/testimonies/UploadTestimonies";
import VideoPlayer from "./component/testimonies/VideoPlayer";
import DonationContext from "./context/DonationContext";
import Notifications from "./pages/Notifications";

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
              <Route
                path="upload-testimonies"
                element={<UploadTestimonies />}
              />
              <Route path="users" element={<Users />} />
              <Route path="donations" element={<Donations />} />
              <Route path="notifications" element={<Notifications/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </DarkModeContextProvider>
      </DonationContext>
    </div>
  );
}

export default App;
