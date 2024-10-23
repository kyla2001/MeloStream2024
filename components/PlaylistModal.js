import React from 'react';
import styles from '../styles/Home.module.css';
function PlaylistModal({ playlists, onSubmit, onClose, track }) {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className={`modal-card-title ${styles.modalCardTitle}`}>Add to Playlist</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="select is-fullwidth">
            <select id="playlist-select" className={styles.playlistSelect}>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.title}
                </option>
              ))}
            </select>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className={`button is-primary ${styles.buttonPrimary}`}
            onClick={() => onSubmit(document.getElementById('playlist-select').value, track)}
          >
            Add to Playlist
          </button>
          <button className={`button ${styles.buttonCancel}`} onClick={onClose}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}

export default PlaylistModal;