// pages/api/auth.js

export default async function handler(req, res) {
    const { code } = req.query;

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    try {
        const spotifyResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        const data = await spotifyResponse.json();
        // Handle response data, perhaps by setting session cookies or similar
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
}
