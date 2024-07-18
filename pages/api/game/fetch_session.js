import { connectToDatabase } from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

  try {
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
      }
  

    const { db } = await connectToDatabase();
    const gameSession = await db.collection('game_sessions').findOne({ sessionId: sessionId });
    if (!gameSession) {
      console.log("Game session not found in /game/fetch_session");
      return res.status(404).json({ message: 'Game session not found' });
    }
    console.log("GAME SESSION GAME SESSION FOUND", gameSession)
    res.status(200).json(gameSession);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
