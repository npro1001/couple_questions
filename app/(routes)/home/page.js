"use client"

import Head from 'next/head';
import NavMenu from '../../components/NavMenu'
import { useRouter } from 'next/navigation';
import Spline from "@splinetool/react-spline"
import { HomeCard } from "../../components/HomeCard"
import Image from 'next/image'
import Header from "../../components/Header"
import { useAuth } from '../../../contexts/AuthContext'
import { useGame } from '../../../contexts/GameContext'; // Import useGame
import { useEffect, useState } from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../models/User';
import HomeUserCoins from './../../components/HomeUserCoins';


export default function HomePage() {

  const { user, loading, signOut, updateUser } = useAuth();
  const { setGameSession } = useGame();
  const router = useRouter();
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    if (loading ) {
      return
    }
    if (!loading && !user) {
      console.log("No user found in Home page");
      signOut();
    }
  }, [user, loading, router, signOut]);

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

  const handleStartGame = (e) => {
    e.preventDefault();
    // router.push('/game');
    setStartGame(true);
  };

  if (loading) {
    return (
      <div className="flex justify-around items-center pt-8">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {!loading && user && <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: startGame ? 0 : 1, scale: startGame ? 1.5 : 1 }}
        exit={{ opacity: 0, scale: 5 }}
        transition={{ 
          opacity: { duration: 0.5 },  // Duration for opacity transition
          scale: { duration: 0.7}  // Duration and delay for scale transition
        }}
        onAnimationComplete={async () => {
          if (startGame) {
            console.log("New game started");
            const sessionId = uuidv4();
            const res = await fetch('/api/game/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, host: user }),
            });
            
            if (res.ok) {
              const userDetails = { userId: user._id, name: `${user.firstName} ${user.lastName}`, type: 'real', interests: user.interests };
              await setGameSession({ sessionId, hostId: user._id, participants: [userDetails], status: 'waiting' }); // TODO fix duplicitaveness -- should be set by response from creation
              await updateUser({...user, currentGameSession: sessionId }); // Update user's current game session
              router.push(`/game_lobby?sessionId=${sessionId}`);
            } else {
              // Handle error
              console.log("Error from home page creating game")

            }
          }
        }}
      >
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
            <HomeCard color="#818CF8" onStartGame={handleStartGame}/>
          </div>

          {/* Coin Info */}
          <HomeUserCoins />
          
        </div>
      </div>
      </motion.div> }
    </ProtectedRoute>
  );
}