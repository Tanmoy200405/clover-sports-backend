
import React from 'react';
import AuthComponent from '@/components/AuthComponent';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  
  const handleAuthComplete = () => {
    navigate('/profile');
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <AuthComponent onComplete={handleAuthComplete} />
    </div>
  );
};

export default Auth;
