// components/SpotifyTracks.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { refreshSpotifyAccessToken } from "./SpotifyAuth";
import AudioPlayer from "./AudioPlayer";
import PlaylistModal from "./PlaylistModal";
import styles from "../styles/Home.module.css";
import TrackDescription from "./TrackDescription";

function SpotifyTracks() {
  const { userId } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(tracks.length / itemsPerPage);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    console.log("clientId, clientSecret: ", clientId, clientSecret);
    refreshSpotifyAccessToken(clientId, clientSecret, setAccessToken);
  }, []);

  useEffect(() => {
    if (accessToken) {
      const fetchPlaylistTracks = async () => {
        const playlistId = process.env.NEXT_PUBLIC_PLAYLIST_ID;
        const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        try {
          const response = await fetch(url, options);
          const data = await response.json();
          const tracksList = data.items.map((item) => item.track);
          setTracks(shuffleArray(tracksList));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching Spotify playlist:", error);
          setLoading(false);
        }
      };

      fetchPlaylistTracks();
    }
  }, [accessToken]);

  useEffect(() => {
    if (userId) {
      const fetchUserPlaylists = async () => {
        const response = await fetch(`/api/playlist/${userId}`);
        if (!response.ok) {
          console.error("Failed to fetch playlists");
          return;
        }
        const data = await response.json();
        setPlaylists(data);
      };

      fetchUserPlaylists();
    }
  }, [userId]);

  const addTrackToPlaylist = async (playlistId, track) => {
    const response = await fetch(
      `/api/playlist/${userId}/${playlistId}/songs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackName: track.name,
          artistName: track.artists.map((artist) => artist.name).join(", "),
          albumName: track.album.name,
          albumArtUrl: track.album.images[0].url,
          previewUrl: track.preview_url,
          liked: false,
        }),
      },
    );

    if (response.ok) {
      alert("Track added to playlist!");
      setShowModal(false);
    } else {
      alert("Failed to add track to playlist.");
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const clickThumbnail = (previewUrl) => {
    setCurrentPreviewUrl((prev) => (prev === previewUrl ? "" : previewUrl));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const paginate = (array, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  };

  return (
    <div>
      <div className="container" style={{ display: "flex" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <button
              className="button is-small is-link is-light is-left"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ visibility: currentPage === 1 ? 'hidden' : 'visible', height: "80px", marginRight: "50px", marginTop: "300px" }}
            >
              {"<"}
            </button>
            <div className="ul-container">
              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "15px",
                  listStyle: "none",
                  padding: "0",
                }}
              >
                {paginate(tracks, currentPage).map((track, index) => (
                  <li
                    key={track.id}
                    className="box"
                    style={{
                      marginBottom: index === paginate(tracks, currentPage).length - 1 ? "0" : "0",
                    }}
                  >
                    <div className="columns is-centered">
                      <div className="column is-full">
                        {track.album.images[0] && (
                          <div style={{ position: 'relative', width: 'auto', height: 'auto', cursor: 'pointer' }} onClick={() => clickThumbnail(track.preview_url)}>
                            <img
                              src={track.album.images[0].url}
                              alt={track.album.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #ccc' }}
                            />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: '#fff', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '24px' }}>{currentPreviewUrl === track.preview_url ? '❚❚' : '▶'}</div>
                          </div>
                        )}
                        <div className="columns">
                          <div className="column is-half">
                            <TrackDescription
                              name={track.name}
                              album={track.album.name}
                              artists={track.artists.map((artist) => artist.name)}
                            />
                          </div>
                          <div className="column is-flex is-flex-direction-column is-align-items-flex-end">
                            <button
                              className="button is-small is-primary is-left buttonAddToPlaylist"
                              style={{
                                marginTop: "12px",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                              onClick={() => {
                                if (!userId) {
                                  alert("Please log in to add tracks to the playlist.");
                                } else {
                                  setSelectedTrack(track);
                                  setShowModal(true);
                                }
                              }}
                            >
                              Add to Playlist
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="button is-small is-link is-light is-right"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ visibility: currentPage === totalPages ? 'hidden' : 'visible', height: "80px", marginLeft: "50px", marginTop: "300px" }}
            >
              {">"}
            </button>
          </>
        )}
      </div>
      {currentPreviewUrl && (
        <div className={styles.floatingAudioPlayer}>
          <AudioPlayer key={currentPreviewUrl} src={currentPreviewUrl} />
        </div>
      )}

      {showModal && (
        <PlaylistModal
          playlists={playlists}
          onSubmit={addTrackToPlaylist}
          onClose={() => setShowModal(false)}
          track={selectedTrack}
        />
      )}
    </div>
  );
}

export default SpotifyTracks;
