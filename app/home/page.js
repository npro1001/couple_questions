"use client"

import Head from 'next/head';
import NavMenu from '../components/NavMenu'
import { useRouter } from 'next/navigation';
import Spline from "@splinetool/react-spline"
import { HomeCard } from "../components/HomeCard"
import Image from 'next/image'
import Header from "../components/Header"
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'



export default function HomePage() {

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found in Home page");
      router.push('/sign_in');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-around items-center pt-8">
          <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!loading && !user) {
    return null;
  }

  const handleNewGame = (e) => {
    e.preventDefault();
    router.push('/game');

  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 h-lvh flex flex-col overflow-hidden">
        <Head>
          <title>Home - Create Next App</title>
          <meta name="description" content="Home page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* HEADER */}
        <Header/>

        {/* MAIN CONTENT */}
        <div className="flex flex-col flex-grow items-center justify-between overflow-hidden">

          <div className="flex-grow flex items-end"></div>

          {/* Card */}
          <div className="min-h-[50vh] h-2/3 w-full flex justify-center items-center">
            <HomeCard color="#818CF8" />
          </div>

          {/* Coin Info */}
          <div className="flex-grow flex items-start justify-around mt-5">
            <div className="flex flex-col">
              <div className="stats bg-primary bg-opacity-85 text-primary-content">

                <div className="stat">
                  <div className="stat-title text-primary-content">Q-coins</div>
                  <div className="flex flex-row justify-around items-center">
                    <Image className="w-full h-auto" src="/coin.png" alt="coin" width={30} height={30} />
                    <div className="stat-value ml-2">{user.questionCredits?.toString()}</div>
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title text-primary-content">Q-skips</div>
                  <div className="flex flex-row justify-around items-center">
                    <Image className="w-full h-auto" src="/skip.png" alt="coin" width={30} height={30} />
                    <div className="stat-value ml-2">{user.questionSkipCredits?.toString()}</div>
                  </div>
                </div>

              </div>
              <div className="stat-actions w-full mt-2">
                <button className="btn btn-sm btn-success w-full hover:btn-primary">Add more Q-coins</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}