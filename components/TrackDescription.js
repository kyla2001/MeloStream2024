// TrackDescription.js
import React from 'react';

const TrackDescription = ({ name, artists }) => {
  
  const nameStyle = {
    fontSize: '13px', 
    fontWeight: 'bold' 
  };

  const artistStyle = {
    fontSize: '13px',    
    fontWeight: 'normal' 
  };

  return (
    <div>
      <h2 style={nameStyle}>{name}</h2>
      <p style={artistStyle}>{artists.join(', ')}</p>
    </div>
  );
};

export default TrackDescription;
