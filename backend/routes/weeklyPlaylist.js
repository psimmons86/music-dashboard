const express = require('express');
const router = express.Router();
const WeeklyPlaylist = require('../../models/weeklyPlaylist');

router.get('/current', async (req, res) => {
  try {
    const currentPlaylist = await WeeklyPlaylist.findOne({ active: true });
    res.json(currentPlaylist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update', requireAdmin, async (req, res) => {
  try {
    await WeeklyPlaylist.updateMany({}, { active: false });
    
    const newPlaylist = await WeeklyPlaylist.create({
      ...req.body,
      active: true,
      weekNumber: getCurrentWeekNumber(),
      year: new Date().getFullYear()
    });
    
    res.json(newPlaylist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});