"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation';


const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameSession, setGameSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const { user, loading, setLoading } = useAuth();
  const router = useRouter();

  const fetchGameSession = useCallback(async (sessionId) => {
    if (!sessionId) return;

    setLoading(true);

    const res = await fetch(`/api/game/fetch_session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId }),
    });

    if (res.ok) {
      const updatedSession = await res.json();
      setGameSession(updatedSession);
      // setLoading(false)
    } else {
      console.log("NOT OK")
      console.error('Error adding participant:', await res.json());

    }
    setLoading(false)

  }, [setLoading, setGameSession]);

  const addParticipant = async (participantId) => {
    if (!gameSession) return;

    setLoading(true);

    // Update the game session in the database
    const res = await fetch(`/api/game/add_participant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: gameSession.sessionId, participantId }),
    });

    if (res.ok) {
      console.log("OK")
      const updatedSession = await res.json();
      // console.log("Updated session after GameContext method: ", updatedSession) //yes
      setGameSession(updatedSession);
      setParticipants(updatedSession.participants);
      // setLoading(false)
    } else {
      console.log("NOT OK")
      console.error('Error adding participant:', await res.json());
    }
    setLoading(false)
  };

  useEffect(() => {
    if (loading) return
    
    if (gameSession && user) {
      console.log("All good")

    } else if (!gameSession && user && user.currentGameSession) {

      // Fetch and set game session 
      const fetchGameSessionUpdateState = async () => {
        const fetchedGameSession = await fetchGameSession(user.currentGameSession);
      }
      fetchGameSessionUpdateState()

    } else if (!user) {
      console.log("No user");
      router.push('/home');
    }
  }, [user, gameSession, loading, router, fetchGameSession]);

  return (
    <GameContext.Provider value={{ gameSession, setGameSession, fetchGameSession, participants, setParticipants, addParticipant}}>
      {children}
    </GameContext.Provider>
  );
};