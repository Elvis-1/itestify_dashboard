import React from "react";
import { Button } from "antd";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreatePassword from "./pages/CreatePassword";
import Dashboard from "./pages/Dashboard";
import Overview from "./component/Overview";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import UserContextProvider from "./context/UserContext";
import { UserContext } from "./context/UserContext";
import Users from "./component/Users";

function App() {
  return (
    <div>
      <UserContextProvider>
        <DarkModeContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="" element={<Overview />} />
                <Route path="/dashboard/users" element={<Users />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DarkModeContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
