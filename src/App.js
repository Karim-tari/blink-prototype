import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, MoreVertical, MapPin, Clock } from 'lucide-react';
import './App.css';

// Suppress MetaMask errors and prevent them from blocking the app
if (typeof window !== 'undefined') {
  // Suppress console errors from MetaMask
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.toString().includes('MetaMask') || 
        args[0]?.toString().includes('ethereum') ||
        args[0]?.toString().includes('chrome-extension')) {
      return; // Suppress MetaMask errors
    }
    originalError.apply(console, args);
  };

  // Prevent MetaMask errors from stopping execution
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('MetaMask') ||
        event.error?.message?.includes('ethereum') ||
        event.filename?.includes('chrome-extension')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Handle unhandled promise rejections from MetaMask
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('MetaMask') ||
        event.reason?.message?.includes('ethereum')) {
      event.preventDefault();
      return false;
    }
  });
}

const TypingText = ({ text, delay = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ color: '#6b46c1' }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};

const AutobotApp = () => {
  const [messages, setMessages] = useState([]);
  const [currentFlow, setCurrentFlow] = useState('chat');
  const [userType, setUserType] = useState('returning'); // 'new' or 'returning'
  const [balance, setBalance] = useState(150);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Karim',
    interests: ['sneakers', 'tech', 'gaming'],
    shoeSize: '10.5',
    clothingSize: 'M',
    address: '2847 Oak Street, San Francisco, CA 94115',
    preferences: {
      prefersFastShipping: true,
      maxBudget: 500,
      brandsToAvoid: ['off-brand']
    },
    purchaseHistory: [
      { item: 'Air Jordan 4 Black Cat', date: '2 weeks ago', price: 210 },
      { item: 'AirPods Pro 2nd Gen', date: '1 month ago', price: 249 },
      { item: 'MacBook Pro 14"', date: '3 months ago', price: 1999 }
    ],
    lastPurchasedShoes: 'Air Jordan 4 Black Cat',
    lastPurchasedLaptop: 'MacBook Pro 14"',
    preferredBrands: ['Nike', 'Apple', 'Samsung', 'Sony'],
    totalSpent: 2458,
    memberSince: 'March 2024'
  });
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [waitingForSizeConfirmation, setWaitingForSizeConfirmation] = useState(false);
  const [pendingShoeSearch, setPendingShoeSearch] = useState('');
  const [hasInitializedMessages, setHasInitializedMessages] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [webViewData, setWebViewData] = useState(null);
  const chatContainerRef = useRef(null);

  // Simulate Autobot typing and responding
  const addAutobotMessage = (content, special, data) => {
    console.log('🤖 Adding autobot message:', { content, special, data }); // Debug log
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMessage = {
        id: Date.now().toString(),
        type: 'autobot',
        content: content || '', // Ensure content is never undefined
        timestamp: new Date(),
        special,
        data
      };
      console.log('🤖 Message object created:', newMessage); // Debug log
      setMessages(prev => {
        console.log('🤖 Previous messages count:', prev.length); // Debug log
        const newMessages = [...prev, newMessage];
        console.log('🤖 New messages count:', newMessages.length); // Debug log
        console.log('🤖 Last message:', newMessages[newMessages.length - 1]); // Debug log
        return newMessages;
      });
    }, 1500);
  };

  const addUserMessage = (content, messageType, data) => {
    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      messageType,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Initialize user based on type selection
  const initializeNewUser = () => {
    setUserType('new');
    setCurrentFlow('onboarding');
    setOnboardingStep(0);
    setBalance(0); // New users start with $0
    setUserProfile({
      name: '',
      interests: [],
      shoeSize: '',
      clothingSize: '',
      address: '',
      preferences: {},
      purchaseHistory: [],
      lastPurchasedShoes: '',
      lastPurchasedLaptop: '',
      preferredBrands: [],
      totalSpent: 0,
      memberSince: ''
    });
    setMessages([]);
    setHasInitializedMessages(false);
  };

  const initializeReturningUser = () => {
    setUserType('returning');
    setCurrentFlow('chat');
    setBalance(150);
    setUserProfile({
      name: 'Karim',
      interests: ['sneakers', 'tech', 'gaming'],
      shoeSize: '10.5',
      clothingSize: 'M',
      address: '2847 Oak Street, San Francisco, CA 94115',
      preferences: {
        prefersFastShipping: true,
        maxBudget: 500,
        brandsToAvoid: ['off-brand']
      },
      purchaseHistory: [
        { item: 'Air Jordan 4 Black Cat', date: '2 weeks ago', price: 210 },
        { item: 'AirPods Pro 2nd Gen', date: '1 month ago', price: 249 },
        { item: 'MacBook Pro 14"', date: '3 months ago', price: 1999 }
      ],
      lastPurchasedShoes: 'Air Jordan 4 Black Cat',
      lastPurchasedLaptop: 'MacBook Pro 14"',
      preferredBrands: ['Nike', 'Apple', 'Samsung', 'Sony'],
      totalSpent: 2458,
      memberSince: 'March 2024'
    });
    setMessages([]);
    setHasInitializedMessages(false);
  };

  // Welcome messages based on user type
  useEffect(() => {
    if (!hasInitializedMessages) {
      if (currentFlow === 'onboarding' && onboardingStep === 0 && userType === 'new') {
      setTimeout(() => {
          addAutobotMessage("Hey there! Welcome to Blink… So tell me, what do you want to buy?");
          setHasInitializedMessages(true);
        }, 1000);
      } else if (currentFlow === 'chat' && userType === 'returning') {
                setTimeout(() => {
          addAutobotMessage(`Hey Karim! 👋 Welcome back!\n\nHope you're enjoying those Air Jordan 4s you got yesterday! They're fire! 🔥\n\nTell me what's on your mind? Anything else you're hunting for today?`);
          setHasInitializedMessages(true);
      }, 1000);
    }
    }
  }, [currentFlow, onboardingStep, userType, hasInitializedMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleUserResponse = (response) => {
    addUserMessage(response);
    
    if (onboardingStep === 0) {
      // First response should be a product request - process immediately
      const category = getProductCategoryName(response.toLowerCase());
      
      setTimeout(() => {
        const contextualMsg = getContextualMessage(category, response);
        addAutobotMessage(contextualMsg);
        
        // Switch to chat mode immediately and process the search
        setCurrentFlow('chat');
        
        // Set up minimal profile
        const today = new Date();
        setUserProfile(prev => ({ 
          ...prev,
          name: '', // Will ask when they want to buy
          memberSince: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          preferredBrands: [],
          shoeSize: '', // Will ask when needed
          address: '' // Will ask when they want to buy
        }));
        
        // Process the search immediately
        setTimeout(() => {
          triggerSearchResults(response, 'search');
          }, 2000);
      }, 1000);
    }
  };

  const getContextualMessage = (category, userRequest) => {
    const isReturningUser = userType === 'returning';
    
    const contextualMessages = {
      shoes: isReturningUser ? [
        `More shoes! 👟 Since you loved those ${userProfile.lastPurchasedShoes} from 2 weeks ago, I'm thinking size ${userProfile.shoeSize} again? Or trying something different this time?`,
        `Nice! You're definitely building a solid collection. Size ${userProfile.shoeSize} like usual, shipping to Oak Street?`,
        `Love the shoe game! Based on your Nike preferences and that size ${userProfile.shoeSize} fit from last time, want me to find similar options?`
      ] : [
        `Shoes! 👟 What size should I look for? I'll remember this for future searches.`,
        `Nice choice! Looking for any particular style or brand?`,
        `Shoe shopping! Let me know your size and I'll find some great options.`
      ],
      laptop: [
        `Laptop shopping again! That ${userProfile.lastPurchasedLaptop} treating you well, or time for an upgrade? 💻`,
        `Tech time! Since you went premium with the MacBook last time, staying in the Apple ecosystem or exploring other options?`,
        `Got it! You spent good money on that ${userProfile.lastPurchasedLaptop} - what's driving the need for another one?`
      ],
      phone: [
        `Phone hunting! 📱 What type of phone are you looking for?`,
        `Nice! Any particular brand or features you have in mind?`,
        `Phone shopping! Let me find some great options for you.`
      ],
      audio: [
        `Audio gear! Those AirPods Pro you got last month working out, or need something different? 🎧`,
        `Headphone time! I remember you liked the AirPods Pro quality - going for similar premium stuff or trying over-ears?`,
        `Got it! Since you're in the Apple ecosystem with that MacBook and AirPods, staying with Apple or exploring?`
      ],
      monitor: [
        `Monitor shopping! With that MacBook Pro setup, I'm thinking you want something that'll complement it nicely? 🖥️`,
        `Nice! For your SF setup, thinking big screen for productivity or focusing on color accuracy?`,
        `Got it! Based on your tech preferences, probably want something premium that matches your MacBook quality?`
      ],
      watch: [
        `Smart watch! Given your Apple ecosystem (MacBook, AirPods), I'm guessing Apple Watch? ⌚`,
        `Watch shopping! You seem to like premium tech - going high-end or trying something more budget-friendly?`,
        `Nice choice! For your Oak Street lifestyle, thinking fitness tracking or more general smart features?`
      ],
      'nintendo-switch': [
        `Nintendo Switch! 🎮 Let me find some great options for you.`,
        `Great choice! Finding Nintendo Switch options now.`,
        `Nintendo time! Let me find some great Switch options for you.`
      ],
      'playstation': [
        `PlayStation! 🎮 Let me find some great options for you.`,
        `Great choice! Finding PlayStation options now.`,
        `PlayStation hunting! Let me find some great options.`
      ],
      'xbox': [
        `Xbox! 🎮 Let me find some great gaming options for you.`,
        `Great choice! Finding Xbox options now.`,
        `Xbox time! Let me find some awesome options.`
      ],
      gaming: [
        `Gaming gear! 🎮 Console or PC setup?`,
        `Nice! What kind of gaming gear are you looking for?`,
        `Gaming time! Let me find some awesome options for you.`
      ],
      lego: [
        `LEGO time! 🧱 What kind of sets are you looking for?`,
        `Nice choice! Star Wars, architecture, or something else?`,
        `LEGO hunting! Let me find some great sets for you.`
      ],
      'half-life': isReturningUser ? [
        `Half-Life collectibles! 🎮 I see gaming in your interests - perfect match! Looking for vintage stuff or specific items?`,
        `Nice! Half-Life memorabilia is getting rare these days. I'll check eBay for some authentic pieces from collectors.`,
        `Half-Life hunting! Given your taste for quality items, I'll find some genuine collectibles with good condition ratings.`
      ] : [
        `Half-Life collectibles! 🎮 Awesome choice - that's some legendary gaming history. I'll search eBay for authentic pieces.`,
        `Nice! Half-Life items are becoming quite valuable. Let me find some second-hand treasures from collectors.`,
        `Half-Life memorabilia! I'll dig through eBay listings to find some genuine vintage pieces for you.`
      ],
      general: [
        `On it! You've got good taste based on your purchase history - let me find quality ${userRequest.toLowerCase()} options.`,
        `Got it! I'll focus on premium options since you usually go for quality stuff.`,
        `Sweet! Let me hunt down some great options for you.`
      ]
    };

    const messages = contextualMessages[category] || contextualMessages.general;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const triggerSearchResults = (userRequest, type) => {
    // Parse user request to determine what they're looking for
    const request = userRequest.toLowerCase();
    
    // Dynamic product generation based on user input
    const getProductCategory = () => {
      if (request.includes('half-life') || request.includes('half life') || (request.includes('half') && request.includes('life'))) {
        return {
          category: 'half-life',
          emoji: '🎮',
          products: [
            { 
              name: 'Half-Life 2 Collector\'s Edition (Used)', 
              basePrice: 89, 
              brand: 'Valve',
              image: `${process.env.PUBLIC_URL}/half-life.webp`,
              condition: 'Used - Very Good',
              seller: 'retro_games_vault',
              shipping: 12,
              location: 'Portland, OR',
              isSecondHand: true
            },
            { 
              name: 'Half-Life Alyx VR Headcrab Plush (Pre-owned)', 
              basePrice: 45, 
              brand: 'Valve',
              image: `${process.env.PUBLIC_URL}/half-life-2.webp`,
              condition: 'Used - Good',
              seller: 'gaming_collectibles_99',
              shipping: 8,
              location: 'Seattle, WA',
              isSecondHand: true
            },
            { 
              name: 'Half-Life Gordon Freeman Action Figure (Vintage)', 
              basePrice: 125, 
              brand: 'NECA',
              image: `${process.env.PUBLIC_URL}/half-life-3.webp`,
              condition: 'Used - Excellent',
              seller: 'valve_memorabilia',
          shipping: 15,
              location: 'Los Angeles, CA',
              isSecondHand: true
            },
            { 
              name: 'Half-Life Orange Box PC Game Complete (Second Hand)', 
              basePrice: 35, 
              brand: 'Valve',
              image: `${process.env.PUBLIC_URL}/half-life-4.webp`,
              condition: 'Used - Very Good',
              seller: 'classic_pc_games',
              shipping: 5,
              location: 'Austin, TX',
              isSecondHand: true
            },
            { 
              name: 'Half-Life Lambda Symbol Metal Pin (Pre-owned)', 
              basePrice: 18, 
              brand: 'Valve',
              image: `${process.env.PUBLIC_URL}/half-life-5.webp`,
              condition: 'Used - Good',
              seller: 'nerd_accessories_co',
              shipping: 3,
              location: 'Chicago, IL',
              isSecondHand: true
            }
          ]
        };
      } else if (request.includes('lego') || request.includes('star wars') || request.includes('blocks')) {
        return {
          category: 'lego',
          emoji: '🧱',
          products: [
            { 
              name: 'LEGO Star Wars Imperial Star Destroyer', 
              basePrice: 699, 
              brand: 'LEGO',
              image: `${process.env.PUBLIC_URL}/lego-1.png`
            },
            { 
              name: 'LEGO Star Wars Millennium Falcon', 
              basePrice: 849, 
              brand: 'LEGO',
              image: `${process.env.PUBLIC_URL}/lego-2.png`
            },
            { 
              name: 'LEGO Star Wars AT-AT Walker', 
              basePrice: 799, 
              brand: 'LEGO',
              image: `${process.env.PUBLIC_URL}/lego-3.png`
            },
            { 
              name: 'LEGO Star Wars X-Wing Starfighter', 
              basePrice: 199, 
              brand: 'LEGO',
              image: `${process.env.PUBLIC_URL}/lego-4.png`
            },
            { 
              name: 'LEGO Star Wars Mandalorian Razor Crest', 
              basePrice: 599, 
              brand: 'LEGO',
              image: `${process.env.PUBLIC_URL}/lego-5.png`
            }
          ]
        };
      } else if (request.includes('monitor') || request.includes('display') || request.includes('screen')) {
        return {
          category: 'monitor',
          emoji: '🖥️',
          products: [
            { 
              name: 'Samsung 4K Monitor M7 Series', 
              basePrice: 299, 
              brand: 'Samsung',
              image: 'https://images.samsung.com/is/image/samsung/p6pim/us/ls32bm700unxgo/gallery/us-smart-monitor-m7-ls32bm700unxgo-532838307?$650_519_PNG$'
            },
            { 
              name: 'LG UltraFine 4K Display', 
              basePrice: 399, 
              brand: 'LG',
              image: 'https://gscs.lge.com/gscs_lge/front/downloadSupFileWork.lge?csSvcCode=SVC203&swId=SWSVC203202008110001'
            },
            { 
              name: 'Dell Professional Monitor', 
              basePrice: 199, 
              brand: 'Dell',
              image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2723qe/media-gallery/monitor-u2723qe-gallery-5.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full'
            }
          ]
        };
      } else if (request.includes('shoes') || request.includes('sneaker') || request.includes('jordan') || request.includes('nike')) {
        return {
          category: 'shoes',
          emoji: '👟',
          products: [
            { 
              name: 'Air Jordan 4 Black Cat', 
              basePrice: 210, 
              brand: 'Nike',
              usedPrice: 180,
              image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/be8b4594-8d7f-4916-9419-405da1de3f0e/air-jordan-4-retro-shoes-zF0vm0.png'
            },
            { 
              name: 'Nike Air Force 1', 
              basePrice: 110, 
              brand: 'Nike',
              usedPrice: 75,
              image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrhbr.png'
            },
            { 
              name: 'Adidas Ultraboost 22', 
              basePrice: 190, 
              brand: 'Adidas',
              usedPrice: 120,
              image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg'
            },
            { 
              name: 'Jordan 1 Retro High OG', 
              basePrice: 170, 
              brand: 'Nike',
              usedPrice: 140,
              image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e7d7c599-8ec8-4c1d-8b7b-1b4e8b9c4a5d/air-jordan-1-retro-high-og-shoes-Mh3J2M.png'
            }
          ]
        };
      } else if (request.includes('laptop') || request.includes('macbook') || request.includes('computer')) {
        return {
          category: 'laptop',
          emoji: '💻',
          products: [
            { 
              name: 'MacBook Pro 14" M3', 
              basePrice: 1999, 
              brand: 'Apple',
              usedPrice: 1650,
              image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'
            },
            { 
              name: 'MacBook Air M2', 
              basePrice: 1199, 
              brand: 'Apple',
              usedPrice: 950,
              image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034'
            },
            { 
              name: 'ThinkPad X1 Carbon Gen 11', 
              basePrice: 1399, 
              brand: 'Lenovo',
              usedPrice: 1050,
              image: 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MzUwODc4fGltYWdlL3BuZ3xhR00yTDJoaE9TOHhOems0T1RBNE1UUXhORGcyTmk1d2JtY3w0OGI3YjNjYTM5NmY0ZjRlNzRiMzUzNzZjODBkNzY5MWNhYzJhMTJjN2Y4NzI2ZDkzYjAyNjI2ZmQyMjU4YWUy/lenovo-laptop-thinkpad-x1-carbon-gen-11-14-intel-hero.png'
            },
            { 
              name: 'Surface Laptop 5', 
              basePrice: 1299, 
              brand: 'Microsoft',
              usedPrice: 950,
              image: 'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Surface-Laptop-5-13inch-Platinum-001-1?wid=406&hei=230&fit=crop'
            }
          ]
        };
      } else if (request.includes('headphone') || request.includes('airpods') || request.includes('audio')) {
        return {
          category: 'audio',
          emoji: '🎧',
          products: [
            { 
              name: 'AirPods Pro 2nd Gen', 
              basePrice: 249, 
              brand: 'Apple',
              image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361'
            },
            { 
              name: 'Sony WH-1000XM5', 
              basePrice: 399, 
              brand: 'Sony',
              image: 'https://sony.scene7.com/is/image/sonyglobalsolutions/wh-1000xm5_Primary_image?$categorypdpnav$&fmt=png-alpha'
            },
            { 
              name: 'Bose QuietComfort', 
              basePrice: 329, 
              brand: 'Bose',
              image: 'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/quietcomfort_headphones/product_silo_images/QC_Headphones_PDP_Ecom-Gallery-B01.png'
            }
          ]
        };
      } else if (request.includes('phone') || request.includes('iphone') || request.includes('samsung galaxy')) {
        return {
          category: 'phone',
          emoji: '📱',
          products: [
            { 
              name: 'iPhone 15 Pro', 
              basePrice: 999, 
              brand: 'Apple',
              usedPrice: 820,
              image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-bluetitanium-pdp-image-position-1a_5G?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1692895990559'
            },
            { 
              name: 'iPhone 14', 
              basePrice: 729, 
              brand: 'Apple',
              usedPrice: 580,
              image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-blue-select-202209?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660712889420'
            },
            { 
              name: 'Samsung Galaxy S24', 
              basePrice: 799, 
              brand: 'Samsung',
              usedPrice: 650,
              image: 'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-s928-492246-sm-s928uzaaxaa-539929072?$650_519_PNG$'
            },
            { 
              name: 'Google Pixel 8', 
              basePrice: 699, 
              brand: 'Google',
              usedPrice: 520,
              image: 'https://lh3.googleusercontent.com/7Q2kNhAOGDnl7sRShvpYCcBf1HVCL3lW1t4_YE3SdGEu7YEOtWYwq-jNP2EtjOLb3dg=s1200'
            }
          ]
        };
      } else if (request.includes('watch') || request.includes('apple watch')) {
        return {
          category: 'watch',
          emoji: '⌚',
          products: [
            { name: 'Apple Watch Series 9', basePrice: 399, brand: 'Apple' },
            { name: 'Samsung Galaxy Watch 6', basePrice: 329, brand: 'Samsung' },
            { name: 'Garmin Forerunner 955', basePrice: 499, brand: 'Garmin' }
          ]
        };
      } else if (request.includes('nintendo') || request.includes('switch')) {
        return {
          category: 'nintendo-switch',
          emoji: '🎮',
          products: [
            { name: 'Nintendo Switch 2', basePrice: 399, brand: 'Nintendo', image: `${process.env.PUBLIC_URL}/switch 2.webp` },
            { name: 'Nintendo Switch OLED', basePrice: 349, brand: 'Nintendo', usedPrice: 280 },
            { name: 'Nintendo Switch (V2)', basePrice: 299, brand: 'Nintendo', usedPrice: 220 },
            { name: 'Nintendo Switch Lite', basePrice: 199, brand: 'Nintendo', usedPrice: 150 },
            { name: 'Nintendo Switch Pro Controller', basePrice: 69, brand: 'Nintendo', usedPrice: 45 }
          ]
        };
      } else if (request.includes('playstation') || request.includes('ps5') || request.includes('ps4')) {
        return {
          category: 'playstation',
          emoji: '🎮',
          products: [
            { name: 'PlayStation 5', basePrice: 499, brand: 'Sony', usedPrice: 420 },
            { name: 'PlayStation 5 Digital', basePrice: 399, brand: 'Sony', usedPrice: 340 },
            { name: 'PlayStation 4 Pro', basePrice: 299, brand: 'Sony', usedPrice: 250 },
            { name: 'DualSense Controller', basePrice: 69, brand: 'Sony', usedPrice: 45 }
          ]
        };
      } else if (request.includes('xbox')) {
        return {
          category: 'xbox',
          emoji: '🎮',
          products: [
            { name: 'Xbox Series X', basePrice: 499, brand: 'Microsoft', usedPrice: 410 },
            { name: 'Xbox Series S', basePrice: 299, brand: 'Microsoft', usedPrice: 220 },
            { name: 'Xbox Wireless Controller', basePrice: 59, brand: 'Microsoft', usedPrice: 35 }
          ]
        };
      } else if (request.includes('gaming') || request.includes('console')) {
        return {
          category: 'gaming',
          emoji: '🎮',
          products: [
            { name: 'Steam Deck 256GB', basePrice: 529, brand: 'Valve', usedPrice: 450 },
            { name: 'ROG Ally Gaming Handheld', basePrice: 699, brand: 'ASUS', usedPrice: 550 },
            { name: 'Gaming Headset', basePrice: 99, brand: 'SteelSeries', usedPrice: 65 }
          ]
        };
      } else {
        // Generic products based on keywords
        return {
          category: 'general',
          emoji: '📦',
          products: [
            { name: userRequest.charAt(0).toUpperCase() + userRequest.slice(1), basePrice: 99, brand: 'Various' },
            { name: `Premium ${userRequest}`, basePrice: 199, brand: 'Top Brand' },
            { name: `Budget ${userRequest}`, basePrice: 49, brand: 'Value Brand' }
          ]
        };
      }
    };

    const productInfo = getProductCategory();
    // Removed retailer names as requested
    const availabilityOptions = ['In Stock', 'Limited Stock', 'Back Ordered', '2-3 in stock'];
    const deliveryOptions = ['Tomorrow', '2-3 days', '3-5 days', 'Next week'];

    // Generate dynamic search results
    const searchResults = {
      search: productInfo.products.map((product, index) => {
        // For Half-Life collectibles, preserve second-hand properties
        if (product.isSecondHand) {
          return {
            title: product.name,
            price: product.basePrice, // Use exact price for collectibles
            shipping: product.shipping,
            availability: 'In Stock',
            authenticity: 'Verified Seller',
            description: `${product.condition} collectible from ${product.seller}`,
            image: product.image,
            deliveryDate: deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)],
            // Preserve second-hand properties
            isSecondHand: product.isSecondHand,
            condition: product.condition,
            seller: product.seller,
            location: product.location
          };
        }
        
        // For the main result, prioritize new items for consumer electronics
        const isMainlyNewProduct = ['gaming', 'phone', 'laptop', 'audio', 'watch'].includes(productInfo.category);
        
        // Main result should be new for consumer electronics, mixed for others
        const isUsed = isMainlyNewProduct ? false : (Math.random() > 0.5 && product.usedPrice);
        const basePrice = isUsed ? product.usedPrice : product.basePrice;
        const priceVariation = isUsed ? Math.floor(Math.random() * 40) - 20 : Math.floor(Math.random() * 50) - 25;
        
        const finalPrice = basePrice + priceVariation;
        const shipping = Math.random() > 0.6 ? Math.floor(Math.random() * 20) : 0;
        
        // Create temporary item to check for coupons
        const tempItem = { price: finalPrice };
        const couponSavings = checkForCoupons(tempItem);
        
        const discountedPrice = couponSavings ? finalPrice - couponSavings.discount : finalPrice;
        
        return {
          title: product.name + (isUsed ? ' (Used - Very Good)' : ''),
          price: discountedPrice,
          originalPrice: couponSavings ? finalPrice : null,
          shipping: shipping,
          availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)],
          authenticity: isUsed ? 'Certified Pre-Owned' : (Math.random() > 0.8 ? 'Certified Refurb' : 'Brand New'),
          description: `${isUsed ? 'Pre-owned' : 'Brand new'} ${product.name.toLowerCase()}`,
          image: product.image || productInfo.emoji,
          deliveryDate: deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)],
          isUsed: isUsed,
          couponApplied: couponSavings ? true : false,
          couponPercentage: couponSavings ? couponSavings.percentage : null,
          // Add metadata for used options count
          hasUsedOptions: !!product.usedPrice,
          usedOptionsCount: product.usedPrice ? Math.floor(Math.random() * 20) + 10 : 0 // Random count between 10-29
        };
      }),
      drop: [
        {
          title: `${productInfo.products[0].name} Limited Drop`,
          price: productInfo.products[0].basePrice + 50,
          shipping: 0,
          availability: "Drops Friday 10AM EST",
          authenticity: "Retail",
          description: "Limited quantities, exclusive colorway",
          image: productInfo.products[0].image || productInfo.emoji,
          deliveryDate: "1-2 weeks"
        }
      ],
      link: [
        {
          title: "Same Item - Better Price Found",
          price: Math.max(50, productInfo.products[0].basePrice - 60),
          shipping: 0,
          availability: "In Stock",
          authenticity: "Verified",
          description: "Same product, better deal found",
          image: productInfo.products[0].image || productInfo.emoji,
          deliveryDate: "Tomorrow"
        }
      ]
    };

    const results = searchResults[type] || searchResults.search;
    
    setTimeout(() => {
      if (results.length === 1) {
        addAutobotMessage("Found it! Here's the best option:", 'search-result', results[0]);
      } else {
        addAutobotMessage(`Found ${results.length} good options. Here are the best matches:`, 'search-results', { results });
      }
    }, 1000);
  };

  const handlePurchaseIntent = (item) => {
    const total = item.price + (item.shipping || 0);
    
    // For new users, first collect customer details, then check funding
    if (userType === 'new') {
      // Check if we have customer details first
      if (!userProfile.name || !userProfile.address) {
        setUserProfile(prev => ({ ...prev, pendingPurchase: item }));
        
        if (!userProfile.name) {
          addAutobotMessage("Great choice! 🎯 To complete your order, I'll need your name.\n\nWhat should I call you?", 'collect-name');
          return;
        } else if (!userProfile.address) {
          addAutobotMessage("Perfect! Now I'll need your shipping address.", 'collect-address');
          return;
        }
      }
      
      // Now check if new user has sufficient funds (after collecting details)
      if (balance < total) {
        setUserProfile(prev => ({ ...prev, pendingPurchase: item }));
        addAutobotMessage("Great! Now to complete your order, you'll need to add funds to your Blink account.", 'funding-required', {
          item,
          total,
          currentBalance: balance,
          requiredAmount: total
        });
        return;
      }
    }
    
    // For returning users, check if we have customer details
    if (userType === 'returning' && (!userProfile.name || !userProfile.address)) {
      setUserProfile(prev => ({ ...prev, pendingPurchase: item }));
      
      if (!userProfile.name) {
        addAutobotMessage("Great choice! 🎯 To complete your order, I'll need your name.\n\nWhat should I call you?", 'collect-name');
        return;
      } else if (!userProfile.address) {
        addAutobotMessage("Perfect! Now I'll need your shipping address.", 'collect-address');
        return;
      }
    }
    
    // We have both name and address - show purchase confirmation
    if (userType === 'returning') {
      // For repeat purchases - offer to reuse previous info
      const shippingMessage = `Perfect! I can ship this to ${userProfile.name} at ${userProfile.address} like last time.\n\n✨ Here's your order:\n\n${item.title}\n\nTotal: $${total} ($${item.price} + $${item.shipping || 0} shipping)\nDelivery: ${item.deliveryDate}\n\nUse same details as before?`;
      
      addAutobotMessage(shippingMessage, 'purchase-confirmation', {
        item,
        total,
        address: userProfile.address,
        name: userProfile.name,
        isRepeatCustomer: true
      });
    } else {
      // New customer with details collected
      const shippingMessage = `✨ Here's your order:\n\n${item.title}\n\nTotal: $${total} ($${item.price} + $${item.shipping || 0} shipping)\nDelivery: ${item.deliveryDate}\nShipping to: ${userProfile.name}, ${userProfile.address}\n\nReady to place your order?`;
      
      addAutobotMessage(shippingMessage, 'purchase-confirmation', {
        item,
        total,
        address: userProfile.address,
        name: userProfile.name,
        isRepeatCustomer: false
      });
    }
  };

  const confirmPurchase = (orderData) => {
    // Check for automatic coupon application
    const couponSavings = checkForCoupons(orderData.item);
    const finalTotal = couponSavings ? orderData.total - couponSavings.discount : orderData.total;
    
    // For new users, check if they need funding first
    if (userType === 'new' && balance < finalTotal) {
      setUserProfile(prev => ({ ...prev, pendingPurchase: orderData.item }));
      addAutobotMessage("To complete your order, you'll need to add funds to your Blink account.", 'funding-required', {
        item: orderData.item,
        total: finalTotal,
        currentBalance: balance,
        requiredAmount: finalTotal
      });
      return;
    }
    
    setBalance(prev => prev - finalTotal);
    setTimeout(() => {
      let successMessage = `🎉 BOOM! You just ordered your ${orderData.item.title}!\n\n📦 **Expect it at your doorstep by Wednesday!**\n\n`;
      
      // Add coupon savings message if applicable
      if (couponSavings) {
        successMessage += `💰 **BTW I saved you ${couponSavings.percentage}% with a coupon code**\n\n`;
      }
      
      successMessage += `I've already expedited your order and it's being prepared for shipment. You're going to absolutely love this - such a solid choice! 🔥\n\n⏰ **Free cancellation until Tuesday 11:59 PM** - but honestly, you're going to want to keep this one!\n\nI'll ping you with tracking info within the hour so you can watch your new treasure make its way to you. Get excited! 🚀`;
      
      addAutobotMessage(successMessage);
    }, 2000);
  };

  const checkForCoupons = (item) => {
    // Simulate finding coupon codes - 30% chance of finding a coupon
    const hasCoupon = Math.random() < 0.3;
    
    if (!hasCoupon) return null;
    
    // Generate random discount between 5% and 25%
    const discountPercentages = [5, 10, 15, 20, 25];
    const percentage = discountPercentages[Math.floor(Math.random() * discountPercentages.length)];
    const discount = Math.round((item.price * percentage) / 100);
    
    return {
      percentage,
      discount,
      code: `SAVE${percentage}` // Example coupon codes
    };
  };

  const handleImageSearch = (imageData, originalMessage) => {
    // First, add the user's uploaded image to the chat
    addUserMessage('', 'image', { imageData });
    
    // Simulate image recognition and product matching
    const recognizedProduct = analyzeImageForProduct(imageData);
    
    setTimeout(() => {
      addAutobotMessage(`Great! I can see the image you shared. Let me analyze it to find this product...`);
      
      setTimeout(() => {
        addAutobotMessage(`Found it! Here's what I identified from your image:`, 'image-product', {
          product: recognizedProduct,
          originalImage: imageData,
          originalMessage: originalMessage
        });
      }, 3000); // Longer delay to simulate image processing
    }, 1000);
  };

  const analyzeImageForProduct = (imageData) => {
    // Simulate AI image recognition - always recognize as Air Jordan 14
    const recognizedProduct = { name: 'Air Jordan 14', category: 'shoes', price: 200, brand: 'Nike' };
    
    return {
      title: 'Air Jordan 14',
      price: recognizedProduct.price + Math.floor(Math.random() * 40) - 20, // Add some price variation
      shipping: Math.random() > 0.6 ? Math.floor(Math.random() * 15) + 5 : 0,
      brand: 'Nike',
      category: 'shoes',
      availability: 'In Stock',
      authenticity: 'Brand New',
      deliveryDate: ['Tomorrow', '2-3 days', '3-5 days'][Math.floor(Math.random() * 3)],
      description: `Classic Nike Air Jordan 14 basketball shoes identified from your image`,
      confidence: Math.floor(Math.random() * 15) + 85 // 85-99% confidence
    };
  };

  const handleUrlPurchase = (url, originalMessage) => {
    // Extract product info from URL
    const productInfo = extractProductFromUrl(url);
    
    setTimeout(() => {
      addAutobotMessage(`Perfect! I can see you want me to buy this item from the link. Let me grab the details...`);
      
      setTimeout(() => {
        addAutobotMessage(`Got it! Here's what I found:`, 'url-product', {
          product: productInfo,
          originalUrl: url,
          originalMessage: originalMessage
        });
      }, 2000);
    }, 1000);
  };

  const extractProductFromUrl = (url) => {
    // Simple product extraction based on URL patterns
    let productName = 'Product from Link';
    let price = Math.floor(Math.random() * 200) + 50; // Random price $50-250
    let brand = 'Various';
    
    // Extract product info from common e-commerce URLs
    if (url.includes('amazon')) {
      productName = 'Amazon Product';
      brand = 'Amazon';
    } else if (url.includes('ebay')) {
      productName = 'eBay Item';
      brand = 'eBay';
    } else if (url.includes('target')) {
      productName = 'Target Product';
      brand = 'Target';
    } else if (url.includes('bestbuy')) {
      productName = 'Best Buy Product';
      brand = 'Best Buy';
    } else if (url.includes('nike')) {
      productName = 'Nike Product';
      brand = 'Nike';
    } else if (url.includes('apple')) {
      productName = 'Apple Product';
      brand = 'Apple';
    }
    
    // Try to extract product name from URL path
    try {
      const urlPath = new URL(url).pathname;
      const segments = urlPath.split('/').filter(segment => segment.length > 0);
      
      // Look for product-like segments (longer than 3 chars, not just numbers/IDs)
      const productSegment = segments.find(segment => 
        segment.length > 3 && 
        !segment.match(/^\d+$/) && 
        segment.includes('-')
      );
      
      if (productSegment) {
        productName = productSegment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    } catch (e) {
      // Fallback if URL parsing fails
    }
    
    return {
      title: productName,
      price: price,
      shipping: Math.random() > 0.5 ? Math.floor(Math.random() * 15) + 5 : 0,
      brand: brand,
      availability: 'In Stock',
      authenticity: 'Verified',
      deliveryDate: ['Tomorrow', '2-3 days', '3-5 days'][Math.floor(Math.random() * 3)],
      description: `Product from external link`,
      url: url
    };
  };

  const handleFundingComplete = (amount, isOptional = false) => {
    setBalance(prev => prev + amount);
    
    if (isOptional) {
      // For optional funding, just acknowledge the addition
      addAutobotMessage(`Perfect! Added $${amount} to your account. Your balance is now $${balance + amount}.`);
    } else {
      // First-time purchase flow - get the pending item details
      const pendingItem = userProfile.pendingPurchase;
      
      if (pendingItem) {
        // Check for automatic coupon application
        const couponSavings = checkForCoupons(pendingItem);
        
        // First message: Detailed purchase success like returning user
        let successMessage = `🎉 BOOM! You just ordered your ${pendingItem.title}!\n\n📦 **Expect it at your doorstep by ${pendingItem.deliveryDate}!**\n\n`;
        
        // Add coupon savings message if applicable
        if (couponSavings) {
          successMessage += `💰 **BTW I saved you ${couponSavings.percentage}% with a coupon code**\n\n`;
        }
        
        successMessage += `I've already expedited your order and it's being prepared for shipment. You're going to absolutely love this - such a solid choice! 🔥\n\n⏰ **Free cancellation until Tuesday 11:59 PM** - but honestly, you're going to want to keep this one!\n\nI'll ping you with tracking info within the hour so you can watch your new treasure make its way to you. Get excited! 🚀`;
        
        addAutobotMessage(successMessage);
        
        // Second message: Offer additional funding for faster future payments
        setTimeout(() => {
          addAutobotMessage(`If you enjoyed this experience and want even faster checkout next time, you can add funds to your Blink account. Send any amount you'd like to the address below:`, 'optional-funding', {
            walletAddress: '0x742d35Cc6644C45532F6c8C1B96d4d67C2bCcE4F'
          });
        }, 3000);
      }
      
      // Clear pending purchase
      setUserProfile(prev => ({
        ...prev,
        pendingPurchase: null
      }));
    }
  };

  const fastForward = () => {
    addAutobotMessage("⏰ *Fast forwarding 20 minutes*\n\nFound some options for you!");
    setTimeout(() => {
      triggerSearchResults(userProfile.currentRequest || 'general items', 'search');
    }, 1500);
  };

  const handleChatMessage = (message) => {
    // Check if message contains an image search
    if (message.startsWith('[IMAGE_SEARCH]')) {
      const imageData = message.replace('[IMAGE_SEARCH]', '');
      handleImageSearch(imageData, message);
      return;
    }
    
    addUserMessage(message);
    
    // Check if message contains a URL - auto-buy feature
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = message.match(urlRegex);
    
    if (urls && urls.length > 0) {
      const url = urls[0];
      handleUrlPurchase(url, message);
      return;
    }
    
    // Check if we're collecting name or address for purchase
    if (userProfile.pendingPurchase) {
      if (!userProfile.name) {
        // Collecting name
        let extractedName = message.trim();
        
        // Handle common response patterns
        const namePatterns = [
          /^call me (.+?)$/i,           // "call me Frank"
          /^my name is (.+?)$/i,        // "my name is Frank"
          /^i'm (.+?)$/i,               // "I'm Frank"
          /^im (.+?)$/i,                // "im Frank" 
          /^it's (.+?)$/i,              // "it's Frank"
          /^its (.+?)$/i,               // "its Frank"
          /^just call me (.+?)$/i,      // "just call me Frank"
          /^you can call me (.+?)$/i    // "you can call me Frank"
        ];
        
        // Try to extract name from common patterns
        for (const pattern of namePatterns) {
          const match = message.match(pattern);
          if (match) {
            extractedName = match[1].trim();
            break;
          }
        }
        
        // Clean up the name
        extractedName = extractedName.replace(/[.,!?]$/, '');
        extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
        
        setUserProfile(prev => ({ ...prev, name: extractedName }));
        
        setTimeout(() => {
          addAutobotMessage(`Perfect, ${extractedName}! Now I'll need your shipping address.`, 'collect-address');
        }, 1000);
        return;
      } else if (!userProfile.address) {
        // Collecting address
        const address = message.trim();
        setUserProfile(prev => ({ 
          ...prev, 
          address: address
        }));
        
        setTimeout(() => {
          addAutobotMessage(`Great! I've got everything I need.`);
          // Process the pending purchase with collected info
          setTimeout(() => {
            setUserProfile(currentProfile => {
              if (currentProfile.pendingPurchase) {
                const pendingItem = currentProfile.pendingPurchase;
                const total = pendingItem.price + (pendingItem.shipping || 0);
                
                // For new users, check funding after collecting details
                if (userType === 'new' && balance < total) {
                  addAutobotMessage("Now to complete your order, you'll need to add funds to your Blink account.", 'funding-required', {
                    item: pendingItem,
                    total: total,
                    currentBalance: balance,
                    requiredAmount: total
                  });
                  return { ...currentProfile }; // Keep pending purchase
                } else {
                  // Sufficient funds or returning user - show purchase confirmation
                  const shippingMessage = `✨ Here's your order:\n\n${pendingItem.title}\n\nTotal: $${total} ($${pendingItem.price} + $${pendingItem.shipping || 0} shipping)\nDelivery: ${pendingItem.deliveryDate}\nShipping to: ${currentProfile.name}, ${address}\n\nReady to place your order?`;
                  
                  addAutobotMessage(shippingMessage, 'purchase-confirmation', {
                    item: pendingItem,
                    total: total,
                    address: address,
                    name: currentProfile.name,
                    isRepeatCustomer: false
                  });
                  return { ...currentProfile, pendingPurchase: null };
                }
              }
              return currentProfile;
            });
          }, 1500);
        }, 1000);
        return;
      }
    }
    
    // Check for /info command
    if (message.trim() === '/info') {
      setTimeout(() => {
        const totalPurchases = userProfile.purchaseHistory.length;
        const infoMessage = `📊 **Your Account Info**\n\n💰 **Balance:** $${balance}\n👤 **Name:** ${userProfile.name || 'Not provided'}\n📍 **Address:** ${userProfile.address || 'Not provided'}\n👟 **Shoe Size:** ${userProfile.shoeSize || 'Not provided'}\n👕 **Clothing Size:** ${userProfile.clothingSize || 'Not provided'}\n🛍️ **Total Purchases:** ${totalPurchases}\n💵 **Total Spent:** $${userProfile.totalSpent}\n📅 **Member Since:** ${userProfile.memberSince}\n\n🏷️ **Preferred Brands:** ${userProfile.preferredBrands.join(', ')}\n💡 **Interests:** ${userProfile.interests.join(', ')}`;
        addAutobotMessage(infoMessage);
      }, 1000);
      return;
    }
    
    // Check if we're waiting for size confirmation
    if (waitingForSizeConfirmation) {
      handleSizeConfirmation(message);
      return;
    }
    
    // Check if it's a casual conversation vs shopping request
    const lowerMessage = message.toLowerCase();
    
    // Casual greetings and conversations
    const casualPatterns = [
      /^(hey|hi|hello|yo|sup|what'?s up|how are you|good morning|good afternoon|good evening)/,
      /^(thanks|thank you|cool|nice|awesome|great|perfect|ok|okay)/,
      /^(how do you work|what do you do|who are you|tell me about)/,
      /^(can you help|what can you do|how does this work)/
    ];

    const isCasual = casualPatterns.some(pattern => pattern.test(lowerMessage));
    
    if (isCasual) {
      setTimeout(() => {
        handleCasualConversation(lowerMessage);
      }, 1000);
    } else {
      // Treat as shopping request
      const category = getProductCategoryName(lowerMessage);
      setTimeout(() => {
        const contextualMsg = getContextualMessage(category, message);
        addAutobotMessage(contextualMsg);
        
        // For shoes, ask for size confirmation before searching
        if (category === 'shoes') {
          setWaitingForSizeConfirmation(true);
          setPendingShoeSearch(message);
          return;
        }
        
        setTimeout(() => {
          triggerSearchResults(message, 'search');
        }, 2000);
      }, 1000);
    }
  };

  const handleSizeConfirmation = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check if they're confirming the size or providing a different one
    if (lowerMessage.includes('yes') || lowerMessage.includes('yeah') || lowerMessage.includes('sounds good') || lowerMessage.includes('perfect')) {
      // They confirmed the suggested size
      setTimeout(() => {
        addAutobotMessage(`Perfect! Searching for size ${userProfile.shoeSize} shoes now...`);
        setTimeout(() => {
          triggerSearchResults(pendingShoeSearch, 'search');
          setWaitingForSizeConfirmation(false);
          setPendingShoeSearch('');
        }, 2000);
      }, 1000);
    } else if (/\b(\d+(?:\.\d+)?)\b/.test(lowerMessage)) {
      // They provided a different size
      const newSize = lowerMessage.match(/\b(\d+(?:\.\d+)?)\b/)[1];
      setUserProfile(prev => ({ ...prev, shoeSize: newSize }));
      setTimeout(() => {
        addAutobotMessage(`Got it! Updated your size to ${newSize}. Searching now...`);
        setTimeout(() => {
          triggerSearchResults(pendingShoeSearch, 'search');
          setWaitingForSizeConfirmation(false);
          setPendingShoeSearch('');
        }, 2000);
      }, 1000);
    } else {
      // They said something else, ask for clarification
      setTimeout(() => {
        addAutobotMessage(`No worries! What size should I look for? Just tell me the number like "10" or "9.5"`);
      }, 1000);
    }
  };

  const getProductCategoryName = (request) => {
    if (request.includes('half-life') || request.includes('half life') || (request.includes('half') && request.includes('life'))) return 'half-life';
    if (request.includes('lego') || request.includes('star wars') || request.includes('blocks')) return 'lego';
    if (request.includes('monitor') || request.includes('display') || request.includes('screen')) return 'monitor';
    if (request.includes('shoes') || request.includes('sneaker') || request.includes('jordan') || request.includes('nike')) return 'shoes';
    if (request.includes('laptop') || request.includes('macbook') || request.includes('computer')) return 'laptop';
    if (request.includes('headphone') || request.includes('airpods') || request.includes('audio')) return 'audio';
    if (request.includes('phone') || request.includes('iphone') || request.includes('samsung galaxy')) return 'phone';
    if (request.includes('watch') || request.includes('apple watch')) return 'watch';
    // More specific Nintendo Switch detection
    if (request.includes('nintendo') || request.includes('switch')) return 'nintendo-switch';
    // More specific PlayStation detection
    if (request.includes('playstation') || request.includes('ps5') || request.includes('ps4')) return 'playstation';
    // More specific Xbox detection  
    if (request.includes('xbox')) return 'xbox';
    // General gaming (only if no specific console mentioned)
    if (request.includes('gaming') || request.includes('console')) return 'gaming';
    return 'general';
  };

  const handleCasualConversation = (message) => {
    const responses = {
      greetings: [
        "Hey there! 👋 I'm doing great, thanks for asking! I'm basically your go-to for finding and buying the stuff you love.",
        "What's up! 😊 Just here chillin' and ready to help you find some cool stuff. What's on your wishlist?",
        "Hey! I'm good, just been hunting for some sweet deals. What can I help you find today?",
        "Sup! 🤙 Living my best life finding awesome products for people like you. Need anything specific?"
      ],
      
      thanks: [
        "You're so welcome! 😊 That's what I'm here for. Need anything else?",
        "No problem at all! Always happy to help. What else can I find for you?",
        "My pleasure! 🙌 I love helping people find great stuff. Anything else on your mind?",
        "Anytime! That's literally what I live for 😄 Got anything else you want me to hunt down?"
      ],
      
      about: [
        "I'm Blink! 🤖 Think of me as your personal shopping buddy who never sleeps. I find products, compare prices, and can even buy stuff for you instantly.",
        "I'm your go-to for finding cool stuff online! I hunt down the best deals and can even buy things for you. Pretty neat, right?",
        "I'm basically like having a really good friend who's obsessed with finding great deals 😅 Tell me what you want and I'll make it happen!",
        "I'm Blink - basically your best friend for finding awesome stuff! I live to hunt down great products at killer prices. What's something you've been wanting lately?"
      ],
      
      help: [
        "I can help you find literally anything! Just tell me what you're looking for - could be shoes, tech, clothes, whatever. I'll find options and can buy them for you too.",
        "Sure! Just say what you want - like 'find me some AirPods' or 'I need a new laptop' - and I'll hunt down the best options for you. Easy!",
        "I'm super easy to use! Just tell me what you want in normal language. I'll find it, show you options, and can even purchase it if you want. Try me!",
        "Absolutely! Think of me like texting a friend who's really good at shopping. Just say what you need and I'll handle the rest 🛍️"
      ]
    };

    let responseArray;
    if (/^(hey|hi|hello|yo|sup|what'?s up|how are you|good morning|good afternoon|good evening)/.test(message)) {
      responseArray = responses.greetings;
    } else if (/^(thanks|thank you|cool|nice|awesome|great|perfect|ok|okay)/.test(message)) {
      responseArray = responses.thanks;
    } else if (/^(how do you work|what do you do|who are you|tell me about)/.test(message)) {
      responseArray = responses.about;
    } else if (/^(can you help|what can you do|how does this work)/.test(message)) {
      responseArray = responses.help;
    } else {
      responseArray = responses.greetings; // fallback
    }

    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    addAutobotMessage(randomResponse);
  };

  return (
    <div style={{ 
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Header - Fixed at top center */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 1000
      }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: '0 0 6px 0'
        }}>
          Blink - Prototype v1.2
        </h1>
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#666',
          letterSpacing: '0.3px'
        }}>
          <TypingText text="BUY ANYTHING YOU WANT IN A BLINK" delay={100} />
        </div>
      </div>

      {/* Main content - Centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {/* Demo Controls - Outside the phone */}
        <DemoControls 
          onNewUser={initializeNewUser}
          onReturningUser={initializeReturningUser}
          currentUserType={userType}
        />
        
        {/* Phone App Container */}
    <div className="autobot-app" style={{ position: 'relative' }}>
      {/* Fast Forward Button (Prototype Only) */}
      {currentFlow === 'chat' && (
        <div className="fast-forward-btn" onClick={fastForward}>
          ⏭️ Fast Forward 20min
        </div>
      )}
      
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <span className="back-arrow">←</span>
          <div className="autobot-info">
            <div className="autobot-avatar">👻</div>
            <div className="autobot-details">
              <div className="autobot-name">Blink</div>
              <div className="autobot-status">online</div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <Settings size={20} />
          <MoreVertical size={20} />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-container" ref={chatContainerRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onPurchaseIntent={handlePurchaseIntent}
              onConfirmPurchase={confirmPurchase}
              onUserResponse={handleUserResponse}
              userProfile={userProfile}
              onImageClick={(image, title) => setFullscreenImage({ image, title })}
              onWebView={(data) => setWebViewData(data)}
              onFunded={handleFundingComplete}
            />
          ))}
        </AnimatePresence>
        
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Area */}
      {currentFlow === 'onboarding' && (
        <OnboardingInput onSubmit={handleUserResponse} onboardingStep={onboardingStep} />
      )}
      
      {currentFlow === 'chat' && (
          <ChatInput onSubmit={handleChatMessage} />
        )}
      </div>
      
      {/* Web View - Inside the phone */}
      {webViewData ? (
        <AutobotWebView 
          data={webViewData} 
          onClose={() => setWebViewData(null)} 
          onPurchaseIntent={handlePurchaseIntent} 
        />
      ) : null}
      
      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {fullscreenImage && (
          <FullscreenImageViewer 
            image={fullscreenImage.image} 
            title={fullscreenImage.title} 
            onClose={() => setFullscreenImage(null)} 
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

const FullscreenImageViewer = ({ image, title, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      {/* Close button */}
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)'
        }}
      >
        ✕
      </motion.button>
      
      {/* Image */}
      <motion.img
        src={image}
        alt={title}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90%',
          maxHeight: '80%',
          objectFit: 'contain',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
      />
      
      {/* Title */}
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '20px',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
          }}
        >
          {title}
        </motion.div>
      )}
      
      {/* Tap to close hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          marginTop: '10px',
          textAlign: 'center'
        }}
      >
        Tap anywhere to close
      </motion.div>
    </motion.div>
  );
};

const generateUsedOptions = (mainResult) => {
  const conditions = ['Used - Like New', 'Used - Very Good', 'Used - Good', 'Used - Acceptable'];
  const usedOptions = [];
  
  // Extract base product name (remove "Used" suffix if present)
  const baseProductName = mainResult.title.replace(' (Used - Very Good)', '');
  
  // Generate used options based on the count
  for (let i = 0; i < Math.min(mainResult.usedOptionsCount, 15); i++) {
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Base the used price on the main result's price (assuming it's new)
    const usedPriceReduction = 100 + Math.floor(Math.random() * 200); // $100-300 less
    const usedPrice = Math.max(50, mainResult.price - usedPriceReduction);
    
    usedOptions.push({
      ...mainResult,
      title: `${baseProductName} (${condition})`,
      price: usedPrice,
      authenticity: 'Certified Pre-Owned',
      description: `${condition} ${baseProductName.toLowerCase()}`,
      isUsed: true,
      shipping: Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 5 : 0
    });
  }
  
  // Sort by price (cheapest first)
  return usedOptions.sort((a, b) => (a.price + (a.shipping || 0)) - (b.price + (b.shipping || 0)));
};

const AutobotWebView = ({ data, onClose, onPurchaseIntent }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for website feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: '60px',
      left: 0,
      right: 0,
      bottom: '97px',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      borderRadius: '0px',
      zIndex: 100
    }}>
      {isLoading ? (
        // Loading Screen
        <div style={{
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1a1a1a'
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(26, 26, 26, 0.1)',
              borderTop: '4px solid #1a1a1a',
              borderRadius: '50%',
              marginBottom: '24px'
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textAlign: 'center'
            }}
          >
            👻 Blink Store
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              fontSize: '16px',
              opacity: 0.9,
              textAlign: 'center'
            }}
          >
            Loading your products...
          </motion.div>
        </div>
      ) : (
        <>
          {/* Website Header */}
          <div style={{
            background: '#ffffff',
            color: '#1a1a1a',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#6b7280',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '500'
                }}
              >
                ← Back
              </motion.button>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.3px' }}>👻 Blink Store</div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              background: '#f3f4f6',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>
                {data.results.length} items
              </div>
            </div>
      </div>

          {/* Results Content */}
          <div style={{
            height: 'calc(100% - 60px)',
            overflowY: 'auto',
            padding: '20px',
            background: '#fafafa'
          }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {(data.results[0].hasUsedOptions && !data.results[0].isUsed 
            ? generateUsedOptions(data.results[0]) 
            : data.results
          ).map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              {/* Product Image */}
              {result.image && (result.image.startsWith('http') || result.image.includes('PUBLIC_URL') || result.image.startsWith('/')) ? (
                <img 
                  src={result.image} 
                  alt={result.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'contain',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    backgroundColor: '#f9fafb'
                  }}
                />
              ) : (
                <div style={{ 
                  fontSize: '48px', 
                  textAlign: 'center', 
                  marginBottom: '12px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {result.image}
                </div>
              )}

              {/* Product Info */}
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '6px',
                  color: '#1e293b'
                }}>
                  {result.title}
                </h3>
                
                {result.isSecondHand ? (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ color: '#e4a853', fontSize: '13px', fontWeight: '500' }}>
                      📍 {result.location} • {result.condition}
                    </div>
                  </div>
                ) : null}

                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#0f172a',
                  marginBottom: '10px'
                }}>
                  ${result.price} {result.shipping > 0 && (
                    <span style={{ fontSize: '14px', color: '#64748b' }}>
                      + ${result.shipping} shipping
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{
                    backgroundColor: result.availability === 'In Stock' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {result.availability}
                  </span>
                  <span style={{
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}>
                    📦 {result.deliveryDate}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose(); // Close web view first
                  setTimeout(() => {
                    onPurchaseIntent(result); // Then trigger purchase intent in chat
                  }, 300);
                }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: '#1a1a1a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                I want this
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  ${result.price + (result.shipping || 0)}
                </span>
              </motion.button>
            </motion.div>
          ))}
          </div>
          </div>
        </>
      )}
    </div>
  );
};

const DemoControls = ({ onNewUser, onReturningUser, currentUserType }) => {
  return (
    <div className="demo-controls" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      minWidth: '200px'
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
                  Blink - Control Panel
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewUser}
          style={{
            padding: '10px 16px',
            backgroundColor: currentUserType === 'new' ? '#6b46c1' : 'white',
            color: currentUserType === 'new' ? 'white' : '#6b46c1',
            border: `2px solid ${currentUserType === 'new' ? '#6b46c1' : '#e5e7eb'}`,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🆕 New User
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReturningUser}
          style={{
            padding: '10px 16px',
            backgroundColor: currentUserType === 'returning' ? '#6b46c1' : 'white',
            color: currentUserType === 'returning' ? 'white' : '#6b46c1',
            border: `2px solid ${currentUserType === 'returning' ? '#6b46c1' : '#e5e7eb'}`,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          👋 Returning User
        </motion.button>
      </div>

      {currentUserType && (
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center',
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f9fafb',
          borderRadius: '6px'
        }}>
          Current: {currentUserType === 'new' ? 'First-time user' : 'Karim (returning)'}
        </div>
      )}
    </div>
  );
};

const ChatMessage = ({ message, onPurchaseIntent, onConfirmPurchase, onUserResponse, userProfile, onImageClick, onWebView, onFunded }) => {
  const isAutobot = message.type === 'autobot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`message ${isAutobot ? 'autobot-message' : 'user-message'}`}
    >
      <div className="message-bubble">
        {message.special === 'search-result' && (
          <SearchResultCard data={message.data} onPurchaseIntent={onPurchaseIntent} onImageClick={onImageClick} />
        )}
        
        {message.special === 'search-results' && (
          <SearchResultsCard data={message.data} onPurchaseIntent={onPurchaseIntent} onImageClick={onImageClick} onWebView={onWebView} />
        )}
        
        {message.special === 'purchase-confirmation' && (
          <PurchaseConfirmationCard data={message.data} onConfirmPurchase={onConfirmPurchase} />
        )}
        
        {message.special === 'purchase-success' && (
          <PurchaseSuccessCard data={message.data} />
        )}
        
        {message.special === 'credit-setup' && (
          <CreditSetupCard data={message.data} onSubmit={onUserResponse} />
        )}
        
        {message.special === 'funding-required' && (
          <FundingRequiredCard data={message.data} onFunded={onFunded} />
        )}
        
        {message.special === 'optional-funding' && (
          <>
            <div className="message-text">{String(message.content || '')}</div>
            <OptionalFundingCard data={message.data} onFunded={onFunded} />
          </>
        )}
        
        {message.special === 'image-product' && (
          <ImageProductCard data={message.data} onPurchaseIntent={onPurchaseIntent} />
        )}
        
        {message.special === 'url-product' && (
          <UrlProductCard data={message.data} onPurchaseIntent={onPurchaseIntent} />
        )}
        
        {(message.special === 'collect-name' || message.special === 'collect-address') && (
          <div className="message-text">{String(message.content || '')}</div>
        )}
        
        {/* User uploaded image */}
        {message.type === 'user' && message.messageType === 'image' && message.data?.imageData && (
          <div style={{ marginBottom: '8px' }}>
            <img 
              src={message.data.imageData} 
              alt="Uploaded image" 
              onClick={() => onImageClick(message.data.imageData, 'Uploaded Image')}
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '8px',
                cursor: 'pointer',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
        
        {!message.special && message.content && (
          <div className="message-text">{String(message.content || '')}</div>
        )}
        
        <div className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

const SearchResultCard = ({ data, onPurchaseIntent, onImageClick, onViewDetails }) => {
  return (
    <motion.div 
      className="search-result-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        border: '1px solid #e1e5e9'
      }}
    >
      <div className="result-content">
        {/* Use actual image if available, otherwise show placeholder */}
        {data.image && (data.image.startsWith('http') || data.image.includes('PUBLIC_URL') || data.image.startsWith('/')) ? (
          <img 
            src={data.image} 
            alt={data.title}
            style={{ 
              width: '100%', 
              height: '200px', 
              objectFit: 'contain', 
              borderRadius: '8px',
              marginBottom: '16px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer'
            }}
            onClick={() => onImageClick && onImageClick(data.image, data.title)}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '200px', 
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #e0e0e0'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#999', 
              textAlign: 'center',
              padding: '20px'
            }}>
              Product Image
            </div>
          </div>
        )}
        
        <div className="result-info">
          {/* Make product title the biggest headline */}
          <div className="result-title" style={{ 
            fontWeight: '700', 
            fontSize: '22px', 
            marginBottom: '8px',
            color: '#1a1a1a',
            lineHeight: '1.2'
          }}>
            {data.title}
          </div>
          
          {/* Simple delivery text instead of pill */}
          <div style={{ 
            fontSize: '14px', 
            color: '#666'
          }}>
            Get this by {data.deliveryDate.toLowerCase()}
          </div>
          
          {data.isSecondHand && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#e4a853', fontSize: '13px', fontWeight: '500' }}>
                📍 {data.location} • {data.condition}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Show coupon savings if applied */}
      {data.couponApplied && (
        <div style={{ 
          marginTop: '12px', 
          marginBottom: '8px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          <div style={{ color: '#666', textDecoration: 'line-through' }}>
            Was ${data.originalPrice + (data.shipping || 0)}
          </div>
          <div style={{ color: '#28a745', fontWeight: '600', fontSize: '12px' }}>
            ✨ Coupon applied - saved {data.couponPercentage}%!
          </div>
        </div>
      )}

      {/* Make "I want this" the biggest, most prominent button */}
      <div style={{ marginTop: '16px' }}>
        <motion.button
          whileHover={{ backgroundColor: '#006ba6' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPurchaseIntent(data)}
          style={{
            width: '100%',
            padding: '16px 20px',
            backgroundColor: '#0088cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '8px'
          }}
        >
          I want this
          <span style={{
            background: 'rgba(255, 255, 255, 0.25)',
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            ${data.price + (data.shipping || 0)}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const SearchResultsCard = ({ data, onPurchaseIntent, onImageClick, onWebView }) => {

  return (
    <motion.div 
      className="search-results-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{ marginBottom: '8px' }}
    >
      <div className="results-content">

        
        <div className="top-result">
          <SearchResultCard data={data.results[0]} onPurchaseIntent={onPurchaseIntent} onImageClick={onImageClick} />
        </div>
        
        {data.results.length > 1 && (
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <motion.button
              whileHover={{ backgroundColor: '#f8f9fa' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onWebView && onWebView(data)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#666',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '400',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline'
              }}
            >
              {data.results[0].hasUsedOptions && !data.results[0].isUsed 
                ? `Show me used options (${data.results[0].usedOptionsCount})` 
                : `View (${data.results.length}) Options from secondary`}
          </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PurchaseConfirmationCard = ({ data, onConfirmPurchase }) => {
  return (
    <motion.div 
      className="purchase-confirmation-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '8px',
        border: '1px solid #e1e5e9'
      }}
    >
      <div className="confirmation-content">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
          ✨ Ready to order
          </div>
        <div className="order-details" style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>{data.item.title}</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0088cc', marginBottom: '8px' }}>${data.total} total</div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> {String(data.name || '')}, {String(data.address || '')}
          </div>
          <div style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> Arrives {String(data.item?.deliveryDate || '')}
          </div>
        </div>
        
        {/* Telegram-style inline keyboard buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <motion.button
            whileHover={{ backgroundColor: '#006ba6' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfirmPurchase(data)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0088cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🚀 Place Order
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ffffff',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ❌ Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const FundingRequiredCard = ({ data, onFunded }) => {
  const walletAddress = "0x742d35Cc6644C45532F6c8C1B96d4d67C2bCcE4F"; // USDC wallet address
  
  const handleFunding = () => {
    onFunded(data.requiredAmount);
  };

  return (
    <motion.div 
      className="funding-required-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '8px',
        border: '1px solid #e1e5e9'
      }}
    >
      <div className="funding-content">
        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
          Send ${data.requiredAmount} to this USDC address in order to buy:
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '12px', 
          borderRadius: '6px', 
          marginBottom: '16px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '13px', 
            fontFamily: 'monospace', 
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            wordBreak: 'break-all',
            border: '1px solid #e0e0e0',
            color: '#495057'
          }}>
            {walletAddress}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <motion.button
            whileHover={{ backgroundColor: '#0056b3' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log('Opening wallet app...')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Open Wallet App
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: '#0056b3' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFunding}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            I've Sent It
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: '#f3f4f6' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => console.log('Cancelling order...')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Nevermind, cancel order
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const OptionalFundingCard = ({ data, onFunded }) => {
  const walletAddress = data.walletAddress;

  return (
    <motion.div 
      className="optional-funding-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '8px',
        border: '1px solid #e9ecef'
      }}
    >
      <div className="funding-content">
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '12px', 
          borderRadius: '6px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '13px', 
            fontFamily: 'monospace', 
            padding: '10px',
            borderRadius: '4px',
            wordBreak: 'break-all',
            color: '#495057',
            textAlign: 'center'
          }}>
            {walletAddress}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CreditSetupCard = ({ data, onSubmit }) => {
  const handleFundingComplete = () => {
    onSubmit("Funded my account with $100");
  };

  const handleSkip = () => {
    onSubmit("I'll fund later");
  };

  return (
    <motion.div 
      className="credit-setup-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '8px',
        border: '1px solid #e1e5e9'
      }}
    >
      <div className="credit-setup-content">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>
          💰 Fund Your Blink Account
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
          Current balance: ${data.currentBalance}
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px', textAlign: 'center', lineHeight: '1.4' }}>
          Your Blink account is powered by USDC. Add funds so I can automatically buy amazing finds on your behalf.
        </div>
        
        {/* Telegram-style inline keyboard buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          <motion.a
            href="https://buy.stripe.com/test_28o14J9YL6nKaNy8ww"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#006ba6' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFundingComplete}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0088cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block'
            }}
          >
            💎 Add $50 via Stripe
          </motion.a>
          
          <motion.a
            href="https://buy.stripe.com/test_28o14J9YL6nKaNy9AA"
          target="_blank"
          rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#006ba6' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFundingComplete}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0088cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block'
            }}
          >
            🚀 Add $100 via Stripe
          </motion.a>
        </div>
        
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px', textAlign: 'center' }}>
          💡 Tip: Start with $50-100 to cover most unique finds
        </div>
        
        <motion.button
          whileHover={{ backgroundColor: '#f0f0f0' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSkip}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ffffff',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          ⏭️ Skip for now
        </motion.button>
      </div>
    </motion.div>
  );
};

const SearchResultsWebView = ({ data, onPurchaseIntent, onImageClick }) => {
  return (
    <motion.div 
      className="webview-storefront"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="webview-header">
        <span>← All Options</span>
      </div>
      
      <div className="results-list">
        {data.results.map((result, index) => (
          <div key={index} className="result-item" style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e1e5e9', borderRadius: '8px' }}>
            {result.image && (result.image.startsWith('http') || result.image.includes('PUBLIC_URL') || result.image.startsWith('/')) ? (
              <img 
                src={result.image} 
                alt={result.title}
                onClick={() => onImageClick && onImageClick(result.image, result.title)}
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  objectFit: 'contain', 
                  borderRadius: '6px',
                  marginBottom: '8px',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer'
                }}
              />
            ) : (
              <div className="result-image" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '8px' }}>{result.image}</div>
            )}
            <div className="result-details">
              <div className="result-title" style={{ fontWeight: '600', marginBottom: '4px' }}>{result.title}</div>
              <div className="result-retailer" style={{ color: '#666', fontSize: '14px' }}>{result.retailer}</div>
              <div className="result-price" style={{ fontWeight: '600', color: '#0088cc', marginTop: '4px' }}>${result.price + (result.shipping || 0)}</div>
              <div className="result-availability" style={{ fontSize: '12px', color: '#666' }}>{result.availability}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPurchaseIntent(result)}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '10px',
                backgroundColor: '#0088cc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              I want this
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                ${result.price + (result.shipping || 0)}
              </span>
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ImageProductCard = ({ data, onPurchaseIntent }) => {
  const product = data.product;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="image-product-card"
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '8px',
        border: '1px solid #e1e5e9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Original uploaded image */}
        <div style={{ flex: '0 0 80px' }}>
          <img 
            src={data.originalImage} 
            alt="Uploaded image"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #e1e5e9'
            }}
          />
          <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '4px' }}>
            Your image
          </div>
        </div>

        {/* Product details */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#2c3e50' }}>
            {product.title}
          </div>
          
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            {product.description}
          </div>
          
          <div style={{ fontSize: '12px', color: '#28a745', marginBottom: '8px' }}>
            ✓ {product.confidence}% match confidence
          </div>
          
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
            {product.availability} • {product.authenticity}
          </div>
          
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Get this by {product.deliveryDate.toLowerCase()}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #f1f3f4', paddingTop: '12px', marginTop: '12px' }}>
        <motion.button
          whileHover={{ backgroundColor: '#0056b3' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPurchaseIntent(product)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          I want this - ${product.price}
        </motion.button>
      </div>
    </motion.div>
  );
};

const UrlProductCard = ({ data, onPurchaseIntent }) => {
  const product = data.product;
  
  return (
    <motion.div 
      className="url-product-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '8px',
        border: '1px solid #e1e5e9'
      }}
    >
      <div className="url-product-content">
        {/* URL Link Display */}
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginBottom: '12px',
          backgroundColor: '#f8f9fa',
          padding: '8px',
          borderRadius: '6px',
          wordBreak: 'break-all'
        }}>
          🔗 {data.originalUrl}
        </div>
        
        {/* Product Info */}
        <div className="product-info">
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            {product.title}
          </div>
          
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0088cc', marginBottom: '8px' }}>
            ${product.price} {product.shipping > 0 && `+ $${product.shipping} shipping`}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px' 
            }}>
              {product.availability}
            </span>
            <span style={{ 
              backgroundColor: '#f0f0f0', 
              color: '#666', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px' 
            }}>
              {product.authenticity}
            </span>
            <span style={{ 
              backgroundColor: '#f0f0f0', 
              color: '#666', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px' 
            }}>
              📦 {product.deliveryDate}
            </span>
          </div>
        </div>
        
        {/* Buy Button */}
        <motion.button
          whileHover={{ backgroundColor: '#006ba6' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPurchaseIntent(product)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0088cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          🚀 Buy This Now
          <span style={{
            background: 'rgba(255, 255, 255, 0.25)',
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            ${product.price + (product.shipping || 0)}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const PurchaseSuccessCard = ({ data }) => {
  return (
    <motion.div 
      className="purchase-success-card"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
    >
      <div className="success-header">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          🚀
        </motion.div>
        ORDER SECURED!
      </div>
      
      <div className="success-item">
        ✅ {data.item.title || data.item.name}
      </div>
      
      <div className="success-summary">
        <div>💰 ${data.amountSpent}</div>
        <div className="tracking">Track: {data.trackingNumber}</div>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 0',
      marginBottom: '8px'
    }}
  >
    <div style={{ fontSize: '24px' }}>👻</div>
    <div style={{ 
      display: 'flex', 
      gap: '2px',
      alignItems: 'center',
      background: '#f3f4f6',
      padding: '8px 12px',
      borderRadius: '18px',
      borderBottomLeftRadius: '4px'
    }}>
      <motion.span 
        animate={{ opacity: [0.3, 1, 0.3] }} 
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        style={{ fontSize: '16px', color: '#6b7280' }}
      >
        •
      </motion.span>
      <motion.span 
        animate={{ opacity: [0.3, 1, 0.3] }} 
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        style={{ fontSize: '16px', color: '#6b7280' }}
      >
        •
      </motion.span>
      <motion.span 
        animate={{ opacity: [0.3, 1, 0.3] }} 
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        style={{ fontSize: '16px', color: '#6b7280' }}
      >
        •
      </motion.span>
    </div>
  </motion.div>
);

const OnboardingInput = ({ onSubmit, onboardingStep }) => {
  const [value, setValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSearch(file);
    }
  };

  const handleImageSearch = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      onSubmit(`[IMAGE_SEARCH]${imageDataUrl}`);
    };
    reader.readAsDataURL(imageFile);
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleImageSearch(file);
          }
          break;
        }
      }
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(true);
    // Simulate voice note about Star Wars Lego collectibles
    setTimeout(() => {
      onSubmit("I'm looking for some Star Wars Lego collectibles");
      setIsVoiceActive(false);
    }, 1500); // Simulate recording time
  };

  return (
    <div className="onboarding-input">
      <form onSubmit={handleSubmit} className="input-form" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e1e5e9'
      }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPaste={handlePaste}
          placeholder="What are you looking for?"
          className="message-input"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            backgroundColor: 'transparent'
          }}
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {/* Image upload button */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="image-btn"
            style={{
              background: 'transparent',
              color: '#999',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Upload image"
          >
            <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 2.5H1.5V9.18933L2.96966 7.71967L3.18933 7.5H3.49999H6.63001H6.93933L6.96966 7.46967L10.4697 3.96967L11.5303 3.96967L14.5 6.93934V2.5ZM8.00066 8.55999L9.53034 10.0897L10.0607 10.62L9.00001 11.6807L8.46968 11.1503L6.31935 9H3.81065L1.53032 11.2803L1.5 11.3106V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H13.5C14.0523 13.5 14.5 13.0523 14.5 12.5V9.06066L11 5.56066L8.03032 8.53033L8.00066 8.55999ZM4.05312e-06 10.8107V12.5C4.05312e-06 13.8807 1.11929 15 2.5 15H13.5C14.8807 15 16 13.8807 16 12.5V9.56066L16.5607 9L16.0303 8.46967L16 8.43934V2.5V1H14.5H1.5H4.05312e-06V2.5V10.6893L-0.0606689 10.75L4.05312e-06 10.8107Z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            type="button"
            onClick={handleVoiceToggle}
            className="voice-btn"
            style={{
              background: isVoiceActive ? '#ff4444' : 'transparent',
              color: isVoiceActive ? 'white' : '#999',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Voice message"
          >
            <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.50098 1.5H7.50098C6.67255 1.5 6.00098 2.17157 6.00098 3V7C6.00098 7.82843 6.67255 8.5 7.50098 8.5H8.50098C9.32941 8.5 10.001 7.82843 10.001 7V3C10.001 2.17157 9.32941 1.5 8.50098 1.5ZM7.50098 0C5.84412 0 4.50098 1.34315 4.50098 3V7C4.50098 8.65685 5.84412 10 7.50098 10H8.50098C10.1578 10 11.501 8.65685 11.501 7V3C11.501 1.34315 10.1578 0 8.50098 0H7.50098ZM7.25098 13.2088V15.25V16H8.75098V15.25V13.2088C11.5607 12.8983 13.8494 10.8635 14.5383 8.18694L14.7252 7.46062L13.2726 7.08673L13.0856 7.81306C12.5028 10.0776 10.4462 11.75 8.00098 11.75C5.55572 11.75 3.49918 10.0776 2.91633 7.81306L2.72939 7.08673L1.27673 7.46062L1.46368 8.18694C2.15258 10.8635 4.44128 12.8983 7.25098 13.2088Z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            type="submit" 
            className="send-btn"
            style={{
              background: value.trim() ? '#007bff' : '#f1f3f4',
              color: value.trim() ? 'white' : '#9aa0a6',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: value.trim() ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              fontSize: '16px'
            }}
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
};

const ChatInput = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(true);
    // Simulate voice note about Star Wars Lego collectibles
    setTimeout(() => {
      onSubmit("I'm looking for some Star Wars Lego collectibles");
      setIsVoiceActive(false);
    }, 1500); // Simulate recording time
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSearch(file);
    }
  };

  const handleImageSearch = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      onSubmit(`[IMAGE_SEARCH]${imageDataUrl}`);
    };
    reader.readAsDataURL(imageFile);
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleImageSearch(file);
          }
          break;
        }
      }
    }
  };

  return (
    <div className="chat-input">
      <form onSubmit={handleSubmit} className="input-form">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={handlePaste}
        placeholder="What do you want?"
        className="message-input"
          style={{ 
            flex: 1, 
            fontSize: '16px',
            fontWeight: '500'
          }}
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        {/* Compact action buttons */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          {/* Image upload button */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="image-btn"
            style={{
              background: 'transparent',
              color: '#999',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Upload image"
          >
            <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 2.5H1.5V9.18933L2.96966 7.71967L3.18933 7.5H3.49999H6.63001H6.93933L6.96966 7.46967L10.4697 3.96967L11.5303 3.96967L14.5 6.93934V2.5ZM8.00066 8.55999L9.53034 10.0897L10.0607 10.62L9.00001 11.6807L8.46968 11.1503L6.31935 9H3.81065L1.53032 11.2803L1.5 11.3106V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H13.5C14.0523 13.5 14.5 13.0523 14.5 12.5V9.06066L11 5.56066L8.03032 8.53033L8.00066 8.55999ZM4.05312e-06 10.8107V12.5C4.05312e-06 13.8807 1.11929 15 2.5 15H13.5C14.8807 15 16 13.8807 16 12.5V9.56066L16.5607 9L16.0303 8.46967L16 8.43934V2.5V1H14.5H1.5H4.05312e-06V2.5V10.6893L-0.0606689 10.75L4.05312e-06 10.8107Z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            type="button"
            onClick={handleVoiceToggle}
            className="voice-btn"
            style={{
              background: isVoiceActive ? '#ff4444' : 'transparent',
              color: isVoiceActive ? 'white' : '#999',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Voice message"
          >
            <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.50098 1.5H7.50098C6.67255 1.5 6.00098 2.17157 6.00098 3V7C6.00098 7.82843 6.67255 8.5 7.50098 8.5H8.50098C9.32941 8.5 10.001 7.82843 10.001 7V3C10.001 2.17157 9.32941 1.5 8.50098 1.5ZM7.50098 0C5.84412 0 4.50098 1.34315 4.50098 3V7C4.50098 8.65685 5.84412 10 7.50098 10H8.50098C10.1578 10 11.501 8.65685 11.501 7V3C11.501 1.34315 10.1578 0 8.50098 0H7.50098ZM7.25098 13.2088V15.25V16H8.75098V15.25V13.2088C11.5607 12.8983 13.8494 10.8635 14.5383 8.18694L14.7252 7.46062L13.2726 7.08673L13.0856 7.81306C12.5028 10.0776 10.4462 11.75 8.00098 11.75C5.55572 11.75 3.49918 10.0776 2.91633 7.81306L2.72939 7.08673L1.27673 7.46062L1.46368 8.18694C2.15258 10.8635 4.44128 12.8983 7.25098 13.2088Z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            type="submit" 
            className="send-btn"
            style={{
              background: '#0088cc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
};

export default AutobotApp;