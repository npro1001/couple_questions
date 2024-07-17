// /pages/api/game-session.js

import { v4 as uuidv4 } from 'uuid';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('couple_questions');
  const collection = db.collection('game_sessions');

  if (req.method === 'POST') {
    const sessionId = uuidv4();
    const { hostId } = req.body;
    const session = {
      sessionId,
      hostId,
      guests: [],
      createdAt: new Date(),
    };
    await collection.insertOne(session);
    res.status(201).json({ sessionId });
  } else if (req.method === 'GET') {
    const { sessionId } = req.query;
    const session = await collection.findOne({ sessionId });
    res.status(200).json(session);
  }
}