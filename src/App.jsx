import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePassword from "./pages/CreatePassword";
import Dashboard from "./pages/Dashboard";
import Overview from "./component/testimonies/Overview";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import UploadTestContextProvider from "./context/UploadTestimonyContext";
import Users from "./pages/Users";
import Donations from "./pages/Donations";
import DonationsAnalytics from "./pages/DonationsAnalytics";
import DonationContext from "./context/DonationContext";
import Notifications from "./pages/Notifications";
import AllTestimonies from "./component/testimonies/AllTestimonies";
import UploadTestimonies from "./component/testimonies/UploadTestimonies";
import ProtectedRoute from "./component/ProtectedRoutes";
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
import ScriptureContextProvider from "./context/ScriptureContext";
import UploadScriptures from "./pages/UploadScriptures";
import HomeManagement from "./pages/HomeManagement";

function App() {
  return (
    <div>
      <ScriptureContextProvider>
        <NotificationContext>
          <DonationContext>
            <DarkModeContextProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-password" element={<CreatePassword />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />}>
                      <Route path="" element={<Overview />} />
                      <Route path="home-management" element={<HomeManagement />} />

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
                      <Route path="daily-scripture" element={<ScriptureForDay />} />
                      <Route
                        path="upload-scripture"
                        element={<UploadScriptures />}
                      />
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
                  </Route>
                </Routes>
              </BrowserRouter>
            </DarkModeContextProvider>
          </DonationContext>
        </NotificationContext>
      </ScriptureContextProvider>
    </div>
  );
}

export default App;
