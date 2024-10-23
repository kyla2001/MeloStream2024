// components/CreatePlaylist.js
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/CreatePlaylist.module.css';


const CreatePlaylist = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { userId } = useAuth(); // Get the user ID from AuthContext

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userId) {
            alert("You must be logged in to create a playlist.");
            return;
        }

        const data = {
            title,
            description,
        };

        const authToken = await auth.currentUser.getIdToken(true);

        const response = await fetch(`/api/playlist/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Playlist created successfully!');
            setTitle('');
            setDescription('');
            // Refresh the page to reflect changes
            window.location.reload();
        } else {
            const errorData = await response.json();
            alert(`Failed to create playlist: ${errorData.error}`);
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        className={styles.inputText}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        className={styles.textarea}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="button is-small is-primary" style={{ padding: "20px 20px", marginTop: "25px"}}>Create Playlist</button>
            </form>
        </div>
    );
};

export default CreatePlaylist;
