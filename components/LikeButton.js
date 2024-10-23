import React, { useState } from 'react';

const LikeButton = ({ userId, playlistId, songId, initialLiked, song }) => {
  const [liked, setLiked] = useState(initialLiked);

  const toggleLike = async () => {
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    // Construct the API endpoint
    const apiUrl = `/api/playlist/${userId}/${playlistId}/songs`;
    console.log("APIURL: ", apiUrl);
    console.log("SONG", song);
    console.log("JSON: ", JSON.stringify({
      songId: songId,
      trackName: song.trackName,
      artistName: song.artistName,
      albumName: song.albumName,
      albumArtUrl: song.albumArtUrl,
      previewUrl: song.previewUrl,
      liked: newLikedStatus,
    }));

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            songId: songId,
            newTrackName: song.trackName,
            newArtistName: song.artistName,
            newAlbumName: song.albumName,
            newAlbumArtUrl: song.albumArtUrl,
            newPreviewUrl: song.previewUrl,
            newLiked: newLikedStatus,
        }),
    });    

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update like status');
      console.log('Like status updated successfully:', result);
    } catch (error) {
      console.error('Error updating like status:', error);
      // Optionally revert like status if update fails
      setLiked(!newLikedStatus);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`button is-medium ${liked ? 'is-danger' : 'is-light'}`}
      style={{
        marginTop: '2px',
        width: '50px',
        height: '30px',
        fontSize: '12px', 
        fontWeight: 'bold'
      }}
    >
      {liked ? 'Liked' : 'Like'}
    </button>
  );
};

export default LikeButton;
