
import React from 'react';
import AuthComponent from '@/components/AuthComponent';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAuthComplete = () => {
    toast({
      title: "Authentication successful",
      description: "You have been logged in successfully"
    });
    navigate('/profile');
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <AuthComponent onComplete={handleAuthComplete} />
    </div>
  );
};

export default Auth;
