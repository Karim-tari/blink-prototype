import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, MoreVertical, MapPin, Clock, Plus, Camera, Mic, ExternalLink, Phone, List, DollarSign } from 'lucide-react';
import Lottie from 'lottie-react';
import falAI from './services/falai';
import PushNotificationFlow from './PushNotificationFlow';
import LandingPage from './LandingPage';
import ProductComponentTest from './ProductComponentTest';
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

const TypingText = ({ text, delay = 50, style = {}, startTyping = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (startTyping && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay, startTyping]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, startTyping]);

  return (
    <span style={style}>
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
  
  // Check URL to determine user flow
  const currentPath = window.location.pathname;
  const isNewUserPath = currentPath.includes('/new-user') || currentPath.includes('new-user');
  const isPushNotificationPath = currentPath.includes('/push-notifications') || currentPath.includes('push-notifications');
  const isReturningUserPath = currentPath.includes('/returning-user') || currentPath.includes('returning-user');
  const isSubscriptionFlowPath = currentPath.includes('/subscription-flow') || currentPath.includes('subscription-flow');
  const isTasteDiscoveryPath = currentPath.includes('/taste-discovery') || currentPath.includes('taste-discovery');
  const isProductTestPage = currentPath.includes('/product-test') || currentPath.includes('product-test');
  const isLandingPage = currentPath === '/' || currentPath === '/blink-prototype' || currentPath === '/blink-prototype/' || currentPath.endsWith('/blink-prototype');
  
  // Load FBS Machro fonts dynamically
  useEffect(() => {
    const loadFonts = () => {
      // Create font face for regular
      const fontFaceRegular = new FontFace('FBS Machro', `url(${process.env.PUBLIC_URL}/FBS-Machro-Regular.otf)`);
      const fontFaceSlant = new FontFace('FBS Machro', `url(${process.env.PUBLIC_URL}/FBS-Machro-Slant.otf)`, { style: 'italic' });
      
      // Load fonts
      fontFaceRegular.load().then((font) => {
        document.fonts.add(font);
      }).catch((error) => {
        console.warn('Failed to load FBS Machro Regular font:', error);
      });
      
      fontFaceSlant.load().then((font) => {
        document.fonts.add(font);
      }).catch((error) => {
        console.warn('Failed to load FBS Machro Slant font:', error);
      });
    };
    
    loadFonts();
  }, []);
  const [currentFlow, setCurrentFlow] = useState('chat');
  const [userType, setUserType] = useState(
    isNewUserPath ? 'new' : 
    isReturningUserPath ? 'returning' :
    isPushNotificationPath ? 'returning' :
    isSubscriptionFlowPath ? 'subscription' :
    isTasteDiscoveryPath ? 'taste-discovery' :
    'landing' // Landing page doesn't need a user type
  ); // 'new', 'returning', 'subscription', 'taste-discovery', or 'landing'
  const [showPushNotification, setShowPushNotification] = useState(isPushNotificationPath);
  const [isFromPushNotification, setIsFromPushNotification] = useState(false);
  const [balance, setBalance] = useState(isNewUserPath ? 0 : isSubscriptionFlowPath ? 200 : isTasteDiscoveryPath ? 100 : 150);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState(
    isNewUserPath ? {
      name: '',
      email: '',
      phone: '',
      interests: [],
      shoeSize: '',
      clothingSize: '',
      pantsSize: '',
      address: '',
      preferences: {
        prefersFastShipping: true,
        maxBudget: 500,
        brandsToAvoid: []
      },
      purchaseHistory: [],
      lastPurchasedShoes: '',
      lastPurchasedLaptop: '',
      preferredBrands: [],
      favoriteBrands: {
        sneakers: [],
        tech: [],
        clothing: []
      },
      totalSpent: 0,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } : isSubscriptionFlowPath ? {
      name: 'Alex',
      email: 'alex@example.com',
      phone: '+1 (555) 987-6543',
      interests: ['fitness', 'nutrition', 'health'],
      shoeSize: '11',
      clothingSize: 'L',
      pantsSize: '34x32',
      address: '1234 Fitness Ave, Los Angeles, CA 90210',
      preferences: {
        prefersFastShipping: true,
        maxBudget: 300,
        brandsToAvoid: []
      },
      purchaseHistory: [
        { item: 'Optimum Nutrition Gold Standard Whey Protein', date: 'Just now', price: 45 },
        { item: 'Nike Training Shoes', date: '1 week ago', price: 120 },
        { item: 'Resistance Bands Set', date: '2 weeks ago', price: 25 }
      ],
      lastPurchasedShoes: 'Nike Training Shoes',
      lastPurchasedSupplement: 'Optimum Nutrition Gold Standard Whey Protein',
      preferredBrands: ['Optimum Nutrition', 'Nike', 'Under Armour', 'Dymatize'],
      favoriteBrands: {
        fitness: ['Nike', 'Under Armour', 'Adidas'],
        nutrition: ['Optimum Nutrition', 'Dymatize', 'BSN'],
        health: ['Nature Made', 'Garden of Life']
      },
      totalSpent: 190,
      memberSince: 'January 2024'
    } : isTasteDiscoveryPath ? {
      name: 'Jordan',
      email: 'jordan@example.com',
      phone: '+1 (555) 456-7890',
      interests: ['style', 'fashion', 'discovery'],
      shoeSize: '9.5',
      clothingSize: 'M',
      pantsSize: '32x30',
      address: '456 Style Street, New York, NY 10001',
      preferences: {
        prefersFastShipping: true,
        maxBudget: 400,
        brandsToAvoid: []
      },
      purchaseHistory: [],
      lastPurchasedShoes: '',
      lastPurchasedClothing: '',
      preferredBrands: [],
      favoriteBrands: {
        sneakers: [],
        streetwear: [],
        basics: []
      },
      totalSpent: 0,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      tasteProfile: {
        discoveredBrands: [],
        styleContext: '',
        favoriteColors: [],
        stylePreference: '', // 'bold' or 'classic'
        footwearPreference: '', // 'sneakers', 'boots', etc.
        currentStep: 'brands' // Track where we are in the discovery flow
      }
    } : {
      // Default returning user profile (Karim)
      name: 'Karim',
      email: 'karim@example.com',
      phone: '+1 (555) 123-4567',
      interests: ['sneakers', 'tech', 'gaming'],
      shoeSize: '10.5',
      clothingSize: 'M',
      pantsSize: '32x32',
      address: '2847 Oak Street, San Francisco, CA 94115',
      preferences: {
        prefersFastShipping: true,
        maxBudget: 500,
        brandsToAvoid: ['off-brand']
      },
      purchaseHistory: [
        { item: 'Air Jordan 20 Black', date: '2 weeks ago', price: 190 },
        { item: 'AirPods Pro 2nd Gen', date: '1 month ago', price: 249 },
        { item: 'MacBook Pro 14"', date: '3 months ago', price: 1999 }
      ],
      lastPurchasedShoes: 'Air Jordan 20 Black',
      lastPurchasedLaptop: 'MacBook Pro 14"',
      preferredBrands: ['Nike', 'Apple', 'Samsung', 'Sony', 'Adidas', 'Jordan'],
      favoriteBrands: {
        sneakers: ['Nike', 'Jordan', 'Adidas'],
        tech: ['Apple', 'Samsung', 'Sony'],
        clothing: ['Nike', 'Uniqlo', 'Patagonia']
      },
      totalSpent: 2458,
      memberSince: 'March 2024'
    }
  );
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [waitingForSizeConfirmation, setWaitingForSizeConfirmation] = useState(false);
  const [pendingShoeSearch, setPendingShoeSearch] = useState('');
  const [hasInitializedMessages, setHasInitializedMessages] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [webViewData, setWebViewData] = useState(null);
  const [creditCardFundingData, setCreditCardFundingData] = useState(null);
  const [recentCompliments, setRecentCompliments] = useState([]);
  const [userImage, setUserImage] = useState(null); // Store user's image for virtual try-on
  const [activeOrder, setActiveOrder] = useState(null); // Track current order for modifications
  const [waitingForZip, setWaitingForZip] = useState(false); // Track if we're waiting for ZIP code
  const [userZip, setUserZip] = useState(''); // Store user's ZIP code
  const [waitingForSelfie, setWaitingForSelfie] = useState(false); // Track if we're waiting for user's selfie
  const [pendingSelfieItems, setPendingSelfieItems] = useState(null); // Track items for contextual selfie
  const chatContainerRef = useRef(null);

  // Enhanced Compliment Engine with Brand Intelligence
  const generateCompliment = (item, context = {}) => {
    const brandSpecificCompliments = {
      // Streetwear
      'kith': [
        `Good eye. Kith nails classic and modern.`,
        `Strong Kith pick. They balance staples with standout pieces.`,
        `Nice choice. Kith always delivers on quality.`
      ],
      'supreme': [
        `Supreme collabs move fast. Smart grab.`,
        `Good call. Supreme pieces hold their value.`,
        `Clean Supreme pickup.`
      ],
      'fear of god': [
        `Fear of God staples hold up season after season.`,
        `Smart pick. FOG cuts are always clean.`,
        `Good taste. Fear of God never misses.`
      ],
      'ald': [
        `Good eye. ALD nails classic and modern.`,
        `Strong ALD pick. Their cuts are always sharp.`,
        `Nice choice. Aimé Leon Dore keeps it refined.`
      ],
      
      // Sneakers
      'nike': [
        `Strong Nike pick. Their collabs move quick.`,
        `Good call. Nike colorways like this vanish fast.`,
        `Clean Nike pickup. You'll get a lot of wear.`
      ],
      'jordan': [
        `Smart Jordan grab. These don't sit long.`,
        `Good eye. Jordan retros are always solid.`,
        `Strong pick. Jordan quality speaks for itself.`
      ],
      'new balance': [
        `Good taste. New Balance comfort is unmatched.`,
        `Smart NB pick. Their collabs are getting harder to find.`,
        `Clean choice. New Balance quality is consistent.`
      ],
      
      // Luxury
      'jacquemus': [
        `Love that. Jacquemus cuts stand out without trying.`,
        `Good eye. Jacquemus silhouettes are always fresh.`,
        `Smart pick. Jacquemus pieces are conversation starters.`
      ],
      'prada': [
        `Refined taste. Prada tailoring is sharp.`,
        `Good call. Prada craftsmanship is unmatched.`,
        `Clean Prada pick. Timeless and modern.`
      ],
      
      // Basics
      'cos': [
        `Smart move. COS staples get the most wear.`,
        `Good eye. COS keeps it minimal but elevated.`,
        `Clean choice. COS quality for the price is solid.`
      ],
      'toteme': [
        `Sharp pick. Toteme keeps it minimal but elevated.`,
        `Good taste. Toteme cuts are always clean.`,
        `Smart choice. Toteme pieces work with everything.`
      ]
    };

    const categoryCompliments = {
      wearables: [
        `You'll look great in this.`,
        `Clean look, very you.`,
        `Sharp pickup, I love this fit.`,
        `Good taste.`,
        `Clean pickup.`,
        `Smart choice.`
      ],
      collectibles: [
        `Strong add to your collection.`,
        `Clean pickup for your shelf.`,
        `Good call, this one is hard to get.`,
        `Smart grab for your collection.`,
        `Nice find.`
      ],
      electronics: [
        `Perfect timing, these go quickly.`,
        `Smart pickup, you'll use this a lot.`,
        `Good call, this one sells fast.`,
        `Clean choice.`,
        `Smart grab.`
      ],
      subscriptions: [
        `Smart move, this keeps you stocked.`,
        `Good call, no more running out.`,
        `Nice choice, this will keep things easy.`,
        `Smart pickup for consistency.`
      ]
    };

    // Determine item category
    const getItemCategory = (item) => {
      const title = item.title?.toLowerCase() || '';
      const category = item.category?.toLowerCase() || '';
      
      if (title.includes('hoodie') || title.includes('shirt') || title.includes('jacket') || 
          title.includes('pants') || title.includes('shoes') || title.includes('sneaker') ||
          category.includes('clothing') || category.includes('fashion')) {
        return 'wearables';
      }
      if (title.includes('lego') || title.includes('figure') || title.includes('collectible') ||
          title.includes('card') || title.includes('toy')) {
        return 'collectibles';
      }
      if (title.includes('laptop') || title.includes('phone') || title.includes('headphone') ||
          title.includes('monitor') || title.includes('console') || category.includes('electronics')) {
        return 'electronics';
      }
      if (title.includes('subscription') || title.includes('monthly') || category.includes('subscription')) {
        return 'subscriptions';
      }
      return 'wearables'; // default
    };

    const itemCategory = getItemCategory(item);
    const brandKey = item.brand?.toLowerCase() || '';
    
    // Try brand-specific compliment first
    if (brandSpecificCompliments[brandKey]) {
      const brandCompliments = brandSpecificCompliments[brandKey].filter(
        comp => !recentCompliments.includes(comp)
      );
      
      if (brandCompliments.length > 0) {
        const compliment = brandCompliments[Math.floor(Math.random() * brandCompliments.length)];
        setRecentCompliments(prev => [...prev.slice(-4), compliment]);
        return compliment;
      }
    }
    
    // Fall back to category compliments
    const categoryOptions = categoryCompliments[itemCategory] || categoryCompliments.wearables;
    const availableCompliments = categoryOptions.filter(
      comp => !recentCompliments.includes(comp)
    );
    
    const finalCompliments = availableCompliments.length > 0 ? availableCompliments : categoryOptions;
    const compliment = finalCompliments[Math.floor(Math.random() * finalCompliments.length)];
    
    // Track this compliment
    setRecentCompliments(prev => [...prev.slice(-4), compliment]);
    
    return compliment;
  };

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
        { item: 'Air Jordan 20 Black', date: '2 weeks ago', price: 190 },
        { item: 'AirPods Pro 2nd Gen', date: '1 month ago', price: 249 },
        { item: 'MacBook Pro 14"', date: '3 months ago', price: 1999 }
      ],
      lastPurchasedShoes: 'Air Jordan 20 Black',
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
      if (userType === 'new') {
        setTimeout(() => {
          const newUserMessage = `I can buy anything for you on the internet. Send me a link, a photo, or tell me what you want.`;
          addAutobotMessage(newUserMessage);
          setHasInitializedMessages(true);
        }, 1000);
      } else if (currentFlow === 'chat' && userType === 'returning') {
        setTimeout(() => {
          if (isFromPushNotification) {
            // Coming from push notification - show Ed Sheeran message and hoodies immediately
            addAutobotMessage("Big news, Jessica! Ed Sheeran just dropped brand-new merch. We have them all in Medium - perfect for you! 🎵");
            setHasInitializedMessages(true);
            
            // Automatically show EdSheeran hoodies after a short delay
            setTimeout(() => {
              triggerSearchResults("Ed Sheeran hoodies", "search");
            }, 1000);
          } else {
            // Normal returning user flow
            addAutobotMessage(`Hey Karim! 👋 Welcome back!\n\nHope you're enjoying your new Les Paul guitar from yesterday! You picked a great one! 🎸\n\nTell me what's on your mind? Anything else you're hunting for today?`);
            setHasInitializedMessages(true);
          }
        }, 1000);
      } else if (currentFlow === 'chat' && userType === 'subscription') {
        // Subscription flow - simulate completed protein powder order
        setTimeout(() => {
          addAutobotMessage("Order complete! Your protein powder will arrive Thursday.");
          setHasInitializedMessages(true);
          
          // Show subscription nudge after 3 seconds
          setTimeout(() => {
            handleSubscriptionNudge({
              item: {
                title: 'Optimum Nutrition Gold Standard Whey Protein',
                category: 'nutrition'
              }
            });
          }, 3000);
        }, 1000);
      } else if (currentFlow === 'chat' && userType === 'taste-discovery') {
        // Taste Discovery flow - start with brand discovery
        setTimeout(() => {
          addAutobotMessage("Hey! I'm here to help you discover your style. Any brands you're into right now?");
          setHasInitializedMessages(true);
        }, 1000);
      }
    }
  }, [currentFlow, onboardingStep, userType, hasInitializedMessages, isFromPushNotification]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handlePushNotificationComplete = () => {
    setShowPushNotification(false);
    setCurrentFlow('chat');
    setUserType('returning');
    setIsFromPushNotification(true);
    // Initialize returning user profile
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
        { item: 'Air Jordan 20 Black', date: '2 weeks ago', price: 190 },
        { item: 'AirPods Pro 2nd Gen', date: '1 month ago', price: 249 },
        { item: 'MacBook Pro 14"', date: '3 months ago', price: 1999 }
      ],
      lastPurchasedShoes: 'Air Jordan 20 Black',
      lastPurchasedLaptop: 'MacBook Pro 14"',
      preferredBrands: ['Nike', 'Apple', 'Samsung', 'Sony'],
      totalSpent: 2458,
      memberSince: 'March 2024'
    });
    
    // Reset messages and let the welcome message logic handle the Ed Sheeran message
    setMessages([]);
    setHasInitializedMessages(false);
  };

  // Show landing page for root path
  if (isLandingPage) {
    return <LandingPage />;
  }

  // Show product test page
  if (isProductTestPage) {
    return <ProductComponentTest />;
  }

  // Show push notification flow if on that path
  if (showPushNotification) {
    return <PushNotificationFlow onComplete={handlePushNotificationComplete} />;
  }

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
        `Perfect! I've got some size ${userProfile.shoeSize} options for you 👟`,
        `Here are some great size ${userProfile.shoeSize} options`,
        `Got some great size ${userProfile.shoeSize} picks!`
      ] : [
        `Shoes! 👟 What size should I look for?`,
        `What size do you need?`,
        `Let me know your shoe size and I'll find options`
      ],
      laptop: [
        `Finding laptops 💻`,
        `Searching for laptop options`,
        `Looking for laptops`
      ],
      phone: [
        `Phone hunting! 📱 What type of phone are you looking for?`,
        `Nice! Any particular brand or features you have in mind?`,
        `Phone shopping! Let me find some great options for you.`
      ],
      audio: [
        `Finding audio gear 🎧`,
        `Searching for headphones`,
        `Looking for audio options`
      ],
      monitor: [
        `Finding monitors 🖥️`,
        `Searching for monitor options`,
        `Looking for displays`
      ],
      watch: [
        `Finding watches ⌚`,
        `Searching for smartwatch options`,
        `Looking for watches`
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
      'kith-jaws': [
        `Kith x Jaws drop! 🦈 This collaboration is fire - let me show you what's available.`,
        `The Kith x Jaws collection! Such a cool collab. Finding the best pieces for you.`,
        `Kith x Jaws! 🦈 This drop has some amazing pieces. Let me pull up the collection.`
      ],
      'ed-sheeran': [
        `Ed Sheeran hoodies! 🎵 These are some cozy pieces from his merch collection.`,
        `Ed Sheeran gear! Love his music and his merch. Let me show you the hoodies.`,
        `Ed Sheeran hoodies! 🎶 Perfect for concerts or just vibing to his music.`
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

  // Funding intent detection - determines if user wants to add funds
  const isFundingIntent = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    
    const fundingKeywords = [
      'fund my account', 'add funds', 'add money', 'fund account', 'top up',
      'reload', 'deposit', 'add balance', 'fund my balance', 'add to balance',
      'put money', 'add cash', 'load money', 'charge my account', 'funding',
      'fund', 'balance', 'money', 'deposit money', 'add credit'
    ];
    
    return fundingKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Subscription intent detection - determines if user wants to set up a subscription
  const isSubscriptionIntent = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    
    const subscriptionKeywords = [
      'subscription', 'subscribe', 'keep me stocked', 'auto order', 'recurring',
      'monthly delivery', 'regular delivery', 'automatic', 'never run out',
      'keep ordering', 'set up delivery', 'monthly order', 'repeat order',
      'auto-ship', 'subscribe me', 'monthly supply', 'regular supply'
    ];
    
    return subscriptionKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Subscription response detection - determines if user is responding to subscription offer
  const isSubscriptionResponse = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    
    const positiveResponses = [
      'yeah', 'yes', 'yep', 'sure', 'go for it', 'sounds good', 'let\'s do it',
      'that works', 'perfect', 'great', 'awesome', 'do it', 'set it up',
      'make it happen', 'go ahead', 'absolutely', 'definitely', 'for sure'
    ];
    
    const negativeResponses = [
      'no', 'nah', 'not now', 'maybe later', 'not interested', 'skip',
      'not right now', 'pass', 'no thanks', 'not today', 'later'
    ];
    
    const isPositive = positiveResponses.some(response => lowerMessage.includes(response));
    const isNegative = negativeResponses.some(response => lowerMessage.includes(response));
    
    return { isPositive, isNegative, isResponse: isPositive || isNegative };
  };

  // Intent detection - determines if user is searching for products or just chatting
  const isProductSearchIntent = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Clear product search indicators
    const productKeywords = [
      'find', 'search', 'look for', 'want', 'need', 'buy', 'get me', 'show me',
      'looking for', 'shopping for', 'interested in', 'can you find',
      'help me find', 'can you help me find',
      'shoes', 'shirt', 'pants', 'jacket', 'hoodie', 'sneakers', 'boots',
      'laptop', 'phone', 'headphones', 'watch', 'bag', 'backpack'
    ];
    
    // Brand names and collections - these are almost always product searches
    const brandNames = [
      'nike', 'adidas', 'apple', 'samsung', 'sony', 'microsoft', 'lego', 'jordan',
      'kith', 'supreme', 'off-white', 'yeezy', 'balenciaga', 'gucci', 'louis vuitton'
    ];
    
    // Collection/drop keywords - strong indicators of product searches
    const collectionKeywords = [
      'collection', 'drop', 'release', 'collab', 'collaboration', 'x ', 'edition',
      'line', 'series', 'capsule', 'launch', 'new drop', 'latest drop'
    ];
    
    // Conversational/dismissive indicators
    const conversationalKeywords = [
      'nah', 'no', 'not now', 'later', 'maybe later', 'skip', 'pass',
      'not interested', 'not right now', 'another time', 'good', 'cool',
      'okay', 'thanks', 'alright', 'sure', 'yeah', 'yep', 'hi', 'hello',
      'how are you', 'what\'s up', 'hey', 'sup', 'yo'
    ];
    
    // Check for brand + collection combinations (very strong indicator)
    const hasBrand = brandNames.some(brand => lowerMessage.includes(brand));
    const hasCollection = collectionKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasBrand && hasCollection) {
      return true; // "kith jaws collection", "nike jordan drop", etc.
    }
    
    // Check for brand names alone (also strong indicator)
    if (hasBrand) {
      // But make sure it's not just a casual mention
      const casualBrandMentions = [
        'i like', 'i love', 'i hate', 'not a fan of', 'what do you think of'
      ];
      const isCasualMention = casualBrandMentions.some(phrase => lowerMessage.includes(phrase));
      if (!isCasualMention) {
        return true; // "kith jaws", "nike air max", etc.
      }
    }
    
    // Check for collection keywords alone
    if (hasCollection) {
      return true; // "new drop", "latest collection", etc.
    }
    
    // Check for conversational patterns first (but only if no product indicators)
    if (conversationalKeywords.some(keyword => lowerMessage.includes(keyword))) {
      // But still check if they're asking for products despite conversational tone
      if (productKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return true; // "nah, but can you find me shoes" should still search
      }
      return false;
    }
    
    // Check for clear product search intent
    if (productKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return true;
    }
    
    // If message is very short and ambiguous, assume conversational
    if (lowerMessage.length < 10 && !hasBrand && !hasCollection) {
      return false;
    }
    
    // Default to product search for longer, specific messages
    return lowerMessage.length > 25;
  };

  // Check if search is for wearable items that would benefit from selfie
  const isWearableSearch = (searchTerm) => {
    const lowerTerm = searchTerm.toLowerCase();
    const wearableKeywords = [
      'shirt', 'shirts', 't-shirt', 'tshirt', 'tee', 'top', 'blouse',
      'hoodie', 'hoodies', 'sweatshirt', 'sweater', 'cardigan',
      'jacket', 'jackets', 'coat', 'blazer', 'vest',
      'pants', 'jeans', 'trousers', 'shorts', 'leggings',
      'dress', 'dresses', 'skirt', 'skirts',
      'shoes', 'sneakers', 'boots', 'sandals', 'heels',
      'hat', 'hats', 'cap', 'caps', 'beanie',
      'jewelry', 'necklace', 'bracelet', 'earrings',
      'bag', 'bags', 'backpack', 'purse', 'handbag',
      'clothes', 'clothing', 'outfit', 'fashion', 'apparel',
      'collection' // Many fashion collections like "kith jaws collection"
    ];
    
    // Also check for known fashion brands/collections that are typically wearable
    const fashionBrands = ['kith', 'supreme', 'off-white', 'yeezy'];
    const hasFashionBrand = fashionBrands.some(brand => lowerTerm.includes(brand));
    
    const hasWearableKeyword = wearableKeywords.some(keyword => lowerTerm.includes(keyword));
    
    console.log('🔍 Wearable Detection:', {
      searchTerm,
      lowerTerm,
      hasWearableKeyword,
      hasFashionBrand,
      result: hasWearableKeyword || hasFashionBrand
    });
    
    return hasWearableKeyword || hasFashionBrand;
  };

  // Comprehensive address validation for shipping
  const validateShippingAddress = (address) => {
    const trimmedAddress = address.trim();
    
    // Basic length check
    if (trimmedAddress.length < 20) {
      return {
        isValid: false,
        error: "Please provide a complete address including street, city, state/province, and postal code."
      };
    }
    
    // Check for required components
    const hasNumbers = /\d/.test(trimmedAddress);
    const hasCommas = trimmedAddress.includes(',') || trimmedAddress.split(/\s+/).length >= 4;
    
    // US ZIP code pattern
    const usZipPattern = /\b\d{5}(-\d{4})?\b/;
    // Canadian postal code pattern
    const canadianPostalPattern = /\b[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d\b/;
    // UK postcode pattern (basic)
    const ukPostcodePattern = /\b[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}\b/;
    
    const hasPostalCode = usZipPattern.test(trimmedAddress) || 
                         canadianPostalPattern.test(trimmedAddress) ||
                         ukPostcodePattern.test(trimmedAddress);
    
    // Common state abbreviations and full names
    const usStates = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];
    
    // Canadian provinces
    const canadianProvinces = [
      'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Northwest Territories', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
    ];
    
    const hasState = usStates.some(state => 
      trimmedAddress.toLowerCase().includes(state.toLowerCase())
    ) || canadianProvinces.some(province => 
      trimmedAddress.toLowerCase().includes(province.toLowerCase())
    );
    
    // Check for common address components
    if (!hasNumbers) {
      return {
        isValid: false,
        error: "Please include a street number in your address."
      };
    }
    
    if (!hasPostalCode) {
      return {
        isValid: false,
        error: "Please include a valid ZIP code or postal code."
      };
    }
    
    if (!hasState && !canadianPostalPattern.test(trimmedAddress)) {
      return {
        isValid: false,
        error: "Please include your state or province."
      };
    }
    
    // Check for common incomplete patterns
    const incompletePatterns = [
      /^[\d\s]+$/, // Only numbers and spaces
      /^[A-Za-z\s]+$/, // Only letters and spaces
      /^\d+\s+[A-Za-z]+\s*$/ // Just number + street name
    ];
    
    if (incompletePatterns.some(pattern => pattern.test(trimmedAddress))) {
      return {
        isValid: false,
        error: "Please provide your complete address including street, city, state, and ZIP code."
      };
    }
    
    return {
      isValid: true,
      address: trimmedAddress
    };
  };

  // Generate conversational responses for non-search messages
  const getConversationalResponse = (message, context = {}) => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Responses for declining selfie
    if (context.waitingForSelfie) {
      const selfieDeclineResponses = [
        "No worries! You can always send a photo later if you want to see how clothes look on you.",
        "That's cool! Just let me know what you're looking for and I'll find some great options.",
        "All good! What can I help you find today?",
        "No problem! Tell me what you're shopping for and I'll get started."
      ];
      return selfieDeclineResponses[Math.floor(Math.random() * selfieDeclineResponses.length)];
    }
    
    // Taste discovery for indecisive users
    if (lowerMessage.includes("don't know") || lowerMessage.includes("not sure") || 
        lowerMessage.includes("anything") || lowerMessage.includes("surprise me") ||
        lowerMessage.includes("what should i") || lowerMessage.includes("help me choose")) {
      
      const tasteDiscoveryQuestions = [
        "Any brands you're into right now?",
        "Are you shopping for something specific, like a date, the office, or just everyday fits?",
        "Do you have favorite colors you wear a lot?",
        "Do you want something bold, or more low-key and classic?",
        "I can show you clean Nike fits, or we could explore newer streetwear labels. What sounds better?"
      ];
      
      return tasteDiscoveryQuestions[Math.floor(Math.random() * tasteDiscoveryQuestions.length)];
    }
    
    // Funding requests in conversational context - handled by main intent detection
    if (lowerMessage.includes('fund') || lowerMessage.includes('add money') || lowerMessage.includes('balance') || 
        lowerMessage.includes('deposit') || lowerMessage.includes('top up') || lowerMessage.includes('reload')) {
      return "Let me help you add funds to your account.";
    }
    
    // Brand mention responses with tracking offer
    if (lowerMessage.includes('kith') || lowerMessage.includes('supreme') || lowerMessage.includes('nike') || 
        lowerMessage.includes('jordan') || lowerMessage.includes('fear of god') || lowerMessage.includes('ald')) {
      return "Nice choice. I'll keep an eye on their drops so you don't have to dig through emails — I'll just send you the pieces worth seeing. What are you looking for from them?";
    }
    
    // General conversational responses
    if (lowerMessage.includes('good') || lowerMessage.includes('cool') || lowerMessage.includes('nice')) {
      return "Glad you think so! What can I help you find today?";
    }
    
    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return "You're welcome! Let me know if you need anything.";
    }
    
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return "Hey! What can I help you find today?";
    }
    
    // Default conversational response
    const generalResponses = [
      "I'm here when you're ready to shop! What are you looking for?",
      "Just let me know what you need and I'll find it for you.",
      "What can I help you find today?",
      "Ready to shop? Tell me what you're looking for!"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  // Compliment engine based on product category
  const getCompliment = (item) => {
    const title = item.title?.toLowerCase() || '';
    const category = item.category?.toLowerCase() || '';
    
    // Determine product type
    const isWearable = title.includes('shirt') || title.includes('hoodie') || title.includes('jacket') || 
                      title.includes('shoes') || title.includes('sneakers') || title.includes('hat') || 
                      title.includes('cap') || title.includes('jeans') || title.includes('pants') ||
                      category.includes('fashion') || category.includes('clothing');
    
    const isCollectible = title.includes('lego') || title.includes('figure') || title.includes('collectible') ||
                         title.includes('card') || title.includes('toy') || category.includes('collectible');
    
    const isElectronics = title.includes('phone') || title.includes('laptop') || title.includes('headphones') ||
                         title.includes('ps5') || title.includes('xbox') || title.includes('switch') ||
                         category.includes('electronics');
    
    if (isWearable) {
      const wearableCompliments = [
        "You'll look great in this!",
        "Clean look, very you.",
        "Sharp pickup, I love this fit.",
        "Sharp look.",
        "Clean fit.",
        "Love this color on you."
      ];
      return wearableCompliments[Math.floor(Math.random() * wearableCompliments.length)];
    } else if (isCollectible) {
      const collectibleCompliments = [
        "Strong add to your collection.",
        "Clean pickup for your shelf.",
        "Good call, this one is hard to get.",
        "Great pickup for your shelf.",
        "Hot release, glad we got it."
      ];
      return collectibleCompliments[Math.floor(Math.random() * collectibleCompliments.length)];
    } else if (isElectronics) {
      const electronicsCompliments = [
        "Perfect timing, these go quickly.",
        "Smart pickup, you'll use this a lot.",
        "Good call, this one sells fast.",
        "Perfect timing.",
        "Smart pickup."
      ];
      return electronicsCompliments[Math.floor(Math.random() * electronicsCompliments.length)];
    } else {
      // General/subscription compliments
      const generalCompliments = [
        "Smart move, this keeps you stocked.",
        "Good call, no more running out.",
        "Nice choice, this will keep things easy.",
        "Smart pickup.",
        "Good call."
      ];
      return generalCompliments[Math.floor(Math.random() * generalCompliments.length)];
    }
  };

  const triggerSearchResults = (userRequest, type) => {
    // Parse user request to determine what they're looking for
    const request = userRequest.toLowerCase();
    
    // Debug logging for selfie detection
    console.log('🔍 triggerSearchResults called:', {
      userRequest,
      type,
      isWearable: isWearableSearch(userRequest),
      hasUserImage: !!userImage
    });
    
    // Debug logging for all searches
    console.log('🔍 Search Debug:', {
      userRequest,
      request,
      type,
      isKithJaws: request.includes('kith jaws') || request.includes('kif jaws') || (request.includes('kith') && request.includes('jaws')),
      isEdSheeran: request.includes('ed sheeran') || request.includes('edsheeran') || (request.includes('ed') && request.includes('sheeran'))
    });
    
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
      } else if (request.includes('kith jaws') || request.includes('kif jaws') || (request.includes('kith') && request.includes('jaws'))) {
        return {
          category: 'kith-jaws',
          emoji: '🦈',
          products: [
            { 
              name: 'Kith x Jaws Vintage Tee', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintage tee.webp`
            },
            { 
              name: 'Kith x Jaws Crewneck', 
              basePrice: 165, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/Crewneck.webp`
            },
            { 
              name: 'Kith x Jaws Cap', 
              basePrice: 65, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/cap.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 2', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee2.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 3', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee3.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 4', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee4.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 5', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee5.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 6', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee6.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 7', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee7.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 8', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee8.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 9', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee9.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 10', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee10.webp`
            },
            { 
              name: 'Kith x Jaws Vintage Tee 11', 
              basePrice: 85, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/vintane tee11.webp`
            },
            { 
              name: 'Kith x Jaws Cap 2', 
              basePrice: 65, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/cap2.webp`
            },
            { 
              name: 'Kith x Jaws Cap 3', 
              basePrice: 65, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/cap3.webp`
            },
            { 
              name: 'Kith x Jaws Poster', 
              basePrice: 45, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/poster.webp`
            },
            { 
              name: 'Kith x Jaws Poster 2', 
              basePrice: 45, 
              brand: 'Kith',
              image: `${process.env.PUBLIC_URL}/Kith Jaws/poster2.webp`
            }
          ]
        };
                } else if (request.includes('ed sheeran') || request.includes('edsheeran') || (request.includes('ed') && request.includes('sheeran')) || (request.includes('sheeran') && request.includes('hoodie'))) {
                  return {
                    category: 'ed-sheeran',
                    emoji: '🎵',
                    products: [
                      {
                        name: 'Tour Collection Tie-dye Hoodie',
                        basePrice: 65, 
                        brand: 'Ed Sheeran Official',
                        image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/+-=÷× (TOUR COLLECTION) Tie-dye Hoodie.jpeg`,
                        size: 'Medium',
                        available: true
                      },
                      {
                        name: 'Flower Head Longsleeve T-Shirt',
                        basePrice: 75, 
                        brand: 'Ed Sheeran Official',
                        image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/Flower Head Longsleeve T-Shirt.jpeg`,
                        size: 'Medium',
                        available: true
                      },
                      {
                        name: 'Orange Tee',
                        basePrice: 55, 
                        brand: 'Ed Sheeran Official',
                        image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/OrangeTee.jpeg`,
                        size: 'Medium',
                        available: true
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
      } else if (request.includes('jordan 20') || request.includes('jordan20') || (request.includes('air jordan') && request.includes('20'))) {
        return {
          category: 'shoes',
          emoji: '👟',
          products: [
            { 
              name: 'Air Jordan 20 Black', 
              basePrice: 190, 
              brand: 'Nike',
              image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`,
              isUsed: false,
              condition: 'Brand New',
              colorVariants: [
                { color: 'Black', image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`, available: true },
                { color: 'Orange', image: `${process.env.PUBLIC_URL}/Jordan20/orange.jpg`, available: true },
                { color: 'Red', image: `${process.env.PUBLIC_URL}/Jordan20/red.jpg.webp`, available: true }
              ]
            },
            { 
              name: 'Air Jordan 20 White/Silver', 
              basePrice: 195, 
              brand: 'Nike',
              image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`, // Using black as placeholder
              isUsed: false,
              condition: 'Brand New',
              colorVariants: [
                { color: 'White/Silver', image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`, available: true },
                { color: 'Black', image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`, available: true }
              ]
            },
            { 
              name: 'Air Jordan 20 Black (Used - Like New)', 
              basePrice: 190, 
              brand: 'Nike',
              usedPrice: 145,
              image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`,
              isUsed: true,
              condition: 'Used - Like New'
            },
            { 
              name: 'Air Jordan 20 White (Used - Very Good)', 
              basePrice: 195, 
              brand: 'Nike',
              usedPrice: 150,
              image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`,
              isUsed: true,
              condition: 'Used - Very Good'
            },
            { 
              name: 'Air Jordan 20 Stealth (Used - Good)', 
              basePrice: 185, 
              brand: 'Nike',
              usedPrice: 135,
              image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`,
              isUsed: true,
              condition: 'Used - Good'
            }
          ]
        };
      } else if (request.includes('shoes') || request.includes('sneaker') || request.includes('jordan') || request.includes('nike')) {
        return {
          category: 'shoes',
          emoji: '👟',
          products: [
            { 
              name: 'Air Jordan 20 Black', 
              basePrice: 190, 
              brand: 'Nike',
              usedPrice: 160,
              image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`,
              colorVariants: [
                { color: 'Black', image: `${process.env.PUBLIC_URL}/Jordan20/black.jpg.webp`, available: true },
                { color: 'Orange', image: `${process.env.PUBLIC_URL}/Jordan20/orange.jpg`, available: true },
                { color: 'Red', image: `${process.env.PUBLIC_URL}/Jordan20/red.jpg.webp`, available: true }
              ]
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
    
    // Debug logging for product info
    console.log('📦 Product Info Debug:', {
      category: productInfo.category,
      productsLength: productInfo.products.length,
      firstProduct: productInfo.products[0]?.name
    });
    
    // Removed retailer names as requested
    const availabilityOptions = ['In Stock', 'Limited Stock', 'Back Ordered', '2-3 in stock'];
    const deliveryOptions = ['Tomorrow', 'Tomorrow', '2 days', 'Next week'];

    // Generate dynamic search results
    const searchResults = {
      search: productInfo.products.map((product, index) => {
        // Debug logging for Kith products
        if (product.name && product.name.includes('Kith')) {
          console.log('🦈 Processing Kith product:', {
            index,
            name: product.name,
            basePrice: product.basePrice,
            image: product.image
          });
        }
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
        
        // Use explicit isUsed property if set, otherwise use the random logic
        const isUsed = product.hasOwnProperty('isUsed') ? product.isUsed : (isMainlyNewProduct ? false : (Math.random() > 0.5 && product.usedPrice));
        
        // Debug logging for transformation
        if (product.name.includes('Jordan 20')) {
          console.log(`🔧 Transforming: ${product.name}, isUsed: ${isUsed}, hasIsUsedProperty: ${product.hasOwnProperty('isUsed')}, originalIsUsed: ${product.isUsed}`);
        }
        const basePrice = isUsed ? (product.usedPrice || product.basePrice) : product.basePrice;
        const priceVariation = isUsed ? Math.floor(Math.random() * 40) - 20 : Math.floor(Math.random() * 50) - 25;
        
        const finalPrice = basePrice + priceVariation;
        const shipping = Math.random() > 0.6 ? Math.floor(Math.random() * 20) : 0;
        
        // Create temporary item to check for coupons
        const tempItem = { price: finalPrice };
        const couponSavings = checkForCoupons(tempItem, isFromPushNotification);
        
        const discountedPrice = couponSavings ? finalPrice - couponSavings.discount : finalPrice;
        
        return {
          title: product.name.includes('Used') ? product.name : product.name + (isUsed ? ' (Used - Very Good)' : ''),
          price: discountedPrice,
          originalPrice: couponSavings ? finalPrice : null,
          shipping: shipping,
          availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)],
          authenticity: isUsed ? 'Certified Pre-Owned' : (Math.random() > 0.8 ? 'Certified Refurb' : 'Brand New'),
          description: `${isUsed ? 'Pre-owned' : 'Brand new'} ${product.name.toLowerCase()}`,
          image: product.image || generatePlaceholderImage(product.name),
          deliveryDate: productInfo.category === 'kith-jaws' ? 'Tomorrow' : deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)],
          isUsed: isUsed,
          condition: product.condition,
          colorVariants: product.colorVariants,
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
          image: productInfo.products[0].image || generatePlaceholderImage(productInfo.products[0].name),
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
          image: productInfo.products[0].image || generatePlaceholderImage(productInfo.products[0].name),
          deliveryDate: "Tomorrow"
        }
      ]
    };

    const results = searchResults[type] || searchResults.search;
    
    // Debug logging for Kith Jaws and Ed Sheeran
    if (userRequest.toLowerCase().includes('kith') || userRequest.toLowerCase().includes('jaws') || userRequest.toLowerCase().includes('ed') || userRequest.toLowerCase().includes('sheeran')) {
      console.log('🦈🎵 Product Debug:', {
        userRequest,
        type,
        productInfoCategory: productInfo.category,
        productInfoProductsLength: productInfo.products.length,
        searchResultsSearchLength: searchResults.search.length,
        resultsLength: results.length,
        firstFewResults: results.slice(0, 5).map(r => r.title),
        allProductNames: productInfo.products.slice(0, 5).map(p => p.name)
      });
    }
    
    setTimeout(async () => {
      // Generate virtual try-on images if user has uploaded a photo (skip EdSheeran for now)
      let finalResults = results;
      const isEdSheeranSearch = request.includes('ed sheeran') || request.includes('edsheeran') || (request.includes('ed') && request.includes('sheeran'));
      
      if (userImage && results.length > 0 && !isEdSheeranSearch) {
        console.log("🎭 User image available, generating virtual try-ons...");
        addAutobotMessage("Let me show you how these would look on you! 🎭", null, null);
        finalResults = await generateVirtualTryOnImages(results, userImage);
      } else if (isEdSheeranSearch) {
        console.log("🎵 EdSheeran search - showing direct images");
      }
      
      if (finalResults.length === 1) {
        const compliment = generateCompliment(finalResults[0]);
        const nudges = ["Want me to grab it now?", "Should I hold this for you?", "Ready to order?"];
        const nudge = nudges[Math.floor(Math.random() * nudges.length)];
        addAutobotMessage("Found it! " + compliment + " " + nudge, 'search-result', finalResults[0]);
        
        // Add contextual selfie offer for wearable items (only if user hasn't uploaded one yet)
        console.log('🔍 Selfie Debug (Single Result):', {
          userRequest,
          isWearable: isWearableSearch(userRequest),
          hasUserImage: !!userImage,
          shouldShowSelfieOffer: isWearableSearch(userRequest) && !userImage
        });
        if (isWearableSearch(userRequest) && !userImage) {
          setTimeout(() => {
            addAutobotMessage("Do you want to see how you look in it? Upload a picture and I'll show you! 📸");
            setWaitingForSelfie(true);
            setPendingSelfieItems([finalResults[0]]); // Store only the single item shown
          }, 2000);
        }
      } else if (finalResults.length <= 3) {
        // Show all results if 3 or fewer, no "View more" button needed
        const message = userImage ? 
          `Found ${finalResults.length} good options with virtual try-on! 🎭` : 
          `Found ${finalResults.length} good options:`;
        addAutobotMessage(message, 'search-results', { results: finalResults, showViewMore: false, searchTerm: userRequest });
        
        // Add contextual selfie offer for wearable items (only if user hasn't uploaded one yet)
        console.log('🔍 Selfie Debug (Multiple Results):', {
          userRequest,
          isWearable: isWearableSearch(userRequest),
          hasUserImage: !!userImage,
          shouldShowSelfieOffer: isWearableSearch(userRequest) && !userImage
        });
        if (isWearableSearch(userRequest) && !userImage) {
          setTimeout(() => {
            addAutobotMessage("Do you want to see how you look in them? Upload a picture and I'll show you! 📸");
            setWaitingForSelfie(true);
            setPendingSelfieItems(finalResults); // Store all items shown (2-3 items)
          }, 2000);
        }
      } else {
        // Show first 3 results with "View more" button for the rest
        const chatResults = finalResults.slice(0, 3);
        const remainingCount = finalResults.length - 3;
        const message = userImage ? 
          `Found ${finalResults.length} good options. Here are the top matches with virtual try-on! 🎭` : 
          `Found ${finalResults.length} good options. Here are the top matches:`;
        addAutobotMessage(message, 'search-results', { 
          results: chatResults, 
          showViewMore: true, 
          remainingCount: remainingCount,
          allResults: finalResults,
          searchTerm: userRequest 
        });
        
        // Add contextual selfie offer for wearable items (only if user hasn't uploaded one yet)
        console.log('🔍 Selfie Debug (Multiple Results):', {
          userRequest,
          isWearable: isWearableSearch(userRequest),
          hasUserImage: !!userImage,
          shouldShowSelfieOffer: isWearableSearch(userRequest) && !userImage
        });
        if (isWearableSearch(userRequest) && !userImage) {
          setTimeout(() => {
            addAutobotMessage("Do you want to see how you look in them? Upload a picture and I'll show you! 📸");
            setWaitingForSelfie(true);
            setPendingSelfieItems(chatResults); // Store only the 3 items actually shown
          }, 2000);
        }
      }
    }, 1000);
  };

  const handlePurchaseIntent = (item) => {
    // Handle group purchase from web view
    if (item.type === 'group-purchase') {
      const { items, totalPrice } = item;
      const subtotalAmount = items.reduce((sum, product) => sum + product.price, 0);
      const shippingTotal = items.reduce((sum, product) => sum + (product.shipping || 8), 0);
      const taxTotal = items.reduce((sum, product) => sum + Math.round(product.price * 0.08), 0);
      const silverFee = Math.round(subtotalAmount * 0.03); // 3% silver tier fee
      const grandTotal = subtotalAmount + shippingTotal + taxTotal + silverFee;
      
      // Create order summary message
      let orderSummary = "🛍️ **Your order is on its way.**\n\n";
      
      items.forEach((product, index) => {
        orderSummary += `${index + 1}. ${product.title}\n`;
        orderSummary += `   $${product.price} + $${product.shipping || 8} shipping\n\n`;
      });
      
      orderSummary += `**Order Total:**\n`;
      orderSummary += `Subtotal: $${subtotalAmount}\n`;
      orderSummary += `Shipping: $${shippingTotal}\n`;
      orderSummary += `Tax: $${taxTotal}\n`;
      orderSummary += `Silver Tier Fee (3%): $${silverFee}\n`;
      orderSummary += `**Total: $${grandTotal}**\n\n`;
      orderSummary += `Estimated delivery: Tomorrow\n`;
      orderSummary += `Just message me if you need to make any changes. You have 3 minutes until the order is placed.`;
      
      const orderData = {
        items,
        subtotal: subtotalAmount,
        shipping: shippingTotal,
        tax: taxTotal,
        silverFee: silverFee,
        total: grandTotal,
        timeLimit: 30,
        originalSearchResults: item.originalSearchResults || items,
        timestamp: Date.now()
      };

      addAutobotMessage(orderSummary, 'group-order-summary', orderData);

      // Set active order for modifications
      setActiveOrder(orderData);

      // Set 3-minute timer for final order confirmation
      setTimeout(() => {
        const itemNames = items.map(item => item.title).join(', ');
        const finalMessage = `🎯 **Order Confirmed!**\n\nYour order for ${itemNames} has been officially placed and is now being processed.\n\n📦 You'll receive tracking details shortly.\n💳 Payment has been processed successfully.\n\nThanks for shopping with Blink! 🚀`;
        addAutobotMessage(finalMessage);
        setActiveOrder(null); // Clear active order after confirmation
      }, 3 * 60 * 1000); // 3 minutes in milliseconds
      
      return;
    }
    
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
          addAutobotMessage("Ready to lock it in? Please give me your full shipping address (street, city, state, ZIP code) and I'll reserve one for you.", 'collect-address');
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
        addAutobotMessage("Ready to lock it in? Please give me your full shipping address (street, city, state, ZIP code) and I'll reserve one for you.", 'collect-address');
        return;
      }
    }
    
    // We have both name and address - create the same detailed order summary as web view
    const shippingTotal = item.shipping || 8;
    const taxTotal = Math.round(item.price * 0.08);
    const silverFee = Math.round(item.price * 0.03); // 3% silver tier fee
    const grandTotal = item.price + shippingTotal + taxTotal + silverFee;
    
    // Create order summary message (same format as web view group purchase)
    let orderSummary = "🛍️ **Your order is on its way.**\n\n";
    orderSummary += `1. ${item.title}\n`;
    orderSummary += `   $${item.price} + $${shippingTotal} shipping\n\n`;
    orderSummary += `**Order Total:**\n`;
    orderSummary += `Subtotal: $${item.price}\n`;
    orderSummary += `Shipping: $${shippingTotal}\n`;
    orderSummary += `Tax: $${taxTotal}\n`;
    orderSummary += `Silver Tier Fee (3%): $${silverFee}\n`;
    orderSummary += `**Total: $${grandTotal}**\n\n`;
    orderSummary += `Estimated delivery: Tomorrow\n`;
    orderSummary += `Just message me if you need to make any changes. You have 3 minutes until the order is placed.`;

    const orderData = {
      items: [item],
      subtotal: item.price,
      shipping: shippingTotal,
      tax: taxTotal,
      silverFee: silverFee,
      total: grandTotal,
      timeLimit: 30,
      originalSearchResults: [item], // Single item as original results
      isSingleItemOrder: true, // Flag to hide Modify Order button
      timestamp: Date.now()
    };

    addAutobotMessage(orderSummary, 'group-order-summary', orderData);

    // Set active order for modifications
    setActiveOrder(orderData);

    // Set 3-minute timer for final order confirmation
    setTimeout(() => {
      const finalMessage = `🎯 **Order Confirmed!**\n\nYour order for ${item.title} has been officially placed and is now being processed.\n\n📦 You'll receive tracking details shortly.\n💳 Payment has been processed successfully.\n\nThanks for shopping with Blink! 🚀`;
      addAutobotMessage(finalMessage);
      setActiveOrder(null); // Clear active order after confirmation
    }, 3 * 60 * 1000); // 3 minutes in milliseconds
  };

  const confirmPurchase = (orderData) => {
    // Check for automatic coupon application
    const couponSavings = checkForCoupons(orderData.item, isFromPushNotification);
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
      // Create order success message with ON ITS WAY styling
      const productSize = orderData.item.size || 'Medium';
      
      // Generate Blink order number
      const brandCode = (orderData.item.brand || orderData.item.retailer || 'GEN').substring(0, 4).toUpperCase();
      const orderNumber = `BL-${brandCode}-${Math.floor(Math.random() * 9000) + 1000}`;
      
      // Get spelled-out arrival day
      const arrivalDate = new Date();
      arrivalDate.setDate(arrivalDate.getDate() + 2); // 2 days from now
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const arrivalDay = dayNames[arrivalDate.getDay()];
      
      addAutobotMessage('', 'order-success', {
        item: orderData.item,
        size: productSize,
        couponSavings: couponSavings,
        total: finalTotal,
        orderNumber: orderNumber,
        arrivalDay: arrivalDay,
        compliment: getCompliment(orderData.item)
      });
      
      // Add 2-minute cancel/change window message
      setTimeout(() => {
        addAutobotMessage(`You have 2 minutes to cancel or make changes. Just message me if you need anything!`);
        
        // Add 1-minute reminder
        setTimeout(() => {
          addAutobotMessage(`Your order will be finalized in 1 minute. Message me now if you need to make any changes!`);
        }, 60000); // 1 minute later
      }, 3000);
    }, 2000);
  };

  const checkForCoupons = (item, disableCoupons = false) => {
    // Don't apply coupons if disabled (e.g., for push notification flow)
    if (disableCoupons) return null;
    
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


  const handleUrlPurchase = (url, originalMessage) => {
    // Extract product info from URL
    const productInfo = extractProductFromUrl(url);
    
    setTimeout(() => {
      addAutobotMessage(`Perfect! I can see you want me to buy this item from the link. Let me grab the details...`);
      
      setTimeout(() => {
        addAutobotMessage(`Got it! Here's the product:`, 'url-product', {
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
      deliveryDate: ['Tomorrow', 'Tomorrow', '2 days'][Math.floor(Math.random() * 3)],
      description: `Product from external link`,
      url: url
    };
  };

  // Handle subscription requests
  const handleSubscriptionRequest = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check if they mentioned a specific product
    let product = 'protein powder'; // default
    if (lowerMessage.includes('protein')) product = 'protein powder';
    else if (lowerMessage.includes('vitamin') || lowerMessage.includes('supplement')) product = 'vitamins';
    else if (lowerMessage.includes('coffee')) product = 'coffee';
    else if (lowerMessage.includes('skincare') || lowerMessage.includes('beauty')) product = 'skincare';
    
    // Special demo trigger - simulate protein powder order completion
    if (lowerMessage.includes('demo subscription') || lowerMessage.includes('test subscription')) {
      // Simulate an order completion first
      setTimeout(() => {
        addAutobotMessage("Order complete! Your protein powder will arrive Thursday.");
        
        // Then show subscription nudge
        setTimeout(() => {
          handleSubscriptionNudge({
            item: {
              title: 'Optimum Nutrition Gold Standard Whey Protein',
              category: 'nutrition'
            }
          });
        }, 2000);
      }, 1000);
      return;
    }
    
    addAutobotMessage(`Perfect! I can set up a ${product} subscription for you. You can skip, change, or cancel any time.`, 'subscription-setup', {
      product: product,
      step: 'initial'
    });
  };

  // Handle subscription nudge after order completion
  const handleSubscriptionNudge = (orderData) => {
    const item = orderData.item;
    const isSubscriptionEligible = item.title?.toLowerCase().includes('protein') || 
                                  item.title?.toLowerCase().includes('vitamin') ||
                                  item.title?.toLowerCase().includes('supplement') ||
                                  item.title?.toLowerCase().includes('coffee') ||
                                  item.category?.toLowerCase().includes('health') ||
                                  item.category?.toLowerCase().includes('nutrition');
    
    if (isSubscriptionEligible) {
      setTimeout(() => {
        addAutobotMessage("Want me to set this up as a subscription so you never run out? You can skip, change, or cancel any time.");
      }, 3000); // Show nudge 3 seconds after order completion
    }
  };

  // Handle subscription setup responses
  const handleSubscriptionSetup = (response, data) => {
    if (response === 'yes') {
      addAutobotMessage(`Perfect! Your ${data.product} subscription is now active. I'll remind you each month before it renews. You can skip, change, or cancel any time.`, 'subscription-confirmation', {
        product: data.product,
        frequency: 'monthly',
        nextDelivery: 'in 30 days'
      });
    } else {
      addAutobotMessage("No problem! You can always set up a subscription later if you change your mind.");
    }
  };

  // Handle subscription nudge responses
  const handleSubscriptionNudgeResponse = (response, data) => {
    if (response === 'yes') {
      addAutobotMessage(`Great! Your ${data.item.title} subscription is now active. I'll remind you each month before it renews. You can skip, change, or cancel any time.`, 'subscription-confirmation', {
        product: data.item.title,
        frequency: 'monthly',
        nextDelivery: 'in 30 days'
      });
    } else {
      addAutobotMessage("No worries! You can always set up a subscription later if you need it.");
    }
  };

  // Handle taste discovery flow responses
  const handleTasteDiscoveryResponse = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    const currentStep = userProfile.tasteProfile?.currentStep || 'brands';

    if (currentStep === 'brands') {
      // Check if they mentioned specific brands
      const mentionedBrands = detectMentionedBrands(message);
      
      if (mentionedBrands.length > 0) {
        // They mentioned brands - compliment and track
        const brandCompliment = getBrandCompliment(mentionedBrands[0]);
        const trackingMessage = `Nice choice. I'll keep an eye on ${mentionedBrands.join(', ')} so you don't have to dig through emails — I'll just send you the pieces worth seeing.`;
        
        setTimeout(() => {
          addAutobotMessage(`${brandCompliment} ${trackingMessage}`);
          
          // Update user profile with discovered brands
          setUserProfile(prev => ({
            ...prev,
            tasteProfile: {
              ...prev.tasteProfile,
              discoveredBrands: mentionedBrands,
              currentStep: 'context'
            }
          }));
          
          // Move to context question with confirmation
          setTimeout(() => {
            addAutobotMessage("Got it, I'm tracking those for you.");
            setTimeout(() => {
              addAutobotMessage("Are you shopping for something specific, like a date, the office, or just everyday fits?");
            }, 1500);
          }, 2000);
        }, 1000);
      } else {
        // No brands mentioned - pivot to context
        setTimeout(() => {
          addAutobotMessage("Are you shopping for something specific, like a date, the office, or just everyday fits?");
          
          setUserProfile(prev => ({
            ...prev,
            tasteProfile: {
              ...prev.tasteProfile,
              currentStep: 'context'
            }
          }));
        }, 1000);
      }
    } else if (currentStep === 'context') {
      // Store context and move to color preferences
      const contextConfirmation = getContextConfirmation(message);
      
      setTimeout(() => {
        addAutobotMessage(contextConfirmation);
        
        setUserProfile(prev => ({
          ...prev,
          tasteProfile: {
            ...prev.tasteProfile,
            styleContext: message,
            currentStep: 'colors'
          }
        }));
        
        setTimeout(() => {
          addAutobotMessage("Do you have favorite colors you wear a lot?");
        }, 1500);
      }, 1000);
    } else if (currentStep === 'colors') {
      // Store colors and move to style preference
      const colors = extractColors(message);
      const colorConfirmation = getColorConfirmation(colors, message);
      
      setTimeout(() => {
        addAutobotMessage(colorConfirmation);
        
        setUserProfile(prev => ({
          ...prev,
          tasteProfile: {
            ...prev.tasteProfile,
            favoriteColors: colors,
            currentStep: 'style'
          }
        }));
        
        setTimeout(() => {
          addAutobotMessage("Do you want something bold, or more low-key and classic?");
        }, 1500);
      }, 1000);
    } else if (currentStep === 'style') {
      // Store style preference and move to footwear
      const stylePreference = lowerMessage.includes('bold') ? 'bold' : 'classic';
      const styleConfirmation = getStyleConfirmation(stylePreference);
      
      setTimeout(() => {
        addAutobotMessage(styleConfirmation);
        
        setUserProfile(prev => ({
          ...prev,
          tasteProfile: {
            ...prev.tasteProfile,
            stylePreference: stylePreference,
            currentStep: 'footwear'
          }
        }));
        
        setTimeout(() => {
          addAutobotMessage("Do you usually go for sneakers, boots, or something else on your feet?");
        }, 1500);
      }, 1000);
    } else if (currentStep === 'footwear') {
      // Store footwear and provide final recommendations
      const footwearConfirmation = getFootwearConfirmation(message);
      
      setTimeout(() => {
        addAutobotMessage(footwearConfirmation);
        
        setUserProfile(prev => ({
          ...prev,
          tasteProfile: {
            ...prev.tasteProfile,
            footwearPreference: message,
            currentStep: 'complete'
          }
        }));
        
        setTimeout(() => {
          const recommendations = generateStyleRecommendations(userProfile.tasteProfile, message);
          addAutobotMessage(recommendations);
        }, 1500);
      }, 1000);
    }
  };

  // Detect mentioned brands in user message
  const detectMentionedBrands = (message) => {
    const lowerMessage = message.toLowerCase();
    const brands = [
      'nike', 'adidas', 'jordan', 'supreme', 'kith', 'fear of god', 'essentials',
      'stone island', 'off-white', 'balenciaga', 'gucci', 'prada', 'uniqlo',
      'cos', 'toteme', 'jacquemus', 'new balance', 'asics', 'vans', 'converse'
    ];
    
    return brands.filter(brand => lowerMessage.includes(brand));
  };

  // Get brand-specific compliment
  const getBrandCompliment = (brand) => {
    const brandCompliments = {
      'nike': "Good eye. Nike nails the balance between performance and style.",
      'adidas': "Smart choice. Adidas has that clean, timeless appeal.",
      'jordan': "Classic pick. Jordan never goes out of style.",
      'supreme': "Strong taste. Supreme knows how to make a statement.",
      'kith': "Good eye. Kith nails classic and modern.",
      'fear of god': "Elevated choice. Fear of God Essentials hits different.",
      'stone island': "Quality pick. Stone Island is next level craftsmanship.",
      'off-white': "Bold choice. Off-White brings that creative edge.",
      'uniqlo': "Smart pick. Uniqlo does quality basics right.",
      'cos': "Clean taste. COS has that minimalist appeal."
    };
    
    return brandCompliments[brand.toLowerCase()] || "Great choice.";
  };

  // Extract colors from user message
  const extractColors = (message) => {
    const lowerMessage = message.toLowerCase();
    const colors = ['black', 'white', 'gray', 'grey', 'blue', 'red', 'green', 'brown', 'beige', 'navy', 'olive'];
    return colors.filter(color => lowerMessage.includes(color));
  };

  // Generate final style recommendations
  const generateStyleRecommendations = (tasteProfile, footwearMessage) => {
    const { discoveredBrands, styleContext, stylePreference } = tasteProfile;
    
    if (discoveredBrands.length > 0) {
      const primaryBrand = discoveredBrands[0];
      if (stylePreference === 'bold') {
        return `I can show you standout ${primaryBrand} pieces, or we could explore newer streetwear labels that match your bold style. What sounds better?`;
      } else {
        return `I can show you clean ${primaryBrand} fits, or we could look at more classic pieces that work for ${styleContext}. What sounds better?`;
      }
    } else {
      if (stylePreference === 'bold') {
        return "I can show you bold streetwear pieces, or we could explore statement accessories. What sounds better?";
      } else {
        return "I can show you clean, classic fits, or we could focus on versatile basics. What sounds better?";
      }
    }
  };

  // Generate context confirmation messages
  const getContextConfirmation = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('date')) {
      return "Perfect, date night vibes. Got it.";
    } else if (lowerMessage.includes('office') || lowerMessage.includes('work')) {
      return "Nice, professional looks. I'm on it.";
    } else if (lowerMessage.includes('everyday') || lowerMessage.includes('casual')) {
      return "Cool, everyday essentials. Makes sense.";
    } else if (lowerMessage.includes('party') || lowerMessage.includes('night out')) {
      return "Got it, something for going out.";
    } else {
      return "Perfect, I understand the vibe.";
    }
  };

  // Generate color confirmation messages
  const getColorConfirmation = (colors, originalMessage) => {
    if (colors.length > 0) {
      if (colors.length === 1) {
        return `${colors[0].charAt(0).toUpperCase() + colors[0].slice(1)} - solid choice.`;
      } else {
        return `${colors.join(', ')} - good palette.`;
      }
    } else {
      // If no specific colors detected, give a general confirmation
      return "Got your color preferences.";
    }
  };

  // Generate style confirmation messages
  const getStyleConfirmation = (stylePreference) => {
    if (stylePreference === 'bold') {
      return "Bold it is. I like that energy.";
    } else {
      return "Classic and clean. Timeless choice.";
    }
  };

  // Generate footwear confirmation messages
  const getFootwearConfirmation = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sneaker')) {
      return "Sneakers, perfect. That's my language.";
    } else if (lowerMessage.includes('boot')) {
      return "Boots - solid foundation.";
    } else if (lowerMessage.includes('dress') || lowerMessage.includes('formal')) {
      return "Dress shoes, keeping it sharp.";
    } else if (lowerMessage.includes('sandal') || lowerMessage.includes('slide')) {
      return "Casual footwear, I feel you.";
    } else {
      return "Got your footwear style.";
    }
  };


  const handleFundingComplete = (amount, isOptional = false) => {
    // Handle funding method selection
    if (amount === 'show_funding_methods') {
      const fundingMessage = `💳 **Choose Your Funding Method**\n\nHow would you like to add funds to your account?`;
      addAutobotMessage(fundingMessage, 'funding-method-selection', {
        showMethods: true
      });
      return;
    }
    
    // Handle USDC funding flow
    if (amount === 'usdc_funding') {
      const usdcMessage = `🪙 **Fund with USDC**\n\nSend any amount of USDC to this address and your balance will be updated automatically:`;
      addAutobotMessage(usdcMessage, 'usdc-funding', {
        walletAddress: '0x742d35Cc6644C45532F6c8C1B96d4d67C2bCcE4F',
        showAddress: true
      });
      return;
    }
    
    // Handle Bank Transfer funding flow
    if (amount === 'bank_transfer_funding') {
      const bankTransferMessage = `🏦 **Fund with Bank Transfer**\n\nSend any amount via bank transfer to the account details below and your balance will be updated automatically:`;
      addAutobotMessage(bankTransferMessage, 'bank-transfer-funding', {
        accountDetails: {
          accountName: 'Blink Technologies Inc.',
          routingNumber: '021000021',
          accountNumber: '1234567890',
          bankName: 'Chase Bank'
        },
        showDetails: true
      });
      return;
    }
    
    // Handle actual funding completion
    if (typeof amount === 'number') {
      const newBalance = balance + amount;
      setBalance(prev => prev + amount);
      
      // Show confirmation message for credit card funding
      if (!isOptional) {
        // Determine new tier based on updated balance
        let tier = 'Bronze';
        let tierColor = '#cd7f32';
        let blinkFee = '5%';
        
        if (newBalance >= 2500) {
          tier = 'Gold';
          tierColor = '#ffd700';
          blinkFee = '0%';
        } else if (newBalance >= 501) {
          tier = 'Silver';
          tierColor = '#c0c0c0';
          blinkFee = '3%';
        }
        
        const confirmationMessage = `🎉 Awesome! Your funds have been added successfully.`;
        addAutobotMessage(confirmationMessage, 'balance-inquiry', {
          balance: newBalance,
          fundingAmount: amount,
          showAddFunds: false,
          isConfirmation: true,
          tier: tier,
          tierColor: tierColor,
          blinkFee: blinkFee
        });
      }
    }
    
    if (isOptional) {
      // For optional funding, just acknowledge the addition
      if (typeof amount === 'number') {
        addAutobotMessage(`Perfect! Added $${amount} to your account. Your balance is now $${balance + amount}.`);
      }
    } else {
      // First-time purchase flow - get the pending item details
      const pendingItem = userProfile.pendingPurchase;
      
      if (pendingItem) {
        // Check for automatic coupon application
        const couponSavings = checkForCoupons(pendingItem, isFromPushNotification);
        
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



  // Find the best matching item from order based on user's description
  const findBestMatchingItem = (requestedName, items) => {
    const cleanRequested = requestedName.toLowerCase().trim();
    
    // Strategy 1: Exact match (case insensitive)
    let match = items.find(item => 
      item.title.toLowerCase() === cleanRequested
    );
    if (match) return match;
    
    // Strategy 2: Full title contains the requested name
    match = items.find(item => 
      item.title.toLowerCase().includes(cleanRequested)
    );
    if (match) return match;
    
    // Strategy 3: Requested name contains significant part of title
    match = items.find(item => {
      const titleWords = item.title.toLowerCase().split(/\s+/);
      const requestedWords = cleanRequested.split(/\s+/);
      
      // Check if any significant word from title is in the request
      return titleWords.some(titleWord => 
        titleWord.length > 2 && requestedWords.some(reqWord => 
          reqWord.includes(titleWord) || titleWord.includes(reqWord)
        )
      );
    });
    if (match) return match;
    
    // Strategy 4: Fuzzy matching for common item types
    const itemTypeMatches = {
      'cap': ['cap', 'hat', 'beanie'],
      'shirt': ['shirt', 'tee', 't-shirt', 'tshirt', 'top'],
      'shoes': ['shoes', 'sneakers', 'boots', 'jordans', 'nike', 'adidas'],
      'pants': ['pants', 'jeans', 'trousers', 'shorts'],
      'jacket': ['jacket', 'hoodie', 'sweater', 'coat'],
      'bag': ['bag', 'backpack', 'purse', 'tote'],
      'watch': ['watch', 'timepiece'],
      'sunglasses': ['sunglasses', 'glasses', 'shades']
    };
    
    for (const [category, keywords] of Object.entries(itemTypeMatches)) {
      if (keywords.some(keyword => cleanRequested.includes(keyword))) {
        match = items.find(item => 
          keywords.some(keyword => item.title.toLowerCase().includes(keyword))
        );
        if (match) return match;
      }
    }
    
    // Strategy 5: Word-by-word partial matching with scoring
    let bestMatch = null;
    let bestScore = 0;
    
    items.forEach(item => {
      const titleWords = item.title.toLowerCase().split(/\s+/);
      const requestedWords = cleanRequested.split(/\s+/);
      
      let score = 0;
      requestedWords.forEach(reqWord => {
        if (reqWord.length > 2) { // Only consider meaningful words
          titleWords.forEach(titleWord => {
            if (titleWord.includes(reqWord) || reqWord.includes(titleWord)) {
              score += reqWord.length; // Longer matches get higher scores
            }
          });
        }
      });
      
      if (score > bestScore && score > 2) { // Minimum threshold
        bestScore = score;
        bestMatch = item;
      }
    });
    
    return bestMatch;
  };

  // Detect if user message is requesting order modifications
  const detectOrderModification = (message, order) => {
    const lowerMessage = message.toLowerCase();
    
    // Size change patterns
    const sizeChangePatterns = [
      /change.*size.*to\s+(\w+)/i,
      /make.*size\s+(\w+)/i,
      /switch.*size.*to\s+(\w+)/i,
      /size\s+(\w+)\s+instead/i,
      /can.*get.*size\s+(\w+)/i,
      /want.*size\s+(\w+)/i,
      /need.*size\s+(\w+)/i
    ];
    
    for (const pattern of sizeChangePatterns) {
      const match = message.match(pattern);
      if (match) {
        return {
          type: 'size_change',
          newSize: match[1].toUpperCase(),
          originalMessage: message
        };
      }
    }
    
    // Remove item patterns - more specific extraction
    const removePatterns = [
      /remove\s+(?:the\s+)?(.+?)(?:\s+from|$)/i,
      /delete\s+(?:the\s+)?(.+?)(?:\s+from|$)/i,
      /take\s+out\s+(?:the\s+)?(.+?)(?:\s+from|$)/i,
      /don't\s+want\s+(?:the\s+)?(.+?)(?:\s+anymore|$)/i,
      /cancel\s+(?:the\s+)?(.+?)(?:\s+from|$)/i,
      /get\s+rid\s+of\s+(?:the\s+)?(.+?)(?:\s+from|$)/i,
      /drop\s+(?:the\s+)?(.+?)(?:\s+from|$)/i
    ];
    
    for (const pattern of removePatterns) {
      const match = message.match(pattern);
      if (match) {
        const requestedItemName = match[1].toLowerCase().trim();
        
        // Find the best matching item using multiple strategies
        const itemToRemove = findBestMatchingItem(requestedItemName, order.items);
        
        if (itemToRemove) {
          return {
            type: 'remove_item',
            item: itemToRemove,
            originalMessage: message,
            requestedName: requestedItemName
          };
        } else {
          // No matching item found, but user clearly wants to remove something
          return {
            type: 'remove_item_not_found',
            originalMessage: message,
            requestedName: requestedItemName,
            availableItems: order.items.map(item => item.title)
          };
        }
      }
    }
    
    // General modification patterns
    if (lowerMessage.includes('change') || lowerMessage.includes('modify') || 
        lowerMessage.includes('update') || lowerMessage.includes('different')) {
      return {
        type: 'general_modification',
        originalMessage: message
      };
    }
    
    return null;
  };

  // Handle order modifications
  const handleOrderModification = (modification, currentOrder) => {
    const { type, newSize, item: itemToRemove, originalMessage, requestedName } = modification;
    
    if (type === 'size_change') {
      // Update all items to new size (for simplicity, assuming single item orders mostly)
      const updatedItems = currentOrder.items.map(item => ({
        ...item,
        size: newSize
      }));
      
      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        timestamp: Date.now() // Reset timer
      };
      
      setActiveOrder(updatedOrder);
      
      // Generate updated confirmation
      generateUpdatedOrderConfirmation(updatedOrder, `Got it! I've changed the size to ${newSize}.`);
      
    } else if (type === 'remove_item') {
      const updatedItems = currentOrder.items.filter(item => item !== itemToRemove);
      
      if (updatedItems.length === 0) {
        // All items removed - cancel order
        setActiveOrder(null);
        addAutobotMessage("No problem! I've cancelled your order since you removed all items. Let me know if you want to search for something else! 😊");
        return;
      }
      
      // Recalculate totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
      const shipping = updatedItems.length > 0 ? (updatedItems[0].shipping || 8) : 0;
      const tax = Math.round(subtotal * 0.08);
      const silverFee = Math.round(subtotal * 0.03); // 3% silver tier fee
      const total = subtotal + shipping + tax + silverFee;
      
      const updatedOrder = {
        ...currentOrder,
        items: updatedItems,
        subtotal,
        shipping,
        tax,
        silverFee,
        total,
        timestamp: Date.now() // Reset timer
      };
      
      setActiveOrder(updatedOrder);
      
      generateUpdatedOrderConfirmation(updatedOrder, `Perfect! I've removed "${itemToRemove.title}" from your order.`);
      
    } else if (type === 'remove_item_not_found') {
      const { requestedName, availableItems } = modification;
      let errorMessage = `I couldn't find "${requestedName}" in your order. `;
      
      if (availableItems.length === 1) {
        errorMessage += `Your order contains: ${availableItems[0]}`;
      } else {
        errorMessage += `Your order contains:\n`;
        availableItems.forEach((item, index) => {
          errorMessage += `${index + 1}. ${item}\n`;
        });
      }
      
      errorMessage += `\nPlease try again with the exact item name, or say "cancel order" to cancel everything.`;
      addAutobotMessage(errorMessage);
      
    } else if (type === 'general_modification') {
      addAutobotMessage("I'd be happy to help modify your order! Could you be more specific about what you'd like to change? For example:\n\n• \"Change the size to Large\"\n• \"Remove the [item name]\"\n• \"Cancel the order\"\n\nWhat would you like to do?");
    }
  };

  // Generate updated order confirmation
  const generateUpdatedOrderConfirmation = (updatedOrder, confirmationMessage) => {
    let orderSummary = `${confirmationMessage}\n\n🛍️ **Updated Order:**\n\n`;
    
    updatedOrder.items.forEach((item, index) => {
      orderSummary += `${index + 1}. ${item.title}`;
      if (item.size) orderSummary += ` (Size: ${item.size})`;
      orderSummary += `\n   $${item.price} + $${updatedOrder.shipping} shipping\n\n`;
    });
    
    orderSummary += `**Order Total:**\n`;
    orderSummary += `Subtotal: $${updatedOrder.subtotal}\n`;
    orderSummary += `Shipping: $${updatedOrder.shipping}\n`;
    orderSummary += `Tax: $${updatedOrder.tax}\n`;
    orderSummary += `Silver Tier Fee (3%): $${updatedOrder.silverFee}\n`;
    orderSummary += `**Total: $${updatedOrder.total}**\n\n`;
    orderSummary += `Estimated delivery: Tomorrow\n`;
    orderSummary += `Just message me if you need to make any changes. You have 3 minutes until the order is placed.`;
    
    addAutobotMessage(orderSummary, 'group-order-summary', updatedOrder);
    
    // Clear any existing timer and set new one
    setTimeout(() => {
      const itemNames = updatedOrder.items.map(item => item.title).join(', ');
      const finalMessage = `🎯 **Order Confirmed!**\n\nYour order for ${itemNames} has been officially placed and is now being processed.\n\n📦 You'll receive tracking details shortly.\n💳 Payment has been processed successfully.\n\nThanks for shopping with Blink! 🚀`;
      addAutobotMessage(finalMessage);
      setActiveOrder(null); // Clear active order after confirmation
    }, 3 * 60 * 1000); // 3 minutes in milliseconds
  };

  // Check if message is asking about balance
  const isBalanceInquiry = (message) => {
    const lowerMessage = message.toLowerCase();
    
    const balancePatterns = [
      /show.*balance/i,
      /what.*balance/i,
      /check.*balance/i,
      /my.*balance/i,
      /current.*balance/i,
      /account.*balance/i,
      /how.*much.*money/i,
      /how.*much.*do.*i.*have/i,
      /wallet.*balance/i,
      /available.*funds/i,
      /credit.*balance/i,
      /balance.*check/i,
      /^balance$/i
    ];
    
    return balancePatterns.some(pattern => pattern.test(lowerMessage));
  };

  // Handle balance inquiry
  const handleBalanceInquiry = () => {
    const balanceMessage = `Your Blink Dollars balance is ${balance} dollars.`;
    
    addAutobotMessage(balanceMessage, 'balance-inquiry', {
      currentBalance: balance,
      showAddFunds: true
    });
  };

  // Handle /info command
  const handleInfoCommand = () => {
    // Get recent orders from user profile (last 3)
    const recentOrders = userProfile.purchaseHistory ? userProfile.purchaseHistory.slice(-3).reverse() : [];
    
    // Determine tier based on balance (updated to match new tiering system)
    let tier = 'Bronze';
    let tierColor = '#cd7f32';
    let nextTierBalance = 501;
    let nextTier = 'Silver';
    let blinkFee = '5%';
    
    if (balance >= 2500) {
      tier = 'Gold';
      tierColor = '#ffd700';
      nextTierBalance = null;
      nextTier = null;
      blinkFee = '0%';
    } else if (balance >= 501) {
      tier = 'Silver';
      tierColor = '#c0c0c0';
      nextTierBalance = 2500;
      nextTier = 'Gold';
      blinkFee = '3%';
    }
    
    const infoMessage = `ℹ️ **Account Information**\n\nHere's everything Blink knows about you:`;
    
    addAutobotMessage(infoMessage, 'account-info', {
      // Account details
      balance: balance,
      tier: tier,
      tierColor: tierColor,
      blinkFee: blinkFee,
      totalSpent: userProfile.totalSpent,
      nextTierBalance: nextTierBalance,
      nextTier: nextTier,
      memberSince: userProfile.memberSince,
      
      // Personal information
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      address: userProfile.address,
      
      // Sizes
      shoeSize: userProfile.shoeSize,
      clothingSize: userProfile.clothingSize,
      pantsSize: userProfile.pantsSize,
      
      // Preferences and brands
      interests: userProfile.interests,
      preferredBrands: userProfile.preferredBrands,
      favoriteBrands: userProfile.favoriteBrands,
      preferences: userProfile.preferences,
      
      // Purchase history
      recentOrders: recentOrders,
      
      // Funding callback
      onFunded: handleFundingComplete
    });
  };

  // Function to generate virtual try-on images for search results
  const generateVirtualTryOnImages = async (results, userImageData) => {
    if (!userImageData || !results || results.length === 0) return results;
    
    const updatedResults = [...results];
    
    // Generate try-on images for first 3 results
    for (let i = 0; i < Math.min(3, results.length); i++) {
      const result = results[i];
      if (result.image) {
        try {
          console.log(`🎭 Generating virtual try-on for ${result.name || result.title}...`);
          
          // Determine clothing type based on product name
          let clothingType = 'clothing';
          const productName = (result.name || result.title || '').toLowerCase();
          if (productName.includes('tee') || productName.includes('shirt') || productName.includes('crewneck')) {
            clothingType = 'shirt';
          } else if (productName.includes('cap') || productName.includes('hat')) {
            clothingType = 'hat';
          } else if (productName.includes('shoes') || productName.includes('sneaker')) {
            clothingType = 'shoes';
          } else if (productName.includes('hoodie')) {
            clothingType = 'hoodie';
          } else if (productName.includes('jacket')) {
            clothingType = 'jacket';
          }
          
          const tryOnResult = await falAI.tryOnClothing(userImageData, result.image, clothingType, result.name || result.title);
          
          if (tryOnResult.success) {
            updatedResults[i] = {
              ...result,
              tryOnImage: tryOnResult.image?.url || tryOnResult.image,
              originalImage: result.image,
              hasTryOn: true
            };
            console.log(`✅ Virtual try-on generated for ${result.name || result.title}`);
          } else {
            console.log(`❌ Virtual try-on failed for ${result.name || result.title}:`, tryOnResult.error);
          }
        } catch (error) {
          console.error(`Error generating try-on for ${result.name || result.title}:`, error);
        }
      }
    }
    
    return updatedResults;
  };

  const handleImageSearch = (imageData, originalMessage) => {
    // Add the user's image message first
    addUserMessage(originalMessage, 'image', { imageData });
    
    // Check if we're waiting for a selfie (user's personal photo)
    if (waitingForSelfie) {
      // Store the user's image for virtual try-on
      setUserImage(imageData);
      setWaitingForSelfie(false);
      
      // If there are pending selfie items (contextual selfie), show virtual try-on for those items
      if (pendingSelfieItems && pendingSelfieItems.length > 0) {
        console.log('🎭 Virtual Try-On Debug:', {
          pendingSelfieItems,
          imageData: imageData ? 'Image data present' : 'No image data',
          imageDataLength: imageData ? imageData.length : 0
        });
        
        setTimeout(() => {
          const compliments = [
            "Perfect! Looking good! 📸",
            "Great photo! Love it! 📸", 
            "Awesome shot! 📸",
            "Nice! That's perfect! 📸"
          ];
          const compliment = compliments[Math.floor(Math.random() * compliments.length)];
          
          // Create virtual try-on results with user image
          const virtualTryOnResults = pendingSelfieItems.map(item => ({
            ...item,
            image: imageData, // Use user's image for virtual try-on
            originalImage: item.image, // Keep original product image
            isVirtualTryOn: true,
            virtualTryOnImage: imageData // Explicit virtual try-on image
          }));
          
          console.log('🎭 Virtual Try-On Results:', virtualTryOnResults);
          
          // Try to add the virtual try-on message
          try {
            addAutobotMessage(`${compliment} Here's how you look in them:`, 'search-results', { 
              results: virtualTryOnResults,
              showViewMore: true,
              remainingCount: 0,
              allResults: virtualTryOnResults,
              searchTerm: 'virtual try-on',
              isVirtualTryOn: true
            });
          } catch (error) {
            console.error('Virtual try-on error:', error);
            // Fallback to simple message
            addAutobotMessage(`${compliment} Here's how you look in them! (Virtual try-on coming soon)`);
          }
        }, 800);
        
        // Clear the pending items
        setPendingSelfieItems(null);
        return;
      } else {
        // General selfie upload (not contextual)
        setTimeout(() => {
          const compliments = [
            "Perfect! Looking good! 📸",
            "Great photo! Love it! 📸", 
            "Awesome shot! 📸",
            "Nice! That's perfect! 📸"
          ];
          const compliment = compliments[Math.floor(Math.random() * compliments.length)];
          
          addAutobotMessage(`${compliment}\n\nNow I can show you how anything looks on you! What do you want me to find for you?`);
        }, 800);
        return;
      }
    }
    
    // Store the user's image for virtual try-on if not already set
    if (!userImage) {
      setUserImage(imageData);
    }
    
    // This is a product search image - search for similar items
      setTimeout(() => {
        addAutobotMessage("Great photo! Let me search for similar items...");
        
        setTimeout(() => {
          // Simulate image search results
          const imageSearchResults = [
            {
              title: "Similar Style Found",
              price: 89,
              shipping: 8,
              availability: "In Stock",
              authenticity: "Verified",
              description: "Based on your photo",
              image: `${process.env.PUBLIC_URL}/lego-1.png`,
              deliveryDate: "Tomorrow"
            }
          ];
          
          addAutobotMessage("Here are some options based on your photo:", 'search-results', {
            results: imageSearchResults,
            showViewMore: false
          });
        }, 2000);
      }, 1000);
  };

  const handleChatMessage = (message) => {
    // Check if message contains an image search
    if (message.startsWith('[IMAGE_SEARCH]')) {
      const imageData = message.replace('[IMAGE_SEARCH]', '');
      handleImageSearch(imageData, message);
      return;
    }
    
    addUserMessage(message);
    
    
    // Check for order modifications if there's an active order within 3 minutes
    if (activeOrder && (Date.now() - activeOrder.timestamp) < (3 * 60 * 1000)) {
      const orderModification = detectOrderModification(message, activeOrder);
      if (orderModification) {
        handleOrderModification(orderModification, activeOrder);
        return;
      }
    }
    
    // Check for balance inquiry
    if (isBalanceInquiry(message)) {
      handleBalanceInquiry();
      return;
    }
    
    // Check for /info command
    if (message.toLowerCase().trim() === '/info') {
      handleInfoCommand();
      return;
    }
    
    // Check if message contains a URL - auto-buy feature
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urls = message.match(urlRegex);
    
    if (urls && urls.length > 0) {
      const url = urls[0];
      handleUrlPurchase(url, message);
      return;
    }
    
    // Handle responses when waiting for selfie (contextual selfie requests)
    if (waitingForSelfie) {
      // Check if this is a positive response
      const lowerMessage = message.toLowerCase().trim();
      const positiveResponses = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'sounds good', 'let\'s do it', 'why not'];
      const negativeResponses = ['no', 'nah', 'not now', 'maybe later', 'i\'m good', 'no thanks', 'skip'];
      
      const isPositive = positiveResponses.some(response => lowerMessage.includes(response));
      const isNegative = negativeResponses.some(response => lowerMessage.includes(response));
      
      if (isPositive) {
        setWaitingForSelfie(false);
        setTimeout(() => {
          addAutobotMessage("Great! Upload your picture and I'll show you how the items look on you! 📸");
        }, 800);
        return;
      } else if (isNegative) {
        setWaitingForSelfie(false);
        setPendingSelfieItems(null); // Clear pending items when user declines
        setTimeout(() => {
          addAutobotMessage("No worries! Let me know if you want to try anything on later. What else can I help you find?");
        }, 800);
        return;
      } else if (!isProductSearchIntent(message)) {
        // If it's not a clear yes/no and not a product search, treat as conversational
        setWaitingForSelfie(false);
        setPendingSelfieItems(null); // Clear pending items
        const conversationalResponse = getConversationalResponse(message, { waitingForSelfie: true });
        setTimeout(() => {
          addAutobotMessage(conversationalResponse);
        }, 800);
        return;
      }
      // If it is a product search, continue to normal processing but stop waiting for selfie
      setWaitingForSelfie(false);
      setPendingSelfieItems(null); // Clear pending items when starting new search
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
          addAutobotMessage(`Perfect, ${extractedName}! Ready to lock it in? Please give me your full shipping address (street, city, state, ZIP code) and I'll reserve one for you.`, 'collect-address');
        }, 1000);
        return;
      } else if (!userProfile.address) {
        // Collecting address with validation
        const validation = validateShippingAddress(message);
        
        if (!validation.isValid) {
          setTimeout(() => {
            addAutobotMessage(validation.error);
          }, 800);
          return;
        }
        
        // Address is valid, save it
        setUserProfile(prev => ({ 
          ...prev, 
          address: validation.address
        }));
        
        setTimeout(() => {
          addAutobotMessage(`Perfect! I've got everything I need to ship this to you.`);
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
                  const shippingMessage = `✨ Here's your order:\n\n${pendingItem.title}\n\nTotal: $${total} ($${pendingItem.price} + $${pendingItem.shipping || 0} shipping)\nDelivery: ${pendingItem.deliveryDate}\nShipping to: ${currentProfile.name}, ${currentProfile.address}\n\nReady to place your order?`;
                  
                  addAutobotMessage(shippingMessage, 'purchase-confirmation', {
                    item: pendingItem,
                    total: total,
                    address: currentProfile.address,
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
    
    // Check for funding intent first (higher priority)
    if (isFundingIntent(message)) {
      // User wants to add funds to their account
      setTimeout(() => {
        addAutobotMessage("I'll help you add funds to your account.", 'funding-method-selection', {
          showMethods: true
        });
      }, 1000);
    } else {
      // Check if user is in taste discovery flow
      if (userType === 'taste-discovery' && userProfile.tasteProfile?.currentStep !== 'complete') {
        handleTasteDiscoveryResponse(message);
        return;
      }
      
      // Check if user is responding to a subscription offer
      const subscriptionResponse = isSubscriptionResponse(message);
      if (subscriptionResponse.isResponse) {
        if (subscriptionResponse.isPositive) {
          setTimeout(() => {
            addAutobotMessage("Perfect, your Protein Powder subscription is now active. You will be getting a shipment every 22nd of the month. And I'll remind you monthly before it renews, you can always skip, change or cancel at any time.");
          }, 1000);
        } else {
          setTimeout(() => {
            addAutobotMessage("No worries! You can always set up a subscription later if you change your mind.");
          }, 1000);
        }
        return;
      } else if (isSubscriptionIntent(message)) {
        // User wants to set up a subscription
        setTimeout(() => {
          handleSubscriptionRequest(message);
        }, 1000);
      } else {
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
      } else if (isProductSearchIntent(message)) {
        // User is actually searching for products
        const category = getProductCategoryName(lowerMessage);
        setTimeout(() => {
          const contextualMsg = getContextualMessage(category, message);
          addAutobotMessage(contextualMsg);
        
        // For shoes, only ask for size if we don't know it
        if (category === 'shoes' && (!userProfile.shoeSize || userType === 'new')) {
          setWaitingForSizeConfirmation(true);
          setPendingShoeSearch(message);
          return;
        }
        
        setTimeout(() => {
          triggerSearchResults(message, 'search');
        }, 2000);
      }, 1000);
      } else {
        // Conversational response - don't show products
        setTimeout(() => {
          const conversationalResponse = getConversationalResponse(message);
          addAutobotMessage(conversationalResponse);
        }, 800);
      }
      }
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
    if (request.includes('kith jaws') || request.includes('kif jaws') || (request.includes('kith') && request.includes('jaws'))) return 'kith-jaws';
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
    <div className="autobot-app" style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>

      {/* Chat View - Always present, slides left when web view opens */}
      <motion.div
        animate={{
          x: webViewData ? '-100%' : '0%'
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          duration: 0.4
        }}
        style={{
          position: webViewData ? 'absolute' : 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <span 
                className="back-arrow" 
                onClick={() => {
                  const basePath = process.env.PUBLIC_URL || '';
                  window.location.href = `${basePath}/`;
                }}
              >
                ←
              </span>
              <div className="autobot-info">
                <div className="autobot-avatar">
                  <svg width="20" height="20" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29.7031 22.1211C30.0696 22.1211 30.3956 22.2532 30.6807 22.5176C30.9759 22.7922 31.123 23.1133 31.123 23.4795C31.1229 23.7134 30.9802 24.0383 30.6953 24.4551C29.2802 26.4689 27.0003 28.0971 23.8545 29.3379C21.0242 30.4465 18.2288 31 15.4697 31C7.80392 30.9999 2.76447 28.8443 0.351562 24.5322C0.117401 24.1152 -1.33374e-08 23.7534 0 23.4482C0.000101261 23.1026 0.127446 22.7975 0.381836 22.5332C0.626178 22.2688 0.916959 22.1367 1.25293 22.1367C1.71093 22.1369 2.17441 22.4318 2.64258 23.0215C3.00904 23.4893 3.37572 23.9625 3.74219 24.4404C6.15508 26.7795 9.94745 27.9492 15.1191 27.9492C17.1247 27.9492 19.1663 27.6697 21.2432 27.1104C23.6253 26.4594 25.4575 25.5738 26.7402 24.4551C27.2085 23.9873 27.6772 23.525 28.1455 23.0674C28.8276 22.4368 29.3468 22.1211 29.7031 22.1211ZM5.94336 8.41602C6.32755 8.41612 6.67578 8.59323 6.9873 8.94629C9.35547 11.5949 11.5003 13.4179 13.4219 14.415C14.0344 14.7266 14.3406 15.1263 14.3408 15.6143C14.3408 15.9881 14.1489 16.3572 13.7646 16.7207C11.2926 19.0162 8.70121 21.032 5.99023 22.7666C5.69943 22.9535 5.42372 23.0469 5.16406 23.0469C4.79016 23.0469 4.46305 22.9011 4.18262 22.6104C3.91255 22.3091 3.77734 21.9716 3.77734 21.5977C3.77735 21.1822 3.97969 20.8184 4.38477 20.5068L10.4307 15.8955C9.50628 15.2827 8.3635 14.3423 7.00293 13.0752C5.34099 11.5067 4.50977 10.4208 4.50977 9.81836C4.50984 9.44455 4.65553 9.11729 4.94629 8.83691C5.23705 8.55666 5.56956 8.41602 5.94336 8.41602ZM26.4707 9.41309C26.8446 9.41309 27.1727 9.55877 27.4531 9.84961C27.7438 10.13 27.8887 10.4625 27.8887 10.8467C27.8887 11.1998 27.7333 11.5322 27.4219 11.8438C26.4247 12.9032 24.8713 14.4148 22.7627 16.3779C23.3444 16.8038 24.0614 17.4632 24.9131 18.3564C25.9206 19.4055 26.6114 20.0911 26.9854 20.4131C27.3593 20.7351 27.5459 21.0884 27.5459 21.4727C27.5459 21.8569 27.4062 22.1946 27.126 22.4854C26.8455 22.7762 26.5175 22.9219 26.1436 22.9219C25.8529 22.9218 25.5621 22.8127 25.2715 22.5947C24.856 22.2935 23.9681 21.4308 22.6074 20.0078C21.5687 18.9172 20.5656 18.1855 19.5996 17.8115C18.8104 17.5207 18.416 17.0888 18.416 16.5176C18.4162 15.9984 18.7747 15.5673 19.4912 15.2246C20.4571 14.7572 21.5171 13.9163 22.6699 12.7012C24.2798 11.0186 25.2348 10.0521 25.5361 9.80273C25.8476 9.54317 26.1592 9.4132 26.4707 9.41309ZM15.6533 0.461914C23.3195 0.461944 28.3586 2.61828 30.7715 6.93066C31.0056 7.34762 31.123 7.70857 31.123 8.01367C31.123 8.35939 30.9957 8.66432 30.7412 8.92871C30.4969 9.19308 30.2069 9.32512 29.8711 9.3252C29.413 9.3252 28.9498 9.03034 28.4814 8.44043C28.1149 7.97258 27.7483 7.49951 27.3818 7.02148C24.969 4.68232 21.1765 3.51277 16.0049 3.5127C13.9994 3.5127 11.9576 3.79224 9.88086 4.35156C7.49852 5.00249 5.66561 5.88805 4.38281 7.00684C3.91454 7.47464 3.44581 7.9369 2.97754 8.39453C2.29542 9.02512 1.77625 9.34082 1.41992 9.34082C1.05354 9.34074 0.727367 9.2087 0.442383 8.94434C0.147353 8.66986 0.000103062 8.34932 0 7.9834C2.78938e-09 7.74949 0.142707 7.4238 0.427734 7.00684C1.84288 4.99302 4.12363 3.36584 7.26953 2.125C10.0998 1.01643 12.8944 0.461914 15.6533 0.461914Z" fill="white"/>
                  </svg>
                </div>
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
                  onWebView={(data) => {
                  // Switch to web view mode with iOS-style animation
                    setWebViewData(data);
                  }}
                  isFromPushNotification={isFromPushNotification}
                  onFunded={handleFundingComplete}
                  onCreditCardFunding={(data) => setCreditCardFundingData(data)}
                  onCancelOrder={() => {
                    addAutobotMessage("No worries, I cancelled your order. Let me know if you want something else! 😊");
                  }}
                  onSubscriptionSetup={handleSubscriptionSetup}
                  onSubscriptionNudgeResponse={handleSubscriptionNudgeResponse}
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
      </motion.div>

      {/* Web View - Slides in from right when opened */}
      <AnimatePresence>
        {webViewData && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: 0.4
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10
            }}
          >
        <WebViewInterface 
          data={webViewData} 
          onClose={() => setWebViewData(null)} 
          onPurchaseIntent={handlePurchaseIntent} 
        />
          </motion.div>
      )}
      </AnimatePresence>
      
      {/* Credit Card Funding Interface - Slides in from bottom */}
      <AnimatePresence>
        {creditCardFundingData && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: 0.4
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 15
            }}
          >
        <CreditCardFundingInterface 
          data={creditCardFundingData} 
          onClose={() => setCreditCardFundingData(null)} 
          onFundingComplete={(amount) => {
            handleFundingComplete(amount);
            setCreditCardFundingData(null);
          }}
        />
          </motion.div>
      )}
      </AnimatePresence>
      
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

const generateColorVariantOptions = (mainResult) => {
  if (!mainResult.colorVariants) return [];
  
  const variantOptions = [];
  
  // Create a product option for each color variant (excluding the main one)
  mainResult.colorVariants.forEach((variant, index) => {
    // Skip the first variant as it's already shown as the main product
    if (index === 0) return;
    
    const priceVariation = Math.floor(Math.random() * 20) - 10; // ±$10 price variation
    const variantPrice = Math.max(50, mainResult.price + priceVariation);
    
    variantOptions.push({
      title: mainResult.title.replace('Black', variant.color),
      price: variantPrice,
      shipping: Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 5 : 0,
      brand: mainResult.brand,
      availability: variant.available ? 'In Stock' : 'Out of Stock',
      authenticity: 'Brand New',
      deliveryDate: ['Tomorrow', 'Tomorrow', '2 days'][Math.floor(Math.random() * 3)],
      image: variant.image,
      description: `${mainResult.title.replace('Black', variant.color)} - ${variant.color} colorway`,
      isColorVariant: true,
      originalProduct: mainResult.title
    });
  });
  
  return variantOptions;
};

const getContextualSearchText = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  
  if (term.includes('kith') && term.includes('jaws')) {
    return "Hey, check out the Kith Jaws Drop";
  } else if (term.includes('ed') && term.includes('sheeran')) {
    return "Ed Sheeran hoodies! 🎵";
  } else if (term.includes('jordan')) {
    return `Some fresh ${searchTerm} just dropped`;
  } else if (term.includes('nike') || term.includes('adidas') || term.includes('yeezy')) {
    return `Here are some great ${searchTerm} options`;
  } else if (term.includes('drop')) {
    return `Check out this ${searchTerm}`;
  } else {
    return `Here are some ${searchTerm} options`;
  }
};

const generatePlaceholderImage = (productName) => {
  const name = productName.toLowerCase();
  
  // Define image mappings for different product types
  const imageMap = {
    // Sneakers
    'jordan': 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
    'nike': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'adidas': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    'yeezy': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    'sneaker': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    'shoe': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    
    // Clothing
    'hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    'sweatshirt': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    'crewneck': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    'shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    'tee': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    'pants': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    'jeans': 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
    
    // Accessories
    'watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    'backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    'hat': 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop',
    'cap': 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop',
    'sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    
    // Electronics
    'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'iphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    'macbook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'airpods': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop'
  };
  
  // Check for matches in product name
  for (const [keyword, imageUrl] of Object.entries(imageMap)) {
    if (name.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Default fallback image
  return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
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
    <div className="autobot-webview">
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
            Blink
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
                <div style={{ fontSize: '18px', fontWeight: '600', letterSpacing: '-0.3px' }}>Blink</div>
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
          {(data.results[0].colorVariants && !data.results[0].isUsed
            ? generateColorVariantOptions(data.results[0])
            : data.results[0].hasUsedOptions && !data.results[0].isUsed 
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
                  background: '#3b82f6',
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

const ChatMessage = ({ message, onPurchaseIntent, onConfirmPurchase, onUserResponse, userProfile, onImageClick, onWebView, onFunded, onCreditCardFunding, onCancelOrder, isFromPushNotification, onSubscriptionSetup, onSubscriptionNudgeResponse }) => {
  const isAutobot = message.type === 'autobot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`message ${isAutobot ? 'autobot-message' : 'user-message'}`}
    >
      <div className="message-bubble">
        {message.special === 'search-result' && (
          <SearchResultCard data={message.data} onImageClick={onImageClick} showButtons={false} />
        )}
        
        {message.special === 'search-results' && (
          <SearchResultsCard data={message.data} onPurchaseIntent={onPurchaseIntent} onImageClick={onImageClick} onWebView={onWebView} />
        )}
        
        {message.special === 'product-list' && (
          <ProductListCard data={message.data} onPurchaseIntent={onPurchaseIntent} onImageClick={onImageClick} />
        )}
        
        {message.special === 'purchase-confirmation' && (
          <PurchaseConfirmationCard data={message.data} onConfirmPurchase={onConfirmPurchase} />
        )}
        
        {message.special === 'group-order-summary' && (
          <GroupOrderSummaryCard data={message.data} onWebView={onWebView} onCancelOrder={onCancelOrder} />
        )}
        
        {message.special === 'balance-inquiry' && (
          <BalanceInquiryCard data={message.data} onFunded={onFunded} />
        )}
        
        {message.special === 'funding-method-selection' && (
          <FundingMethodSelectionCard 
            data={message.data} 
            onFunded={onFunded} 
            onWebView={onWebView} 
            onCreditCardFunding={onCreditCardFunding}
          />
        )}
        
        {message.special === 'usdc-funding' && (
          <USDCFundingCard data={message.data} />
        )}
        
        {message.special === 'bank-transfer-funding' && (
          <BankTransferFundingCard data={message.data} />
        )}
        
        {message.special === 'subscription-setup' && (
          <SubscriptionSetupCard 
            data={message.data} 
            onSubscriptionSetup={onSubscriptionSetup} 
          />
        )}
        
        {message.special === 'subscription-nudge' && (
          <SubscriptionNudgeCard 
            data={message.data} 
            onSubscriptionResponse={onSubscriptionNudgeResponse} 
          />
        )}
        
        {message.special === 'account-info' && (
          <AccountInfoCard data={message.data} />
        )}
        
        {message.special === 'purchase-success' && (
          <PurchaseSuccessCard data={message.data} />
        )}
        
        {message.special === 'order-success' && (
          <OrderSuccessCard data={message.data} />
        )}
        
        {message.special === 'credit-setup' && (
          <CreditSetupCard data={message.data} onSubmit={onUserResponse} />
        )}
        
        {message.special === 'funding-required' && (
          <FundingRequiredCard data={message.data} onFunded={onFunded} onCreditCardFunding={onCreditCardFunding} />
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
        
        {!message.special && message.content && message.messageType !== 'image' && (
          <div className="message-text">{String(message.content || '')}</div>
        )}
        
        <div className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* WhatsApp-style menu buttons outside message bubble */}
      {message.special === 'search-result' && message.data && (
        <div className="whatsapp-menu-container">
          <motion.button
            whileHover={{ backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPurchaseIntent && onPurchaseIntent(message.data)}
            className="whatsapp-menu-btn"
          >
            <DollarSign size={20} className="whatsapp-menu-icon" />
            <span className="whatsapp-menu-text">${message.data.price + (message.data.shipping || 0)} -</span>
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            className="whatsapp-menu-btn"
            onClick={() => console.log('View more options clicked')}
          >
            <ExternalLink size={20} className="whatsapp-menu-icon" />
            <span className="whatsapp-menu-text">View (4) more Options</span>
          </motion.button>
        </div>
      )}
      
      {/* WhatsApp-style menu buttons for search results (multiple items) - only show additional buttons */}
      {message.special === 'search-results' && message.data && message.data.results && message.data.results.length > 0 && (
        <>
          {/* "View more" button container - only if there are more results */}
          {message.data.showViewMore && (
            <div className="whatsapp-menu-container" style={{ marginTop: '8px' }}>
              <motion.button
                whileHover={{ backgroundColor: '#f0f0f0' }}
                whileTap={{ scale: 0.98 }}
                className="whatsapp-menu-btn"
                onClick={() => {
                  // Switch to web view with all results
                  if (message.data.allResults) {
                    onWebView && onWebView({
                      ...message.data,
                      results: message.data.allResults
                    });
                  }
                }}
              >
                <ExternalLink size={20} className="whatsapp-menu-icon" />
                <span className="whatsapp-menu-text">View ({message.data.remainingCount}) more Options</span>
              </motion.button>
            </div>
          )}

          {/* Ed Sheeran Full Collection button - only for push notification flow */}
          {isFromPushNotification && message.data.searchTerm && 
           (message.data.searchTerm.toLowerCase().includes('ed sheeran') || 
            message.data.searchTerm.toLowerCase().includes('edsheeran') || 
            (message.data.searchTerm.toLowerCase().includes('ed') && message.data.searchTerm.toLowerCase().includes('sheeran'))) && (
            <div className="whatsapp-menu-container" style={{ marginTop: '8px' }}>
              <motion.button
                whileHover={{ backgroundColor: '#f0f0f0' }}
                whileTap={{ scale: 0.98 }}
                className="whatsapp-menu-btn"
                onClick={() => {
                  // Create full collection data from EdSheeran-Jessica/full collection folder
                  const fullCollectionResults = [
                    {
                      title: 'Green X Tee',
                      price: 45,
                      shipping: 5,
                      availability: 'Available in your size (Medium)',
                      authenticity: 'Brand New',
                      description: 'Ed Sheeran Green X Tee',
                      image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/green-x.jpeg`,
                      productShotImage: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/green x tee-product-shot.png`,
                      deliveryDate: 'Tomorrow'
                    },
                    {
                      title: 'Leopard Stamp Hoodie',
                      price: 65,
                      shipping: 5,
                      availability: 'Available in your size (Medium)',
                      authenticity: 'Brand New',
                      description: 'Ed Sheeran Leopard Stamp Hoodie',
                      image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/Leopard Stamp Hoodie.jpeg`,
                      productShotImage: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/Leopard Stamp Hoodie-product-shot.webp`,
                      deliveryDate: 'Tomorrow'
                    },
                    {
                      title: 'Peace House Hoodie',
                      price: 70,
                      shipping: 5,
                      availability: 'Available in your size (Medium)',
                      authenticity: 'Brand New',
                      description: 'Ed Sheeran Peace House Hoodie',
                      image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/Peace House Hoodie.jpeg`,
                      productShotImage: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/Peace House Hoodie-product-shot.webp`,
                      deliveryDate: 'Tomorrow'
                    },
                    {
                      title: 'Play Pink Hoodie',
                      price: 68,
                      shipping: 5,
                      availability: 'Available in your size (Medium)',
                      authenticity: 'Brand New',
                      description: 'Ed Sheeran Play Pink Hoodie',
                      image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/Play Pink Hoodie.jpeg`,
                      productShotImage: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/Play Pink Hoodie-product-shot.webp`,
                      deliveryDate: 'Tomorrow'
                    },
                    {
                      title: 'Sun Dial Hoodie',
                      price: 72,
                      shipping: 5,
                      availability: 'Available in your size (Medium)',
                      authenticity: 'Brand New',
                      description: 'Ed Sheeran Sun Dial Hoodie',
                      image: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/sun dial hoodie.jpeg`,
                      productShotImage: `${process.env.PUBLIC_URL}/EdSheeran-Jessica/full collection/Sun Dial Hoodie-product-shot.png`,
                      deliveryDate: 'Tomorrow'
                    }
                  ];

                  onWebView && onWebView({
                    results: fullCollectionResults,
                    searchTerm: 'Ed Sheeran Full Collection'
                  });
                }}
              >
                <ExternalLink size={20} className="whatsapp-menu-icon" />
                <span className="whatsapp-menu-text">View Full Collection</span>
              </motion.button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

const SearchResultCard = ({ data, onImageClick, showButtons = true }) => {
  return (
    <div style={{
      padding: '0',
      margin: '0'
    }}>
      <div className="result-content">
        {/* Show virtual try-on image if available, otherwise show original image */}
        {data.hasTryOn && data.tryOnImage ? (
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <img 
              src={data.tryOnImage} 
              alt={`Virtual try-on: ${data.title}`}
              style={{ 
                width: '100%', 
                objectFit: 'cover', 
                borderRadius: '12px',
                backgroundColor: '#f9fafb',
                cursor: 'pointer'
              }}
              onClick={() => onImageClick && onImageClick(data.tryOnImage, `Virtual Try-On: ${data.title}`)}
              onError={(e) => {
                console.error('Virtual try-on image failed to load:', data.tryOnImage);
                console.error('Image error details:', e);
                console.log('Falling back to original image:', data.originalImage || data.image);
                // Fallback to original image if virtual try-on fails to load
                e.target.src = data.originalImage || data.image;
                e.target.style.border = '2px solid #ff6b6b';
              }}
              onLoad={() => {
                console.log('Virtual try-on image loaded successfully:', data.tryOnImage);
              }}
            />
          </div>
        ) : data.image && (data.image.startsWith('http') || data.image.includes('PUBLIC_URL') || data.image.startsWith('/')) ? (
          <img 
            src={data.image} 
            alt={data.title}
            style={{ 
              width: '100%', 
              objectFit: 'cover', 
              borderRadius: '12px',
              marginBottom: '12px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer'
            }}
            onClick={() => onImageClick && onImageClick(data.image, data.title)}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '240px', 
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#999', 
              textAlign: 'center'
            }}>
              Product Image
            </div>
          </div>
        )}
        
        <div>
          <div style={{ 
            fontWeight: '600', 
            fontSize: '16px', 
            marginBottom: '4px',
            color: '#000000',
            lineHeight: '1.3'
          }}>
            {data.title}
          </div>
          
          <div style={{
            fontSize: '14px', 
            color: '#8e8e93',
            marginBottom: '4px'
          }}>
            Available in your size (Medium)
          </div>
          
          {data.isSecondHand && (
            <div style={{ 
              color: '#8e8e93', 
              fontSize: '13px',
              marginBottom: '4px'
            }}>
                📍 {data.location} • {data.condition}
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

      </div>
  );
};

const SearchResultCardWithButton = ({ data, onImageClick, onPurchaseIntent, showButtons = true }) => {
  return (
    <div style={{
      padding: '0',
      margin: '0'
    }}>
      <div className="result-content">
        {/* Show virtual try-on image if available, otherwise show original image */}
        {data.hasTryOn && data.tryOnImage ? (
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <img 
              src={data.tryOnImage} 
              alt={`Virtual try-on: ${data.title}`}
              style={{ 
                width: '100%', 
                objectFit: 'cover', 
                borderRadius: '12px',
                backgroundColor: '#f9fafb',
                cursor: 'pointer'
              }}
              onClick={() => onImageClick && onImageClick(data.tryOnImage, `Virtual Try-On: ${data.title}`)}
              onError={(e) => {
                console.error('Virtual try-on image failed to load:', data.tryOnImage);
                console.error('Image error details:', e);
                console.log('Falling back to original image:', data.originalImage || data.image);
                // Fallback to original image if virtual try-on fails to load
                e.target.src = data.originalImage || data.image;
                e.target.style.border = '2px solid #ff6b6b';
              }}
              onLoad={() => {
                console.log('Virtual try-on image loaded successfully:', data.tryOnImage);
              }}
            />
          </div>
        ) : data.image && (data.image.startsWith('http') || data.image.includes('PUBLIC_URL') || data.image.startsWith('/')) ? (
          <img 
            src={data.image} 
            alt={data.title}
            style={{ 
              width: '100%', 
              objectFit: 'cover', 
              borderRadius: '12px',
              marginBottom: '12px',
              backgroundColor: '#f9fafb',
              cursor: 'pointer'
            }}
            onClick={() => onImageClick && onImageClick(data.image, data.title)}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '240px', 
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#999', 
              textAlign: 'center'
            }}>
              Product Image
            </div>
          </div>
        )}
        
        <div>
          <div style={{ 
            fontWeight: '600', 
            fontSize: '16px', 
            marginBottom: '4px',
            color: '#000000',
            lineHeight: '1.3'
          }}>
            {data.title}
          </div>
          
          <div style={{
            fontSize: '14px', 
            color: '#8e8e93',
            marginBottom: '12px'
          }}>
            Available in your size (Medium)
          </div>
          
          {data.isSecondHand && (
            <div style={{ 
              color: '#8e8e93', 
              fontSize: '13px',
              marginBottom: '12px'
            }}>
                📍 {data.location} • {data.condition}
            </div>
          )}
        </div>
      </div>
      
      {/* Show coupon savings if applied */}
      {data.couponApplied && (
        <div style={{ 
          marginTop: '12px', 
          marginBottom: '12px',
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

      {/* WhatsApp-style button at full width below description */}
      {showButtons && onPurchaseIntent && (
        <div className="whatsapp-menu-container" style={{ marginTop: '12px', marginBottom: '0' }}>
          <motion.button
            whileHover={{ backgroundColor: '#f0f0f0' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPurchaseIntent(data)}
            className="whatsapp-menu-btn"
            style={{ width: '100%' }}
          >
            <DollarSign size={20} className="whatsapp-menu-icon" />
            <span className="whatsapp-menu-text">Buy Now - ${data.price + (data.shipping || 0)} ({data.title})</span>
          </motion.button>
        </div>
      )}

      </div>
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
        {/* Show all results (up to 3) with buttons integrated into each card */}
        {data.results.map((result, index) => (
          <div key={index} className="result-item" style={{ marginBottom: index < data.results.length - 1 ? '12px' : '0' }}>
            <SearchResultCardWithButton 
              data={result} 
              onImageClick={onImageClick} 
              onPurchaseIntent={onPurchaseIntent}
              showButtons={true} 
            />
        </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProductListCard = ({ data, onPurchaseIntent, onImageClick }) => {
  const products = data.results || [];
  
  return (
    <motion.div 
      className="product-list-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{ marginBottom: '8px' }}
    >
      <div className="products-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px'
      }}>
        {products.map((product, index) => (
          <SearchResultCard 
            key={index}
            data={product} 
            onImageClick={onImageClick} 
            showButtons={false}
          />
        ))}
      </div>
    </motion.div>
  );
};

const WebViewInterface = ({ data, onClose, onPurchaseIntent }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [lottieData, setLottieData] = useState(null);
  const [slidCardIndexes, setSlidCardIndexes] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [undoTimers, setUndoTimers] = useState({}); // Track countdown timers for each item
  const [showProductShots, setShowProductShots] = useState({}); // Track which items are showing product shots

  // Toggle between regular image and product shot
  const toggleProductShot = (index) => {
    setShowProductShots(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    // Load Lottie animation data
    const lottieUrl = `${process.env.PUBLIC_URL}/lottie/data.json`;
    console.log('🎬 Loading Lottie animation from:', lottieUrl);
    fetch(lottieUrl)
      .then(response => {
        console.log('🎬 Lottie fetch response:', response.status, response.url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('🎬 Lottie data loaded successfully:', data);
        setLottieData(data);
      })
      .catch(error => {
        console.error('❌ Error loading Lottie animation:', error);
        // If loading fails, just complete the animation immediately
        setAnimationComplete(true);
      });
  }, []);

  useEffect(() => {
    // Wait for animation to complete before showing products
    console.log('🎬 Animation complete state changed:', animationComplete);
    if (animationComplete) {
      console.log('🎬 Animation completed, hiding loading screen in 300ms');
      const timer = setTimeout(() => {
        console.log('🎬 Hiding loading screen now!');
        setIsLoading(false);
      }, 300); // Smoother transition
      return () => clearTimeout(timer);
    }
  }, [animationComplete]);

  useEffect(() => {
    // Pre-select items when in modify mode
    if (data.showModifyMode && data.results) {
      setSelectedItems(data.results);
      // Find the indexes of the ordered items in the full results list
      if (data.originalSearchResults) {
        const orderedIndexes = [];
        data.results.forEach(orderedItem => {
          const index = data.originalSearchResults.findIndex(item => 
            item.title === orderedItem.title && item.price === orderedItem.price
          );
          if (index !== -1) {
            orderedIndexes.push(index);
          }
        });
        setSlidCardIndexes(orderedIndexes);
      } else {
        // Fallback if no original search results
        const indexes = data.results.map((_, index) => index);
        setSlidCardIndexes(indexes);
      }
    }
  }, [data.showModifyMode, data.results, data.originalSearchResults]);

  const products = (data.showModifyMode && data.originalSearchResults) 
    ? data.originalSearchResults 
    : (data.results || []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: '#ffffff',
      color: '#1e293b'
    }}>
        {isLoading ? (
          // Cool Lottie Loading Screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e293b',
              zIndex: 1000
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              style={{
                marginBottom: '24px'
              }}
            >
              {lottieData ? (
                <Lottie 
                  animationData={lottieData}
                  style={{ width: 120, height: 120 }}
                  loop={false}
                  autoplay={true}
                  onComplete={() => {
                    console.log('🎬 Lottie animation completed!');
                    // Animation completed, trigger the next phase
                    setTimeout(() => {
                      console.log('🎬 Setting animation complete to true');
                      setAnimationComplete(true);
                    }, 200); // Smoother transition
                  }}
                  onLoopComplete={() => {
                    console.log('🎬 Lottie loop completed (should not happen with loop=false)');
                  }}
                  onEnterFrame={(e) => {
                    // Log every 10th frame to avoid spam
                    if (e.currentTime % 10 === 0) {
                      console.log('🎬 Lottie frame:', e.currentTime);
                    }
                  }}
                />
              ) : (
                // Fallback loading spinner while Lottie data loads
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '60px',
                    height: '60px',
                    border: '3px solid rgba(30, 41, 59, 0.3)',
                    borderTop: '3px solid #1e293b',
                    borderRadius: '50%'
                  }}
                />
              )}
            </motion.div>
            
            
            

            

          </motion.div>
        ) : (
          <>
            {/* Web View Header */}
            <div style={{
              background: '#ffffff',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '10px'
            }}>
              {/* Top section with time and status icons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '17px',
                  fontWeight: '600',
                  color: '#000'
                }}>
                  9:41
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="73" height="13" viewBox="0 0 73 13" fill="none">
                    <path d="M67.2119 0.597328C68.6533 0.743706 69.7782 1.96107 69.7783 3.44108V9.87369L69.7637 10.1657C69.6269 11.5109 68.5572 12.5808 67.2119 12.7174L66.9199 12.7321H49.0527L48.7607 12.7174C47.4154 12.5808 46.3458 11.5109 46.209 10.1657L46.1943 9.87369V3.44108C46.1945 1.86249 47.4741 0.582825 49.0527 0.58268H66.9199L67.2119 0.597328ZM2.95312 8.08561C3.54517 8.08561 4.02539 8.56582 4.02539 9.15787V11.3014C4.02521 11.8933 3.54506 12.3737 2.95312 12.3737H1.88184C1.2899 12.3737 0.809749 11.8933 0.80957 11.3014V9.15787C0.80957 8.56582 1.28979 8.08561 1.88184 8.08561H2.95312ZM7.95508 5.94205C8.54713 5.94205 9.02734 6.42227 9.02734 7.01432V11.3024C9.02698 11.8941 8.5469 12.3737 7.95508 12.3737H6.88379C6.29197 12.3737 5.81189 11.8941 5.81152 11.3024V7.01432C5.81152 6.42227 6.29174 5.94205 6.88379 5.94205H7.95508ZM12.96 3.4401C13.552 3.4401 14.0322 3.92032 14.0322 4.51237V11.3014C14.032 11.8933 13.5519 12.3737 12.96 12.3737H11.8887C11.2967 12.3737 10.8166 11.8933 10.8164 11.3014V4.51237C10.8164 3.92032 11.2966 3.4401 11.8887 3.4401H12.96ZM17.9619 0.939125C18.554 0.939125 19.0342 1.41934 19.0342 2.01139V11.3014C19.034 11.8933 18.5539 12.3737 17.9619 12.3737H16.8906C16.2987 12.3737 15.8185 11.8933 15.8184 11.3014V2.01139C15.8184 1.41934 16.2986 0.939125 16.8906 0.939125H17.9619ZM30.2422 9.58365C31.6096 8.42737 33.6122 8.42726 34.9795 9.58365C35.0482 9.64586 35.088 9.73416 35.0898 9.82682C35.0916 9.9194 35.0554 10.009 34.9893 10.0739L32.8486 12.235C32.7859 12.2984 32.6995 12.3337 32.6104 12.3337C32.5214 12.3336 32.4357 12.2982 32.373 12.235L30.2314 10.0739C30.1654 10.009 30.129 9.91936 30.1309 9.82682C30.1328 9.73416 30.1734 9.64581 30.2422 9.58365ZM49.0527 1.65495C48.0662 1.65509 47.2667 2.45454 47.2666 3.44108V9.87369C47.267 10.86 48.0663 11.6597 49.0527 11.6598H66.9199C67.9063 11.6597 68.7057 10.86 68.7061 9.87369V3.44108C68.7059 2.45454 67.9065 1.65508 66.9199 1.65495H49.0527ZM66.2041 2.72721C66.9934 2.72721 67.6336 3.36666 67.6338 4.15592V9.15885C67.6338 9.94825 66.9935 10.5885 66.2041 10.5885H49.7676C48.9782 10.5885 48.3379 9.94825 48.3379 9.15885V4.15592C48.338 3.36666 48.9783 2.72721 49.7676 2.72721H66.2041ZM70.8506 4.51334C71.7132 4.87652 72.2744 5.72099 72.2744 6.6569C72.2744 7.5929 71.7133 8.43826 70.8506 8.80143V4.51334ZM27.3848 6.70182C30.3308 3.96139 34.8928 3.96142 37.8389 6.70182C37.9053 6.76607 37.9434 6.85454 37.9443 6.94694C37.9451 7.03914 37.9088 7.12859 37.8438 7.19401L36.6064 8.44401C36.4789 8.5715 36.2724 8.57399 36.1416 8.44987C35.1742 7.57403 33.9153 7.08943 32.6104 7.08951C31.3063 7.09015 30.0487 7.5746 29.082 8.44987C28.9512 8.57398 28.7447 8.5715 28.6172 8.44401L27.3799 7.19401C27.3147 7.12866 27.2786 7.03919 27.2793 6.94694C27.2802 6.85457 27.3184 6.76606 27.3848 6.70182ZM24.5264 3.82682C29.0449 -0.503492 36.1728 -0.50345 40.6914 3.82682C40.7566 3.89103 40.7943 3.97848 40.7949 4.06998C40.7954 4.16161 40.7589 4.25008 40.6943 4.3151L39.4551 5.56608C39.3275 5.69392 39.1208 5.69578 38.9912 5.56998C37.2697 3.93327 34.9848 3.0203 32.6094 3.02018C30.2337 3.02018 27.9484 3.93315 26.2266 5.56998C26.0971 5.69592 25.8901 5.69416 25.7627 5.56608L24.5225 4.3151C24.4582 4.25007 24.4223 4.16144 24.4229 4.06998C24.4236 3.97845 24.4611 3.891 24.5264 3.82682Z" fill="black"/>
                  </svg>
                </div>
              </div>

              {/* Navigation section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.95 }}
              style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.12447 15.5755L6.46154 14.9125L0.432519 8.88354C-0.0556312 8.39539 -0.0556312 7.60393 0.432519 7.11578L6.46154 1.08674L7.12447 0.423828L8.45034 1.74965L7.78734 2.41257L2.20028 7.99965L7.78734 13.5868L8.45034 14.2497L7.12447 15.5755Z" fill="black"/>
                  </svg>
                </motion.button>
                
                <img 
                  src={`${process.env.PUBLIC_URL}/logo.svg`}
                  alt="Blink Logo"
                  style={{
                    height: '24px',
                    filter: 'brightness(0)' // Make logo black
                  }}
                />
                
          <div style={{
                  cursor: 'pointer',
            display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.6875 7.3125C1.6875 4.2059 4.2059 1.6875 7.3125 1.6875C10.4191 1.6875 12.9375 4.2059 12.9375 7.3125C12.9375 10.4191 10.4191 12.9375 7.3125 12.9375C4.2059 12.9375 1.6875 10.4191 1.6875 7.3125ZM7.3125 0C3.27392 0 0 3.27392 0 7.3125C0 11.3511 3.27392 14.625 7.3125 14.625C9.02778 14.625 10.6051 14.0344 11.8522 13.0455L15.7159 16.9091L16.3125 17.5058L17.5058 16.3125L16.9091 15.7159L13.0455 11.8522C14.0344 10.6051 14.625 9.02778 14.625 7.3125C14.625 3.27392 11.3511 0 7.3125 0Z" fill="black"/>
                  </svg>
                </div>
              </div>

              {/* Search term black box */}
              <div style={{
                background: '#000',
                borderRadius: '20px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
            gap: '12px'
          }}>
                <svg width="20" height="20" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.7031 22.1211C30.0696 22.1211 30.3956 22.2532 30.6807 22.5176C30.9759 22.7922 31.123 23.1133 31.123 23.4795C31.1229 23.7134 30.9802 24.0383 30.6953 24.4551C29.2802 26.4689 27.0003 28.0971 23.8545 29.3379C21.0242 30.4465 18.2288 31 15.4697 31C7.80392 30.9999 2.76447 28.8443 0.351562 24.5322C0.117401 24.1152 -1.33374e-08 23.7534 0 23.4482C0.000101261 23.1026 0.127446 22.7975 0.381836 22.5332C0.626178 22.2688 0.916959 22.1367 1.25293 22.1367C1.71093 22.1369 2.17441 22.4318 2.64258 23.0215C3.00904 23.4893 3.37572 23.9625 3.74219 24.4404C6.15508 26.7795 9.94745 27.9492 15.1191 27.9492C17.1247 27.9492 19.1663 27.6697 21.2432 27.1104C23.6253 26.4594 25.4575 25.5738 26.7402 24.4551C27.2085 23.9873 27.6772 23.525 28.1455 23.0674C28.8276 22.4368 29.3468 22.1211 29.7031 22.1211ZM5.94336 8.41602C6.32755 8.41612 6.67578 8.59323 6.9873 8.94629C9.35547 11.5949 11.5003 13.4179 13.4219 14.415C14.0344 14.7266 14.3406 15.1263 14.3408 15.6143C14.3408 15.9881 14.1489 16.3572 13.7646 16.7207C11.2926 19.0162 8.70121 21.032 5.99023 22.7666C5.69943 22.9535 5.42372 23.0469 5.16406 23.0469C4.79016 23.0469 4.46305 22.9011 4.18262 22.6104C3.91255 22.3091 3.77734 21.9716 3.77734 21.5977C3.77735 21.1822 3.97969 20.8184 4.38477 20.5068L10.4307 15.8955C9.50628 15.2827 8.3635 14.3423 7.00293 13.0752C5.34099 11.5067 4.50977 10.4208 4.50977 9.81836C4.50984 9.44455 4.65553 9.11729 4.94629 8.83691C5.23705 8.55666 5.56956 8.41602 5.94336 8.41602ZM26.4707 9.41309C26.8446 9.41309 27.1727 9.55877 27.4531 9.84961C27.7438 10.13 27.8887 10.4625 27.8887 10.8467C27.8887 11.1998 27.7333 11.5322 27.4219 11.8438C26.4247 12.9032 24.8713 14.4148 22.7627 16.3779C23.3444 16.8038 24.0614 17.4632 24.9131 18.3564C25.9206 19.4055 26.6114 20.0911 26.9854 20.4131C27.3593 20.7351 27.5459 21.0884 27.5459 21.4727C27.5459 21.8569 27.4062 22.1946 27.126 22.4854C26.8455 22.7762 26.5175 22.9219 26.1436 22.9219C25.8529 22.9218 25.5621 22.8127 25.2715 22.5947C24.856 22.2935 23.9681 21.4308 22.6074 20.0078C21.5687 18.9172 20.5656 18.1855 19.5996 17.8115C18.8104 17.5207 18.416 17.0888 18.416 16.5176C18.4162 15.9984 18.7747 15.5673 19.4912 15.2246C20.4571 14.7572 21.5171 13.9163 22.6699 12.7012C24.2798 11.0186 25.2348 10.0521 25.5361 9.80273C25.8476 9.54317 26.1592 9.4132 26.4707 9.41309ZM15.6533 0.461914C23.3195 0.461944 28.3586 2.61828 30.7715 6.93066C31.0056 7.34762 31.123 7.70857 31.123 8.01367C31.123 8.35939 30.9957 8.66432 30.7412 8.92871C30.4969 9.19308 30.2069 9.32512 29.8711 9.3252C29.413 9.3252 28.9498 9.03034 28.4814 8.44043C28.1149 7.97258 27.7483 7.49951 27.3818 7.02148C24.969 4.68232 21.1765 3.51277 16.0049 3.5127C13.9994 3.5127 11.9576 3.79224 9.88086 4.35156C7.49852 5.00249 5.66561 5.88805 4.38281 7.00684C3.91454 7.47464 3.44581 7.9369 2.97754 8.39453C2.29542 9.02512 1.77625 9.34082 1.41992 9.34082C1.05354 9.34074 0.727367 9.2087 0.442383 8.94434C0.147353 8.66986 0.000103062 8.34932 0 7.9834C2.78938e-09 7.74949 0.142707 7.4238 0.427734 7.00684C1.84288 4.99302 4.12363 3.36584 7.26953 2.125C10.0998 1.01643 12.8944 0.461914 15.6533 0.461914Z" fill="white"/>
                </svg>
                
                {/* Faded divider line */}
                <div style={{
                  width: '1px',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.3)'
                }}></div>
                
                <TypingText 
                  text={getContextualSearchText(data.searchTerm || 'Air Jordan 40s')} 
                  style={{ color: 'white' }}
                  startTyping={!isLoading}
                />
              </div>
            </div>

            {/* Products Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 10px 140px', // Extra bottom padding for Safari bar
              background: 'transparent'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
          }}>
            {(() => {
              // Separate primary (new/color variants) and secondary (used) options
              const primaryProducts = products.filter(product => product.isUsed !== true);
              const secondaryProducts = products.filter(product => product.isUsed === true);
              
              console.log('🔍 Debug - All products:', products);
              console.log('🔍 Debug - Primary products:', primaryProducts);
              console.log('🔍 Debug - Secondary products:', secondaryProducts);
              console.log('🔍 Debug - Secondary products length:', secondaryProducts.length);
              
              return (
                <>
                  {/* Primary Options */}
                  {primaryProducts.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.15,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  borderRadius: '20px',
                  padding: '0px',
                  marginBottom: '0px',
                  overflow: 'hidden'
                }}
              >
                {/* Typography Background - No black box, just text */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  pointerEvents: slidCardIndexes.includes(index) ? 'auto' : 'none'
                }}>
                  {/* Item thumbnail */}
                  {slidCardIndexes.includes(index) && (
                    <motion.div
                      initial={{ scale: 0.3, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.1, 
                        duration: 0.5,
                        ease: [0.175, 0.885, 0.32, 1]
                      }}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                    >
                      <img 
                        src={result.image} 
                        alt={result.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </motion.div>
                  )}

                                    {/* ON ITS WAY text */}
                  {slidCardIndexes.includes(index) && (
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
                        marginBottom: '20px'
                      }}
                    >
                      ON ITS WAY
                    </motion.div>
                  )}
                  
                  {/* Product name */}
                  {slidCardIndexes.includes(index) && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: 0.35, 
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      style={{
                        color: '#111',
                        textAlign: 'center',
                        leadingTrim: 'both',
                        textEdge: 'cap',
                        fontFamily: 'Inter',
                        fontSize: '20px',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        lineHeight: '85%',
                        letterSpacing: '-1.4px',
                        textTransform: 'uppercase',
                        marginBottom: '12px'
                      }}
                    >
                      <TypingText 
                        text={`Got your ${result.title.toLowerCase()}`}
                        delay={30}
                        startTyping={true}
                        style={{
                          color: '#111',
                          textAlign: 'center',
                          fontFamily: 'Inter',
                          fontSize: '20px',
                          fontWeight: '700',
                          lineHeight: '85%',
                          letterSpacing: '-1.4px',
                          textTransform: 'uppercase'
                        }}
                      />
                    </motion.div>
                  )}
                  
                  {/* Size */}
                  {slidCardIndexes.includes(index) && (
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        delay: 0.5, 
                        duration: 0.25,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      style={{
                        color: '#111',
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
                        marginBottom: '30px'
                      }}
                    >
                      {(result.size || 'MEDIUM').toUpperCase()}
                    </motion.div>
                  )}

                  {/* Undo button with countdown timer */}
                  {slidCardIndexes.includes(index) && (() => {
                    const itemKey = `${result.title}-${index}`;
                    const timeLeft = undoTimers[itemKey];
                    const isExpired = !timeLeft || timeLeft <= 0;
                    
                    // Don't render the button at all if expired
                    if (isExpired) {
                      return null;
                    }
                    
                    return (
                      <motion.button
                        initial={{ y: 30, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 30, opacity: 0, scale: 0.9 }}
                        transition={{ 
                          delay: 0.65, 
                          duration: 0.4,
                          ease: [0.175, 0.885, 0.32, 1]
                        }}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Clear the timer
                          setUndoTimers(prev => {
                            const { [itemKey]: removed, ...rest } = prev;
                            return rest;
                          });
                          // Remove from selected items and slide back
                          setSlidCardIndexes(prev => prev.filter(i => i !== index));
                          setSelectedItems(prev => prev.filter(item => item !== result));
                        }}
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
                          {timeLeft}
                        </span>
                      </motion.button>
                    );
                  })()}
                </div>

                {/* Product Card - Slides off with rotation */}
                <motion.div
                  animate={{ 
                    x: slidCardIndexes.includes(index) ? '120%' : '0%',
                    rotate: slidCardIndexes.includes(index) ? 18 : 0
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94] // Custom easing curve for smooth feel
                  }}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                  background: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: slidCardIndexes.includes(index)
                      ? '0 20px 60px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                >
                {/* Product Image Container */}
                <div style={{ 
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}>
                  {/* Product Image - Full Width */}
                {(() => {
                  const selectedVariant = selectedVariants[index];
                  const isShowingProductShot = showProductShots[index];
                  
                  // Determine which image to show
                  let imageToShow;
                  if (selectedVariant) {
                    imageToShow = selectedVariant.image;
                  } else if (isShowingProductShot && result.productShotImage) {
                    imageToShow = result.productShotImage;
                  } else {
                    imageToShow = result.image;
                  }
                  
                  return imageToShow && (imageToShow.startsWith('http') || imageToShow.includes('PUBLIC_URL') || imageToShow.startsWith('/')) ? (
                    <img 
                      src={imageToShow} 
                      alt={selectedVariant ? `${result.title} - ${selectedVariant.color}` : result.title}
                      style={{
                        width: '100%',
                          height: '400px',
                          objectFit: 'cover',
                          backgroundColor: '#f8f9fa'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      fontSize: '48px', 
                      textAlign: 'center', 
                        height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8f9fa'
                    }}>
                      {result.image}
                    </div>
                  );
                })()}

                  {/* Product Shot Toggle Tag - only show if productShotImage exists */}
                  {result.productShotImage && (
                    <div 
                      onClick={() => toggleProductShot(index)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        color: '#333',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.2s ease',
                        zIndex: 3,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      View Product Shot
                    </div>
                  )}

                  {/* Size Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '155px',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    MEDIUM
                  </div>

                  {/* White Content Box Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}>
                    {/* Title and Price Row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '2px'
                    }}>
                  <h3 style={{ 
                        fontSize: '15px', 
                    fontWeight: '600', 
                        color: '#111',
                        lineHeight: 'normal',
                        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                        flex: 1,
                        marginRight: '12px'
                  }}>
                    {result.title}
                  </h3>
                  
                  <div style={{ 
                    fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#000',
                        lineHeight: '1.2'
                      }}>
                        ${result.price}
                      </div>
                  </div>

                    {/* Brand and Blink Certified Row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#8e8e93',
                        fontWeight: '500'
                      }}>
                        {result.brand || 'Ed Sheeran'}
                      </div>
                      
                      <div style={{
                        fontSize: '12px',
                        color: '#8e8e93',
                        fontWeight: '400'
                      }}>
                        Est. shipping & taxes ${(result.shipping || 8) + Math.round(result.price * 0.08)}
                            </div>
                </div>


                  {/* I WANT THIS Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                      setSlidCardIndexes(prev => {
                        if (!prev.includes(index)) {
                          // Add to selected items
                          setSelectedItems(prevItems => [...prevItems, result]);
                          
                          // Start 30-second countdown timer for this item
                          const itemKey = `${result.title}-${index}`;
                          setUndoTimers(prevTimers => ({
                            ...prevTimers,
                            [itemKey]: 30
                          }));
                          
                          // Start countdown interval
                          const interval = setInterval(() => {
                            setUndoTimers(prevTimers => {
                              const newTime = prevTimers[itemKey] - 1;
                              if (newTime <= 0) {
                                clearInterval(interval);
                                const { [itemKey]: removed, ...rest } = prevTimers;
                                return rest;
                              }
                              return {
                                ...prevTimers,
                                [itemKey]: newTime
                              };
                            });
                          }, 1000);
                          
                          return [...prev, index]; // Add to array if not already there
                        }
                        return prev; // Don't add duplicates
                      });
                  }}
                  style={{
                    width: '100%',
                      height: '53px',
                      paddingTop: '8px',
                      background: '#111',
                      color: '#FFF',
                      border: '1px solid rgba(255, 255, 255, 0.30)',
                      borderRadius: '155px',
                      fontSize: '25px',
                      fontWeight: '400',
                    cursor: 'pointer',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      fontFamily: '"FBS Machro", "Bebas Neue", "Arial Black", system-ui, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 14px 0 rgba(255, 255, 255, 0.45) inset',
                      lineHeight: '1',
                      textAlign: 'center'
                    }}
                  >
                    I WANT THIS
                </motion.button>
                  </div>

                </div>
                </motion.div>
              </motion.div>
                  ))}
                  
                  {/* Divider and Secondary Options */}
                  {secondaryProducts.length > 0 && (
                    <>
                      <div style={{
                        margin: '20px 0 16px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          flex: 1,
                          height: '1px',
                          background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)'
                        }}></div>
                        <span style={{
                          fontSize: '13px',
                          color: '#64748b',
                          fontWeight: '500',
                          padding: '0 8px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          Secondary options
                        </span>
                        <div style={{
                          flex: 1,
                          height: '1px',
                          background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)'
                        }}></div>
                      </div>
                      
                      {/* Secondary Options */}
                      {secondaryProducts.map((result, index) => (
                        <motion.div
                          key={`secondary-${index}`}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            delay: (primaryProducts.length + index) * 0.15,
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid #e2e8f0',
                            opacity: 0.95
                          }}
                        >
                          {/* Product Image */}
                          {result.image && (result.image.startsWith('http') || result.image.includes('PUBLIC_URL') || result.image.startsWith('/')) ? (
                            <img 
                              src={result.image} 
                              alt={result.title}
                              style={{
                                width: '100%',
                                height: '140px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                backgroundColor: '#fafbfc'
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
                          <div style={{ marginBottom: '16px' }}>
                            <h3 style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              marginBottom: '6px',
                              color: '#1e293b',
                              letterSpacing: '-0.025em',
                              lineHeight: '1.4'
                            }}>
                              {result.title}
                            </h3>
                            
                            <div style={{ 
                              fontSize: '18px', 
                              fontWeight: '700', 
                              color: '#0f172a',
                              marginBottom: '4px'
                            }}>
                              ${result.usedPrice || result.price} {result.shipping > 0 && (
                                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                                  + ${result.shipping} shipping
                                </span>
                              )}
                            </div>
                            
                            {result.condition && (
                              <div style={{
                                fontSize: '12px',
                                color: '#f59e0b',
                                fontWeight: '500',
                                marginTop: '4px'
                              }}>
                                {result.condition}
                              </div>
                            )}
                          </div>

                          {/* Buy Button */}
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onClose(); // Close web view first
                              setTimeout(() => {
                                onPurchaseIntent(result); // Then trigger purchase intent in chat
                              }, 300);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 20px',
                              background: '#64748b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '15px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              letterSpacing: '-0.025em',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>I want this</span>
                            <span style={{
                              fontSize: '15px',
                              fontWeight: '700'
                            }}>
                              ${result.usedPrice || result.price}
                            </span>
                          </motion.button>
                        </motion.div>
                      ))}
                    </>
                  )}
                </>
              );
            })()}
          </div>
            </div>
          </>
        )}

      {/* Checkout Button - Slides up when items are selected */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
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
                // Go back to WhatsApp with group purchase
                onClose();
                setTimeout(() => {
                  onPurchaseIntent({
                    type: 'group-purchase',
                    items: selectedItems,
                    count: selectedItems.length,
                    totalPrice: selectedItems.reduce((sum, item) => sum + item.price + (item.shipping || 0), 0),
                    timeLimit: 30, // 30 minutes
                    originalSearchResults: products // Pass the full product list
                  });
                }, 300);
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
                position: 'relative',
                boxShadow: '0 -4px 15px 0 rgba(0, 0, 0, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.2, 
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.7031 22.1211C30.0696 22.1211 30.3956 22.2532 30.6807 22.5176C30.9759 22.7922 31.123 23.1133 31.123 23.4795C31.1229 23.7134 30.9802 24.0383 30.6953 24.4551C29.2802 26.4689 27.0003 28.0971 23.8545 29.3379C21.0242 30.4465 18.2288 31 15.4697 31C7.80392 30.9999 2.76447 28.8443 0.351562 24.5322C0.117401 24.1152 -1.33374e-08 23.7534 0 23.4482C0.000101261 23.1026 0.127446 22.7975 0.381836 22.5332C0.626178 22.2688 0.916959 22.1367 1.25293 22.1367C1.71093 22.1369 2.17441 22.4318 2.64258 23.0215C3.00904 23.4893 3.37572 23.9625 3.74219 24.4404C6.15508 26.7795 9.94745 27.9492 15.1191 27.9492C17.1247 27.9492 19.1663 27.6697 21.2432 27.1104C23.6253 26.4594 25.4575 25.5738 26.7402 24.4551C27.2085 23.9873 27.6772 23.525 28.1455 23.0674C28.8276 22.4368 29.3468 22.1211 29.7031 22.1211ZM5.94336 8.41602C6.32755 8.41612 6.67578 8.59323 6.9873 8.94629C9.35547 11.5949 11.5003 13.4179 13.4219 14.415C14.0344 14.7266 14.3406 15.1263 14.3408 15.6143C14.3408 15.9881 14.1489 16.3572 13.7646 16.7207C11.2926 19.0162 8.70121 21.032 5.99023 22.7666C5.69943 22.9535 5.42372 23.0469 5.16406 23.0469C4.79016 23.0469 4.46305 22.9011 4.18262 22.6104C3.91255 22.3091 3.77734 21.9716 3.77734 21.5977C3.77735 21.1822 3.97969 20.8184 4.38477 20.5068L10.4307 15.8955C9.50628 15.2827 8.3635 14.3423 7.00293 13.0752C5.34099 11.5067 4.50977 10.4208 4.50977 9.81836C4.50984 9.44455 4.65553 9.11729 4.94629 8.83691C5.23705 8.55666 5.56956 8.41602 5.94336 8.41602ZM26.4707 9.41309C26.8446 9.41309 27.1727 9.55877 27.4531 9.84961C27.7438 10.13 27.8887 10.4625 27.8887 10.8467C27.8887 11.1998 27.7333 11.5322 27.4219 11.8438C26.4247 12.9032 24.8713 14.4148 22.7627 16.3779C23.3444 16.8038 24.0614 17.4632 24.9131 18.3564C25.9206 19.4055 26.6114 20.0911 26.9854 20.4131C27.3593 20.7351 27.5459 21.0884 27.5459 21.4727C27.5459 21.8569 27.4062 22.1946 27.126 22.4854C26.8455 22.7762 26.5175 22.9219 26.1436 22.9219C25.8529 22.9218 25.5621 22.8127 25.2715 22.5947C24.856 22.2935 23.9681 21.4308 22.6074 20.0078C21.5687 18.9172 20.5656 18.1855 19.5996 17.8115C18.8104 17.5207 18.416 17.0888 18.416 16.5176C18.4162 15.9984 18.7747 15.5673 19.4912 15.2246C20.4571 14.7572 21.5171 13.9163 22.6699 12.7012C24.2798 11.0186 25.2348 10.0521 25.5361 9.80273C25.8476 9.54317 26.1592 9.4132 26.4707 9.41309ZM15.6533 0.461914C23.3195 0.461944 28.3586 2.61828 30.7715 6.93066C31.0056 7.34762 31.123 7.70857 31.123 8.01367C31.123 8.35939 30.9957 8.66432 30.7412 8.92871C30.4969 9.19308 30.2069 9.32512 29.8711 9.3252C29.413 9.3252 28.9498 9.03034 28.4814 8.44043C28.1149 7.97258 27.7483 7.49951 27.3818 7.02148C24.969 4.68232 21.1765 3.51277 16.0049 3.5127C13.9994 3.5127 11.9576 3.79224 9.88086 4.35156C7.49852 5.00249 5.66561 5.88805 4.38281 7.00684C3.91454 7.47464 3.44581 7.9369 2.97754 8.39453C2.29542 9.02512 1.77625 9.34082 1.41992 9.34082C1.05354 9.34074 0.727367 9.2087 0.442383 8.94434C0.147353 8.66986 0.000103062 8.34932 0 7.9834C2.78938e-09 7.74949 0.142707 7.4238 0.427734 7.00684C1.84288 4.99302 4.12363 3.36584 7.26953 2.125C10.0998 1.01643 12.8944 0.461914 15.6533 0.461914Z" fill="white"/>
                </svg>
                <span>Back to Blink</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.3,
                  ease: [0.68, -0.55, 0.265, 1.55]
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  background: 'white',
                  color: '#E3591D',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                {selectedItems.length}
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safari Bottom Navigation Bar - Fixed Position */}
      <div className="safari-bottom-bar">
        <img 
          src={`${process.env.PUBLIC_URL}/safari-bottom.png`}
          alt="Safari navigation bar"
        />
      </div>
    </div>
  );
};

const PurchaseConfirmationCard = ({ data, onConfirmPurchase }) => {
  const shippingAndTax = (data.item.shipping || 8) + Math.round(data.item.price * 0.08);
  const totalWithShippingTax = data.item.price + shippingAndTax;
  
  return (
    <>
      {/* Regular WhatsApp-style message content */}
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
          ✨ Ready to Order
          </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>{data.item.title}</strong>
          </div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#0088cc', marginBottom: '8px' }}>
          All in total: ${totalWithShippingTax}
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
          📍 {String(data.name || '')}, {String(data.address || '')}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          🕐 Arrives {String(data.item?.deliveryDate || '')}
          </div>
        </div>
        
      {/* Separate colored buttons */}
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <motion.button
          whileHover={{ backgroundColor: '#0066cc' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfirmPurchase(data)}
            style={{
              width: '100%',
            padding: '12px 16px',
              backgroundColor: '#0088cc',
              color: 'white',
              border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Place Order
          </motion.button>
          <motion.button
          whileHover={{ backgroundColor: '#cc0000' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
            padding: '12px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Cancel
          </motion.button>
        </div>
    </>
  );
};

const AccountInfoCard = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressToNextTier = () => {
    if (!data.nextTierBalance) return 100; // Gold tier (max)
    return Math.min((data.balance / data.nextTierBalance) * 100, 100);
  };

  const InfoSection = ({ title, children, icon }) => (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '16px', 
      borderRadius: '12px', 
      marginBottom: '16px',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
        {icon} {title}
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '14px', color: '#666' }}>{label}:</span>
      <span style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>{value}</span>
    </div>
  );

  return (
    <>
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#000' }}>
          ℹ️ Everything Blink Knows About You
        </div>
        
        {/* Personal Information */}
        <InfoSection title="Personal Information" icon="👤">
          <InfoRow label="Name" value={data.name} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Phone" value={data.phone} />
          <InfoRow label="Address" value={data.address} />
          <InfoRow label="Member Since" value={data.memberSince} />
        </InfoSection>

        {/* Account & Balance */}
        <InfoSection title="Account & Balance" icon="💳">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Current Balance:</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#0088cc' }}>
              ${data.balance}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: data.tierColor, 
              borderRadius: '50%', 
              marginRight: '8px' 
            }}></div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
              {data.tier} Tier
            </span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
              ({data.blinkFee} fee)
            </span>
          </div>
          
          <InfoRow label="Total Spent" value={`$${data.totalSpent}`} />
          
          {data.nextTier && (
            <>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                Progress to {data.nextTier}: ${data.balance} / ${data.nextTierBalance}
              </div>
              <div style={{ 
                width: '100%', 
                height: '6px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  width: `${getProgressToNextTier()}%`, 
                  height: '100%', 
                  backgroundColor: data.tierColor,
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </>
          )}
          
          {!data.nextTier && (
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
              🏆 Highest tier achieved!
            </div>
          )}
          
          {/* Add Funds Button */}
          <motion.button
            whileHover={{ backgroundColor: '#0056b3' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => data.onFunded && data.onFunded('show_funding_methods')}
            style={{
              width: '100%',
              backgroundColor: '#0088cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>💰</span>
            Add Funds
          </motion.button>
        </InfoSection>

        {/* Sizes */}
        <InfoSection title="Your Sizes" icon="📏">
          <InfoRow label="Shoe Size" value={data.shoeSize} />
          <InfoRow label="Clothing Size" value={data.clothingSize} />
          <InfoRow label="Pants Size" value={data.pantsSize} />
        </InfoSection>

        {/* Interests & Preferences */}
        <InfoSection title="Interests & Preferences" icon="❤️">
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '6px' }}>Interests:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.interests?.map((interest, index) => (
                <span key={index} style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <InfoRow label="Prefers Fast Shipping" value={data.preferences?.prefersFastShipping ? 'Yes' : 'No'} />
          <InfoRow label="Max Budget" value={`$${data.preferences?.maxBudget}`} />
        </InfoSection>

        {/* Favorite Brands */}
        <InfoSection title="Favorite Brands" icon="🏷️">
          {data.favoriteBrands && Object.entries(data.favoriteBrands).map(([category, brands]) => (
            <div key={category} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '6px', textTransform: 'capitalize' }}>
                {category}:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {brands.map((brand, index) => (
                  <span key={index} style={{
                    backgroundColor: '#f3e5f5',
                    color: '#7b1fa2',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          {data.preferences?.brandsToAvoid && data.preferences.brandsToAvoid.length > 0 && (
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '6px' }}>
                Brands to Avoid:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {data.preferences.brandsToAvoid.map((brand, index) => (
                  <span key={index} style={{
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}
        </InfoSection>

        {/* Recent Orders */}
        {data.recentOrders && data.recentOrders.length > 0 && (
          <InfoSection title="Recent Orders" icon="📦">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.recentOrders.map((order, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: '#f1f3f4' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('Order clicked:', order);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500', color: '#000', marginBottom: '2px' }}>
                      {order.item}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {order.date}
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#0088cc' }}>
                    ${order.price}
                  </div>
                </motion.button>
              ))}
            </div>
          </InfoSection>
        )}
      </div>
    </>
  );
};

const USDCFundingCard = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
          🪙 Fund with USDC
        </div>
        
        <div style={{ fontSize: '15px', color: '#666', marginBottom: '16px' }}>
          Send any amount of USDC to this address and your balance will be updated automatically:
        </div>
        
        {/* Wallet Address */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '16px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '13px', 
            fontFamily: 'monospace', 
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            wordBreak: 'break-all',
            border: '1px solid #e0e0e0',
            color: '#495057',
            marginBottom: '12px'
          }}>
            {data.walletAddress}
          </div>
          
          <motion.button
            whileHover={{ backgroundColor: '#6f42c1' }}
            whileTap={{ scale: 0.98 }}
            onClick={copyToClipboard}
            style={{
              width: '100%',
              backgroundColor: copied ? '#28a745' : '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>{copied ? '✓' : '📋'}</span>
            {copied ? 'Copied!' : 'Copy Address'}
          </motion.button>
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          color: '#666', 
          backgroundColor: '#e3f2fd', 
          padding: '12px', 
          borderRadius: '8px',
          border: '1px solid #bbdefb'
        }}>
          💡 <strong>Note:</strong> Only send USDC on supported networks. Your balance will update within a few minutes after the transaction confirms.
        </div>
      </div>
    </>
  );
};

const BankTransferFundingCard = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const copyAccountDetails = () => {
    const details = `Account Name: ${data.accountDetails.accountName}
Bank: ${data.accountDetails.bankName}
Routing Number: ${data.accountDetails.routingNumber}
Account Number: ${data.accountDetails.accountNumber}`;
    
    navigator.clipboard.writeText(details).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
          🏦 Fund with Bank Transfer
        </div>
        
        <div style={{ fontSize: '15px', color: '#666', marginBottom: '16px' }}>
          Send any amount via bank transfer to the account details below and your balance will be updated automatically:
        </div>
        
        {/* Account Details */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '16px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Account Name</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>{data.accountDetails.accountName}</div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Bank</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>{data.accountDetails.bankName}</div>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Routing Number</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>{data.accountDetails.routingNumber}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Account Number</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>{data.accountDetails.accountNumber}</div>
          </div>
        </div>
        
        {/* Copy Button */}
        <motion.button
          whileHover={{ backgroundColor: '#059669' }}
          whileTap={{ scale: 0.98 }}
          onClick={copyAccountDetails}
          style={{
            width: '100%',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          {copied ? '✓ Copied!' : '📋 Copy Account Details'}
        </motion.button>
        
        {/* Info Note */}
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '12px', 
          borderRadius: '8px',
          border: '1px solid #bbdefb'
        }}>
          💡 <strong>Note:</strong> Bank transfers typically take 1-3 business days to process. Your balance will update automatically once the transfer is received.
        </div>
      </div>
    </>
  );
};

const SubscriptionSetupCard = ({ data, onSubscriptionSetup }) => {
  return (
    <>
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
          🔄 Set Up Subscription
        </div>
        
        <div style={{ fontSize: '15px', color: '#666', marginBottom: '20px' }}>
          I can set up a {data.product} subscription for you. You'll get fresh supplies automatically and can skip, change, or cancel any time.
        </div>
        
        {/* Subscription Benefits */}
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '16px', 
          borderRadius: '12px',
          border: '1px solid #bae6fd',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600', marginBottom: '8px' }}>
            ✨ Subscription Benefits
          </div>
          <ul style={{ fontSize: '13px', color: '#0369a1', margin: 0, paddingLeft: '16px', lineHeight: '1.5' }}>
            <li>Never run out of your essentials</li>
            <li>Skip, change, or cancel anytime</li>
            <li>Monthly reminders before each delivery</li>
            <li>Same great price, automatic convenience</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            whileHover={{ backgroundColor: '#059669' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubscriptionSetup('yes', data)}
            style={{
              flex: 1,
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Yes, Set Up Subscription
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: '#f3f4f6' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubscriptionSetup('no', data)}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Not Right Now
          </motion.button>
        </div>
      </div>
    </>
  );
};

const SubscriptionNudgeCard = ({ data, onSubscriptionResponse }) => {
  return (
    <>
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
          🔄 Never Run Out Again?
        </div>
        
        <div style={{ fontSize: '15px', color: '#666', marginBottom: '16px' }}>
          Want me to set this up as a subscription so you never run out? You can skip, change, or cancel any time.
        </div>
        
        {/* Product Info */}
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '12px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            🥤
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              {data.item?.title || 'Product'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Monthly delivery • Skip anytime
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            whileHover={{ backgroundColor: '#059669' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubscriptionResponse('yes', data)}
            style={{
              flex: 1,
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Yes, Subscribe
          </motion.button>
          
          <motion.button
            whileHover={{ backgroundColor: '#f3f4f6' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubscriptionResponse('no', data)}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Just This Once
          </motion.button>
        </div>
      </div>
    </>
  );
};

const FundingMethodSelectionCard = ({ data, onFunded, onWebView, onCreditCardFunding }) => {
  const handleCreditCardFunding = () => {
    // Open credit card funding interface
    const creditCardData = {
      type: 'credit-card-funding',
      maxAmount: 500,
      showWebView: true
    };
    onCreditCardFunding && onCreditCardFunding(creditCardData);
  };

  const handleUSDCFunding = () => {
    // Trigger USDC funding flow
    onFunded('usdc_funding', true);
  };

  const handleBankTransferFunding = () => {
    // Trigger bank transfer funding flow
    onFunded('bank_transfer_funding', true);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '20px',
      padding: '32px 24px',
      margin: '0 -8px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '8px', 
          color: '#0f172a',
          letterSpacing: '-0.025em'
        }}>
          Add Funds
        </div>
        <div style={{ 
          fontSize: '16px', 
          color: '#64748b', 
          fontWeight: '400',
          lineHeight: '1.5'
        }}>
          Choose your preferred funding method
        </div>
      </div>

      {/* Gold Membership Offer - Redesigned */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '20px', 
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            fontSize: '16px', 
            color: '#92400e', 
            fontWeight: '600', 
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>✨</span>
            Blink Gold
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#92400e', 
            lineHeight: '1.4',
            opacity: 0.9
          }}>
            Fund $5,000+ with USDC or bank transfer to unlock better rates on all purchases
          </div>
        </div>
      </div>
      
      {/* Funding Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Credit Card Option */}
        <motion.button
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 10px 25px -3px rgba(0, 136, 204, 0.2), 0 4px 6px -2px rgba(0, 136, 204, 0.1)'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreditCardFunding}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0088cc 0%, #0077b3 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '20px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 136, 204, 0.3), 0 2px 4px -1px rgba(0, 136, 204, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Credit Card Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Credit Card</div>
              <div style={{ fontSize: '13px', opacity: 0.8, fontWeight: '400' }}>Instant • Up to $500</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </motion.button>

        {/* USDC Option */}
        <motion.button
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 10px 25px -3px rgba(124, 58, 237, 0.2), 0 4px 6px -2px rgba(124, 58, 237, 0.1)'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUSDCFunding}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '20px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3), 0 2px 4px -1px rgba(124, 58, 237, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* USDC Logo */}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
              color: '#7c3aed'
            }}>
              $
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>USDC</div>
              <div style={{ fontSize: '13px', opacity: 0.8, fontWeight: '400' }}>Any amount • Crypto wallet</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </motion.button>

        {/* Bank Transfer Option */}
        <motion.button
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 10px 25px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(16, 185, 129, 0.1)'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBankTransferFunding}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '20px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Bank Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.5 1L2 6v2h20V6m-5 4v7h3v-7M2 22h20v-2H2m1.5-4h4v-7h-4m6 0v7h4v-7m-13-2h18v2H2.5z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Bank Transfer</div>
              <div style={{ fontSize: '13px', opacity: 0.8, fontWeight: '400' }}>Any amount • 1-3 business days</div>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

const BalanceInquiryCard = ({ data, onFunded }) => {
  const isConfirmation = data.isConfirmation;
  
  return (
    <>
      {/* Regular WhatsApp-style message content */}
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
          {isConfirmation ? '🎉 Funds Added Successfully!' : '💰 Your Current Balance'}
        </div>
        
        {/* Funding confirmation message */}
        {isConfirmation && data.fundingAmount && (
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid #4caf50'
          }}>
            <div style={{ fontSize: '14px', color: '#2e7d32', textAlign: 'center' }}>
              ✅ Successfully added <strong>${data.fundingAmount}</strong> to your account
            </div>
          </div>
        )}
        
        {/* Tier status for confirmation */}
        {isConfirmation && data.tier && (
          <div style={{ 
            backgroundColor: '#f3e5f5', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid #9c27b0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: data.tierColor, 
                borderRadius: '50%'
              }}></div>
              <div style={{ fontSize: '14px', color: '#7b1fa2', textAlign: 'center' }}>
                🎯 You're now <strong>{data.tier} Tier</strong> with <strong>{data.blinkFee}</strong> fees
              </div>
            </div>
          </div>
        )}
        
        {/* Balance display */}
        <div style={{ 
          backgroundColor: isConfirmation ? '#e3f2fd' : '#f8f9fa', 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '16px',
          textAlign: 'center',
          border: isConfirmation ? '1px solid #2196f3' : 'none'
        }}>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#0088cc',
            marginBottom: '4px'
          }}>
            ${data.balance || data.currentBalance}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {isConfirmation ? 'Your new balance' : 'Available to spend'}
          </div>
        </div>
        
        <div style={{ fontSize: '15px', color: '#000', marginBottom: '16px' }}>
          {isConfirmation 
            ? "Perfect! You're all set to continue shopping. What would you like to find next?" 
            : "Your account is looking good! Need to add more funds for your next purchase?"
          }
        </div>
      </div>
      
      {/* Add funds button */}
      {data.showAddFunds && (
        <div style={{ marginTop: '12px' }}>
          <motion.button
            whileHover={{ backgroundColor: '#0077b3' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (onFunded) {
                // Show funding method selection
                onFunded('show_funding_methods', true);
              }
            }}
            style={{
              width: '100%',
              backgroundColor: '#0088cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>💳</span>
            Add More Funds
          </motion.button>
        </div>
      )}
    </>
  );
};

const GroupOrderSummaryCard = ({ data, onWebView, onCancelOrder }) => {
  return (
    <>
      {/* Regular WhatsApp-style message content */}
      <div className="message-text">
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#000' }}>
          🛍️ Your order is on its way.
      </div>
        
        {/* Items list */}
        <div style={{ marginBottom: '16px' }}>
          {data.items.map((item, index) => (
            <div key={index} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: index < data.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '2px' }}>
                {index + 1}. {item.title}
          </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                ${item.price} + ${item.shipping || 8} shipping
              </div>
            </div>
          ))}
        </div>
        
        {/* Order total breakdown */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Subtotal:</span>
            <span style={{ fontSize: '14px', color: '#666' }}>${data.subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Shipping:</span>
            <span style={{ fontSize: '14px', color: '#666' }}>${data.shipping}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Tax:</span>
            <span style={{ fontSize: '14px', color: '#666' }}>${data.tax}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Silver Tier Fee (3%):</span>
            <span style={{ fontSize: '14px', color: '#666' }}>${data.silverFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #dee2e6', paddingTop: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#000' }}>Total:</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#0088cc' }}>${data.total}</span>
          </div>
        </div>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
          🚚 Estimated delivery: Tomorrow
        </div>
        <div style={{ fontSize: '14px', color: '#ff6b35', fontWeight: '500' }}>
          💬 Just message me if you need to make any changes. You have 3 minutes until the order is placed.
        </div>
      </div>
      
      {/* Action buttons */}
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <motion.button
          whileHover={{ backgroundColor: '#cc0000' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (onCancelOrder) {
                onCancelOrder();
              }
            }}
            style={{
              width: '100%',
            padding: '12px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Cancel Order
          </motion.button>
        </div>
    </>
  );
};

const FundingRequiredCard = ({ data, onFunded, onCreditCardFunding }) => {
  const handleCreditCardFunding = () => {
    // Open credit card funding interface
    const creditCardData = {
      type: 'credit-card-funding',
      maxAmount: 500,
      showWebView: true
    };
    onCreditCardFunding && onCreditCardFunding(creditCardData);
  };

  const handleUSDCFunding = () => {
    // Trigger USDC funding flow
    onFunded('usdc_funding', true);
  };

  const handleBankTransferFunding = () => {
    // Trigger bank transfer funding flow
    onFunded('bank_transfer_funding', true);
  };

  return (
    <motion.div 
      className="funding-required-card"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '20px',
        padding: '32px 24px',
        marginBottom: '8px',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)'
      }}
    >
      <div className="funding-content">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            marginBottom: '8px', 
            color: '#0f172a',
            letterSpacing: '-0.025em'
          }}>
            Add ${data.requiredAmount}
          </div>
          <div style={{ 
            fontSize: '15px', 
            color: '#64748b', 
            fontWeight: '400',
            lineHeight: '1.5'
          }}>
            Choose your funding method to complete purchase
          </div>
        </div>
        
        {/* Gold Membership Offer - Redesigned */}
        <div style={{ 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          padding: '16px', 
          borderRadius: '12px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30%',
            right: '-15%',
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#92400e', 
              fontWeight: '600', 
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '16px' }}>✨</span>
              Blink Gold
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#92400e', 
              lineHeight: '1.3',
              opacity: 0.9
            }}>
              Fund $5,000+ with USDC or bank transfer to unlock better rates
            </div>
          </div>
        </div>
        
        {/* Funding Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Credit Card Option */}
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 10px 25px -3px rgba(0, 136, 204, 0.2), 0 4px 6px -2px rgba(0, 136, 204, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreditCardFunding}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0088cc 0%, #0077b3 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '18px 20px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 136, 204, 0.3), 0 2px 4px -1px rgba(0, 136, 204, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Credit Card Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>Credit Card</div>
                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: '400' }}>Instant • Up to $500</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </motion.button>
          
          {/* USDC Option */}
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 10px 25px -3px rgba(124, 58, 237, 0.2), 0 4px 6px -2px rgba(124, 58, 237, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUSDCFunding}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '18px 20px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3), 0 2px 4px -1px rgba(124, 58, 237, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* USDC Logo */}
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700',
                color: '#7c3aed'
              }}>
                $
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>USDC</div>
                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: '400' }}>Any amount • Crypto wallet</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </motion.button>
          
          {/* Bank Transfer Option */}
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 10px 25px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(16, 185, 129, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBankTransferFunding}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '18px 20px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3), 0 2px 4px -1px rgba(16, 185, 129, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Bank Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.5 1L2 6v2h20V6m-5 4v7h3v-7M2 22h20v-2H2m1.5-4h4v-7h-4m6 0v7h4v-7m-13-2h18v2H2.5z"/>
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>Bank Transfer</div>
                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: '400' }}>Any amount • 1-3 business days</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </motion.button>
          
          {/* Cancel Option */}
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
            Available in your size (Medium)
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

const OrderSuccessCard = ({ data }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: '#f8f9fa',
        borderRadius: '16px',
        padding: '24px',
        margin: '16px 0',
        textAlign: 'center',
        border: '1px solid #e9ecef'
      }}
    >
      {/* Product Image */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{
          marginBottom: '20px'
        }}
      >
        {data.item.image && (data.item.image.startsWith('http') || data.item.image.includes('PUBLIC_URL') || data.item.image.startsWith('/')) ? (
          <img 
            src={data.item.image} 
            alt={data.item.title}
            style={{ 
              width: '120px', 
              height: '120px',
              objectFit: 'cover', 
              borderRadius: '12px',
              backgroundColor: '#f9fafb'
            }}
          />
        ) : (
          <div style={{ 
            width: '120px', 
            height: '120px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            {data.item.image || '📦'}
          </div>
        )}
      </motion.div>

      {/* Main Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#000',
          marginBottom: '8px',
          lineHeight: '1.4'
        }}
      >
        Paid. {data.compliment || "Great choice!"}
      </motion.div>

      {/* Size Confirmation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '16px'
        }}
      >
        Size: <strong>{data.size}</strong>
      </motion.div>

      {/* Order Details */}
      {data.orderNumber && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '8px'
          }}
        >
          Order: <strong>{data.orderNumber}</strong>
        </motion.div>
      )}

      {data.arrivalDay && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            fontSize: '14px',
            color: '#0088cc',
            fontWeight: '500'
          }}
        >
          Arrives {data.arrivalDay}
        </motion.div>
      )}

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
    {/* Blink Avatar - same as header */}
    <div style={{
      background: '#1e293b',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px',
      flexShrink: 0
    }}>
      <svg width="20" height="20" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.7031 22.1211C30.0696 22.1211 30.3956 22.2532 30.6807 22.5176C30.9759 22.7922 31.123 23.1133 31.123 23.4795C31.1229 23.7134 30.9802 24.0383 30.6953 24.4551C29.2802 26.4689 27.0003 28.0971 23.8545 29.3379C21.0242 30.4465 18.2288 31 15.4697 31C7.80392 30.9999 2.76447 28.8443 0.351562 24.5322C0.117401 24.1152 -1.33374e-08 23.7534 0 23.4482C0.000101261 23.1026 0.127446 22.7975 0.381836 22.5332C0.626178 22.2688 0.916959 22.1367 1.25293 22.1367C1.71093 22.1369 2.17441 22.4318 2.64258 23.0215C3.00904 23.4893 3.37572 23.9625 3.74219 24.4404C6.15508 26.7795 9.94745 27.9492 15.1191 27.9492C17.1247 27.9492 19.1663 27.6697 21.2432 27.1104C23.6253 26.4594 25.4575 25.5738 26.7402 24.4551C27.2085 23.9873 27.6772 23.525 28.1455 23.0674C28.8276 22.4368 29.3468 22.1211 29.7031 22.1211ZM5.94336 8.41602C6.32755 8.41612 6.67578 8.59323 6.9873 8.94629C9.35547 11.5949 11.5003 13.4179 13.4219 14.415C14.0344 14.7266 14.3406 15.1263 14.3408 15.6143C14.3408 15.9881 14.1489 16.3572 13.7646 16.7207C11.2926 19.0162 8.70121 21.032 5.99023 22.7666C5.69943 22.9535 5.42372 23.0469 5.16406 23.0469C4.79016 23.0469 4.46305 22.9011 4.18262 22.6104C3.91255 22.3091 3.77734 21.9716 3.77734 21.5977C3.77735 21.1822 3.97969 20.8184 4.38477 20.5068L10.4307 15.8955C9.50628 15.2827 8.3635 14.3423 7.00293 13.0752C5.34099 11.5067 4.50977 10.4208 4.50977 9.81836C4.50984 9.44455 4.65553 9.11729 4.94629 8.83691C5.23705 8.55666 5.56956 8.41602 5.94336 8.41602ZM26.4707 9.41309C26.8446 9.41309 27.1727 9.55877 27.4531 9.84961C27.7438 10.13 27.8887 10.4625 27.8887 10.8467C27.8887 11.1998 27.7333 11.5322 27.4219 11.8438C26.4247 12.9032 24.8713 14.4148 22.7627 16.3779C23.3444 16.8038 24.0614 17.4632 24.9131 18.3564C25.9206 19.4055 26.6114 20.0911 26.9854 20.4131C27.3593 20.7351 27.5459 21.0884 27.5459 21.4727C27.5459 21.8569 27.4062 22.1946 27.126 22.4854C26.8455 22.7762 26.5175 22.9219 26.1436 22.9219C25.8529 22.9218 25.5621 22.8127 25.2715 22.5947C24.856 22.2935 23.9681 21.4308 22.6074 20.0078C21.5687 18.9172 20.5656 18.1855 19.5996 17.8115C18.8104 17.5207 18.416 17.0888 18.416 16.5176C18.4162 15.9984 18.7747 15.5673 19.4912 15.2246C20.4571 14.7572 21.5171 13.9163 22.6699 12.7012C24.2798 11.0186 25.2348 10.0521 25.5361 9.80273C25.8476 9.54317 26.1592 9.4132 26.4707 9.41309ZM15.6533 0.461914C23.3195 0.461944 28.3586 2.61828 30.7715 6.93066C31.0056 7.34762 31.123 7.70857 31.123 8.01367C31.123 8.35939 30.9957 8.66432 30.7412 8.92871C30.4969 9.19308 30.2069 9.32512 29.8711 9.3252C29.413 9.3252 28.9498 9.03034 28.4814 8.44043C28.1149 7.97258 27.7483 7.49951 27.3818 7.02148C24.969 4.68232 21.1765 3.51277 16.0049 3.5127C13.9994 3.5127 11.9576 3.79224 9.88086 4.35156C7.49852 5.00249 5.66561 5.88805 4.38281 7.00684C3.91454 7.47464 3.44581 7.9369 2.97754 8.39453C2.29542 9.02512 1.77625 9.34082 1.41992 9.34082C1.05354 9.34074 0.727367 9.2087 0.442383 8.94434C0.147353 8.66986 0.000103062 8.34932 0 7.9834C2.78938e-09 7.74949 0.142707 7.4238 0.427734 7.00684C1.84288 4.99302 4.12363 3.36584 7.26953 2.125C10.0998 1.01643 12.8944 0.461914 15.6533 0.461914Z" fill="white"/>
      </svg>
    </div>
    <div style={{ 
      display: 'flex', 
      gap: '2px',
      alignItems: 'center',
      background: '#ffffff',
      padding: '8px 12px',
      borderRadius: '18px',
      borderBottomLeftRadius: '4px',
      boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)'
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
      handleImageSearchLocal(file);
    }
  };

  const handleImageSearchLocal = (imageFile) => {
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
            handleImageSearchLocal(file);
          }
          break;
        }
      }
    }
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
            <svg data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
              <path fillRule="evenodd" clipRule="evenodd" d="M14.5 2.5H1.5V9.18933L2.96966 7.71967L3.18933 7.5H3.49999H6.63001H6.93933L6.96966 7.46967L10.4697 3.96967L11.5303 3.96967L14.5 6.93934V2.5ZM8.00066 8.55999L9.53034 10.0897L10.0607 10.62L9.00001 11.6807L8.46968 11.1503L6.31935 9H3.81065L1.53032 11.2803L1.5 11.3106V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H13.5C14.0523 13.5 14.5 13.0523 14.5 12.5V9.06066L11 5.56066L8.03032 8.53033L8.00066 8.55999ZM4.05312e-06 10.8107V12.5C4.05312e-06 13.8807 1.11929 15 2.5 15H13.5C14.8807 15 16 13.8807 16 12.5V9.56066L16.5607 9L16.0303 8.46967L16 8.43934V2.5V1H14.5H1.5H4.05312e-06V2.5V10.6893L-0.0606689 10.75L4.05312e-06 10.8107Z" fill="currentColor"/>
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
      handleImageSearchLocal(file);
    }
  };

  const handleImageSearchLocal = (imageFile) => {
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
            handleImageSearchLocal(file);
          }
          break;
        }
      }
    }
  };

  return (
    <div className="whatsapp-input-container">
      <div className="whatsapp-input-wrapper">
        {/* Plus button */}
        <button 
          type="button"
          className="whatsapp-plus-btn"
        >
          <Plus size={24} />
        </button>
        
        {/* Input field */}
        <form onSubmit={handleSubmit} className="whatsapp-input-form">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={handlePaste}
            placeholder="Message"
            className="whatsapp-message-input"
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        </form>
        
        {/* Right side buttons */}
        <div className="whatsapp-right-buttons">
          {/* Camera button */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="whatsapp-icon-btn"
          >
            <Camera size={24} />
          </button>
          
          {/* Microphone button */}
          <button 
            type="button"
            className="whatsapp-icon-btn"
            onClick={handleSubmit}
          >
            <Mic size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CreditCardFundingInterface = ({ data, onClose, onFundingComplete }) => {
  const [formData, setFormData] = useState({
    cardNumber: '0000 0000 0000 0000',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    email: 'johndoe@gmail.com',
    name: 'John Appleseed',
    address: '123 Main St, New York, NY 10001',
    amount: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [useTestCard, setUseTestCard] = useState(true);
  const [saveInfo, setSaveInfo] = useState(true);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than $0';
    } else if (parseFloat(formData.amount) > data.maxAmount) {
      newErrors.amount = `Amount cannot exceed $${data.maxAmount}`;
    }
    
    // Card number validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Card number must be at least 13 digits';
    }
    
    // Expiry validation
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    }
    
    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const quickAmounts = [10, 25, 50];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowErrors(true);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the funding
    onFundingComplete(parseFloat(formData.amount));
      setIsProcessing(false);
  };

  const getFieldStyle = (fieldName, baseStyle) => ({
    ...baseStyle,
    border: errors[fieldName] ? '2px solid #ff4444' : '1px solid #e1e5e9',
    borderColor: errors[fieldName] ? '#ff4444' : '#e1e5e9'
  });

  const ErrorMessage = ({ error }) => {
    if (!error || !showErrors) return null;
    return (
      <div style={{ color: '#ff4444', fontSize: '12px', marginTop: '4px' }}>
        {error}
      </div>
    );
  };

  const subtotal = parseFloat(formData.amount) || 0;
  const serviceFee = subtotal * 0.038; // 3.8% service fee
  const total = subtotal + serviceFee;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e1e5e9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
          Add Funds
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflow: 'auto'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Deposit Amount */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1a1a1a', 
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              Deposit amount
            </h3>
            
            {/* Quick Amount Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleInputChange('amount', amount.toString())}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: formData.amount === amount.toString() ? '#007bff' : 'white',
                    color: formData.amount === amount.toString() ? 'white' : '#1a1a1a',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    minWidth: '60px'
                  }}
                >
                  ${amount}
                </button>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
                <span style={{ fontSize: '20px' }}>⚙️</span>
                <span style={{ fontSize: '14px' }}>Custom amount</span>
              </div>
            </div>

            {/* Custom Amount Input */}
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter custom amount"
              min="1"
              max="500"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #e1e5e9',
                fontSize: '16px',
                marginBottom: '4px',
                backgroundColor: 'white'
              }}
            />
            <ErrorMessage error={errors.amount} />
          </div>

          {/* Payment Methods */}
          <div style={{ marginBottom: '24px' }}>
            {/* Apple Pay & Google Pay */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button
                  type="button"
                  style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                    cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                  }}
                >
                {/* Apple Logo SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Pay
                </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {/* Google Pay Logo SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Pay
              </button>
            </div>

            <div style={{ 
              textAlign: 'center', 
              color: '#6c757d', 
              fontSize: '14px', 
              margin: '16px 0' 
            }}>
              or
          </div>

            {/* Credit Card Option */}
            <div style={{
              border: '2px solid #007bff',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '16px', 
                  backgroundColor: '#000', 
                  borderRadius: '2px' 
                }}></div>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Credit Card</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: '#007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    backgroundColor: 'white', 
                    borderRadius: '50%' 
                  }}></div>
                </div>
                <span style={{ color: '#007bff', fontSize: '14px', cursor: 'pointer' }}>Change</span>
              </div>
            </div>
          </div>

          {/* Test Card Section */}
          <div style={{ marginBottom: '24px' }}>
            <div 
              onClick={() => setUseTestCard(!useTestCard)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                cursor: 'pointer',
                borderBottom: '1px solid #e1e5e9'
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a' }}>
                Use a test card
              </span>
              <span style={{ fontSize: '18px' }}>{useTestCard ? '▼' : '▶'}</span>
            </div>
            
            {useTestCard && (
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '16px', marginTop: '2px' }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: '14px', color: '#856404', lineHeight: '1.4' }}>
                      <strong>Sandbox environment</strong> - Enter appropriate CC number for your testing 
                      (testing with 3DS requires special numbers)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Card Information */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#1a1a1a' 
              }}>
                Card Information <span style={{ color: '#dc3545' }}>*</span>
            </label>
              
              {/* Card Number */}
              <div style={{ 
                border: '1px solid #e1e5e9', 
                borderRadius: '8px 8px 0 0',
                backgroundColor: 'white',
                position: 'relative'
              }}>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  style={{
                width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px 8px 0 0',
                fontSize: '16px',
                    backgroundColor: 'transparent',
                    outline: 'none'
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <div style={{ width: '24px', height: '16px', backgroundColor: '#1a1f71', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'white', fontWeight: 'bold' }}>VISA</div>
                  <div style={{ width: '24px', height: '16px', backgroundColor: '#eb001b', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px', color: 'white', fontWeight: 'bold' }}>MC</div>
                  <div style={{ width: '24px', height: '16px', backgroundColor: '#006fcf', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px', color: 'white', fontWeight: 'bold' }}>AMEX</div>
                  <div style={{ width: '24px', height: '16px', backgroundColor: '#ff6000', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5px', color: 'white', fontWeight: 'bold' }}>DISC</div>
                </div>
          </div>

          {/* Expiry and CVV */}
              <div style={{ display: 'flex' }}>
              <input
                type="text"
                  value={formData.expiryMonth}
                  onChange={(e) => handleInputChange('expiryMonth', e.target.value.replace(/\D/g, '').substring(0, 2))}
                  placeholder="MM"
                  maxLength="2"
                  style={{
                    width: '25%',
                    padding: '12px 16px',
                    border: '1px solid #e1e5e9',
                    borderTop: 'none',
                    borderRadius: '0',
                  fontSize: '16px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 8px',
                  border: '1px solid #e1e5e9',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  backgroundColor: 'white'
                }}>
                  /
            </div>
                <input
                  type="text"
                  value={formData.expiryYear}
                  onChange={(e) => handleInputChange('expiryYear', e.target.value.replace(/\D/g, '').substring(0, 2))}
                  placeholder="YY"
                  maxLength="2"
                  style={{
                    width: '25%',
                    padding: '12px 16px',
                    border: '1px solid #e1e5e9',
                    borderTop: 'none',
                    borderRadius: '0',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                />
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                  placeholder="CVV"
                maxLength="4"
                  style={{
                    width: '50%',
                    padding: '12px 16px',
                    border: '1px solid #e1e5e9',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '0 12px',
                  border: '1px solid #e1e5e9',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRadius: '0 0 8px 0',
                  backgroundColor: 'white'
                }}>
                  <div style={{ 
                    width: '20px', 
                    height: '12px', 
                    border: '1px solid #ccc', 
                    borderRadius: '2px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '1px',
                      backgroundColor: '#ccc'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '8px',
                      height: '1px',
                      backgroundColor: '#ccc'
                    }}></div>
                  </div>
                </div>
              </div>
              <ErrorMessage error={errors.cardNumber || errors.expiry || errors.cvv} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#1a1a1a' 
              }}>
                Email <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="johndoe@gmail.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              />
              <ErrorMessage error={errors.email} />
          </div>

            {/* Name on card */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#1a1a1a' 
              }}>
                Name on card <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Appleseed"
                style={{
                width: '100%',
                  padding: '12px 16px',
                borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
            />
            <ErrorMessage error={errors.name} />
          </div>

            {/* Address */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#1a1a1a' 
              }}>
                Address <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, New York, NY 10001"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e1e5e9',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  outline: 'none'
                }}
              />
              <ErrorMessage error={errors.address} />
            </div>

            {/* Order Summary */}
            <div style={{ 
              backgroundColor: 'white',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6c757d' }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6c757d' }}>Service fees</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e1e5e9', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Save Info Checkbox */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '24px' 
            }}>
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px', color: '#1a1a1a' }}>
                Save my info for 1-click checkout
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: '#007bff', 
                backgroundColor: '#e7f3ff',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                🔒 Encrypted
              </span>
            </div>

          {/* Submit Button */}
          <button
            type="submit"
              disabled={isProcessing || !formData.amount}
            style={{
              width: '100%',
              padding: '16px',
                backgroundColor: isProcessing || !formData.amount ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
                cursor: isProcessing || !formData.amount ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px'
            }}
          >
            {isProcessing ? (
              <>
                <div style={{
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                  }}></div>
                Processing...
              </>
            ) : (
              <>
                  🔒 Confirm Purchase of ${total.toFixed(2)}
              </>
            )}
          </button>

            {/* Footer */}
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#6c757d' }}>
              This payment will appear on your statement as{' '}
              <span style={{ color: '#007bff', fontWeight: '500' }}>COINFLOW</span>. For support,
              please contact{' '}
              <a href="mailto:support@coinflow.cash" style={{ color: '#007bff' }}>
                support@coinflow.cash
              </a>
            </div>

          <div style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '16px',
            marginTop: '16px',
            fontSize: '12px',
              color: '#6c757d'
            }}>
              <span>Powered by</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: '#007bff', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>C</span>
                </div>
                <span style={{ fontWeight: '600', color: '#1a1a1a' }}>Coinflow</span>
              </div>
              <a href="#" style={{ color: '#007bff' }}>Terms</a>
              <a href="#" style={{ color: '#007bff' }}>Refunds</a>
              <a href="#" style={{ color: '#007bff' }}>Privacy</a>
          </div>
        </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AutobotApp;