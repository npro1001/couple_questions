import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { sessionId, host } = req.body;

  try {
    console.log('Connecting to the database...');

    // const client = await clientPromise;
    // const db = client.db('couple_questions')
    // const collection = db.collection('game_sessions');

    const { db } = await connectToDatabase();
    const collection = db.collection('game_sessions');

    // Create a new game session
    const userDetails = { userId: host._id, name: `${host.firstName} ${host.lastName}`, type: 'real', interests: host.interests };

    const session = {
      sessionId,
      hostId: host._id,
      participants: [userDetails],
      createdAt: new Date(),
      status: 'waiting', // waiting, active, finished
    };

    await collection.insertOne(session);

    res.status(200).json({ success: true, sessionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}