"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import User from '../models/User';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const initializeAuth = async () => {
      // Skip authentication logic if the current page is the sign-in page
      // if (pathname === '/sign_in') {
      //   setLoading(false);
      //   return;
      // }
      console.log("Initializing auth")
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Replace this URL with your actual API endpoint
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Token validation failed');
          const userData = await response.json();
          setUser(userData); // Restore user session
          console.log("Auth initialized")
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token'); // Clear invalid token
          router.push('/sign_in'); // Redirect to sign-in page
        }
      } else {
        if (pathname !== '/sign_in') {
          router.push('/sign_in')
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [router, pathname]);

  const fetchUser = async (token) => {
    setLoading(true);
    try {
      console.log("Fetching user with token: ", token)
      const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch user data');

      const userData = await res.json();
      // console.log("User data fetched: ", userData)
      setUser(User.fromJSON(userData));

    } catch (error) {
      console.error('Error fetching user data:', error);
      signOut(); 

    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (newUserInfo) => {
    setLoading(true);
    const { _id, ...newUserInfoWithoutId } = newUserInfo;

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/auth/update_me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
          body: JSON.stringify(newUserInfoWithoutId)})
        
        if (!response.ok) throw new Error('Failed to update user information');
        const updatedUser = await response.json();
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
      } finally {
        setLoading(false)
      }
    }
  }


  const signIn = async (email, password) => {
    setLoading(true);
    setError(null); // Reset error statae
    try {
      const res = await fetch('/api/sign_in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) throw new Error('Sign-in failed');
  
      const { token, user: userData} = await res.json();
      console.log("Sign-in response", {token, userData})
      localStorage.setItem('token', token);
      setUser(User.fromJSON(userData));

    } catch (error) {
      setError(error.message);
      console.error('Sign-in error:', error);

    } finally {
      setLoading(false);
    }

  };

  const signOut = async () => {
    // user.removeCurrentGameSession() // TODO impl
    await updateUser({...user, currentGameSession: null }); // Remove game session
    localStorage.removeItem('token');
    localStorage.removeItem('pusherTransportTLS');
    console.log("User signed out");

    // setUser(null);
    if (pathname !== '/sign_in') {
      router.push('/sign_in');
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-around items-center pt-8">
  //       <span className="loading loading-ring loading-lg"></span>
  //     </div>
  //   );
  // }

  return (
    <AuthContext.Provider value={{ user, loading, error, setLoading, updateUser, fetchUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}