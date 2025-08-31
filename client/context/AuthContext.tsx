import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  groups: string[];
  isAdmin: boolean;
  isBusiness: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isBusiness: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // In a real app, validate token with backend
          // For now, mock a user based on stored data
          const userData = localStorage.getItem("userData");
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Mock authentication - in real app, call your backend API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Mock user data based on email
      let mockUser: User;

      if (email.includes("admin")) {
        mockUser = {
          id: "1",
          name: "System Administrator",
          email: email,
          groups: ["admin", "business"],
          isAdmin: true,
          isBusiness: true,
        };
      } else if (email.includes("business")) {
        mockUser = {
          id: "2",
          name: "Business User",
          email: email,
          groups: ["business"],
          isAdmin: false,
          isBusiness: true,
        };
      } else {
        mockUser = {
          id: "3",
          name: "Regular User",
          email: email,
          groups: ["user"],
          isAdmin: false,
          isBusiness: false,
        };
      }

      // Store auth data
      localStorage.setItem("authToken", "mock-jwt-token");
      localStorage.setItem("userData", JSON.stringify(mockUser));

      setUser(mockUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return user?.groups.includes(role) || false;
  };

  const isAdmin = (): boolean => {
    return user?.isAdmin || false;
  };

  const isBusiness = (): boolean => {
    return user?.isBusiness || false;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    isAdmin,
    isBusiness,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
