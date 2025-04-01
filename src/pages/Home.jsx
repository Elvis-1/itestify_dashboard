import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EntryCodeLogin from '../component/EntryCodeLogin';
import LogoDisplay from '../component/LogoDisplay';

function Home() {
  const [showLogo, setShowLogo] = useState(true);
  const [showEntryCodeLogin, setShowEntryCodeLogin] = useState(false); 
  const navigate = useNavigate(); 

  
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user?.created_password === true) {
      navigate('/dashboard');
    }else if(!token && user?.created_password === true) {
      navigate('/login')
    } 
    else {
      setShowEntryCodeLogin(true); 
    }
  };

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setShowLogo(false);
      checkAuth(); 
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-950'>
      {showLogo && <LogoDisplay />}
      {!showLogo && showEntryCodeLogin && <EntryCodeLogin />}
    </div>
  );
}

export default Home;