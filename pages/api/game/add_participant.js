// app/api/game/add_participant.js
import {connectToDatabase} from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sessionId, participantId } = req.body;
  console.log(sessionId, participantId);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('game_sessions');

    // Update the game session
    const updatedSession = await collection.findOneAndUpdate(
      { sessionId },
      { $addToSet: { participants: participantId } },
      { returnDocument: 'after' }
    );

    if (!updatedSession.sessionId) {
      return res.status(404).json({ success: false, message: 'Game session record not found' });
    }

    console.log("Updated session after add_participants method: ", updatedSession)
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}