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

// ============================================
// IN-MEMORY DATA STORES
// ============================================

// Users
let users = [
  {
    id: 'u1',
    email: 'demo@calcuttacollective.com',
    password: 'demo123', // In production, this would be hashed
    name: 'Demo User',
    bio: 'Love exploring hidden gems in Kolkata!',
    photoUrl: null,
    pastHangoutsCount: 3,
    createdAt: Date.now() - 86400000 * 30
  }
];

// Areas
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

// Places
let places = [
  { id: 'p1', areaId: 'college-street', name: 'Indian Coffee House', type: 'Café', description: 'Iconic spiral café with decades of history', lowCost: true },
  { id: 'p2', areaId: 'college-street', name: 'College Square', type: 'Park', description: 'Historic park surrounded by bookstores', lowCost: true },
  { id: 'p3', areaId: 'college-street', name: 'Presidency University', type: 'Heritage', description: 'Colonial architecture and student energy', lowCost: true },
  { id: 'p4', areaId: 'park-street', name: 'Flurys', type: 'Bakery', description: 'Legendary Swiss bakery since 1927', lowCost: false },
  { id: 'p5', areaId: 'park-street', name: 'Mocambo', type: 'Restaurant', description: 'Classic Continental dining experience', lowCost: false },
  { id: 'p6', areaId: 'prinsep-ghat', name: 'James Prinsep Ghat', type: 'Landmark', description: 'Gothic memorial by the river', lowCost: true },
  { id: 'p7', areaId: 'prinsep-ghat', name: 'Millennium Park', type: 'Park', description: 'Sprawling green space along the Hooghly', lowCost: true },
  { id: 'p8', areaId: 'new-market', name: 'New Market Building', type: 'Shopping', description: 'Victorian-era covered market', lowCost: true },
  { id: 'p9', areaId: 'new-market', name: 'Nahoum\'s Bakery', type: 'Bakery', description: 'Historic Jewish bakery with legendary fruitcakes', lowCost: true },
  { id: 'p10', areaId: 'college-street', name: 'Paramount Sherbets', type: 'Street Food', description: 'Iconic cold drinks since 1918', lowCost: true }
];

// Hangouts (seeded with sample data)
let hangouts = [
  {
    id: 'h1',
    title: 'Sunday Coffee & Books',
    description: 'Start the day at Indian Coffee House, then explore the bookstores together. Perfect for book lovers and chai enthusiasts.',
    date: '2026-02-08',
    time: '10:00',
    location: 'Indian Coffee House, College Street',
    latitude: 22.5729,
    longitude: 88.3605,
    maxParticipants: 6,
    participants: [
      { userId: 'u1', name: 'Demo User', joinedAt: Date.now() - 86400000, status: 'approved' }
    ],
    createdBy: 'Demo User',
    createdById: 'u1',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'h2',
    title: 'Sunset at Prinsep Ghat',
    description: 'Golden hour walk along the river, watch the sunset, grab some street chai. Bring your camera!',
    date: '2026-02-07',
    time: '17:00',
    location: 'Prinsep Ghat',
    latitude: 22.5564,
    longitude: 88.3249,
    maxParticipants: 8,
    participants: [
      { userId: 'u1', name: 'Demo User', joinedAt: Date.now() - 172800000, status: 'approved' }
    ],
    createdBy: 'Demo User',
    createdById: 'u1',
    createdAt: Date.now() - 172800000
  },
  {
    id: 'h3',
    title: 'New Market Food Trail',
    description: 'Hunt for the best kathi rolls, visit Nahoum\'s Bakery, and explore the vintage market lanes.',
    date: '2026-02-15',
    time: '12:00',
    location: 'New Market',
    latitude: 22.5626,
    longitude: 88.3510,
    maxParticipants: 5,
    participants: [],
    createdBy: 'Community',
    createdById: null,
    createdAt: Date.now() - 43200000
  }
];

// Join Requests
let joinRequests = [];

// Messages (chat)
let messages = [];

// Reflections
let reflections = [];

// ============================================
// AUTH ROUTES
// ============================================

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const newUser = {
    id: 'u' + Date.now(),
    email,
    password, // In production, hash this!
    name,
    bio: '',
    photoUrl: null,
    pastHangoutsCount: 0,
    createdAt: Date.now()
  };
  
  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// ============================================
// USER ROUTES
// ============================================

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.patch('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const { name, bio, photoUrl } = req.body;
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (photoUrl !== undefined) user.photoUrl = photoUrl;
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.get('/api/users/:id/hangouts', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  // Find hangouts where user is participant or creator
  const userHangouts = hangouts.filter(h => 
    h.createdById === userId || 
    h.participants.some(p => p.userId === userId)
  ).map(h => {
    const userReflection = reflections.find(r => r.hangoutId === h.id && r.userId === userId);
    return {
      id: h.id,
      title: h.title,
      date: h.date,
      location: h.location,
      reflected: !!userReflection
    };
  });
  
  res.json(userHangouts);
});

// ============================================
// AREA ROUTES
// ============================================

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

// ============================================
// HANGOUT ROUTES
// ============================================

app.get('/api/hangouts', (req, res) => {
  res.json(hangouts);
});

app.get('/api/hangouts/:id', (req, res) => {
  const hangout = hangouts.find(h => h.id === req.params.id);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  // Include reflections
  const hangoutReflections = reflections.filter(r => r.hangoutId === req.params.id);
  
  res.json({ ...hangout, reflections: hangoutReflections });
});

app.post('/api/hangouts', (req, res) => {
  const { title, description, date, time, location, latitude, longitude, maxParticipants, createdBy, createdById } = req.body;
  
  if (!title || !createdBy) {
    return res.status(400).json({ error: 'Missing required fields: title, createdBy' });
  }
  
  const newHangout = {
    id: 'h' + Date.now(),
    title,
    description,
    date,
    time,
    location,
    latitude: latitude ? parseFloat(latitude) : undefined,
    longitude: longitude ? parseFloat(longitude) : undefined,
    maxParticipants: parseInt(maxParticipants) || 6,
    participants: [{ 
      userId: createdById || null,
      name: createdBy, 
      joinedAt: Date.now(),
      status: 'approved'
    }],
    createdBy,
    createdById: createdById || null,
    createdAt: Date.now()
  };
  
  hangouts.push(newHangout);
  res.status(201).json(newHangout);
});

// ============================================
// JOIN REQUEST ROUTES
// ============================================

app.get('/api/hangouts/:id/requests', (req, res) => {
  const hangoutId = req.params.id;
  const userId = req.query.userId;
  
  const hangout = hangouts.find(h => h.id === hangoutId);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  const isHost = hangout.createdById === userId;
  const isParticipant = hangout.participants.some(p => p.userId === userId && p.status === 'approved');
  const userRequest = joinRequests.find(r => r.hangoutId === hangoutId && r.userId === userId);
  
  const requests = isHost ? joinRequests.filter(r => r.hangoutId === hangoutId) : [];
  
  res.json({
    isHost,
    isParticipant,
    userRequest,
    requests
  });
});

app.post('/api/hangouts/:id/request', (req, res) => {
  const hangoutId = req.params.id;
  const { userId, userName, message } = req.body;
  
  const hangout = hangouts.find(h => h.id === hangoutId);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  // Check if already requested or participant
  const existingRequest = joinRequests.find(r => r.hangoutId === hangoutId && r.userId === userId);
  if (existingRequest) {
    return res.status(400).json({ error: 'Request already sent' });
  }
  
  const isParticipant = hangout.participants.some(p => p.userId === userId);
  if (isParticipant) {
    return res.status(400).json({ error: 'Already a participant' });
  }
  
  const newRequest = {
    id: 'req' + Date.now(),
    hangoutId,
    userId,
    userName,
    message: message || '',
    status: 'pending',
    createdAt: Date.now()
  };
  
  joinRequests.push(newRequest);
  res.status(201).json(newRequest);
});

app.post('/api/requests/:id/approve', (req, res) => {
  const request = joinRequests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  
  const hangout = hangouts.find(h => h.id === request.hangoutId);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  // Check capacity
  if (hangout.participants.length >= hangout.maxParticipants) {
    return res.status(400).json({ error: 'Hangout is full' });
  }
  
  // Update request status
  request.status = 'approved';
  
  // Add to participants
  hangout.participants.push({
    userId: request.userId,
    name: request.userName,
    joinedAt: Date.now(),
    status: 'approved'
  });
  
  // Update user's hangout count
  const user = users.find(u => u.id === request.userId);
  if (user) {
    user.pastHangoutsCount++;
  }
  
  res.json({ success: true, request, hangout });
});

app.post('/api/requests/:id/reject', (req, res) => {
  const request = joinRequests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  
  request.status = 'rejected';
  res.json({ success: true, request });
});

// ============================================
// CHAT ROUTES
// ============================================

app.get('/api/hangouts/:id/messages', (req, res) => {
  const hangoutId = req.params.id;
  const hangoutMessages = messages.filter(m => m.hangoutId === hangoutId);
  res.json(hangoutMessages);
});

app.post('/api/hangouts/:id/messages', (req, res) => {
  const hangoutId = req.params.id;
  const { senderId, senderName, text } = req.body;
  
  const hangout = hangouts.find(h => h.id === hangoutId);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  const newMessage = {
    id: 'msg' + Date.now(),
    hangoutId,
    senderId,
    senderName,
    text,
    timestamp: Date.now()
  };
  
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// ============================================
// REFLECTION ROUTES
// ============================================

app.post('/api/hangouts/:id/reflect', (req, res) => {
  const hangoutId = req.params.id;
  const { userId, rating, reflection, placesVisited, photoUrl } = req.body;
  
  const hangout = hangouts.find(h => h.id === hangoutId);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  const user = users.find(u => u.id === userId);
  
  const newReflection = {
    id: 'ref' + Date.now(),
    hangoutId,
    userId,
    userName: user?.name || 'Anonymous',
    rating,
    reflection: reflection || '',
    placesVisited: placesVisited || [],
    photoUrl: photoUrl || null,
    createdAt: Date.now()
  };
  
  reflections.push(newReflection);
  res.status(201).json(newReflection);
});

// ============================================
// LEGACY JOIN ROUTE (for backwards compatibility)
// ============================================

app.post('/api/hangouts/:id/join', (req, res) => {
  const hangout = hangouts.find(h => h.id === req.params.id);
  if (!hangout) return res.status(404).json({ error: 'Hangout not found' });
  
  if (hangout.participants.length >= hangout.maxParticipants) {
    return res.status(400).json({ error: 'Hangout is full' });
  }
  
  const { name, userId } = req.body;
  const alreadyJoined = hangout.participants.some(p => p.name === name || (userId && p.userId === userId));
  
  if (alreadyJoined) {
    return res.status(400).json({ error: 'You have already joined this hangout' });
  }
  
  hangout.participants.push({ 
    userId: userId || null,
    name, 
    joinedAt: Date.now(),
    status: 'approved'
  });
  res.json(hangout);
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// ============================================
// PLACES ENDPOINT
// ============================================

app.get('/api/places', (req, res) => {
  res.json(places);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
