"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  // const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (loading) return

    if (!user) {
      signOut()
      router.push('/sign_in')
    }
  }, [loading, user, signOut, router]);

    return children

    // const validateToken = async () => {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     try {
    //       // Replace this with your actual token validation logic
    //       const response = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    //       if (response.ok) {}
    //       setIsAuthenticated(true);
    //     } catch (error) {
    //       console.error('Token validation failed', error);
    //       setIsAuthenticated(false);
    //     }        
    //   } else {
    //     setIsAuthenticated(false);
    //   }
    //   setIsLoading(false);
    // };

    // validateToken();

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     signOut()
  //     // router.push('/sign_in');
  //   }
  // }, [isLoading, isAuthenticated, signOut]);

  // return isAuthenticated ? children : null;
};

export default ProtectedRoute;