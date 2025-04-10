
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
    <div className="container mx-auto px-4 py-16 bg-black">
      <div className="max-w-md mx-auto bg-black/60 backdrop-blur-md rounded-lg shadow-lg border border-white/10 overflow-hidden">
        <div className="bg-clover-primary p-6 text-white text-center">
          <div className="mx-auto w-24 h-24 mb-4">
            <img 
              src="/lovable-uploads/27e90892-d6f9-4edc-8bf8-d4cdad6bb09c.png" 
              alt="Clover Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold">Welcome to Clover Sports</h2>
          <p className="text-white/80 mt-2">Sign in to access your account</p>
        </div>
        <div className="p-6">
          <AuthComponent onComplete={handleAuthComplete} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
