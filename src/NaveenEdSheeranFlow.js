import React, { useState, useEffect } from 'react';

const NaveenEdSheeranFlow = ({ onComplete }) => {
  const [fadeState, setFadeState] = useState('black');
  const [wallpaperOpacity, setWallpaperOpacity] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [notificationPressed, setNotificationPressed] = useState(false);

  useEffect(() => {
    // iPhone "turning on" sequence
    setTimeout(() => {
      // First fade from black to dark background
      setFadeState('dark');
    }, 500);
    
    setTimeout(() => {
      // Then fade in the wallpaper like the screen is powering on
      setWallpaperOpacity(1);
    }, 1200);
    
    // Show notification after wallpaper fully appears
    setTimeout(() => setShowNotification(true), 2500);
  }, []);

  const handleNotificationTap = () => {
    setNotificationPressed(true);
    // Brief press feedback before opening
    setTimeout(() => {
      setIsOpening(true);
      // iOS-style app opening animation duration
      setTimeout(() => {
        onComplete();
      }, 650);
    }, 100);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      transform: isOpening 
        ? 'translateX(-100%) scale(0.95)' 
        : 'translateX(0) scale(1)',
      transition: isOpening 
        ? 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)' 
        : 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
      transformOrigin: 'center center'
    }}>
      {/* iPhone screen with realistic power-on effect */}
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: fadeState === 'black' ? '#000' : '#0a0a0a',
        transition: 'background-color 0.8s ease-out',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '280px',
        position: 'relative'
      }}>
        {/* Wallpaper layer that fades in */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${process.env.PUBLIC_URL}/iphone-home-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: wallpaperOpacity,
          transition: 'opacity 1.5s ease-in-out'
        }} />
        {/* Naveen Ed Sheeran Push Notification */}
        {showNotification && (
          <img 
            src={`${process.env.PUBLIC_URL}/Naveen-Edsheeran/naveen-notifications-edsheeran.png`}
            onClick={handleNotificationTap}
            alt="Naveen Ed Sheeran Notification"
            style={{
              width: '175%',
              maxWidth: '730px',
              height: 'auto',
              cursor: 'pointer',
              animation: 'slideDownAndScale 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
              boxShadow: notificationPressed 
                ? '0 5px 15px rgba(0,0,0,0.4)' 
                : '0 10px 30px rgba(0,0,0,0.3)',
              transform: notificationPressed ? 'scale(0.48)' : 'scale(0.5)',
              transition: 'all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)',
              position: 'relative',
              zIndex: 10,
              borderRadius: '16px'
            }}
          />
        )}
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideDownAndScale {
          0% {
            transform: translateY(0) scale(0.1);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(0.5);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NaveenEdSheeranFlow;
