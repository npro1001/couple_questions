import clientPromise from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, firstName, lastName, questionCredits, questionSkipCredits, interests } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('your-database-name');
      const collection = db.collection('users');

      const user = new User(email, password, firstName, lastName, questionCredits, questionSkipCredits, interests);
      const result = await collection.insertOne(user.toJSON());

      res.status(201).json({ message: 'User created', userId: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}