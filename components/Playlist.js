import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PlaylistCard from './PlaylistCard';
import styles from '../styles/Playlist.module.css';

const Playlists = () => {
    const { userId } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // Fetch playlists when userId changes and is not null
    useEffect(() => {
        if (userId) {
            fetchPlaylists(userId);
        } else {
            setPlaylists([]); // Clear playlists if there is no user
        }
    }, [userId]);

    const fetchPlaylists = async (uid) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/playlist/${uid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch playlists');
            }
            const data = await response.json();
            setPlaylists(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (playlistId, newTitle, newDescription) => {
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
            setPlaylists(playlists.map(playlist => {
                if (playlist.id === playlistId) {
                    return { ...playlist, title: newTitle, description: newDescription };
                }
                return playlist;
            }));
            setEditingId(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (playlistId) => {
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
                setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const startEditing = (id) => {
        setEditingId(id);
    };

    const cancelEditing = () => {
        setEditingId(null); // Exit editing mode by resetting editingId
    };

    return (
        <div className={styles.playlistContainer}>
            <h1 style={{ fontSize: "24px", marginBottom: "20px"}}>Your Playlist</h1>
            {userId ? (
                isLoading ? (
                    <p>Loading playlists...</p>
                ) : error ? (
                    <p>Error fetching playlists: {error}</p>
                ) : playlists.length > 0 ? (
                    <ul>
                        {playlists.map(playlist => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                onSave={handleSave}
                                onDelete={handleDelete}
                                onStartEdit={() => startEditing(playlist.id)}
                                onCancelEdit={cancelEditing} // Pass cancelEditing function
                                isEditing={editingId === playlist.id}
                                styles={styles}
                            />
                        ))}
                    </ul>
                ) : (
                    <p>No playlists found.</p>
                )
            ) : (
                <p>Please log in to see your playlists.</p>
            )}
        </div>
    );
};

export default Playlists;
