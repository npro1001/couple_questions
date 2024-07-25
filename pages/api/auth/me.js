import { connectToDatabase } from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log("Attempting to validate token")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(decoded.userId) });
    // console.log(user)

    if (!user) {
      console.log("User not found in /api/auth/me")
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log("User FOUND in /api/auth/me", user)
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
