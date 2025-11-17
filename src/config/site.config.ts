// ========================================
// CENTRALIZED CONFIGURATION FILE
// Edit all text, colors, buttons, and icons here
// ========================================

export const siteConfig = {
  // ========================================
  // TYPOGRAPHY STYLES
  // ========================================
  typography: {
    h1: {
      className: "text-5xl md:text-6xl lg:text-7xl font-bold leading-tight",
      style: {} as React.CSSProperties,
    },
    h2: {
      className: "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
      style: {} as React.CSSProperties,
    },
    h3: {
      className: "text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight",
      style: {} as React.CSSProperties,
    },
    paragraph: {
      className: "text-base md:text-lg lg:text-xl leading-relaxed",
      style: {} as React.CSSProperties,
    },
    link: {
      className: "underline hover:opacity-80 transition-opacity",
      style: {} as React.CSSProperties,
    },
  },

  // ========================================
  // COLOR PALETTE
  // ========================================
  colors: {
    // Text colors
    text1: "#ffffff",        // Primary text (white)
    text2: "#000000",        // Secondary text (black)
    
    // Background colors
    background1: "#ffffff",  // Primary background (white)
    background2: "#FF7a25",  // Secondary background (orange)
    background3: "#e9ecef",  // Tertiary background
    
    // Accent colors
    accent1: "#FE3a08",      // Primary accent (red-orange)
    accent2: "#fd2b05",      // Secondary accent (red)
    accent3: "#f92417",      // Tertiary accent (bright red)
  },

  // ========================================
  // BUTTONS
  // ========================================
  buttons: {
    primary: {
      className: "px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg",
      style: {} as React.CSSProperties,
    },
    secondary: {
      className: "px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 border-2",
      style: {} as React.CSSProperties,
    },
    appStore: {
      className: "inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-md",
      style: {} as React.CSSProperties,
      // App Store specific properties
      apple: {
        text: "Download on the App Store",
        icon: "apple",
      },
    },
  },

  // ========================================
  // ICONS
  // ========================================
  icons: {
    // You can use emojis or integrate with icon libraries like react-icons
    apple: "🍎",
    menu: "☰",
    close: "✕",
    arrowRight: "→",
    arrowDown: "↓",
    check: "✓",
    star: "⭐",
  },

  // ========================================
  // CONTENT - FIXED SECTION (LEFT 40%)
  // ========================================
  fixedSection: {
    logo: {
      text: "Crave",
      emoji: "🍽️",
      image: "/images/logo.png", // Optional: Add your logo file to public/images/
    },
    tagline: "The Internet is Hungry",
    description: "Sharing Our World's Cuisine Through Video",
    cta: {
      secondary: "",
    },
  },

  // ========================================
  // CONTENT - HERO SECTIONS (RIGHT 60% / SCROLLABLE)
  // ========================================
  heroSections: [
    {
      id: 1,
      title: "Your food-first video app",
      subtitle: "Real videos. Real food.",
      description: "Explore mouthwatering food videos, discover new recipes, and share your culinary adventures with a community of food lovers.",
      icon: "🎬",
      bgGradient: "from-orange-400 to-red-500",
      mockupImage: "/images/hero-mockups/hero-1-app-mockup.mov", // Video mockup
      isVideo: true,
      layout: "image-right", // Image on right, text on left
    },
    {
      id: 2,
      title: "Cravin Something?",
      subtitle: "Find It in Seconds",
      description: "Swipe through endless food content. From viral recipes to restaurant reviews, discover what you're craving right now.",
      icon: "😋",
      bgGradient: "from-purple-400 to-pink-500",
      mockupImage: "/images/hero-mockups/hero-2-app-mockup.png",
      layout: "image-left", // Image on left, text on right (oppositely symmetrical)
    },
    {
      id: 3,
      title: "Connect With Foodies",
      subtitle: "Share, Chat & Discover Together",
      description: "Chat with friends about food, share your favorite finds, and build your community of fellow food enthusiasts.",
      icon: "💬",
      bgGradient: "from-blue-400 to-cyan-500",
      mockupImage: "/images/hero-mockups/hero-3-app-mockup.png",
      layout: "image-right",
    },
    {
      id: 4,
      title: "Trusted by Top Restaurants",
      subtitle: "Join Dozens of Food Businesses",
      description: "From local favorites to hidden gems, restaurants are using Crave to reach dozens of hungry customers.",
      icon: "🏪",
      bgGradient: "from-green-400 to-emerald-500",
      layout: "image-left",
      restaurantTiles: [
        "Thai 2 Go",
        "Chuan House",
        "Solo Noodle",
        "Angkor Wok",
        "Pho Shizzle",
        "Sweet Alchemy",
        "Shake and Stack",
        "Toasted Seattle",
      ],
    },
    {
      id: 5,
      title: "Restaurant Partners",
      subtitle: "Grow Your Business with Crave",
      description: "Showcase your dishes through video, reach new customers, and leverage our platform to grow your restaurant's presence.",
      icon: "🤝",
      bgGradient: "from-yellow-400 to-orange-500",
      layout: "image-right",
      showLearnMore: true,
    },
  ],

  // ========================================
  // FOOTER & LINKS
  // ========================================
  appStoreLinks: [
    { text: "Privacy", href: "/privacy" },
    { text: "Terms of Service", href: "/terms" },
  ],
  footer: {
    copyright: "© 2025 Crave. All rights reserved.",
    links: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
      { text: "Community Guidelines", href: "/community-guidelines" },
    ],
    social: [
      { name: "LinkedIn", href: "https://www.linkedin.com/company/cravesocial/?viewAsMember=true", icon: "linkedin" },
      { name: "Instagram", href: "https://www.instagram.com/theinternetishungry/", icon: "instagram" },
      { name: "X", href: "#", icon: "x" },
    ],
  },
};

export type SiteConfig = typeof siteConfig;

