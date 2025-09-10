import React from 'react';

const LoadingOverlay = ({ progress = 0 }) => {
  
  const overlayStyle = {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000
  };
  
  const containerStyle = {
    width: '400px',
    height: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
    margin: '20px'
  };
  
  const barStyle = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: '#FFD700',
    transition: 'width 0.3s ease'
  };
  
  return (
    <div style={overlayStyle}>
      <div style={{ color: 'white', fontSize: '24px', marginBottom: '20px' }}>Loading...</div>
      <div style={containerStyle}>
        <div style={barStyle}></div>
      </div>
      <div style={{ color: 'white', fontSize: '18px', marginTop: '10px' }}>{`${Math.round(progress)}%`}</div>
    </div>
  );
};

export default LoadingOverlay;