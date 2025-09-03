// "use client";

// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authInitialized, setAuthInitialized] = useState(false);

//   // Initialize auth state from localStorage
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         setLoading(true);

//         // Small delay to ensure localStorage is ready
//         await new Promise(resolve => setTimeout(resolve, 50));

//         const token = localStorage.getItem('token');
//         const storedUser = localStorage.getItem('user');
//         const storedProvider = localStorage.getItem('provider');
//         const storedAdmin = localStorage.getItem('admin');

//         if (token) {
//           if (storedUser) {
//             const userData = JSON.parse(storedUser);
//             setUser(userData);
//           } else if (storedProvider) {
//             const providerData = JSON.parse(storedProvider);
//             setProvider(providerData);
//           } else if (storedAdmin) {
//             const adminData = JSON.parse(storedAdmin);
//             setAdmin(adminData);
//           }
//         }
//       } catch (error) {
//         // Clear corrupted data
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         localStorage.removeItem('provider');
//         localStorage.removeItem('admin');
//       } finally {
//         setAuthInitialized(true);
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   // Set user and update localStorage with immediate state update
//   const updateUser = async (userData) => {
//     // Update state immediately
//     setUser(userData);
//     setProvider(null);
//     setAdmin(null);

//     // Update localStorage asynchronously
//     if (userData) {
//       localStorage.setItem('user', JSON.stringify(userData));
//       localStorage.removeItem('provider');
//       localStorage.removeItem('admin');
//     } else {
//       localStorage.removeItem('user');
//     }

//     // Small delay to ensure localStorage is written
//     await new Promise(resolve => setTimeout(resolve, 10));
//   };

//   // Set provider and update localStorage with immediate state update
//   const updateProvider = async (providerData) => {
//     // Update state immediately
//     setProvider(providerData);
//     setUser(null);
//     setAdmin(null);

//     // Update localStorage asynchronously
//     if (providerData) {
//       localStorage.setItem('provider', JSON.stringify(providerData));
//       localStorage.removeItem('user');
//       localStorage.removeItem('admin');
//     } else {
//       localStorage.removeItem('provider');
//     }

//     // Small delay to ensure localStorage is written
//     await new Promise(resolve => setTimeout(resolve, 10));
//   };

//   // Set admin and update localStorage with immediate state update
//   const updateAdmin = async (adminData) => {
//     // Update state immediately
//     setAdmin(adminData);
//     setUser(null);
//     setProvider(null);

//     // Update localStorage asynchronously
//     if (adminData) {
//       localStorage.setItem('admin', JSON.stringify(adminData));
//       localStorage.removeItem('user');
//       localStorage.removeItem('provider');
//     } else {
//       localStorage.removeItem('admin');
//     }

//     // Small delay to ensure localStorage is written
//     await new Promise(resolve => setTimeout(resolve, 10));
//   };

//   // Check if user is authenticated - now checks state first, then localStorage as fallback
//   const isAuthenticated = () => {
//     // First check current state
//     const hasStateUser = !!(user || provider || admin);

//     // If we have state, use that
//     if (hasStateUser) {
//       const token = localStorage.getItem('token');
//       return !!(token && hasStateUser);
//     }

//     // Fallback to localStorage check
//     const token = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
//     const storedProvider = localStorage.getItem('provider');
//     const storedAdmin = localStorage.getItem('admin');
//     const hasStoredUser = !!(storedUser || storedProvider || storedAdmin);
//     return !!(token && hasStoredUser);
//   };

//   // Get current user (user, provider, or admin) - checks state first, then localStorage
//   const getCurrentUser = () => {
//     // First check current state
//     const stateUser = user || provider || admin;
//     if (stateUser) {
//       return stateUser;
//     }

//     // Fallback to localStorage
//     try {
//       const storedUser = localStorage.getItem('user');
//       const storedProvider = localStorage.getItem('provider');
//       const storedAdmin = localStorage.getItem('admin');

//       if (storedUser) {
//         return JSON.parse(storedUser);
//       }
//       if (storedProvider) {
//         return JSON.parse(storedProvider);
//       }
//       if (storedAdmin) {
//         return JSON.parse(storedAdmin);
//       }
//     } catch (error) {
//       // Silent error handling
//     }

//     return null;
//   };

//   // Get user role - checks state first, then localStorage
//   const getUserRole = () => {
//     // Check current state first
//     if (user) return 'user';
//     if (provider) return 'provider';
//     if (admin) return 'admin';

//     // Fallback to localStorage
//     if (localStorage.getItem('user')) return 'user';
//     if (localStorage.getItem('provider')) return 'provider';
//     if (localStorage.getItem('admin')) return 'admin';

//     return null;
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     setProvider(null);
//     setAdmin(null);

//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('provider');
//     localStorage.removeItem('admin');
//     sessionStorage.clear();
//   };

//   // Login with response data - now async to handle localStorage properly
//   const loginWithResponse = async (responseData) => {
//     // Store token immediately
//     if (responseData.token) {
//       localStorage.setItem('token', responseData.token);
//     }

//     // Set user data based on response with immediate state updates
//     if (responseData.user) {
//       await updateUser(responseData.user);
//       // Additional delay to ensure state is fully updated
//       await new Promise(resolve => setTimeout(resolve, 50));
//       return { success: true, role: 'user', user: responseData.user };
//     } else if (responseData.provider) {
//       await updateProvider(responseData.provider);
//       // Additional delay to ensure state is fully updated
//       await new Promise(resolve => setTimeout(resolve, 50));
//       return { success: true, role: 'provider', provider: responseData.provider };
//     } else if (responseData.admin) {
//       await updateAdmin(responseData.admin);
//       // Additional delay to ensure state is fully updated
//       await new Promise(resolve => setTimeout(resolve, 50));
//       return { success: true, role: 'admin', admin: responseData.admin };
//     } else if (responseData.newUser) {
//       return { success: true, newUser: true };
//     }

//     return { success: false, message: 'Invalid response format' };
//   };

//   const value = {
//     user,
//     provider,
//     admin,
//     loading,
//     authInitialized,
//     setUser: updateUser,
//     setProvider: updateProvider,
//     setAdmin: updateAdmin,
//     isAuthenticated,
//     getCurrentUser,
//     getUserRole,
//     logout,
//     loginWithResponse
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const initializeAuth = () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log("decoded token inside context", decoded);

          if (decoded) {
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email || '',
              role: decoded.role,
              phone:decoded.phone,
              date:decoded.date
            });
          } else {
            console.warn("Token found but missing required fields.");
            setUser(null);
          }
        } catch (e) {
          console.error("Failed to decode token:", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setAuthInitialized(true);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loginWithToken = (token) => {
    try {
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      if (decoded) {
        const userData = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email || "",
          role: decoded.role,
          phone:decoded.phone,
          date:decoded.date
        };
        setUser(userData);
        return { success: true, user: userData };
      } else {
        localStorage.removeItem("token");
        setUser(null);
        return { success: false, message: "Invalid token format" };
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      return { success: false, message: "Invalid or corrupt token" };
    }
  };
console.log("userdate" ,user);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    sessionStorage.clear();
    router.push('/')
  };

  const isAuthenticated = () => !!user;

  const getCurrentUser = () => user;

  const getUserRole = () => user?.role || null;

  const value = {
    user,
    loading,
    authInitialized,
    isAuthenticated,
    getCurrentUser,
    getUserRole,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

