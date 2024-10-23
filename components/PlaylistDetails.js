// component/PlaylistDetails.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Head from 'next/head';
import SongCard from './SongCard';
import AudioPlayer from './AudioPlayer';
import styles from '../styles/PlaylistDetails.module.css';



function PlaylistDetails({ playlistId }) {
    const router = useRouter();
    const { userId } = useAuth();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [currentPreviewUrl, setCurrentPreviewUrl] = useState('');


    useEffect(() => {
        if (!userId) {
            setError('User must be logged in');
            setLoading(false);
            return;
        }

        const fetchPlaylistDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const playlistResponse = await fetch(`/api/playlist/${userId}`);
                const playlists = await playlistResponse.json();
                const playlistForUser = playlists.find(playlist => playlist.id === playlistId);

                if (playlistResponse.ok && playlistForUser) {
                    setPlaylist(playlistForUser);
                    setNewTitle(playlistForUser.title);
                    setNewDescription(playlistForUser.description);
                } else {
                    throw new Error('Failed to fetch playlist details');
                }

                // Fetch the songs in the playlist from another endpoint
                const songsResponse = await fetch(`/api/playlist/${userId}/${playlistId}/songs`);
                const songsData = await songsResponse.json();
                if (songsResponse.ok) {
                    setSongs(songsData);
                } else {
                    throw new Error('Failed to fetch songs');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylistDetails();
    }, [userId, playlistId]); // Dependencies on userId and playlistId

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/playlist/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId, newTitle, newDescription }),
            });
            if (!response.ok) {
                throw new Error('Failed to update playlist');
            }
            setIsEditing(false);
            setPlaylist(prevPlaylist => ({
                ...prevPlaylist,
                title: newTitle,
                description: newDescription
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewTitle(playlist.title);
        setNewDescription(playlist.description);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this playlist?')) {
            try {
                const response = await fetch(`/api/playlist/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ playlistId }),
                });
                if (!response.ok) {
                    throw new Error('Failed to delete playlist');
                }
                router.push('/playlist/'); // Redirect to /playlist/ after successful deletion
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAddSongs = () => {
        router.push('/');
    };

    const handleDeleteSong = async (songId) => {
        if (!window.confirm('Are you sure you want to delete this song from the playlist?')) {
            return;
        }

        try {
            const response = await fetch(`/api/playlist/${userId}/${playlistId}/songs`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete song');
            }
            // Update the songs state by filtering out the deleted song
            setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
            alert('Song deleted successfully!');
        } catch (err) {
            setError(err.message);
        }
    };


    const clickThumbnail = (previewUrl) => {
        setCurrentPreviewUrl(prev => (prev === previewUrl ? '' : previewUrl));
    };
    return (
        <div className={styles.container}>
            <Head>
                <title>MeloStream</title>
                <meta name="description" content="A simple music streaming app" />
                <link rel="icon" href='/assets/favicon.ico' />

                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
                ></link>
            </Head>

            <main className={styles.main}>
                <div className={styles.playlistContainer}>
                    {playlist ? (
                        <>
                            {isEditing ? (
                                <div className={styles.playlistDetails}>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className={styles.editInput}
                                    />
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className={styles.editTextarea}
                                    />
                                    <div className={styles.playlistActions}>
                                        <button className="button is-small is-primary" onClick={handleSave} >Save</button>
                                        <button className="button is-small is-primary" onClick={handleCancel} >Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.playlistDetails}>
                                    <h1 className={styles.playlistHeader}>{playlist.title}</h1>
                                    <p>{playlist.description}</p>
                                    <div className={styles.playlistActions}>
                                        <button onClick={handleAddSongs} className="button is-small is-primary">Add songs to playlist</button>
                                        <button onClick={() => setIsEditing(true)} className="button is-small is-primary">Edit</button>
                                        <button onClick={handleDelete} className="button is-small is-primary">Delete</button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Playlist details not available.</p>
                    )}
                    {songs.length > 0 ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <ul className={styles.songGrid}>
                                {songs.map((song) => (
                                    <SongCard
                                        userId={userId}
                                        playlistId={playlistId}
                                        key={song.id}
                                        song={song}
                                        onClickThumbnail={clickThumbnail}
                                        onDeleteSong={handleDeleteSong}
                                        currentPreviewUrl={currentPreviewUrl}
                                    />
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No songs found in this playlist.</p>
                    )}

                    {currentPreviewUrl && (
                        <div className={styles.floatingAudioPlayer}>
                            <AudioPlayer key={currentPreviewUrl} src={currentPreviewUrl} />
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default PlaylistDetails;