'use client';

import React, { useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site.config';
import { Text } from '@/components/ui/Text';
import { Button, AppStoreButton } from '@/components/ui/Button';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { fixedSection, heroSections, colors, appStoreLinks } = siteConfig;
  const mockupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    mockupRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* DESKTOP LAYOUT (1280+) */}
      <div className="hidden desktop:flex h-screen overflow-hidden">
        {/* LEFT FIXED SECTION - 40% */}
        <div 
          className="w-[40%] h-full flex flex-col px-12 lg:px-16 sticky top-0"
          style={{ backgroundColor: colors.background2 }}
        >
          {/* Centered content */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {/* Crave, Discover, Eat, Share - each on own line */}
            <div className="space-y-2">
              <h2 className="text-7xl md:text-8xl font-bold" style={{ color: colors.text1 }}>
                {fixedSection.logo.text}
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#FEFF48' }}>
                Discover
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#FEFF48' }}>
                Eat
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#FEFF48' }}>
                Share
              </h2>
            </div>

            {/* Description */}
            <Text variant="paragraph" color="text1" style={{ opacity: 0.9 }}>
              {fixedSection.description}
            </Text>

            {/* CTAs */}
            <div className="flex flex-col gap-4 pt-4">
              <Button variant="secondary" textColor="#ffffff" style={{ borderColor: '#ffffff' }}>
                {fixedSection.cta.secondary}
              </Button>
            </div>

            {/* App Store Download */}
            <div className="pt-4 w-full">
              <div className="text-left mb-2">
                <p className="text-sm font-medium" style={{ color: colors.text1 }}>
                  Download Now
                </p>
              </div>
              <a 
                href="https://crave.onelink.me/7FzW/r6ggd7ej" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 block"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.text2 }}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: colors.text2 }}>
                      App Store
                    </div>
                  </div>
                </div>
              </a>
              
              {/* Links Below Badge */}
              <div className="flex gap-6 mt-6">
                {appStoreLinks.map((link, index) => (
                  <Text
                    key={index}
                    variant="link"
                    href={link.href}
                    color="text1"
                    className="text-sm opacity-80 hover:opacity-100"
                  >
                    {link.text}
                  </Text>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SCROLLABLE SECTION - 60% */}
        <div className="w-[60%] h-full overflow-y-auto" style={{ backgroundColor: colors.background1 }}>
          {/* Logo and Crave at top center */}
          <div className="py-4 flex justify-center items-center gap-3 sticky top-0 z-10" style={{ backgroundColor: colors.background1 }}>
            {fixedSection.logo.image ? (
              <img 
                src={fixedSection.logo.image} 
                alt={fixedSection.logo.text}
                className="h-12 w-auto"
              />
            ) : (
              <span className="text-6xl">{fixedSection.logo.emoji}</span>
            )}
            <h2 className="text-4xl font-bold" style={{ color: colors.accent1 }}>
              {fixedSection.logo.text}
            </h2>
          </div>

          {/* Hero Sections */}
          {heroSections.map((section) => (
            <section
              key={section.id}
              className={`min-h-screen flex items-center justify-center px-12 py-16 bg-gradient-to-br ${section.bgGradient}`}
            >
              <div className={`w-full max-w-6xl flex items-center gap-12 ${
                section.layout === 'image-left' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: colors.text2 }}>
                    {section.title}
                  </h2>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight" style={{ color: colors.accent1 }}>
                    {section.subtitle}
                  </h3>
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed" style={{ color: colors.text2, opacity: 0.8 }}>
                    {section.description}
                  </p>
                </div>

                {/* Mockup Image/Video OR Special Content */}
                <div className="flex-1 flex items-center justify-center">
                  {section.restaurantTiles ? (
                    // Hero 4: Restaurant tiles
                    <div 
                      ref={(el) => { mockupRefs.current[section.id - 1] = el; }}
                      className="mockup-container grid grid-cols-2 gap-4 w-full max-w-lg"
                    >
                      {section.restaurantTiles.map((restaurant: string, index: number) => (
                        <div 
                          key={index}
                          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                          <p className="text-center font-bold text-lg" style={{ color: colors.text2 }}>
                            {restaurant}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : section.showLearnMore ? (
                    // Hero 5: Learn More button
                    <div 
                      ref={(el) => { mockupRefs.current[section.id - 1] = el; }}
                      className="mockup-container flex items-center justify-center w-full"
                    >
                      <Button 
                        variant="primary" 
                        href="#contact"
                        className="text-xl px-12 py-6 rounded-full"
                      >
                        Learn More
                      </Button>
                    </div>
                  ) : (
                    // Regular mockup
                    <div 
                      ref={(el) => { mockupRefs.current[section.id - 1] = el; }}
                      className="mockup-container relative w-full max-w-md"
                    >
                      {section.mockupImage ? (
                        section.isVideo ? (
                          <video 
                            src={section.mockupImage}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto object-contain"
                          />
                        ) : (
                          <img 
                            src={section.mockupImage} 
                            alt={`${section.title} mockup`}
                            className="w-full h-auto object-contain drop-shadow-2xl"
                          />
                        )
                      ) : (
                        <div className="w-full aspect-[9/16] flex items-center justify-center text-white/60 text-center p-8 bg-white/10 rounded-3xl">
                          <div>
                            <div className="text-4xl mb-4">{section.icon}</div>
                            <p className="text-sm">Upload mockup to:<br/>{section.mockupImage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* TABLET & MOBILE LAYOUT (1-1279px) */}
      <div className="desktop:hidden">
        {/* Fixed section becomes first hero section */}
        <section 
          className="min-h-screen flex flex-col px-6 sm:px-12"
          style={{ backgroundColor: colors.background2 }}
        >
          {/* Centered content */}
          <div className="flex-1 flex flex-col justify-center space-y-6 max-w-2xl mx-auto py-12">
            {/* Crave, Discover, Eat, Share - each on own line */}
            <div className="space-y-2 text-center">
              <h2 className="text-6xl sm:text-7xl font-bold" style={{ color: colors.text1 }}>
                {fixedSection.logo.text}
              </h2>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#FFB300' }}>
                Discover
              </h2>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#FFB300' }}>
                Eat
              </h2>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#FFB300' }}>
                Share
              </h2>
            </div>

            {/* Description */}
            <Text variant="paragraph" color="text1" className="text-center" style={{ opacity: 0.9 }}>
              {fixedSection.description}
            </Text>

            {/* CTAs */}
            <div className="flex flex-col gap-4 pt-4 max-w-md mx-auto">
              <Button variant="secondary" textColor="#ffffff" style={{ borderColor: '#ffffff' }}>
                {fixedSection.cta.secondary}
              </Button>
            </div>

            {/* App Store Download */}
            <div className="pt-4 w-full">
              <div className="text-left mb-2">
                <p className="text-sm font-medium" style={{ color: colors.text1 }}>
                  Download Now
                </p>
              </div>
              <a 
                href="https://crave.onelink.me/7FzW/r6ggd7ej" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 block"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.text2 }}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: colors.text2 }}>
                      App Store
                    </div>
                  </div>
                </div>
              </a>
              
              {/* Links Below Badge */}
              <div className="flex gap-6 mt-6">
                {appStoreLinks.map((link, index) => (
                  <Text
                    key={index}
                    variant="link"
                    href={link.href}
                    color="text1"
                    className="text-sm opacity-80 hover:opacity-100"
                  >
                    {link.text}
                  </Text>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Logo and Crave at top center for mobile/tablet */}
        <div className="py-4 flex justify-center items-center gap-3 sticky top-0 z-10 bg-white">
          {fixedSection.logo.image ? (
            <img 
              src={fixedSection.logo.image} 
              alt={fixedSection.logo.text}
              className="h-12 sm:h-16 w-auto"
            />
          ) : (
            <span className="text-5xl sm:text-6xl">{fixedSection.logo.emoji}</span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: colors.accent1 }}>
            {fixedSection.logo.text}
          </h2>
        </div>

        {/* Hero Sections */}
        {heroSections.map((section) => (
          <section
            key={section.id}
            className={`min-h-screen flex items-center justify-center px-6 sm:px-12 py-16 bg-gradient-to-br ${section.bgGradient}`}
          >
            <div className="max-w-2xl space-y-8 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: colors.text2 }}>
                {section.title}
              </h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight" style={{ color: colors.accent1 }}>
                {section.subtitle}
              </h3>
              <p className="text-base md:text-lg lg:text-xl leading-relaxed" style={{ color: colors.text2, opacity: 0.8 }}>
                {section.description}
              </p>
              
              {/* Mockup Image/Video OR Special Content for Mobile/Tablet */}
              <div className="flex items-center justify-center pt-8">
                {section.restaurantTiles ? (
                  // Hero 4: Restaurant tiles
                  <div 
                    ref={(el) => { mockupRefs.current[section.id + 4] = el; }}
                    className="mockup-container grid grid-cols-2 gap-3 w-full max-w-md"
                  >
                    {section.restaurantTiles.map((restaurant: string, index: number) => (
                      <div 
                        key={index}
                        className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                      >
                        <p className="text-center font-bold text-sm" style={{ color: colors.text2 }}>
                          {restaurant}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : section.showLearnMore ? (
                  // Hero 5: Learn More button
                  <div 
                    ref={(el) => { mockupRefs.current[section.id + 4] = el; }}
                    className="mockup-container flex items-center justify-center w-full"
                  >
                    <Button 
                      variant="primary" 
                      href="#contact"
                      className="text-lg px-10 py-5 rounded-full"
                    >
                      Learn More
                    </Button>
                  </div>
                ) : (
                  // Regular mockup
                  <div 
                    ref={(el) => { mockupRefs.current[section.id + 4] = el; }}
                    className="mockup-container relative w-full max-w-xs"
                  >
                    {section.mockupImage ? (
                      section.isVideo ? (
                        <video 
                          src={section.mockupImage}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto object-contain"
                        />
                      ) : (
                        <img 
                          src={section.mockupImage} 
                          alt={`${section.title} mockup`}
                          className="w-full h-auto object-contain drop-shadow-2xl"
                        />
                      )
                    ) : (
                      <div className="w-full aspect-[9/16] flex items-center justify-center text-white/60 text-center p-6 bg-white/10 rounded-3xl">
                        <div>
                          <div className="text-3xl mb-3">{section.icon}</div>
                          <p className="text-xs">Upload mockup here</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}

