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

  }, [setLoading]);

  const addParticipant = async (participant) => {
    if (!gameSession) return;

    setLoading(true);

    const res = await fetch(`/api/game/add_participant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: gameSession.sessionId, participant }),
    });

    if (res.ok) {
      console.log("OK")
      const updatedSession = await res.json();
      setGameSession(updatedSession);
      setParticipants(updatedSession.participants);
    } else {
      console.log("NOT OK")
      console.error('Error adding participant:', await res.json());
    }
    setLoading(false);
  };

  const removeParticipant = async (participant) => {
    if (!gameSession) return;

    setLoading(true);

    if (participant.name) {
      // It's a temp user, remove them from the game session database record
      const res = await fetch(`/api/game/remove_participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: gameSession.sessionId, participantId: participant.id }),
      });

      if (res.ok) {
        const updatedSession = await res.json();
        setGameSession(updatedSession);
        setParticipants(updatedSession.participants);
      } else {
        console.error('Error removing participant:', await res.json());
      }
    } else if (participant.userId) {
      // It's a real user, handle accordingly
      console.log('Removing real user: TO BE IMPLEMENTED');
    }

    setLoading(false);
  };


  useEffect(() => {
    if (loading) return
    
    if (gameSession && user) {
      console.log("All good")

    } else if (!gameSession && user && user.currentGameSession) {
      // Fetch and set game session 
      fetchGameSession(user.currentGameSession);

    } else if (!user) {
      console.log("No user");
      router.push('/home');
    }
  }, [user, loading, router, gameSession, fetchGameSession]);

  return (
    <GameContext.Provider value={{ gameSession, setGameSession, fetchGameSession, participants, setParticipants, addParticipant, removeParticipant}}>
      {children}
    </GameContext.Provider>
  );
};