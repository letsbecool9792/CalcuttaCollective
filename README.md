# Calcutta Collective

A city-native platform to discover neighborhoods, create small real-world hangouts, and build community through shared experiences.

## Quick Start

### Backend (Terminal 1)
```bash
cd backend
npm start
```
Server runs on `http://localhost:3001`

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

## Features

### Core
✅ **Landing Page** - Hero, featured hangouts, vibe shortcuts  
✅ **Area Explorer** - Discover places and hangouts by neighborhood  
✅ **Interactive Maps** - Leaflet + OpenStreetMap integration  
✅ **Mobile-First** - Fully responsive design  

### Authentication
✅ **Sign Up / Login** - Email & password auth  
✅ **Profile Page** - View & edit profile, see past hangouts  
✅ **Persistent Sessions** - localStorage-based auth  

### Hangouts
✅ **Create Hangout** - Location picker with map, date/time selection  
✅ **Join Request Flow** - Request to join, host approves/rejects  
✅ **Hangout Detail** - View participants, status, location on map  
✅ **Share Links** - Copy link to share hangout  

### Social
✅ **Pre-Hangout Chat** - Group messaging for approved participants  
✅ **Post-Hangout Reflections** - Rate, write about, and share your experience  
✅ **Vibe-Based Discovery** - Explore by mood (Social, Quiet, Budget, Adventure, Foodie)  

### Demo Data (Hard-coded)
✅ **Featured Hangouts** - Curated hangouts on landing page  
✅ **Suggested Places** - Low-cost spots, iconic locations  
✅ **Vibe Recommendations** - Area and place suggestions per vibe  

## User Flows

**Flow A: Discovery**
```
/ → /explore → select vibe → view recommendations → /create
```

**Flow B: Join a Hangout**
```
/hangout/:id → Request to Join → Host Approves → Access Chat
```

**Flow C: Create & Host**
```
/create → pick location on map → submit → manage join requests
```

**Flow D: Post-Hangout**
```
/hangout/:id → (after date passes) → Reflect → rate & write reflection
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4 |
| Routing | React Router v6 |
| Maps | Leaflet, React-Leaflet, OpenStreetMap, Nominatim API |
| Backend | Node.js, Express.js |
| Data | In-memory store (no database) |
| Deployment | Vercel (frontend) + Render (backend) |

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile
- `GET /api/users/:id/hangouts` - Get user's hangouts

### Areas
- `GET /api/areas` - List all areas
- `GET /api/areas/:id` - Get area with places & hangouts

### Hangouts
- `GET /api/hangouts` - List all hangouts
- `GET /api/hangouts/:id` - Get hangout details
- `POST /api/hangouts` - Create hangout

### Join Requests
- `POST /api/hangouts/:id/request` - Request to join
- `GET /api/hangouts/:id/requests` - Get request status
- `POST /api/requests/:id/approve` - Approve request
- `POST /api/requests/:id/reject` - Reject request

### Chat
- `GET /api/hangouts/:id/messages` - Get messages
- `POST /api/hangouts/:id/messages` - Send message

### Reflections
- `POST /api/hangouts/:id/reflect` - Submit reflection

## Demo Credentials

```
Email: demo@calcuttacollective.com
Password: demo123
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Backend
```
PORT=3001
```

## Deployment

**Frontend (Vercel):**
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your Render backend URL

**Backend (Render):**
- Build command: `npm install`
- Start command: `node server.js`
- CORS configured for `*.vercel.app`
