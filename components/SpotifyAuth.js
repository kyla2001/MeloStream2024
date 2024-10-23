// components/auth.js
let accessToken = '';
let refreshIntervalId = null;

// getSpotifyAccessToken
async function getSpotifyAccessToken(clientId, clientSecret) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
    return {
        accessToken: data.access_token,
        // expires_in is in seconds
        expiresIn: data.expires_in 
    };
}

// refreshSpotifyAccessToken
export async function refreshSpotifyAccessToken(clientId, clientSecret, updateTokenCallback) {
    
    // get initial access token
    const { accessToken, expiresIn } = await getSpotifyAccessToken(clientId, clientSecret);
    updateTokenCallback(accessToken);

    // refresh access token periodically
    if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
    }

    refreshIntervalId = setInterval(async () => {
        const tokenData = await getSpotifyAccessToken(clientId, clientSecret);
        updateTokenCallback(tokenData.accessToken);
        console.log('Updated Access Token:', tokenData.accessToken);
    }, (expiresIn - 300) * 1000); // refresh token 5 minutes before it expires
}

// return access token
export function getAccessToken() {
    return accessToken;
}
