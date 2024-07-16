"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import User from '../models/User';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Retrieved token on mount: ", token)
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      console.log("Fetching user with token: ", token)
      const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        console.log("User data fetched: ", userData)
        setUser(User.fromJSON(userData));
      } else {
        const errorData = await res.json();
        console.error('Error fetching user data:', errorData);
      }
      setLoading(false);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    console.log("In auth signIn")
    setLoading(true);
    const res = await fetch('/api/sign_in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token, user: userData} = await res.json();
      console.log("Sign-in response", {token, userData})
      localStorage.setItem('token', token);
      setUser(User.fromJSON(userData));
      router.push('/home');

    } else {
      const errorData = await res.json();
      console.error('Sign-in error:', errorData.message);
    }
    setLoading(false);
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/sign_in');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}