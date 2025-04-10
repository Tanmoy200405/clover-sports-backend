
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
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-clover-primary p-6 text-white text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <div className="bg-clover-primary w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold">C</div>
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
