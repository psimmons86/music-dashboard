# Music Dashboard
![music-dashboard screenshot](https://i.imgur.com/KPvvfDP.png)
![music-dashboard screenshot](https://i.imgur.com/GHWeGWx.png)

Full-stack web application for music discovery, playlist generation, and content sharing.

**[Live Demo](https://music-dashboard-aed58e43f3b3.herokuapp.com/)**

## Features
- Spotify API integration for playlist creation and management
- Dynamic music news feed with article saving
- Social posting with music sharing
- Full blog platform with rich text editor
- User authentication and profile management
- Admin dashboard for content moderation
- Responsive grid-based dashboard layout

## Tech Stack
### Frontend
- React Grid Layout - Draggable/resizable dashboard components
- TipTap - Customizable rich text editor
- Tailwind CSS - Utility-first CSS framework
- Lucide - Minimal icon library

### Backend
- Node.js/Express
- MongoDB/Mongoose
- JWT authentication
- Spotify Web API
- News API

### Key Libraries
- SpotifyWebApi-Node
- Axios
- bcrypt

## Setup
```bash
# Install dependencies
npm install

# Start backend
nodemon server.js

# Start frontend
npm start
```

## Environment Variables
```
MONGODB_URI=
JWT_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEWS_API_KEY=
```

## Deployment
The app is deployed on Heroku at [https://music-dashboard-aed58e43f3b3.herokuapp.com/](https://music-dashboard-aed58e43f3b3.herokuapp.com/)
