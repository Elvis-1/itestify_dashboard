import React from 'react';
import { Button } from 'antd';
import './App.css'
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreatePassword from './pages/CreatePassword';
import Dashboard from './pages/Dashboard';
import Overview from './component/Overview';
import { DarkModeContextProvider } from './context/DarkModeContext';


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
          </Route>
        </Routes>
      </BrowserRouter>
      </DarkModeContextProvider>
    </div>
  )
}

export default App
