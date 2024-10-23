// components/AudioPlayer.js
import React from 'react';

const AudioPlayer = ({ src }) => {
  return <audio controls autoPlay src={src} />;
};

export default AudioPlayer;
