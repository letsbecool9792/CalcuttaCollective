const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'http://localhost:3000',
  /https:\/\/.*\.vercel\.app$/ // All Vercel deployments
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(allowed => 
      typeof allowed === 'string' ? origin === allowed : allowed.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// In-memory data store
let areas = [
  {
    id: 'college-street',
    name: 'College Street',
    description: 'The intellectual heart of Kolkata. Bookstores, chai stalls, and endless conversations.',
    vibe: ['Books', 'Heritage', 'Chai'],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
  },
  {
    id: 'park-street',
    name: 'Park Street',
    description: 'Where old Calcutta meets new energy. Cafés, restaurants, and nightlife.',
    vibe: ['Food', 'Nightlife', 'Colonial'],
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
  },
  {
    id: 'prinsep-ghat',
    name: 'Prinsep Ghat',
    description: 'Sunset by the Hooghly. Perfect for evening walks and street food.',
    vibe: ['River', 'Sunset', 'Photography'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
  },
  {
    id: 'new-market',
    name: 'New Market',
    description: 'A maze of stalls and stories. Get lost in the old-school shopping experience.',
    vibe: ['Shopping', 'Street Food', 'Vintage'],
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800'
  }
];

let places = [
  { id: 'p1', areaId: 'college-street', name: 'Indian Coffee House', type: 'Café', description: 'Iconic spiral café with decades of history' },
  { id: 'p2', areaId: 'college-street', name: 'College Square', type: 'Park', description: 'Historic park surrounded by bookstores' },
  { id: 'p3', areaId: 'college-street', name: 'Presidency University', type: 'Heritage', description: 'Colonial architecture and student energy' },
  { id: 'p4', areaId: 'park-street', name: 'Flurys', type: 'Bakery', description: 'Legendary Swiss bakery since 1927' },
  { id: 'p5', areaId: 'park-street', name: 'Mocambo', type: 'Restaurant', description: 'Classic Continental dining experience' },
  { id: 'p6', areaId: 'prinsep-ghat', name: 'James Prinsep Ghat', type: 'Landmark', description: 'Gothic memorial by the river' },
  { id: 'p7', areaId: 'prinsep-ghat', name: 'Millennium Park', type: 'Park', description: 'Sprawling green space along the Hooghly' },
  { id: 'p8', areaId: 'new-market', name: 'New Market Building', type: 'Shopping', description: 'Victorian-era covered market' }
];

let hangouts = [
  {
    id: 'h1',
    areaId: 'college-street',
    title: 'Morning Coffee & Books',
    description: 'Start the day at Indian Coffee House, then explore the bookstores together.',
    date: '2026-01-15',
    time: '09:00',
    location: 'Indian Coffee House',
    latitude: 22.5729,
    longitude: 88.3605,
    maxParticipants: 6,
    participants: [
      { name: 'Arjun K', joinedAt: Date.now() - 86400000 },
      { name: 'Priya M', joinedAt: Date.now() - 43200000 }
    ],
    createdBy: 'Arjun K',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'h2',
    areaId: 'prinsep-ghat',
    title: 'Sunset Walk & Chai',
    description: 'Evening walk along the river, watch the sunset, and grab some street chai.',
    date: '2026-01-14',
    time: '17:30',
    location: 'Prinsep Ghat',
    latitude: 22.5564,
    longitude: 88.3249,
    maxParticipants: 8,
    participants: [
      { name: 'Rahul D', joinedAt: Date.now() - 172800000 },
      { name: 'Sneha R', joinedAt: Date.now() - 129600000 },
      { name: 'Vikram S', joinedAt: Date.now() - 86400000 }
    ],
    createdBy: 'Rahul D',
    createdAt: Date.now() - 172800000
  },
  {
    id: 'h3',
    areaId: 'park-street',
    title: 'Sunday Brunch Meetup',
    description: 'Let\'s try the classic breakfast at Flurys and walk around Park Street.',
    date: '2026-01-19',
    time: '11:00',
    location: 'Flurys',
    latitude: 22.5533,
    longitude: 88.3526,
    maxParticipants: 5,
    participants: [
      { name: 'Ananya B', joinedAt: Date.now() - 43200000 }
    ],
    createdBy: 'Ananya B',
    createdAt: Date.now() - 43200000
  }
];

// API Routes
app.get('/api/areas', (req, res) => {
  res.json(areas);
});

app.get('/api/areas/:id', (req, res) => {
  const area = areas.find(a => a.id === req.params.id);
  if (!area) return res.status(404).json({ error: 'Area not found' });
  
  const areaPlaces = places.filter(p => p.areaId === req.params.id);
  const areaHangouts = hangouts.filter(h => h.areaId === req.params.id);
  
  res.json({ ...area, places: areaPlaces, hangouts: areaHangouts });
});

app.get('/api/hangouts', (req, res) => {
  res.json(hangouts);
});

app.get('/api/hangouts/:id', (req, res) => {
  const hangout = hangouts.find(h => h.id === req.params.id);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  res.json(hangout);
});

app.post('/api/hangouts', (req, res) => {
  const { areaId, title, description, date, time, location, latitude, longitude, maxParticipants, createdBy } = req.body;
  
  const newHangout = {
    id: 'h' + (hangouts.length + 1),
    areaId,
    title,
    description,
    date,
    time,
    location,
    latitude: latitude ? parseFloat(latitude) : undefined,
    longitude: longitude ? parseFloat(longitude) : undefined,
    maxParticipants: parseInt(maxParticipants),
    participants: [{ name: createdBy, joinedAt: Date.now() }],
    createdBy,
    createdAt: Date.now()
  };
  
  hangouts.push(newHangout);
  res.status(201).json(newHangout);
});

app.post('/api/hangouts/:id/join', (req, res) => {
  const hangout = hangouts.find(h => h.id === req.params.id);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  if (hangout.participants.length >= hangout.maxParticipants) {
    return res.status(400).json({ error: 'Hangout is full' });
  }
  
  const { name } = req.body;
  const alreadyJoined = hangout.participants.some(p => p.name === name);
  
  if (alreadyJoined) {
    return res.status(400).json({ error: 'You have already joined this hangout' });
  }
  
  hangout.participants.push({ name, joinedAt: Date.now() });
  res.json(hangout);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
