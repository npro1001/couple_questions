"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute: user: ", user, " loading: ", loading)
    if (!loading && !user) {
      console.log(loading)
      console.log(user)
      router.push('/sign_in');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-around items-center pt-8">
        <span className="loading loading-ring loading-lg"></span>
      </div>);
  }

  if (!loading && !user) {
    return null
  }

  return children;
};

export default ProtectedRoute;