"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'
import { useRouter, usePathname } from 'next/navigation';


const GameContext = createContext();

export const useGame = () => useContext(GameContext);


export const GameProvider = ({ children }) => {
  const pathname = usePathname();
  const [gameSession, setGameSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const { user, loading, setLoading, updateUser, signOut: authSignOut } = useAuth();
  const router = useRouter();

  const fetchGameSession = useCallback(async (sessionId) => {
    if (!sessionId) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/game/fetch_session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId }),
      });

      if (res.ok) {
          const updatedSession = await res.json();
          setGameSession(updatedSession);
          setParticipants(updatedSession.participants);
      } else {
          console.log("NOT OK");
          console.error('Error fetching game session:', await res.json());
      }
    } catch (error) {
        console.error('Fetch game session error:', error);
    } finally {
        setLoading(false);
    }

  }, []);
  // }, [setLoading, setGameSession, setParticipants]);

  const addParticipant = async ({participant, participantType}) => {
    console.log("Game session: ", gameSession)
    if (!gameSession) return;

    setLoading(true);

    const res = await fetch(`/api/game/add_participant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: gameSession.sessionId, participant: participant, participantType: participantType}),
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

    if (participant) {
      const res = await fetch(`/api/game/remove_participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: gameSession.sessionId, participant: participant }),
      });

      if (res.ok) {
        const updatedSession = await res.json();
        setGameSession(updatedSession);
        setParticipants(updatedSession.participants);
      } else {
        console.error('Error removing participant:', await res.json());
      }
    } else {
      console.log('Error when removing participant: ', participant);
    }

    setLoading(false);
  };

  const endGame = async (userId) => {
    if (!gameSession) return;

    setLoading(true);

    if (userId) {
      const res = await fetch(`/api/game/end_game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: gameSession.sessionId, userId: userId }),
      });

      if (res.ok) {
        setGameSession(null)
        console.log("Game session set to null")
      } else {
        console.error('Error removing participant:', await res.json());
      }
    } else {
      console.log('Error when removing participant: ', participant);
    }

    setLoading(false);
  };

  const signOut = async () => {
    console.log("SIGN OUT")
    if (gameSession) {
      await endGame(user._id)
      await updateUser({...user, currentGameSession: null }); // Remove game session
    }
    authSignOut()

  };


  useEffect(() => {
    console.log("GAME USE EFFECT")

    if (loading) return
    
    if (gameSession && user) {
      console.log("All good")

    } else if (!gameSession && !loading && user && user.currentGameSession) {
      // Fetch and set game session 
      fetchGameSession(user.currentGameSession);

    } else if (!user) {
      console.log("GameContext: No user");
      if (pathname !== '/sign_in') {
        router.push('/home');
      }
    }
  }, [user, loading, router, gameSession, pathname, fetchGameSession]);

  return (
    <GameContext.Provider value={{ gameSession, setGameSession, fetchGameSession, participants, setParticipants, addParticipant, removeParticipant, endGame, signOut}}>
      {children}
    </GameContext.Provider>
  );
};