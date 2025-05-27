import express from 'express';
import { db } from '../index.js';
import haversine from '../utils/haversine.js';

const router = express.Router();

router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added', schoolId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/listSchools', async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');

    const schoolsWithDistance = schools.map((school) => {
      const distance = haversine(
        parseFloat(latitude),
        parseFloat(longitude),
        school.latitude,
        school.longitude
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    res.json(schoolsWithDistance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
