// pages/api/pusher/trigger.js
import pusher from '../../../lib/pusher';

export default async function handler(req, res) {
  const { channel, event, data } = req.body;

  try {
    await pusher.trigger(channel, event, data);
    res.status(200).json({ message: 'Event triggered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to trigger event' });
  }
}