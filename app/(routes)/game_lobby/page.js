"use client";

import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useGame } from '../../../contexts/GameContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import FontAwesomeIcon from '../../fontawesome';
import TempUser from '../../../models/TempUser';
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Pusher from 'pusher-js'
// import pusher from '../../../lib/pusher';


// TODO - Sign out should remove token AND game context from DB

const GameLobby = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading, setLoading, signOut } = useAuth();
    const { gameSession, fetchGameSession, addParticipant, removeParticipant } = useGame();
    const [tempUser, setTempUser] = useState(null);
    const [showAddGuestForm, setShowAddGuestForm] = useState(false);
    const [showInvitePopup, setShowInvitePopup] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestInterests, setGuestInterests] = useState([]);
    const [interestInput, setInterestInput] = useState('');
    // const { sessionId } = router.query;
    const sessionId = searchParams.get('sessionId');


    useEffect(() => {
        // TODO REVIEW to ensure it deosnt trigger multiple auth checks
        let pusher
        let channel

        if (loading) return

        // Check if loading is finished and user session is lost
        if (!loading && !user) {
            console.log("No user found in GameLobby");
            signOut();

        } else if (sessionId && user) {
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                encrpyted: true,
            })

            const channel = pusher.subscribe(`game-session-${sessionId}`);

            channel.bind('participant-joined', (data) => {
                console.log('Participant Joined:', data);
                addParticipant(data, "real"); //? data.participant
            })

            return () => {
                if (channel) {
                    channel.unbind_all();
                    channel.unsubscribe();
                }
                // pusher.unsubscribe(`game-session-${sessionId}`);
            }

        } else if (user && !user.currentGameSession) {
            // If user exists but there's no current game session, fetch it
            console.log('Fetching game session for the user');
            fetchGameSession(); // Assuming fetchGameSession fetches and sets the game session

        } else if (gameSession && gameSession.participants && gameSession.participants.length > 1) {
            const participant = gameSession.participants[1];
            if (participant.name) {
              setTempUser(participant);
            } else if (participant.userId) {
              // Fetch real user details if necessary
            }
        }
        
    }, [user, loading, sessionId, fetchGameSession, gameSession, signOut, addParticipant, setTempUser]);



    // if (loading) {
    //     return (
    //         <div className="flex justify-around items-center pt-8 h-lvh align-center">
    //             <span className="loading loading-ring loading-lg align-middle"></span>
    //         </div>
    //     );
    // }

    if (!loading && !user) {
        return null;
    }


    const handleStartGame = () => {
        // Logic to start the game
        router.push('/game');
    };

    const handleAddGuestButton = () => {
        setShowAddGuestForm(true);
        setShowInvitePopup(false);
    };

    const handleInviteGuestButton = () => {
        setShowInvitePopup(true);
        setShowAddGuestForm(false);
    };

    const handleFormSubmit = async (e) => { // TODO - fix
        e.preventDefault();
        const guest = { type: 'temp', name: guestName, interests: guestInterests };
        setTempUser(guest);
        setShowAddGuestForm(false);
        await addParticipant(guest, "temp");
    };

    const handleAddInterest = () => {
        if (interestInput.trim()) {
            setGuestInterests([...guestInterests, interestInput.trim()]);
            setInterestInput('');
        }
    };

    const handleRemoveInterest = (index) => {
        setGuestInterests(guestInterests.filter((_, i) => i !== index));
    };

    const handleRemoveGuest = () => {
        removeParticipant(tempUser);
        setGuestName('');
        setGuestInterests([]);
        setShowAddGuestForm(false);
        setTempUser(null);
    };


    // const invitationUrl = `${window.location.origin}/join-game?sessionId}`;
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center">

                <div className="flex justify-center items-center align-middle">
                    <h2 className="font-playwrite text-3xl mt-5">Couple Questions</h2>
                </div>

                <div className="mt-10"></div>
                {loading && <div className="flex justify-around items-center pt-8 h-lvh align-center">
                    <span className="loading loading-ring loading-lg align-middle"></span>
                </div>}

                {user && <div className="mt-5 border border-primary rounded w-1/2 mx-auto flex flex-col items-center bg-base-100">

                    <h1 className="m-5 text-2xl">Game Lobby</h1>

                    {/* Players */}
                    <div className="m-5 flex flex-row justify-evenly w-full items-center">
                        {gameSession && gameSession.participants.map((participant, index) => (
                            <div key={index} className="border rounded flex flex-col items-center p-3 w-1/3 border-transparent">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-24 rounded-full">
                                        <span className="text-3xl">{participant.name[0].toUpperCase()}{participant.name[1]?.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <span className="mr-2 mt-2 text-3xl">{participant.name}</span>
                                    {participant.type === 'temp' && (
                                        <button type="button" className="btn btn-sm btn-outline btn-danger mt-3 items-center" onClick={() => handleRemoveGuest(participant)}>
                                            <FontAwesomeIcon icon={faTimes} className=" text-white" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap mt-3">
                                    {participant.interests.map((interest, index) => (
                                        <div key={index} className="badge badge-primary m-1">
                                            {interest}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
{/**       
                        <div className="border rounded flex flex-col items-center p-3 w-1/3 border-transparent">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content w-24 rounded-full">
                                    <span className="text-3xl">{user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}</span>
                                </div>
                            </div>
                            <span className="mt-2 text-3xl">{user.firstName}</span>
                            <div className="flex flex-wrap mt-3">
                                {user.interests.map((interest, index) => (
                                    <div key={index} className="badge badge-primary m-1">
                                        {interest}
                                    </div>
                                ))}
                            </div>
                            
                        </div>

                        {tempUser && (
                            <div className="border rounded flex flex-col items-center p-3 w-1/3 border-transparent">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-24 rounded-full">
                                        <span className="text-3xl">{tempUser.name[0].toUpperCase()}{tempUser.name[1].toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <span className="mr-2 mt-2 text-3xl">{tempUser.name}</span>
                                    <button type="button" className="btn btn-sm btn-outline btn-danger mt-3 items-center" onClick={handleRemoveGuest}>
                                        <FontAwesomeIcon icon={faTimes} className=" text-white" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap mt-3">
                                    {tempUser.interests.map((interest, index) => (
                                        <div key={index} className="badge badge-primary m-1">
                                            {interest}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}*/}

                        {/* Mock Guest Profile */}
                        {gameSession && user && showAddGuestForm && user._id === gameSession.hostId && (
                            <div className="border rounded flex flex-col items-center p-3 w-1/3 border-transparent">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-24 rounded-full">
                                        <span className="text-3xl">{guestName ? guestName[0].toUpperCase() : 'G'}{guestName ? guestName[1]?.toUpperCase() : 'N'}</span>
                                    </div>
                                </div>
                                <span className="mt-2 text-3xl">{guestName}</span>
                                <div className="flex flex-wrap mt-3">
                                    {guestInterests.map((interest, index) => (
                                        <div
                                            key={index}
                                            className="badge badge-primary m-1 relative cursor-pointer"
                                            onClick={() => handleRemoveInterest(index)}
                                            onMouseEnter={(e) => e.currentTarget.classList.add('badge-outline')}
                                            onMouseLeave={(e) => e.currentTarget.classList.remove('badge-outline')}
                                        >
                                            {interest}
                                            <FontAwesomeIcon icon={faTimes} className="absolute top-0 right-0 text-xs ml-2 text-red-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>


                    {/* Invite/Add options */}
                    {gameSession && tempUser === null && !showAddGuestForm &&  user._id === gameSession.hostId && (
                        <div className="border rounded flex flex-row items-center justify-center p-3 mb-10 w-1/3 border-transparent">
                            <button className="btn btn-outline btn-primary w-40 mx-2" onClick={handleInviteGuestButton}>
                                <FontAwesomeIcon icon={faEnvelope} className="fas fa-envelope" />
                                Invite a guest
                            </button>
                            <div className="divider divider-horizontal divider-outline mx-2"></div>
                            <button className="btn btn-outline btn-primary w-40 mx-2" onClick={handleAddGuestButton}>
                                <FontAwesomeIcon icon={faPlus} className="fas fa-plus" />
                                Add a guest
                            </button>
                        </div>
                    )}

                    {/* Guest Form */}
                    {gameSession && showAddGuestForm && (
                        <form onSubmit={handleFormSubmit} className="w-full flex flex-col items-center mt-3 mb-10">
                            <div className="flex flex-row w-2/3 items-center mb-3">
                                <input
                                    type="text"
                                    placeholder="Guest Name"
                                    className="input input-bordered flex-grow mr-2"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Add Interest"
                                    className="input input-bordered flex-grow mr-2"
                                    value={interestInput}
                                    onChange={(e) => setInterestInput(e.target.value)}
                                />
                                <button type="button" className="btn btn-primary" onClick={handleAddInterest}>Add</button>
                            </div>
                            <div className="flex flex-row w-2/3 justify-between">
                                <button type="submit" className="btn btn-primary w-1/2 mr-1">Add Guest</button>
                                <button type="button" className="btn btn-secondary w-1/2 ml-1" onClick={() => setShowAddGuestForm(false)}>Cancel</button>
                            </div>
                        </form>
                    )}

                    {/* Invitation Popup */}
                    {showInvitePopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-5 rounded shadow-lg text-center">
                                <h3 className="mb-4 text-xl">Invite a Guest</h3>
                                <p className="mb-4">Share this link with your guest:</p>
                                <input
                                    type="text"
                                    value={`${window.location.origin}/join?sessionId=${sessionId}`}
                                    readOnly
                                    className="input input-bordered w-full mb-4"
                                    onClick={(e) => e.target.select()}
                                />
                                <button className="btn btn-primary w-full mb-2" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/join?sessionId=${sessionId}`)}>Copy Link</button>
                                <button className="btn btn-secondary w-full" onClick={() => setShowInvitePopup(false)}>Close</button>
                            </div>
                        </div>
                    )}

                    {/* Start Game Button */}
                    {(tempUser && !showAddGuestForm && !showInvitePopup) && (
                        <button className="btn btn-success w-1/3 mb-10" onClick={handleStartGame}>Start Game</button>
                    )}
                </div>
                }
            </div>
        </ProtectedRoute >
    );
};

const GuestForm = ({ onAddGuest }) => {
    const [name, setName] = useState('');
    const [interests, setInterests] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddGuest(name, interests);
    };

    return (<>


        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value.split(','))}
            />
            <button type="submit">Add Guest</button>
        </form>
    </>
    );
};

export default GameLobby;