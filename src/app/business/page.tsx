'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

// Fixed pricing tiers
// Each package = 1 creator, 1 video. Buy multiple for more coverage.
const PRICING_TIERS = [
  {
    id: 'micro',
    name: 'Micro',
    price: 49,
    emoji: '🌱',
    description: 'Test the waters',
    reach: '500+',
    features: [
      '1 video about your restaurant',
      '500+ people will see it',
      'Posted on TikTok, IG & Crave',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    emoji: '💼',
    description: 'Real visibility',
    reach: '2,000+',
    features: [
      '1 video about your restaurant',
      '2,000+ people will see it',
      'Posted on TikTok, IG & Crave',
      'See your video stats',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 199,
    emoji: '⭐',
    popular: true,
    description: 'Maximum reach',
    reach: '5,000+',
    features: [
      '1 video about your restaurant',
      '5,000+ people will see it',
      'Posted on TikTok, IG & Crave',
      'Detailed analytics report',
    ],
  },
];

export default function BusinessPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState(PRICING_TIERS[1]);
  const [formData, setFormData] = useState({
    restaurantName: '',
    contactName: '',
    email: '',
    phone: '',
    restaurantAddress: '',
    videoFocus: [] as string[],
  });
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((ref) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (value: string) => {
    const currentFocus = formData.videoFocus;
    if (currentFocus.includes(value)) {
      setFormData({
        ...formData,
        videoFocus: currentFocus.filter(item => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        videoFocus: [...currentFocus, value],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bidData = {
        ...formData,
        tier: selectedTier.id,
        tierName: selectedTier.name,
        tierPrice: selectedTier.price,
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen">
      {/* DESKTOP LAYOUT (1280+) */}
      <div className="hidden desktop:flex h-screen overflow-hidden">
        {/* LEFT FIXED SECTION - 40% */}
        <div 
          className="w-[40%] h-full flex flex-col px-12 lg:px-16 sticky top-0"
          style={{ backgroundColor: '#FF7a25' }}
        >
          {/* Centered content */}
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {/* Back to main site */}
            <Link 
              href="/" 
              className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
            >
              ← Back to Crave
            </Link>

            {/* Main headline */}
            <div className="space-y-2">
              <h1 className="text-6xl lg:text-7xl font-bold text-white">
                Crave for
              </h1>
              <h1 className="text-5xl lg:text-6xl font-bold" style={{ color: '#FEFF48' }}>
                Business
              </h1>
            </div>
            
            {/* Value prop */}
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
              Get your restaurant discovered by hungry locals through authentic video content.
            </p>

            {/* Key stats */}
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="text-white font-medium text-lg lg:text-xl">Posted on TikTok, Instagram & Crave</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-white font-medium text-lg lg:text-xl">Reach 500 - 5,000+ local foodies</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-white font-medium text-lg lg:text-xl">Starting at just $49</p>
              </div>
            </div>
            
            {/* CTA */}
            <button 
              onClick={scrollToForm}
              className="bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-lg w-fit"
            >
              Get Started →
            </button>

            {/* Trust line */}
            <p className="text-white/60 text-base">
              No hidden fees. No long-term contracts.
            </p>
          </div>
            </div>
            
        {/* RIGHT SCROLLABLE SECTION - 60% */}
        <div className="w-[60%] h-full overflow-y-auto bg-white">
          {/* Sticky header */}
          <div className="py-4 px-8 flex justify-between items-center sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Crave" className="h-8 w-auto" />
              <span className="font-bold text-xl" style={{ color: '#FE3a08' }}>Crave</span>
            </div>
            <span className="text-sm text-gray-500">For Business</span>
          </div>

          {/* Section 1: How It Works */}
          <section 
            ref={(el) => { sectionRefs.current[0] = el; }}
            className="section-animate min-h-screen flex items-center px-12 lg:px-16 py-20 bg-gradient-to-br from-orange-50 to-red-50"
          >
            <div className="w-full max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">How It Works</h2>
              
              <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Package</h3>
                    <p className="text-lg text-gray-600">Pick how many people you want to reach. More reach = more potential customers.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">A Creator Visits</h3>
                    <p className="text-lg text-gray-600">A local food creator comes to your restaurant, enjoys a meal, and captures the experience on video.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Video Goes Live</h3>
                    <p className="text-lg text-gray-600">Your video gets posted to TikTok, Instagram, and Crave — reaching their entire audience.</p>
                  </div>
                </div>
                
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">New Customers Find You</h3>
                    <p className="text-lg text-gray-600">Hungry locals discover your restaurant and show up ready to eat.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing */}
          <section 
            ref={(el) => { sectionRefs.current[1] = el; }}
            className="section-animate min-h-screen flex items-center px-12 lg:px-16 py-20"
            id="pricing"
          >
            <div className="w-full max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Choose Your Reach</h2>
              <p className="text-xl text-gray-600 mb-12">
                The only difference is how many people see your restaurant.
              </p>
              
              <div className="grid gap-6">
                {PRICING_TIERS.map((tier) => (
                  <div 
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier);
                      scrollToForm();
                    }}
                    className={`relative rounded-2xl p-8 cursor-pointer transition-all flex items-center gap-6 ${
                      selectedTier.id === tier.id
                        ? 'border-3 border-orange-500 shadow-xl bg-orange-50'
                        : 'border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg bg-white'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 right-6 bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="text-5xl">{tier.emoji}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{tier.name}</h3>
                        <span className="text-gray-400">—</span>
                        <span className="text-lg lg:text-xl text-gray-600">{tier.description}</span>
                      </div>
                      <p className="text-orange-600 font-semibold text-lg">
                        {tier.reach} people will see your restaurant
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-4xl lg:text-5xl font-bold text-gray-900">${tier.price}</span>
                      <p className="text-base text-gray-500">one-time</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-gray-500 mt-10 text-base">
                Want more coverage? Purchase multiple packages for different creators.
              </p>
            </div>
          </section>

          {/* Section 3: Why This Works */}
          <section 
            ref={(el) => { sectionRefs.current[2] = el; }}
            className="section-animate min-h-screen flex items-center px-12 lg:px-16 py-20 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <div className="w-full max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why This Works</h2>
              <p className="text-xl text-gray-600 mb-12">
                Food creators know how to get your restaurant seen.
              </p>
              
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Built for Discovery</h3>
                  <p className="text-lg text-gray-600">
                    Creators know exactly how to make content that TikTok and Instagram push to people looking for places to eat.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Local Audience</h3>
                  <p className="text-lg text-gray-600">
                    Their followers are local foodies — people who actually live nearby and are looking for their next meal.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Authentic Content</h3>
                  <p className="text-lg text-gray-600">
                    Real people sharing real experiences. It is word-of-mouth at scale — far more trusted than traditional ads.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Get Started Form */}
          <section 
            ref={(el) => { sectionRefs.current[3] = el; }}
            className="section-animate min-h-screen flex items-center px-12 lg:px-16 py-20"
            id="get-started"
          >
            <div className="w-full max-w-xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Get Started</h2>
              <p className="text-xl text-gray-600 mb-10">
                Tell us about your restaurant and we will match you with a creator.
              </p>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Tier Display */}
                <div className="bg-orange-50 rounded-xl p-5 border-2 border-orange-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base text-gray-600">Selected Package</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedTier.emoji} {selectedTier.name} — ${selectedTier.price}
                      </p>
                      <p className="text-base text-orange-600">{selectedTier.reach} people will see it</p>
                    </div>
                    <a href="#pricing" className="text-orange-600 text-base font-semibold hover:underline">
                      Change
                    </a>
                  </div>
                </div>

                {/* Restaurant Information */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">Restaurant Name *</label>
                    <input 
                      type="text" 
                      name="restaurantName"
                      required
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Your Restaurant Name"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">Restaurant Address *</label>
                    <input 
                      type="text"
                      name="restaurantAddress"
                      required
                      value={formData.restaurantAddress}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-base font-medium text-gray-900 mb-2">Your Name *</label>
                      <input 
                        type="text" 
                        name="contactName"
                        required
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Your Name"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium text-gray-900 mb-2">Phone</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-medium text-gray-900 mb-2">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Video Focus */}
                <div className="space-y-3">
                  <label className="block text-base font-medium text-gray-900">What should the video highlight? (optional)</label>
                  
                  <div className="flex gap-3">
                    {[
                      { id: 'specific-dishes', emoji: '🍽️', label: 'Dishes' },
                      { id: 'dining-experience', emoji: '✨', label: 'Experience' },
                      { id: 'ambiance', emoji: '🎵', label: 'Ambiance' },
                    ].map((option) => (
                      <label 
                        key={option.id}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all flex-1 justify-center ${
                          formData.videoFocus.includes(option.id) 
                            ? 'bg-orange-100 border-2 border-orange-400' 
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.videoFocus.includes(option.id)}
                          onChange={() => handleCheckboxChange(option.id)}
                          className="sr-only"
                        />
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-base font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms Summary */}
                <div className="bg-gray-50 rounded-xl p-5 text-base text-gray-600">
                  <p className="mb-3 font-medium text-gray-900">By continuing, you agree to:</p>
                  <ul className="space-y-2 text-base">
                    <li>• Provide a complimentary meal for the creator (up to $50 value)</li>
                    <li>• Allow filming and content posting about your restaurant</li>
                    <li>• Content will be posted within 2 weeks of the visit</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-5 px-6 rounded-xl font-bold text-xl hover:bg-orange-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  {loading ? 'Processing...' : `Continue to Payment — $${selectedTier.price}`}
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  Secure payment powered by Stripe
                </p>
          </form>
        </div>
      </section>

          {/* Section 5: FAQ */}
          <section 
            ref={(el) => { sectionRefs.current[4] = el; }}
            className="section-animate px-12 lg:px-16 py-20 bg-gray-50"
          >
            <div className="w-full max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-10">Questions?</h2>
              
              <div className="space-y-4">
                {[
                  {
                    q: 'How are views counted?',
                    a: 'We count total views across all platforms — Crave, Instagram, and TikTok combined. Creators submit their post links and we track the numbers.'
                  },
                  {
                    q: 'Can I get multiple videos?',
                    a: 'Yes! Each package gets you one video from one creator. Want more coverage? Simply purchase multiple packages for variety from different creators.'
                  },
                  {
                    q: 'How long until my video is posted?',
                    a: 'Typically within 1-2 weeks of a creator accepting. They will coordinate with you to schedule their visit.'
                  },
                  {
                    q: 'Do I get to choose the creator?',
                    a: 'Creators browse available opportunities and choose which ones to accept. Higher-tier packages get priority placement.'
                  },
                  {
                    q: 'Can I approve the video first?',
                    a: 'To keep things authentic, creators have creative freedom. This results in more genuine, engaging videos that perform better.'
                  },
                ].map((faq, index) => (
                  <details key={index} className="bg-white rounded-xl p-6 shadow-sm group">
                    <summary className="font-semibold cursor-pointer text-gray-900 flex justify-between items-center text-lg">
                      {faq.q}
                      <span className="text-orange-500 group-open:rotate-45 transition-transform text-2xl">+</span>
                    </summary>
                    <p className="mt-4 text-gray-600 text-lg">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>

      {/* TABLET & MOBILE LAYOUT */}
      <div className="desktop:hidden">
        {/* Hero */}
        <section 
          className="min-h-screen flex flex-col justify-center px-6 sm:px-12 py-16"
          style={{ backgroundColor: '#FF7a25' }}
        >
          <Link 
            href="/" 
            className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 mb-8"
          >
            ← Back to Crave
          </Link>

          <div className="space-y-6 max-w-lg">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-white">
                Crave for
              </h1>
              <h1 className="text-5xl sm:text-6xl font-bold" style={{ color: '#FEFF48' }}>
                Business
              </h1>
            </div>

            <p className="text-xl text-white/90 leading-relaxed">
              Get your restaurant discovered by hungry locals through authentic video content.
            </p>

            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <p className="text-white font-medium">Posted on TikTok, IG & Crave</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <p className="text-white font-medium">Reach 500 - 5,000+ locals</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💰</span>
                <p className="text-white font-medium">Starting at $49</p>
              </div>
            </div>

            <button 
              onClick={scrollToForm}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg w-full sm:w-auto"
            >
              Get Started →
            </button>
          </div>
        </section>

        {/* Sticky header for mobile */}
        <div className="py-3 px-6 flex justify-center items-center gap-2 sticky top-0 z-10 bg-white border-b border-gray-100">
          <img src="/images/logo.png" alt="Crave" className="h-8 w-auto" />
          <span className="font-bold text-lg" style={{ color: '#FE3a08' }}>Crave</span>
          <span className="text-gray-400 mx-1">|</span>
          <span className="text-sm text-gray-500">For Business</span>
        </div>

        {/* How It Works - Mobile */}
        <section className="px-6 py-16 bg-gradient-to-br from-orange-50 to-red-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">How It Works</h2>
          
          <div className="space-y-6">
            {[
              { num: 1, title: 'Choose Your Package', desc: 'Pick how many people you want to reach.' },
              { num: 2, title: 'A Creator Visits', desc: 'They enjoy a meal and capture the experience.' },
              { num: 3, title: 'Video Goes Live', desc: 'Posted to TikTok, Instagram, and Crave.' },
              { num: 4, title: 'New Customers Find You', desc: 'Hungry locals discover your restaurant.', green: true },
            ].map((step) => (
              <div key={step.num} className="flex gap-4 items-start">
                <div className={`w-10 h-10 ${step.green ? 'bg-green-500' : 'bg-orange-500'} text-white rounded-full flex items-center justify-center font-bold shrink-0`}>
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing - Mobile */}
        <section className="px-6 py-16" id="pricing-mobile">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Reach</h2>
          <p className="text-gray-600 mb-8">The only difference is how many people see your restaurant.</p>
          
          <div className="space-y-4">
            {PRICING_TIERS.map((tier) => (
              <div 
                key={tier.id}
                onClick={() => {
                  setSelectedTier(tier);
                  scrollToForm();
                }}
                className={`relative rounded-2xl p-5 cursor-pointer transition-all ${
                  selectedTier.id === tier.id
                    ? 'border-3 border-orange-500 shadow-lg bg-orange-50'
                    : 'border-2 border-gray-200 bg-white'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-2 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Popular
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{tier.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                      <p className="text-orange-600 text-sm font-medium">{tier.reach} people</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why This Works - Mobile */}
        <section className="px-6 py-16 bg-gradient-to-br from-purple-50 to-pink-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why This Works</h2>
          
          <div className="space-y-4">
            {[
              { emoji: '📱', title: 'Built for Discovery', desc: 'Creators know how to make content that gets pushed to people looking for food.' },
              { emoji: '🎯', title: 'Local Audience', desc: 'Their followers are nearby and looking for their next meal.' },
              { emoji: '✨', title: 'Authentic Content', desc: 'Real experiences, not ads. Far more trusted.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-2xl mb-2">{item.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form - Mobile */}
        <section className="px-6 py-16" id="get-started">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Get Started</h2>
          <p className="text-gray-600 mb-8">Tell us about your restaurant.</p>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Selected Tier */}
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Package</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedTier.emoji} {selectedTier.name} — ${selectedTier.price}
                  </p>
                </div>
                <a href="#pricing-mobile" className="text-orange-600 text-sm font-semibold">
                  Change
                </a>
              </div>
            </div>

            <input 
              type="text" 
              name="restaurantName"
              required
              value={formData.restaurantName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Restaurant Name *"
            />

            <input 
              type="text"
              name="restaurantAddress"
              required
              value={formData.restaurantAddress}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Restaurant Address *"
            />

            <input 
              type="text" 
              name="contactName"
              required
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Your Name *"
            />

            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Email *"
            />

            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Phone (optional)"
            />

            {/* Terms */}
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
              <p className="mb-2 font-medium text-gray-900">By continuing:</p>
              <ul className="space-y-1">
                <li>• Provide a meal for the creator (up to $50)</li>
                <li>• Allow filming and posting</li>
                <li>• Content posted within 2 weeks</li>
              </ul>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : `Continue — $${selectedTier.price}`}
            </button>
            
            <p className="text-center text-xs text-gray-500">
              Secure payment via Stripe
            </p>
          </form>
        </section>

        {/* FAQ - Mobile */}
        <section className="px-6 py-16 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions?</h2>
          
          <div className="space-y-3">
            {[
              { q: 'How are views counted?', a: 'Total views across Crave, Instagram, and TikTok combined.' },
              { q: 'Can I get multiple videos?', a: 'Yes! Purchase multiple packages for more creators.' },
              { q: 'How long until posted?', a: 'Typically 1-2 weeks after a creator accepts.' },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl p-4 shadow-sm">
                <summary className="font-semibold cursor-pointer text-gray-900">{faq.q}</summary>
                <p className="mt-2 text-gray-600 text-sm">{faq.a}</p>
            </details>
            ))}
        </div>
      </section>

      <Footer />
      </div>

      <style jsx>{`
        .section-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }
        .section-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
