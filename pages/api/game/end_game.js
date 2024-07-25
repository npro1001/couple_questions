// app/api/game/remove_participant.js
import { connectToDatabase } from '../../../lib/mongodb';
import pusher from '../../../lib/pusher';
import { removeParticipant } from './remove_participant'

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { sessionId, userId } = req.body;
    console.log(sessionId, userId);

    try {
        const { db } = await connectToDatabase();
        const collection = db.collection('game_sessions');

        // Find the game session by sessionId
        const gameSession = await collection.findOne({ sessionId });

        if (!gameSession) {
            return res.status(404).json({ success: false, message: 'Game session not found' });
        }

        // Check if the userId matches the hostId
        if (gameSession.hostId !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized action' });
        }

        // Remove all participants
        const participants = gameSession.participants || [];
        for (const participant of participants) {

            // Dont remove host
            if (participant.userId !== userId)
                console.log("Removing participant: ", participant)
                const res = await fetch(`/api/game/remove_participant`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: gameSession.sessionId, participant: participant }),
                });
            
                if (res.ok) {
                    console.log("Ok")
                } else {
                    console.error('Error removing participant:', await res.json());
                }
        }

        // Remove the game session from the database
        const deleteResult = await collection.deleteOne({ sessionId });

        if (deleteResult.deletedCount === 0) {
            return res.status(500).json({ success: false, message: 'Failed to delete game session' });
        }

        // // Trigger the game session removed event
        // const triggerResponse = await pusher.trigger(`game-session-${sessionId}`, 'game-session-removed', { sessionId });
        // console.log("Trigger response:", triggerResponse);

        // // Trigger event to notify the client to close the Pusher connection
        // await pusher.trigger(`private-user-${userId}`, 'close-connection', { sessionId });
        // console.log(`Pusher close-connection event triggered for user: ${userId}`);

        console.log("Game session removed: ", gameSession);
        res.status(200).json({ success: true, message: 'Game session removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}