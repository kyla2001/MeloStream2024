# MeloStream2024

Welcome to the repository of MeloStream, a Next.js-based music streaming app designed to offer a personalized music experience. Here, users can create, manage, and share playlists, explore new music, and engage with a community of music lovers.

## Project Setup
### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (>= 12.x)
- npm

### Cloning the Repository

To get started with the project, clone the repository to your local machine:

```bash
git clone git@github.com:kyla2001/MeloStream2024.git
cd MeloStream2024
```

### Installing Dependencies

Install the necessary dependencies by running:

```bash
cd melostream
npm install
```

### Environment Setup

To configure your local development environment:

1. **Create a `.env.local` file** at the root of your project directory.

2. **Add the following environment variables** to the file:

```plaintext
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=
NEXT_PUBLIC_PLAYLIST_ID=
```

These variables are essential for the application's interaction with the Spotify API:

- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` and `NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET` are used to authenticate API requests.
- `NEXT_PUBLIC_PLAYLIST_ID` specifies the Spotify playlist ID from which the app retrieves songs.


3. **Customizing the Playlist:**
   - To use a different Spotify playlist, change the value of `NEXT_PUBLIC_PLAYLIST_ID` to your desired playlist's ID. You can find more information about managing playlists in the [Spotify Playlists API Documentation](https://developer.spotify.com/documentation/web-api/concepts/playlists).

4. **Obtaining Spotify API Credentials:**
   - If you need to create your own Spotify client ID and secret for a new application, register your app and obtain credentials at the [Spotify Developer Dashboard](https://developer.spotify.com/documentation/web-api/concepts/apps).

## Running the Project

To run the project locally, execute the following command:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the app.

## Technology Stack

- **Frontend**: Next.js, React
- **Styling**: CSS Modules
- **Backend**: Next.js API routes
- **Authentication**: NextAuth.js
- **Database**: Firestore
- **Deployment**: Vercel (https://melostream.vercel.app/)

## Features

- User authentication with Google
- Playlist creation and management
- Social features like comments
- Responsive audio player integration

## Contact

For support or queries, reach out to us at [xw672@cornell.edu](mailto:xw672@cornell.edu) or [yl3692@cornell.edu](mailto:yl3692@cornell.edu).