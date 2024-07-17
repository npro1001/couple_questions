import {connectToDatabase} from '../../lib/mongodb';
import User from '../../models/User';
import jwt from 'jsonwebtoken';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // const client = await clientPromise;
      // const db = client.db('couple_questions');
      const { db } = await connectToDatabase();
      const collection = db.collection('users');

      console.log('Connecting to the database...');
      const user = await collection.findOne({ email });

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      
      if (user.password === password) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Sign-in successful")
        res.status(200).json({ message: 'Sign-in successful', token: token, user: user });
      } else {
        console.log("Invalid credentials")
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error connecting to the database:', error);
      res.status(500).json({ message: 'Error processing request', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}