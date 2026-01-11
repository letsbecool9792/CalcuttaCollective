# Calcutta Collective

A city-native platform to discover neighborhoods and create small, real-world hangouts.

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

✅ **Landing Page** - Browse areas of Kolkata  
✅ **Area Page** - Discover places and hangouts in each area  
✅ **Hangout Detail** - View hangout details, join, and share links  
✅ **Create Hangout** - Start a new gathering  
✅ **Mobile-First** - Fully responsive design  
✅ **No Login Required** - Zero friction to explore and join  

## User Flows

**Flow A: Discovery**
/ → /area/college-street → browse places & hangouts

**Flow B: Join via Link**
/hangout/h1 → Join → enter name → success

**Flow C: Create & Share**
/create → submit → /hangout/h4 → copy link

## Tech Stack

**Frontend:** React, TypeScript, React Router, Tailwind CSS  
**Backend:** Node.js, Express, In-Memory Store (no database needed)
