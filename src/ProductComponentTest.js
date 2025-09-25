import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductComponentTest = ({ productData = null, hideNavigation = false, compact = false, onClose = null, purchaseCount = 1, onPurchaseIntent = null, onPurchaseMade = null, purchasedItems = [] }) => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [undoTimer, setUndoTimer] = useState(0);
  const [isUndoing, setIsUndoing] = useState(false);
  const [isColorTransitioning, setIsColorTransitioning] = useState(false);
  const [nextColor, setNextColor] = useState(null);
  // Check URL parameters for initial tab
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    return tabParam === 'naveenSlayer' ? 'naveenSlayer' : 'fashion';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Product data for different tabs
  const defaultProducts = {
    fashion: {
      title: "Jordan Sport Classic",
      brand: "Nike",
      price: 100.00,
      shipping: 19,
      images: {
        black: [
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic.png`,
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic-product-shot-1.png`,
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic-product-shot-2.png`,
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic-product-shot-3.png`
        ],
        teal: [
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic-teal.png`,
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic-product-shot-1.png`,
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic-product-shot-2.png`,
          `${process.env.PUBLIC_URL}/test-product/Jordan-sport-classic-product-shot-3.png`
        ]
      },
      colors: [
        { name: 'black', color: '#000000' },
        { name: 'teal', color: '#61B6EE' }
      ],
      sizes: [
        { name: 'XS', fullName: 'Extra Small', available: true },
        { name: 'S', fullName: 'Small', available: true },
        { name: 'M', fullName: 'Medium', available: true },
        { name: 'L', fullName: 'Large', available: true },
        { name: 'XL', fullName: 'Extra Large', available: true },
        { name: 'XXL', fullName: 'Extra Extra Large', available: false },
        { name: '3XL', fullName: '3X Large', available: false }
      ]
    },
    collectible: {
      title: "Death Star",
      brand: "LEGO",
      price: 939.99,
      shipping: 22,
      images: {
        default: [
          `${process.env.PUBLIC_URL}/test-product/death-star.png`,
          `${process.env.PUBLIC_URL}/test-product/death-star-product-shot-1.png`,
          `${process.env.PUBLIC_URL}/test-product/death-star-product-shot-2.png`,
          `${process.env.PUBLIC_URL}/test-product/death-star-product-shot-3.png`
        ]
      },
      colors: [], // No color selection for collectibles
      sizes: [] // No sizes for collectibles
    },
    naveenSlayer: {
      title: "MAGMA LORD Hoodie",
      brand: "Slayer",
      price: 120.00,
      shipping: 5,
      images: {
        default: [
          `${process.env.PUBLIC_URL}/Naveen-Slayer-Drop/naveen-slayer-hoodie.jpeg`,
          `${process.env.PUBLIC_URL}/Naveen-Slayer-Drop/naveen-slayer-hoodie.jpeg`,
          `${process.env.PUBLIC_URL}/Naveen-Slayer-Drop/naveen-slayer-hoodie.jpeg`
        ]
      },
      colors: [], // No color options for Naveen Slayer
      sizes: [
        { name: 'XS', fullName: 'Extra Small', available: true },
        { name: 'S', fullName: 'Small', available: true },
        { name: 'M', fullName: 'Medium', available: true },
        { name: 'L', fullName: 'Large', available: true },
        { name: 'XL', fullName: 'Extra Large', available: true },
        { name: 'XXL', fullName: 'Extra Extra Large', available: false },
        { name: '3XL', fullName: '3X Large', available: false }
      ]
    }
  };

  // Use passed productData if available, otherwise use default products
  const products = productData ? {
    singleProduct: {
      title: productData.title,
      brand: productData.brand,
      price: productData.price,
      shipping: productData.shipping || 0,
      images: {
        default: productData.images || [
          productData.image,
          productData.image,
          productData.image
        ]
      },
      colors: [],
      sizes: [
        { name: 'XS', fullName: 'Extra Small', available: true },
        { name: 'S', fullName: 'Small', available: true },
        { name: 'M', fullName: 'Medium', available: true },
        { name: 'L', fullName: 'Large', available: true },
        { name: 'XL', fullName: 'Extra Large', available: true },
        { name: 'XXL', fullName: 'Extra Extra Large', available: false },
        { name: '3XL', fullName: '3X Large', available: false }
      ]
    }
  } : defaultProducts;

  const product = productData ? products.singleProduct : products[activeTab];

  const currentImages = (activeTab === 'collectible' || activeTab === 'naveenSlayer' || productData)
    ? product.images.default 
    : product.images[selectedColor];
  const totalImages = currentImages ? currentImages.length : 0;

  const goToImage = (index) => {
    if (index >= 0 && index < totalImages) {
      setCurrentImageIndex(index);
    }
  };

  const handleColorChange = (newColor) => {
    if (newColor === selectedColor || isColorTransitioning) return;
    
    setIsColorTransitioning(true);
    setNextColor(newColor);
    
    // Change the color at the peak of the wipe animation
    setTimeout(() => {
      setSelectedColor(newColor);
      setCurrentImageIndex(0);
    }, 150); // Peak of the wipe
    
    // Clean up after animation completes
    setTimeout(() => {
      setNextColor(null);
      setIsColorTransitioning(false);
    }, 300); // Full animation duration
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentImageIndex(0);
    if (tab === 'fashion' || tab === 'naveenSlayer') {
      setSelectedColor('black');
    }
  };

  // Reset image index when color changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  const handlePurchase = () => {
    setIsPurchasing(true);
    setIsPurchased(true);
    
    // Notify parent component about the purchase
    if (onPurchaseMade && productData) {
      onPurchaseMade({
        title: productData.title,
        price: productData.price,
        shipping: productData.shipping || 0,
        brand: productData.brand,
        image: productData.image,
        size: selectedSize,
        available: productData.available
      });
    }
    
    // Start 30-second countdown timer
    setUndoTimer(30);
    const timerInterval = setInterval(() => {
      setUndoTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUndo = () => {
    setIsUndoing(true);
    setIsPurchased(false);
    setUndoTimer(0);
    
    // Reset undo state after animation completes
    setTimeout(() => {
      setIsUndoing(false);
      setIsPurchasing(false);
    }, 500);
  };

  return (
    <div style={{
      minHeight: compact ? 'auto' : '100vh',
      backgroundColor: '#ffffff'
    }}>
      {/* Tabs */}
      <div style={{
        borderBottom: hideNavigation ? 'none' : '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        padding: hideNavigation ? '0' : '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Tab Navigation - Hide for Naveen Slayer or when hideNavigation is true */}
          {!hideNavigation && activeTab !== 'naveenSlayer' && (
            <div style={{
              display: 'flex',
              gap: '32px'
            }}>
              <button
                onClick={() => handleTabChange('fashion')}
                style={{
                  padding: '16px 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'fashion' ? '2px solid #007bff' : '2px solid transparent',
                  color: activeTab === 'fashion' ? '#007bff' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
              >
                Fashion Item
              </button>
              
              <button
                onClick={() => handleTabChange('collectible')}
                style={{
                  padding: '16px 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'collectible' ? '2px solid #007bff' : '2px solid transparent',
                  color: activeTab === 'collectible' ? '#007bff' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
              >
                Collectible
              </button>
            </div>
          )}

          {/* Naveen Slayer Header */}
          {!hideNavigation && activeTab === 'naveenSlayer' && (
            <div style={{
              textAlign: 'center',
              marginBottom: compact ? '8px' : '24px'
            }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: '0 0 8px 0',
                fontFamily: 'inherit'
              }}>
                Naveen Slayer Collection
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '0',
                fontFamily: 'inherit'
              }}>
                Exclusive streetwear drop
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: compact ? '10px' : '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: compact ? 'auto' : 'calc(100vh - 73px)' // Subtract tab height
      }}>
      <div style={{
        width: compact ? 'auto' : '362px',
        position: 'relative',
        margin: '0 auto'
      }}>
        {/* Main Product Container - Slides off with rotation, bounces back on undo */}
        <motion.div
          animate={
            isPurchased 
              ? { x: '150%', rotate: 18 }
              : { x: '0%', rotate: 0 }
          }
          transition={
            isUndoing 
              ? {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1] // Smooth ease-in-out for undo
                }
              : {
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1] // Slick ease-in-out for purchase
                }
          }
          style={{
            width: '100%',
            position: 'relative',
            zIndex: 2,
            boxShadow: isPurchased
              ? '0 20px 60px rgba(0, 0, 0, 0.3)' 
              : 'none'
          }}
        >
        {/* Product Image - Separate from content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onWheel={(e) => {
            if (isImageExpanded) {
              e.preventDefault();
              const container = e.currentTarget.querySelector('.zoomable-container');
              if (container) {
                const currentScale = parseFloat(container.style.transform.replace('scale(', '').replace(')', '') || '1');
                const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
                const newScale = Math.max(1, Math.min(3, currentScale * scaleChange));
                container.style.transform = `scale(${newScale})`;
              }
            }
          }}
          style={{
            position: 'relative',
            width: '362px',
            height: '420px',
            overflow: isImageExpanded ? 'hidden' : 'hidden',
            borderRadius: '4px',
            marginBottom: isImageExpanded ? '10px' : '19px'
          }}
        >
          {/* Image Container */}
          {isImageExpanded ? (
            // Single image mode for share
            <motion.div
              className="zoomable-container"
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              dragElastic={0.1}
              style={{
                width: '100%',
                height: '100%',
                cursor: 'grab',
                transformOrigin: 'center center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              whileDrag={{ cursor: 'grabbing' }}
            >
              <img
                src={currentImages[currentImageIndex]}
                alt={`${product.title} - ${selectedColor} - Share View`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </motion.div>
          ) : (
            // Carousel mode for normal view
            <motion.div
              key={selectedColor} // Key change triggers smooth transition
              className="zoomable-container"
              drag="x"
              dragConstraints={{ 
                left: -(totalImages - 1) * 362, 
                right: 0 
              }}
              dragElastic={0.2}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                x: -currentImageIndex * 362,
                opacity: 1,
                scale: 1
              }}
              transition={{ 
                x: {
                  type: "spring", 
                  stiffness: 400, 
                  damping: 40 
                },
                opacity: {
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                },
                scale: {
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1]
                }
              }}
              onDragStart={() => {
                // Prevent any conflicting animations during drag
              }}
              onDragEnd={(event, info) => {
                const swipeThreshold = 50;
                if (info.offset.x > swipeThreshold && currentImageIndex > 0) {
                  setCurrentImageIndex(currentImageIndex - 1);
                } else if (info.offset.x < -swipeThreshold && currentImageIndex < totalImages - 1) {
                  setCurrentImageIndex(currentImageIndex + 1);
                }
              }}
              style={{
                display: 'flex',
                width: `${totalImages * 362}px`,
                height: '100%',
                cursor: 'grab',
                userSelect: 'none' // Prevent text selection during drag
              }}
              whileDrag={{ cursor: 'grabbing' }}
              whileHover={{ cursor: 'grab' }}
            >
              {currentImages.map((imageSrc, index) => (
                <div
                  key={`${selectedColor}-${index}`}
                  style={{
                    width: '362px',
                    height: '420px',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={`${product.title} - ${selectedColor} - Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* Color Wipe Transition Overlay */}
          <AnimatePresence>
            {isColorTransitioning && nextColor && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: product.colors.find(c => c.name === nextColor)?.color || '#000000',
                  borderRadius: '4px', // Match the image container's border radius
                  overflow: 'hidden', // Ensure the wipe respects the border radius
                  zIndex: 10
                }}
                initial={{ 
                  clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
                }}
                animate={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                }}
                exit={{ 
                  clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1] // Smoother, less aggressive easing
                }}
              />
            )}
          </AnimatePresence>

            {/* Size Badge - Inside Image - Only show for fashion items and Naveen Slayer */}
            {(activeTab === 'fashion' || activeTab === 'naveenSlayer') && (
              <motion.div
                key={selectedSize} // This will trigger re-animation when size changes
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizeSelector(!showSizeSelector);
                }}
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1.0] // Smooth cubic-bezier easing
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'absolute',
                  top: '7px',
                  left: '7px',
                  backgroundColor: '#fff',
                  padding: '6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  color: '#111',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  lineHeight: '8.5px',
                  boxShadow: '10px 10px 15px 0 rgba(0, 0, 0, 0.1)',
                  zIndex: 2,
                  cursor: 'pointer'
                }}
              >
                {product.sizes.find(size => size.name === selectedSize)?.fullName || selectedSize}
              </motion.div>
            )}

            {/* Size Selector Overlay - Only show for fashion items and Naveen Slayer */}
            <AnimatePresence>
              {(activeTab === 'fashion' || activeTab === 'naveenSlayer') && showSizeSelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    duration: 0.3
                  }}
                  onClick={() => setShowSizeSelector(false)}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    width: '362px',
                    height: '125px',
                    flexShrink: 0,
                    borderRadius: '4px 4px 0 0',
                    background: 'linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.00) 100%)',
                    padding: '0',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '10px'
                  }}
                >
                  <motion.div 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'nowrap',
                      justifyContent: 'center'
                    }}
                  >
                    {product.sizes.map((size, index) => (
                      <motion.button
                        key={size.name}
                        initial={{ opacity: 0, y: -10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 500,
                          damping: 25
                        }}
                        onClick={() => {
                          if (size.available) {
                            setSelectedSize(size.name);
                            // Add a small delay to show the selection impact before closing
                            setTimeout(() => {
                              setShowSizeSelector(false);
                            }, 150);
                          }
                        }}
                        whileHover={size.available ? { scale: 1.05 } : {}}
                        whileTap={size.available ? { 
                          scale: 0.85, 
                          backgroundColor: '#f0f0f0',
                          transition: { duration: 0.1 }
                        } : {}}
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '8px',
                        backgroundColor: size.available 
                          ? '#fff'
                          : '#666',
                        color: size.available 
                          ? '#111'
                          : '#999',
                        border: size.available && size.name === selectedSize 
                          ? '2px solid #007bff' 
                          : size.available 
                            ? '1px solid #e0e0e0' 
                            : 'none',
                        boxShadow: size.available && size.name === selectedSize 
                          ? '0 0 0 1px rgba(0, 123, 255, 0.25)' 
                          : 'none',
                        textAlign: 'center',
                        leadingTrim: 'both',
                        textEdge: 'cap',
                        fontFamily: 'Inter',
                        fontSize: '13px',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        lineHeight: '85%',
                        textTransform: 'uppercase',
                        cursor: size.available ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: size.available ? 1 : 0.5
                      }}
                      >
                        {size.name}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Image Navigation Dots */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'inline-flex',
              padding: '4px 6px',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '60px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(22.5px)',
              boxShadow: '0 0 25px 0 rgba(0, 0, 0, 0.1)'
            }}>
              {currentImages.map((_, index) => {
                const isActive = index === currentImageIndex;
                
                return (
                  <motion.div
                    key={index}
                    onClick={() => goToImage(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#000000' : 'rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </div>
        </motion.div>

        {/* Product Info - Separate section */}
        {!isImageExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Title and Brand */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: compact ? '6px' : '12px'
            }}>
              {activeTab === 'fashion' && !productData ? (
                // Fashion: Brand next to title
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      color: '#111',
                      fontFamily: 'Inter',
                      fontSize: '15px',
                      fontStyle: 'normal',
                      fontWeight: '600',
                      lineHeight: 'normal'
                    }}>
                      {product.title}
                    </h3>
                    <p style={{
                      margin: 0,
                      color: '#A6A6A6',
                      fontFamily: 'Inter',
                      fontSize: '10px',
                      fontStyle: 'normal',
                      fontWeight: '600',
                      lineHeight: 'normal'
                    }}>
                      {product.brand}
                    </p>
                  </div>
                </div>
              ) : (
                // Collectible: Brand on the right
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: '#111',
                    fontFamily: 'Inter',
                    fontSize: '15px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: 'normal'
                  }}>
                    {product.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#A6A6A6',
                    fontFamily: 'Inter',
                    fontSize: '10px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: 'normal'
                  }}>
                    {product.brand}
                  </p>
                </div>
              )}
              
              {/* Color Picker - Only show for fashion items */}
              {activeTab === 'fashion' && (
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center'
                }}>
                  {product.colors.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => handleColorChange(colorOption.name)}
                    style={{
                      width: selectedColor === colorOption.name ? '22px' : '14px',
                      height: selectedColor === colorOption.name ? '22px' : '14px',
                      borderRadius: selectedColor === colorOption.name ? '5px' : '2px',
                      backgroundColor: 'transparent',
                      border: selectedColor === colorOption.name 
                        ? '1px solid #000000' 
                        : 'none',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '2px',
                        backgroundColor: colorOption.color
                      }}
                    />
                  </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: compact ? '8px' : '15px'
            }}>
              <div style={{
                color: '#111',
                fontFamily: 'Inter',
                fontSize: '13px',
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: 'normal'
              }}>
                ${product.price.toFixed(2)} USD
              </div>
              
              <div style={{
                color: '#A6A6A6',
                fontFamily: 'Inter',
                fontSize: '10px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: 'normal'
              }}>
                Est. shipping & taxes ${product.shipping}
              </div>
            </div>

            {/* Buy Button */}
            {!isImageExpanded && (
              <motion.button
                onClick={handlePurchase}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#111',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '800',
                  lineHeight: 'normal',
                  letterSpacing: '-0.7px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                BUY NOW
              </motion.button>
            )}

            {/* Share Button - Only visible in expanded mode */}
            {isImageExpanded && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#111',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '800',
                  lineHeight: 'normal',
                  letterSpacing: '-0.7px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                SHARE
              </motion.button>
            )}
          </motion.div>
        )}
        </motion.div>

        {/* Purchase Confirmation Overlay - Exact same as main app */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: isPurchased ? 'auto' : 'none'
          }}
        >
          {/* Item thumbnail */}
          {isPurchased && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1, 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                marginBottom: compact ? '8px' : '20px'
              }}
            >
              <img 
                src={currentImages[currentImageIndex]}
                alt={product.title}
                style={{ 
                  width: '80px', 
                  height: '80px',
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb'
                }}
              />
            </motion.div>
          )}

          {/* "GETTING READY TO BUY IT FOR YOU" text - Exact same styling as "ON ITS WAY" */}
          {isPurchased && (
            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                color: '#111',
                textAlign: 'center',
                leadingTrim: 'both',
                textEdge: 'cap',
                fontFamily: '"FBS Machro", "Bebas Neue", "Arial Black", system-ui, sans-serif',
                fontSize: '60px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: '85%',
                textTransform: 'uppercase',
                marginTop: '30px',
                marginBottom: compact ? '8px' : '20px'
              }}
            >
              GETTING READY TO<br />BUY IT FOR YOU
            </motion.div>
          )}
          
          {/* Product name */}
          {isPurchased && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.35, 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                color: '#111',
                textAlign: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: '120%',
                marginBottom: compact ? '4px' : '8px'
              }}
            >
              {product.title}
            </motion.div>
          )}
          
          {/* Size - Only show for fashion items and Naveen Slayer */}
          {(activeTab === 'fashion' || activeTab === 'naveenSlayer') && isPurchased && (
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.5, 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                color: '#666',
                textAlign: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: '120%',
                marginBottom: compact ? '10px' : '30px'
              }}
            >
              {product.sizes.find(size => size.name === selectedSize)?.fullName || selectedSize}
            </motion.div>
          )}

          {/* Undo button with countdown timer - Exact same styling as main app */}
          {isPurchased && undoTimer > 0 && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.6, 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
              onClick={handleUndo}
              style={{
                display: 'flex',
                padding: '10px 20px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                background: '#333',
                border: 'none',
                borderRadius: '25px',
                color: '#FFF',
                textAlign: 'center',
                leadingTrim: 'both',
                textEdge: 'cap',
                fontFamily: 'Inter',
                fontSize: '9px',
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: '85%',
                letterSpacing: '-0.63px',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              <span>UNDO</span>
              <span style={{
                background: 'white',
                color: 'black',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                minWidth: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                {undoTimer}
              </span>
            </motion.button>
          )}
        </motion.div>
      </div>
      </div>

      {/* Orange "Back to Blink" tab - appears after any purchase */}
      <AnimatePresence>
        {purchaseCount > 0 && onClose && (
          <motion.div
            initial={{ scaleX: 0, y: 0 }}
            animate={{ scaleX: 1, y: 0 }}
            exit={{ scaleX: 0, y: 0 }}
            transition={{
              type: 'tween',
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.4
            }}
            style={{
              position: 'fixed',
              bottom: '143px', // Above Safari bar
              left: '0px',
              right: '0px',
              zIndex: 1002 // Higher than Safari bar
            }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Close web view first
                onClose();
                // Then trigger group purchase intent in WhatsApp after a short delay
                if (onPurchaseIntent && purchasedItems.length > 0) {
                  setTimeout(() => {
                    if (purchasedItems.length === 1) {
                      // Single item purchase
                      onPurchaseIntent(purchasedItems[0]);
                    } else {
                      // Group purchase
                      onPurchaseIntent({
                        type: 'group-purchase',
                        items: purchasedItems,
                        count: purchasedItems.length,
                        totalPrice: purchasedItems.reduce((sum, item) => sum + item.price + (item.shipping || 0), 0),
                        timeLimit: 30, // 30 minutes
                        originalSearchResults: purchasedItems // Pass the purchased items
                      });
                    }
                  }, 300);
                }
              }}
              style={{
                width: '100%',
                background: '#E3591D',
                color: 'white',
                border: 'none',
                borderRadius: '0px',
                padding: '16px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              Back to Blink
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: '#E3591D'
              }}>
                {purchaseCount}
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductComponentTest;
