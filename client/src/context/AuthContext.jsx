import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Set up axios interceptor for 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Auto logout on 401 Unauthorized
          logout();
        }
        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setAuthError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );
      setUser(response.data);
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error?.response?.data || error.message,
      );
      setAuthError(error?.response?.data?.message || "Authentication failed");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply the auth check effect with a cleanup
  useEffect(() => {
    let isMounted = true;

    const performAuthCheck = async () => {
      try {
        await checkAuth();
      } catch (error) {
        if (isMounted) {
          console.error("Error during auth check:", error);
        }
      }
    };

    performAuthCheck();

    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  const login = async (token, userData = null) => {
    try {
      localStorage.setItem("token", token);
      setAuthError(null);

      if (!userData) {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URI}/api/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        userData = response.data;
      }

      setUser(userData);
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return userData;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Login failed";
      setAuthError(errorMessage);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      throw new Error(errorMessage);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/verify-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.valid === true;
    } catch (error) {
      return false;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URI}/api/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUser(response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Profile update failed";
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    authError,
    login,
    logout,
    verifyToken,
    updateUserProfile,
    handleOAuthLogin: login, // Simplified OAuth login handling
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
