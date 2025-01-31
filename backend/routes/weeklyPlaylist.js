const express = require('express');
const router = express.Router();
const WeeklyPlaylist = require('../models/weeklyPlaylist');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');
const checkToken = require('../middleware/checkToken');

// Get current active playlist - public route
router.get('/current', async (req, res) => {
  try {
    const currentPlaylist = await WeeklyPlaylist.findOne({ active: true })
      .sort('-createdAt');
    
    if (!currentPlaylist) {
      return res.status(404).json({ message: 'No active playlist found' });
    }
    
    res.json(currentPlaylist);
  } catch (err) {
    console.error('Error getting weekly playlist:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin routes
router.use(checkToken);
router.use(ensureLoggedIn);

// Update weekly playlist (admin only)
router.post('/update', async (req, res) => {
  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Unauthorized: Admin access required' 
    });
  }

  try {
    // Validate required fields
    const { spotifyPlaylistId, embedUrl, title } = req.body;
    if (!spotifyPlaylistId || !embedUrl || !title) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Deactivate all current playlists
    await WeeklyPlaylist.updateMany({}, { active: false });
    
    // Create new playlist
    const newPlaylist = await WeeklyPlaylist.create({
      spotifyPlaylistId,
      embedUrl,
      title,
      description: req.body.description || '',
      active: true,
      weekNumber: getCurrentWeekNumber(),
      year: new Date().getFullYear()
    });
    
    res.status(201).json(newPlaylist);
  } catch (err) {
    console.error('Error updating weekly playlist:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get week number helper function
function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
}

module.exports = router;