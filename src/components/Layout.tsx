
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Calendar, 
  Trophy, 
  Users, 
  MessageSquare, 
  User,
  Menu,
  LogOut
} from 'lucide-react';
import { authService } from '@/services/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [authState, setAuthState] = useState(authService.getState());
  const location = useLocation();
  
  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);
  
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home size={20} />
    },
    {
      name: 'Community',
      path: '/community',
      icon: <MessageSquare size={20} />
    },
    {
      name: 'Teams',
      path: '/teams',
      icon: <Users size={20} />
    },
    {
      name: 'Leaderboards',
      path: '/leaderboards',
      icon: <Trophy size={20} />
    }
  ];
  
  const handleLogout = () => {
    authService.logout();
  };
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Header */}
      <header className="bg-black border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-clover-primary w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-bold text-clover-primary hidden sm:inline">Clover Sports</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path) 
                    ? 'text-clover-primary font-medium' 
                    : 'text-gray-300 hover:text-clover-primary hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {authState.isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage src={authState.user.avatar} alt={authState.user.name} />
                    <AvatarFallback>{authState.user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex text-white hover:bg-white/5"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="bg-clover-primary hover:bg-clover-dark">
                  Login / Register
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden border-white/20 text-white">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white border-white/10">
                <div className="py-4">
                  <h2 className="text-xl font-bold text-clover-primary mb-6 flex items-center gap-2">
                    <div className="bg-clover-primary w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">C</div>
                    <span>Clover Sports</span>
                  </h2>
                  
                  <div className="space-y-1">
                    {navItems.map(item => (
                      <Link 
                        key={item.path} 
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                          isActive(item.path) 
                            ? 'bg-clover-dark/30 text-clover-light font-medium' 
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    
                    {authState.isAuthenticated && (
                      <>
                        <Link 
                          to="/profile"
                          className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                            isActive('/profile') 
                              ? 'bg-clover-light text-clover-dark font-medium' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <User size={20} />
                          <span>Profile</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-3 rounded-md transition-colors text-gray-600 hover:bg-gray-100 w-full text-left"
                        >
                          <LogOut size={20} />
                          <span>Logout</span>
                        </button>
                      </>
                    )}
                    
                    {!authState.isAuthenticated && (
                      <Link 
                        to="/auth"
                        className="flex items-center gap-3 px-3 py-3 rounded-md transition-colors bg-clover-primary text-white hover:bg-clover-dark"
                      >
                        <User size={20} />
                        <span>Login / Register</span>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="pb-20">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-clover-primary w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2">C</div>
              <span className="text-lg font-bold text-clover-primary">Clover Sports</span>
            </div>
            
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Clover Sports Community. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
