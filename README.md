# Music Dashboard

## Overview

Music Dashboard is a comprehensive web application designed for music enthusiasts, offering a unique blend of music discovery, playlist generation, and social interaction. Built with modern web technologies, the app provides users with personalized music experiences, news updates, and social sharing capabilities.

## Features

### 🎵 Spotify Integration
- Connect your Spotify account
- Generate personalized playlists
- View top artists and recent albums
- Discover music recommendations based on genre and mood

### 📰 Music News
- Curated news feed
- Filter news by music genres
- Save and bookmark interesting articles

### 🖋️ Blogging Platform
- Create and publish blog posts
- Draft and save blog entries
- Categorize posts by genre and type
- Rich text editor with image upload

### 👥 Social Features
- Create and share posts
- Add current song to your posts
- View community posts

### 🎨 User Profile
- Customize profile information
- Upload profile picture
- Add social media links
- Manage Spotify connection

## Technology Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Shadcn/UI components
- Recharts
- Tiptap Rich Text Editor

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

### External APIs
- Spotify Web API
- News API

## Prerequisites

- Node.js (v18+)
- MongoDB
- Spotify Developer Account
- News API Key

## Environment Variables

Create a `.env` file in the backend directory with:

```
MONGODB_URI=your_mongodb_connection_string
SECRET=your_jwt_secret
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback
NEWS_API_KEY=your_news_api_key
ADMIN_SECRET_CODE=optional_admin_registration_code
```