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
      padding: '32px 20px 20px 20px',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>

      {/* Content Container */}
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%'
      }}>
        
        {/* Flows Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M5.5 2V0H7V2H5.5ZM0.96967 2.03033L2.46967 3.53033L3.53033 2.46967L2.03033 0.96967L0.96967 2.03033ZM4.24592 4.24592L4.79515 5.75631L7.79516 14.0063L8.46663 15.8529L9.19636 14.0285L10.2739 11.3346L13.4697 14.5303L14.5303 13.4697L11.3346 10.2739L14.0285 9.19636L15.8529 8.46663L14.0063 7.79516L5.75631 4.79516L4.24592 4.24592ZM11.6471 8.53337L10.1194 9.14447C9.6747 9.32235 9.32235 9.6747 9.14447 10.1194L8.53337 11.6471L6.75408 6.75408L11.6471 8.53337ZM0 7H2V5.5H0V7Z" fill="currentColor" />
            </svg>
            Flows
          </motion.h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
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
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  First time user experience
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  fontWeight: '400',
                  marginTop: '4px'
                }}>
                  Complete onboarding flow for new users discovering Blink
                </span>
              </div>
              <svg 
                height="16" 
                strokeLinejoin="round" 
                viewBox="0 0 16 16" 
                width="16" 
                style={{ color: '#9ca3af', flexShrink: 0 }}
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" 
                  fill="currentColor"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Push notification
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  fontWeight: '400',
                  marginTop: '2px'
                }}>
                  Flow that brings users back to discover new product drops
                </span>
              </div>
              <svg 
                height="16" 
                strokeLinejoin="round" 
                viewBox="0 0 16 16" 
                width="16" 
                style={{ color: '#9ca3af', flexShrink: 0 }}
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" 
                  fill="currentColor"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Returning user
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  fontWeight: '400',
                  marginTop: '2px'
                }}>
                  Personalized flow for existing users with purchase history
                </span>
              </div>
              <svg 
                height="16" 
                strokeLinejoin="round" 
                viewBox="0 0 16 16" 
                width="16" 
                style={{ color: '#9ca3af', flexShrink: 0 }}
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" 
                  fill="currentColor"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => handleNavigation('/subscription-flow')}
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
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Subscription Entry Point
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  fontWeight: '400',
                  marginTop: '2px'
                }}>
                  Post-purchase flow that nudges users to set up recurring orders
                </span>
              </div>
              <svg 
                height="16" 
                strokeLinejoin="round" 
                viewBox="0 0 16 16" 
                width="16" 
                style={{ color: '#9ca3af', flexShrink: 0 }}
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" 
                  fill="currentColor"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => handleNavigation('/taste-discovery')}
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
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Taste Discovery & Styling Flow
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  fontWeight: '400',
                  marginTop: '2px'
                }}>
                  Conversational styling flow that discovers user preferences
                </span>
              </div>
              <svg 
                height="16" 
                strokeLinejoin="round" 
                viewBox="0 0 16 16" 
                width="16" 
                style={{ color: '#9ca3af', flexShrink: 0 }}
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" 
                  fill="currentColor"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: '1px',
            backgroundColor: '#e5e7eb',
            marginBottom: '32px',
            transformOrigin: 'left'
          }} 
        />

        {/* Components Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ color: 'currentcolor' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M2.5 6.5V2.5H5.5V6.5H2.5ZM1 2C1 1.44772 1.44772 1 2 1H6C6.55228 1 7 1.44772 7 2V7C7 7.55228 6.55228 8 6 8H2C1.44772 8 1 7.55228 1 7V2ZM2.5 13.5V11.5H5.5V13.5H2.5ZM1 11C1 10.4477 1.44772 10 2 10H6C6.55228 10 7 10.4477 7 11V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V11ZM10.5 2.5V4.5H13.5V2.5H10.5ZM10 1C9.44772 1 9 1.44772 9 2V5C9 5.55228 9.44772 6 10 6H14C14.5523 6 15 5.55228 15 5V2C15 1.44772 14.5523 1 14 1H10ZM13.5 13.5H10.5V9.5H13.5V13.5ZM9 9C9 8.44772 9.44772 8 10 8H14C14.5523 8 15 8.44772 15 9V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V9Z" fill="currentColor" />
            </svg>
            Components
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => handleNavigation('/product-test')}
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
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                WebView Product Listing
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: '#9ca3af',
                fontWeight: '400',
                marginTop: '4px'
              }}>
                Enhanced product component with sizing, colors, and purchase flow
              </span>
            </div>
            <svg 
              height="16" 
              strokeLinejoin="round" 
              viewBox="0 0 16 16" 
              width="16" 
              style={{ color: '#9ca3af', flexShrink: 0 }}
            >
              <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" 
                fill="currentColor"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
        style={{
          marginTop: 'auto',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '40px'
        }}
      >
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
      </motion.div>
    </div>
  );
};

export default LandingPage;
