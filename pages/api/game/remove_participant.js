// app/api/game/remove_participant.js
import { connectToDatabase } from '../../../lib/mongodb';
import pusher from '../../../lib/pusher';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sessionId, participant } = req.body;
  console.log(sessionId, participant);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('game_sessions');

    // Update the game session
    const updatedSession = await collection.findOneAndUpdate(
      { sessionId },
      { $pull: { participants: { userId: participant.userId } } },
      { returnDocument: 'after' }
    );

    if (!updatedSession) {
      return res.status(404).json({ success: false, message: 'Game session record not found' });
    }

    // await pusher.trigger(`game-session-${sessionId}`, 'participant-left', { participant });
    console.log("Triggering participant-left event with:", participant);
    const triggerResponse = await pusher.trigger(`game-session-${sessionId}`, 'participant-left', { participant });
    console.log("Trigger response:", triggerResponse);


    console.log("Updated session after remove_participants method: ", updatedSession);
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}