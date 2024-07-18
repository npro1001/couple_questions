"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  // useEffect(() => {
  //   console.log("ProtectedRoute: user: ", user, " loading: ", loading)
  //   if (!loading && !user) {
  //     console.log(loading)
  //     console.log(user)
  //     signOut()
  //   }
  // }, [user, loading, signOut]);
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Replace this with your actual token validation logic
          const response = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed', error);
          setIsAuthenticated(false);
        }        
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signOut()
      // router.push('/sign_in');
    }
  }, [isLoading, isAuthenticated, signOut]);

  // if (loading) {
  //   return (
  //     <div className="flex justify-around items-center pt-8">
  //       <span className="loading loading-ring loading-lg"></span>
  //     </div>);
  // }
  

  // if (!loading && !user) {
  //   return null
  // }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;