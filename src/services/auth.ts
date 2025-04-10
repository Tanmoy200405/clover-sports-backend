
import { db } from './database';
import { toast } from '@/hooks/use-toast';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
}

class AuthService {
  private state: AuthState = {
    user: null,
    isAuthenticated: false
  };
  
  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem('clover_user');
    if (savedUser) {
      try {
        this.state.user = JSON.parse(savedUser);
        this.state.isAuthenticated = true;
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('clover_user');
      }
    }
  }

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  async register(name: string, email: string, password: string): Promise<boolean> {
    try {
      // Check if user already exists
      const users = await db.getUsers();
      if (users.some(u => u.email === email)) {
        toast({
          title: "Registration Failed",
          description: "Email is already in use.",
          variant: "destructive"
        });
        return false;
      }

      // In a real app, we would hash the password
      // For this demo, we'll store it directly
      const user = await db.createUser({
        name,
        email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
      });

      this.state = {
        user,
        isAuthenticated: true
      };

      // Save to localStorage
      localStorage.setItem('clover_user', JSON.stringify(user));
      this.notifyListeners();
      
      toast({
        title: "Registration Successful",
        description: "Welcome to Clover Sports!",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Find user by email
      const users = await db.getUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        return false;
      }

      // In a real app, we would verify the password hash
      // For this demo, we'll assume it's correct
      
      this.state = {
        user,
        isAuthenticated: true
      };

      // Save to localStorage
      localStorage.setItem('clover_user', JSON.stringify(user));
      this.notifyListeners();
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Clover Sports!",
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    }
  }

  logout(): void {
    this.state = {
      user: null,
      isAuthenticated: false
    };
    
    // Clear from localStorage
    localStorage.removeItem('clover_user');
    this.notifyListeners();
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  }

  async updateProfile(userData: Partial<any>): Promise<boolean> {
    try {
      if (!this.state.user || !this.state.isAuthenticated) {
        toast({
          title: "Update Failed",
          description: "You must be logged in to update your profile.",
          variant: "destructive"
        });
        return false;
      }

      const updatedUser = await db.updateUser(this.state.user.id, userData);
      
      if (!updatedUser) {
        toast({
          title: "Update Failed",
          description: "Failed to update profile.",
          variant: "destructive"
        });
        return false;
      }

      this.state = {
        ...this.state,
        user: updatedUser
      };

      // Update localStorage
      localStorage.setItem('clover_user', JSON.stringify(updatedUser));
      this.notifyListeners();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    }
  }
}

export const authService = new AuthService();
