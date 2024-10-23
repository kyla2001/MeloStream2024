import React from 'react';
import styles from '../styles/PlaylistDetails.module.css';
import LikeButton from './LikeButton';

const SongCard = ({ userId, playlistId, song, onClickThumbnail, onDeleteSong, currentPreviewUrl }) => {
    return (
        <li className={styles.songCard}>
            <div onClick={() => onClickThumbnail(song.previewUrl)} style={{ position: 'relative', width: '100px', height: '100px', cursor: 'pointer' }}>
                <img src={song.albumArtUrl} alt={song.trackName} style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #ccc' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: '#fff', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '24px' }}>
                    {currentPreviewUrl === song.previewUrl ? '❚❚' : '▶'}
                </div>
            </div>

            <div className={styles.songInfo}>
                <strong style={{ justifySelf: "start", width: "500px" }}>{song.trackName}</strong>
                <p style={{ justifySelf: "start", width: "100px" }}>{song.artistName}</p>
                <div style={{ justifySelf: "start", width: "200px", display: "flex"}}>
                    <LikeButton style={{ marginRight: "10px"}} userId={userId} playlistId={playlistId} songId={song.id} initialLiked={song.liked} song={song} />
                    <button className="button is-light is-primary is-small" onClick={() => onDeleteSong(song.id)}>Remove from Playlist</button></div>
            </div>
        </li>
    );
};

export default SongCard;
