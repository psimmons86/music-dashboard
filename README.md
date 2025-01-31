# Music Dashboard - A Spotify-Integrated Social Music Platform
![Dashboard Screenshot](https://imgur.com/a/TSoeRCu)

## Description
Music Dashboard is a comprehensive web application that combines social networking with music discovery. Users can connect their Spotify accounts to create custom playlists, share their music preferences, and stay updated with the latest music news. The platform features a clean, modern interface with drag-and-drop customizable widgets and real-time social interactions.

## Features
- Spotify Integration
  - Create personalized daily mix playlists
  - View listening statistics and favorites
  - Easy one-click playlist generation
- Social Features
  - Share posts with currently playing songs
  - Like and interact with other users' posts
  - Create and share music-related blog posts
- News & Content
  - Music news feed with genre filtering
  - Weekly curated playlists
  - Admin-managed blog content
- Customizable Dashboard
  - Drag-and-drop widget layout
  - Persistent layout saving
  - Responsive design for all screen sizes

## Technical Stack
### Frontend
- React
- Tailwind CSS
- React Grid Layout
- Spotify Web Playback SDK

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

### APIs
- Spotify Web API
- News API

## Getting Started
1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. Set up environment variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   SECRET=your_jwt_secret
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:5173/spotify/callback
   NEWS_API_KEY=your_news_api_key
   ```
4. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend
   cd frontend
   npm run dev
   ```

## Future Improvements
- Real-time chat functionality
- Music recommendation system
- Group playlist collaboration
- Advanced music statistics and analytics
- Genre-based community features
- Mobile app version

## Live Demo
[Visit Music Dashboard](https://music-dashboard-aed58e43f3b3.herokuapp.com/)

## Screenshots
![Social Feed](https://imgur.com/a/TSoeRCu)
![Music Player](https://imgur.com/a/TSoeRCu)
![Blog Interface](https://imgur.com/a/TSoeRCu)

## Contact & Support
For any questions or support needs, please reach out through the following channels:
- Email: [hadroncollides.@gmail.com]

