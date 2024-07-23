"use client"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useGame } from '../../../contexts/GameContext';

const JoinGame = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading, signIn } = useAuth();
    const { gameSession, fetchGameSession, addParticipant } = useGame();
    const [joining, setJoining] = useState(false);
    const sessionId = searchParams.get('sessionId');

    useEffect(() => {
        if (loading) return;
        
        if (sessionId) {
            console.log(`Joining session: ${sessionId}`);
            sessionStorage.setItem('sessionId', sessionId);
          } else {
            console.log('No sessionId found');
          }

        if (sessionId && user) {
            const joinGame = async () => {
                try {
                    setJoining(true);
                    console.log(`Fetching game session for joining: ${sessionId}`);
                    await fetchGameSession(sessionId);
                    console.log('Adding participant');
                    await addParticipant({ userId: user._id, type: 'real' });
                    router.push(`/game_lobby?sessionId=${sessionId}`);
                } catch (error) {
                    console.error('Failed to join game:', error);
                } finally {
                    setJoining(false);
                }
            };
            joinGame();
        } else if (!user) {
            console.log('User not found, redirecting to sign in');
            router.push(`/sign_in`);
        }
    }, [user, loading, sessionId, router, addParticipant, fetchGameSession]);

    return (
        <div className="container mx-auto w-auto h-full p-4 bg-base-300">
            {loading || joining ? (
                <div className="flex justify-around items-center pt-8">
                    <span className="loading loading-ring loading-lg"></span>
                </div>
            ) : (
                <h2>Joining Couple Questions game...</h2>
            )}
        </div>
    );
};

export default JoinGame;