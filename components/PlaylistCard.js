import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Playlist.module.css';

const PlaylistCard = ({ playlist, onSave, onDelete, onStartEdit, onCancelEdit, isEditing }) => {
    const [title, setTitle] = useState(playlist.title);
    const [description, setDescription] = useState(playlist.description);

    const handleCancel = () => {
        onCancelEdit();
        setTitle(playlist.title);
        setDescription(playlist.description);
    };

    return (
        <li className={styles.playlistItem}>
            {isEditing ? (
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        value={title}
                        className={styles.input}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        value={description}
                        className={styles.textarea}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className={styles.buttons}>
                        <button onClick={() => onSave(playlist.id, title, description)} className="button is-small is-primary">Save</button>
                        <button onClick={handleCancel} className="button is-small is-primary">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className={styles.details}>
                    <Link legacyBehavior href={`/playlist/${playlist.id}`}>
                        <a>
                            <h3 className={styles.title}>{playlist.title}</h3>
                            <p className={styles.description}>{playlist.description}</p>
                        </a>
                    </Link>
                    <div className={`${styles.buttons} ${styles.rightAligned}`}>
                        <button onClick={() => onStartEdit(playlist.id)} className="button is-small is-primary">Edit Playlist</button>
                        <button onClick={() => onDelete(playlist.id)} className="button is-small is-primary">Delete Playlist</button>
                    </div>
                </div>
            )}
        </li>
    );
};

export default PlaylistCard;
