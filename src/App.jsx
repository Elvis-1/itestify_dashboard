import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePassword from "./pages/CreatePassword";
import Dashboard from "./pages/Dashboard";
import Overview from "./component/testimonies/Overview";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import Users from "./pages/Users";
import Donations from "./pages/Donations";
import UsersAnalytics from "./pages/UsersAnalytics";
import DonationsAnalytics from "./pages/DonationsAnalytics";
import DonationContext from "./context/DonationContext";
import Notifications from "./pages/Notifications";
import AllTestimonies from "./component/testimonies/AllTestimonies";
import UploadTestimonies from "./component/testimonies/UploadTestimonies";
import VideoPlayer from "./component/testimonies/VideoPlayer";
import Allpics from "./component/inspirationalPics/Allpics";
import UploadInspirational from "./component/inspirationalPics/UploadInspirational";
import NotificationContext from "./context/NotificationContext";
import GeneralSettings from "./pages/GeneralSettings";

function App() {
  return (
    <div>
      <NotificationContext>
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
                  <Route path="notifications" element={<Notifications />} />

                  <Route path="all-testimonies" element={<AllTestimonies />} />
                  <Route
                    path="upload-testimonies"
                    element={<UploadTestimonies />}
                  />
                  <Route path="users" element={<Users />} />
                  <Route path="inspirational-pictures" element={<Allpics />} />
                  <Route
                    path="upload-inspirational-pictures"
                    element={<UploadInspirational />}
                  />
                  <Route path="users-analytics" element={<UsersAnalytics />} />
                  <Route
                    path="donations-analytics"
                    element={<DonationsAnalytics />}
                  />
                  <Route path="testimonies-analytics" element={<Donations />} />
                  <Route
                    path="general-settings"
                    element={<GeneralSettings />}
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </DarkModeContextProvider>
        </DonationContext>
      </NotificationContext>
    </div>
  );
}

export default App;
