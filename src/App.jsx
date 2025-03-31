import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePassword from "./pages/CreatePassword";
import Dashboard from "./pages/Dashboard";
import Overview from "./component/testimonies/Overview";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import Users from "./pages/Users";
import Donations from "./pages/Donations";
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
import Permissions from "./pages/Permissions";
import TestimonyAnalytics from "./pages/TestimonyAnalytics";
import Profile from "./pages/Profile";
import NotificationSettings from "./pages/NotificationSettings";
import Reviews from "./pages/Reviews";
import Login from "./component/Login";
import ForgotPassword from "./component/ForgotPassword";
import ScriptureForDay from "./pages/ScriptureForDay";
import ScriptureContext from "./context/ScriptureContext";

function App() {
  return (
    <div>
      <ScriptureContext>
        <NotificationContext>
          <DonationContext>
            <DarkModeContextProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-password" element={<CreatePassword />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route path="" element={<Overview />} />

                    <Route
                      path="all-testimonies"
                      element={<AllTestimonies />}
                    />
                    <Route
                      path="upload-testimonies"
                      element={<UploadTestimonies />}
                    />
                    <Route path="users" element={<Users />} />
                    <Route path="donations" element={<Donations />} />
                    <Route path="notifications" element={<Notifications />} />

                    <Route
                      path="all-testimonies"
                      element={<AllTestimonies />}
                    />
                    <Route
                      path="upload-testimonies"
                      element={<UploadTestimonies />}
                    />
                    <Route path="users" element={<Users />} />
                    <Route
                      path="inspirational-pictures"
                      element={<Allpics />}
                    />
                    <Route
                      path="upload-inspirational-pictures"
                      element={<UploadInspirational />}
                    />
                    <Route path="reviews" element={<Reviews />} />
                    <Route
                      path="donations-analytics"
                      element={<DonationsAnalytics />}
                    />
                    <Route
                      path="testimonies-analytics"
                      element={<TestimonyAnalytics />}
                    />
                    <Route path="daily-verse" element={<ScriptureForDay />} />
                    <Route
                      path="general-settings"
                      element={<GeneralSettings />}
                    />
                    <Route
                      path="manage-permissions"
                      element={<Permissions />}
                    />
                    <Route path="profile" element={<Profile />} />
                    <Route
                      path="notification-settings"
                      element={<NotificationSettings />}
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </DarkModeContextProvider>
          </DonationContext>
        </NotificationContext>
      </ScriptureContext>
    </div>
  );
}

export default App;
