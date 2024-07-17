"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameSession, setGameSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  // const { setLoading } = useAuth(); //? WHYY NOT

  const addParticipant = async (participantId) => {
    if (!gameSession) return;

    // setLoading(true);
    // Update the game session in the database
    const res = await fetch(`/api/game/add_participant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: gameSession.sessionId, participantId }),
    });

    if (res.ok) {
      const updatedSession = await res.json();
      console.log("Updated session after GameContext method: ", updatedSession) //yes
      setGameSession(updatedSession);
      setParticipants(updatedSession.participants);
      // setLoading(false)
    } else {
      console.error('Error adding participant:', await res.json());
      // setLoading(false)

    }
  };

  useEffect(() => {
    console.log("Game session updated: ", gameSession)
  }, [gameSession]);

  return (
    <GameContext.Provider value={{ gameSession, setGameSession, participants, setParticipants, addParticipant}}>
      {children}
    </GameContext.Provider>
  );
};