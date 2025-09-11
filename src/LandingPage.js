import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

const LandingPage = () => {
  const [lottieData, setLottieData] = useState(null);

  useEffect(() => {
    // Load Lottie animation data
    const lottieUrl = `${process.env.PUBLIC_URL}/lottie/data.json`;
    fetch(lottieUrl)
      .then(response => response.json())
      .then(data => {
        setLottieData(data);
      })
      .catch(error => {
        console.error('Error loading Lottie animation:', error);
      });
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${process.env.PUBLIC_URL}/bg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      position: 'relative'
    }}>
      {/* Lottie Animation - Top Center */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '0px',
        marginTop: '-25px'
      }}>
        {lottieData ? (
          <Lottie 
            animationData={lottieData}
            style={{ width: 120, height: 120 }}
            loop={false}
            autoplay={true}
          />
        ) : (
          <div style={{ width: 120, height: 120 }} />
        )}
      </div>

      {/* Navigation Buttons - Vertically Centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: 'calc(100% - 40px)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        
        <button
          onClick={() => handleNavigation('/new-user')}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            color: '#1a1a1a',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          First time user experience
        </button>

        <button
          onClick={() => handleNavigation('/push-notifications')}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            color: '#1a1a1a',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          Push notification
        </button>

        <button
          onClick={() => handleNavigation('/returning-user')}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            color: '#1a1a1a',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          Returning user
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#999',
        fontSize: '11px',
        textAlign: 'center',
        letterSpacing: '0.5px'
      }}>
        BLINK PROTOTYPE
      </div>
    </div>
  );
};

export default LandingPage;
