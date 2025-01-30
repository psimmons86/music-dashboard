import sendRequest from './sendRequest';

const BASE_URL = '/api/spotify';

export async function connectSpotify() {
  try {
    const response = await sendRequest(`${BASE_URL}/connect`);
    return response;
  } catch (error) {
    console.error('Error connecting to Spotify:', error);
    throw new Error('Failed to connect to Spotify');
  }
}

export async function getSpotifyStatus() {
  try {
    const response = await sendRequest(`${BASE_URL}/status`);
    return response;
  } catch (error) {
    console.error('Error checking Spotify status:', error);
    return { connected: false };
  }
}

export async function disconnectSpotify() {
  try {
    const response = await sendRequest(`${BASE_URL}/disconnect`, 'POST');
    return response;
  } catch (error) {
    console.error('Error disconnecting from Spotify:', error);
    throw new Error('Failed to disconnect from Spotify');
  }
}

export async function getTopArtists() {
  try {
    const response = await sendRequest(`${BASE_URL}/top-artists`);
    return response;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
}

export async function handleSpotifyCallback(code) {
  try {
    const response = await sendRequest(`${BASE_URL}/callback`, 'POST', { code });
    return response;
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    throw new Error('Failed to complete Spotify connection');
  }
}

export async function getRecommendations(genre, mood) {
  try {
    const moodFeatures = {
      happy: {
        min_valence: 0.6,
        target_valence: 0.8,
        target_energy: 0.8,
        min_danceability: 0.6,
        
        target_tempo: Math.floor(Math.random() * (160 - 120) + 120),
        target_popularity: Math.floor(Math.random() * (100 - 50) + 50) 
      },
      chill: {
        max_energy: 0.5,
        target_valence: 0.5,
        max_tempo: 120,
        target_acousticness: 0.6,
        
        target_instrumentalness: Math.random() * 0.5,
        target_popularity: Math.floor(Math.random() * (80 - 30) + 30)
      },
      energetic: {
        min_energy: 0.7,
        target_danceability: 0.7,
        min_tempo: 120,
        
        target_energy: 0.7 + (Math.random() * 0.3), // Random high energy
        target_popularity: Math.floor(Math.random() * (100 - 60) + 60)
      },
      sad: {
        max_valence: 0.4,
        target_energy: 0.4,
        target_acousticness: 0.6,
        
        target_tempo: Math.floor(Math.random() * (100 - 60) + 60), // Slower tempo
        target_popularity: Math.floor(Math.random() * (90 - 40) + 40)
      },
      focused: {
        target_energy: 0.5,
        max_danceability: 0.4,
        target_instrumentalness: 0.3,
        target_tempo: Math.floor(Math.random() * (130 - 90) + 90),
        target_popularity: Math.floor(Math.random() * (80 - 30) + 30)
      }
    };

    const relatedGenres = {
      rock: ['rock', 'hard-rock', 'alt-rock', 'indie-rock'],
      pop: ['pop', 'dance-pop', 'indie-pop', 'synth-pop'],
      'hip hop': ['hip-hop', 'rap', 'urban'],
      electronic: ['electronic', 'edm', 'dance', 'house'],
      jazz: ['jazz', 'bebop', 'swing'],
      classical: ['classical', 'orchestra', 'piano']
    };

    const seedGenres = relatedGenres[genre.toLowerCase()] || [genre.toLowerCase()];
    
    const selectedGenres = seedGenres
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, seedGenres.length))
      .join(',');
    
    const params = new URLSearchParams({
      seed_genres: selectedGenres,
      limit: 30,
      ...moodFeatures[mood.toLowerCase()]
    });
    
    const response = await sendRequest(`${BASE_URL}/recommendations?${params}`);
    if (!Array.isArray(response)) {
      throw new Error('Invalid recommendations response');
    }

    return response
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    if (error.status === 401) {
      throw new Error('Please reconnect your Spotify account');
    }
    throw new Error(error.message || 'Failed to get recommendations');
  }
}

export async function getRecentAlbums() {
  try {
    const response = await sendRequest(`${BASE_URL}/recent-albums`);
    if (!Array.isArray(response)) {
      throw new Error('Invalid albums response');
    }
    return response;
  } catch (error) {
    console.error('Error fetching recent albums:', error);
    if (error.status === 401) {
      throw new Error('Please reconnect your Spotify account');
    }
    throw new Error(error.message || 'Failed to get recent albums');
  }
}

export async function getUserPlaylists() {
  try {
    const response = await sendRequest(`${BASE_URL}/playlists`);
    if (!Array.isArray(response)) {
      throw new Error('Invalid playlists response');
    }
    return response;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    if (error.status === 401) {
      throw new Error('Please reconnect your Spotify account');
    }
    throw new Error(error.message || 'Failed to get playlists');
  }
}

