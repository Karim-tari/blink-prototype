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
    // Use the homepage from package.json to construct proper URLs for GitHub Pages
    const basePath = process.env.PUBLIC_URL || '';
    window.location.href = `${basePath}${path}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        {lottieData ? (
          <Lottie 
            animationData={lottieData}
            style={{ width: 80, height: 80 }}
            loop={false}
            autoplay={true}
          />
        ) : (
          <div style={{ width: 80, height: 80 }} />
        )}
      </div>

      {/* Content Container */}
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%'
      }}>
        
        {/* Flows Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Flows
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={() => handleNavigation('/new-user')}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#9ca3af';
                e.target.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              First time user experience
            </button>

            <button
              onClick={() => handleNavigation('/push-notifications')}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#9ca3af';
                e.target.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Push notification
            </button>

            <button
              onClick={() => handleNavigation('/returning-user')}
              style={{
                width: '100%',
                padding: '16px 20px',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#9ca3af';
                e.target.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Returning user
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: '#e5e7eb',
          marginBottom: '32px'
        }} />

        {/* Components Section */}
        <div>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Components
          </h2>
          
          <button
            onClick={() => handleNavigation('/product-test')}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            WebView Product Listing
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 'auto',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '11px',
        letterSpacing: '0.5px',
        paddingTop: '40px'
      }}>
        BLINK PROTOTYPE
      </div>
    </div>
  );
};

export default LandingPage;
