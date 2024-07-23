module.exports = async (req, res) => {
    const { event } = req.body;
  
    switch (event.name) {
      case 'participant-joined':
        // Handle participant joined logic
        console.log('Participant Joined:', event.data);
        break;
      case 'participant-left':
        // Handle participant joined logic
        console.log('Participant Left:', event.data);
        break;
      case 'next-card':
        // Handle next card logic
        console.log('Next Card:', event.data);
        break;
      case 'start-game':
        // Handle end game logic
        console.log('Start Game:', event.data);
        break;
      case 'end-game':
        // Handle end game logic
        console.log('End Game:', event.data);
        break;
      default:
        console.log('Unknown event:', event.name);
    }
  
    res.status(200).send('Event handled');
  };