
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from '@/hooks/use-toast';
import { authAPI } from '@/utils/api';

type User = {
  id: string;
  name: string | null;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate it
    const checkAuth = async () => {
      const token = localStorage.getItem("skillsync_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authAPI.getCurrentUser();
        setUser(data.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("skillsync_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await authAPI.login({ email, password });
      
      localStorage.setItem("skillsync_token", data.token);
      setUser(data.user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name || data.user.email}!`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await authAPI.register({ name, email, password });
      
      localStorage.setItem("skillsync_token", data.token);
      setUser(data.user);
      
      toast({
        title: "Registration Successful",
        description: `Welcome to SkillSync, ${name}!`,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("skillsync_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
