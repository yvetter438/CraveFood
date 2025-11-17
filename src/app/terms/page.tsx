import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';

export default function TermsOfService() {
  const { colors } = siteConfig;

  return (
    <main className="min-h-screen py-12 px-6" style={{ backgroundColor: colors.background1 }}>
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-block mb-8 hover:opacity-70 transition-opacity"
          style={{ color: colors.accent1 }}
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4" style={{ color: colors.text2 }}>
          Terms of Service
        </h1>
        <p className="text-sm mb-12" style={{ color: colors.text2, opacity: 0.6 }}>
          Last Updated: October 26, 2025
        </p>

        <div className="prose max-w-none space-y-8" style={{ color: colors.text2 }}>
          <p>
            Welcome to Crave! By using our app, you agree to these Terms of Service. Please read them carefully.
          </p>

          <section>
            <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using Crave, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. Description of Service</h2>
            <p>Crave is a social media platform for sharing and discovering food and restaurant experiences through video content. We provide tools for users to upload, share, and engage with food-related content.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 13 years old to use Crave</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must not share your account credentials with others</li>
              <li>You must provide accurate and complete information when creating your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. User-Generated Content</h2>
            
            <p className="mt-4"><strong>Content Ownership:</strong> You retain ownership of content you post on Crave. By posting content, you grant Crave a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content.</p>

            <p className="mt-4"><strong>Content Moderation:</strong> All uploaded content is subject to moderation before appearing publicly. We reserve the right to remove content that violates our Community Guidelines.</p>

            <p className="mt-4"><strong>Responsibility:</strong> You are solely responsible for the content you post. You must not post content that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Violates any laws or regulations</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains hate speech or harassment</li>
              <li>Depicts violence or illegal activities</li>
              <li>Contains explicit or sexual content</li>
              <li>Spreads misinformation</li>
              <li>Constitutes spam or commercial solicitation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Content Moderation & Enforcement</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All videos are reviewed before appearing in the public feed</li>
              <li>Content that violates our guidelines will be removed</li>
              <li>Repeat violations may result in account suspension or termination</li>
              <li>Users can report inappropriate content for review</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use automated systems (bots) to access the service</li>
              <li>Harass, threaten, or intimidate other users</li>
              <li>Impersonate any person or entity</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the service</li>
              <li>Collect user information without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Intellectual Property</h2>
            <p>The Crave app, including its design, features, and branding, is protected by intellectual property laws. You may not copy, modify, or distribute any part of our service without permission.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. Privacy & Data Collection</h2>
            <p>Your privacy is important to us. Our collection and use of personal information is governed by our <Link href="/privacy" className="underline" style={{ color: colors.accent1 }}>Privacy Policy</Link>. By using Crave, you consent to our data practices.</p>

            <h3 className="text-2xl font-semibold mb-3 mt-4">Analytics and Tracking</h3>
            <p>We use analytics services to understand how you use our app and improve your experience:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>PostHog:</strong> Tracks app usage, user behavior, and engagement patterns</li>
              <li><strong>AppsFlyer:</strong> Tracks app installs and attribution from marketing campaigns</li>
              <li><strong>Sentry:</strong> Collects crash reports and performance data to improve app stability</li>
            </ul>
            <p className="mt-4">These services collect anonymous usage data and do not identify you personally. You can opt out of analytics in your device settings.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. Data Sharing</h2>
            <p>We share data with trusted third-party services to provide and improve our app:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analytics providers (PostHog, AppsFlyer) for app improvement and marketing attribution</li>
              <li>Crash reporting service (Sentry) for technical support and app stability</li>
              <li>Cloud storage providers (Supabase) for secure data storage and app functionality</li>
            </ul>
            <p className="mt-4">We do not sell your personal data to third parties. All data sharing is for legitimate business purposes and app functionality.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service or our Community Guidelines. You may also terminate your account at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">11. Disclaimers</h2>
            <p>Crave is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. We are not responsible for user-generated content or third-party links.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">12. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Crave shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">13. Changes to Terms</h2>
            <p>We may update these Terms of Service from time to time. We will notify you of significant changes by posting a notice in the app or via email. Your continued use of Crave after changes constitute acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">14. Contact Us</h2>
            <p>If you have questions about these Terms of Service, please contact us at:</p>
            <p className="mt-4">
              <strong>Email:</strong> <a href="mailto:support@cravesocial.app" className="underline" style={{ color: colors.accent1 }}>support@cravesocial.app</a>
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">15. Governing Law</h2>
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
          </section>

          <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: colors.background2 }}>
            <p className="text-sm" style={{ color: colors.text1 }}>
              By using Crave, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our <Link href="/community-guidelines" className="underline" style={{ color: colors.text1 }}>Community Guidelines</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

