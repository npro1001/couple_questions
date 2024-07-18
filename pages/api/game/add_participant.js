// app/api/game/add_participant.js
import {connectToDatabase} from '../../../lib/mongodb';

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

    let update;

    if (participant.type === 'temp') {
      update = { $addToSet: { participants: participant } };
    } else if (participant.type === 'real') {
      update = { $addToSet: { participants: { userId: new ObjectId(participant.userId) } } };
    } else {
      return res.status(400).json({ success: false, message: 'Invalid participant type' });
    }

    // Update the game session
    const updatedSession = await collection.findOneAndUpdate(
      { sessionId },
      update,
      { returnDocument: 'after' }
    );

    if (!updatedSession) {
      return res.status(404).json({ success: false, message: 'Game session record not found' });
    }

    console.log("Updated session after add_participants method: ", updatedSession)
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}