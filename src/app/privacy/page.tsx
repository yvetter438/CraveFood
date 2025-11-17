import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: colors.text2, opacity: 0.6 }}>
          Last Updated: October 26, 2025
        </p>

        <div className="prose max-w-none space-y-8" style={{ color: colors.text2 }}>
          <p>
            This Privacy Policy describes how Crave collects, uses, and protects your information when you use our app. We are committed to protecting your privacy and being transparent about our data practices.
          </p>

          <section>
            <h2 className="text-3xl font-bold mb-4">1. Information We Collect</h2>
            
            <h3 className="text-2xl font-semibold mb-3 mt-6">Personal Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address</li>
              <li>Username and display name</li>
              <li>Profile information (bio, location, Instagram handle)</li>
              <li>Profile photo/avatar</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">Content You Create</h3>
            <p>We store content you upload to our app:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Videos and photos you post</li>
              <li>Comments and replies</li>
              <li>Restaurant reviews and ratings</li>
              <li>User interactions (likes, saves, follows)</li>
            </ul>

            <h3 className="text-2xl font-semibold mb-3 mt-6">Usage Data</h3>
            <p>We automatically collect information about how you use our app:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>App usage patterns and session length</li>
              <li>Videos watched and interactions</li>
              <li>Search queries and preferences</li>
              <li>Device information (type, operating system)</li>
              <li>Crash reports and performance data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our app services</li>
              <li>Show you personalized content and recommendations</li>
              <li>Moderate content and ensure community safety</li>
              <li>Analyze app usage to improve features</li>
              <li>Provide customer support</li>
              <li>Send important updates about our service</li>
              <li>Track marketing campaign effectiveness</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">3. Analytics and Tracking Services</h2>
            <p>We use third-party services to understand how our app is used and improve your experience:</p>
            
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">PostHog Analytics</h3>
                <p>Tracks user behavior, app usage patterns, and engagement metrics to help us improve the app experience. Data is anonymized and used for product development.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">AppsFlyer Attribution</h3>
                <p>Tracks how users discover and install our app from marketing campaigns. This helps us understand which marketing efforts are most effective.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Sentry Error Tracking</h3>
                <p>Collects crash reports and performance data to help us identify and fix technical issues, improving app stability and reliability.</p>
              </div>
            </div>

            <p className="mt-4"><strong>Opt-Out:</strong> You can opt out of analytics tracking in your device settings, though this may limit our ability to improve the app.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">4. Information Sharing</h2>
            <p>We share your information only in these limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Analytics Providers:</strong> PostHog, AppsFlyer for app improvement and marketing attribution</li>
              <li><strong>Technical Services:</strong> Sentry for crash reporting and technical support</li>
              <li><strong>Cloud Storage:</strong> Supabase for secure data storage and app functionality</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="mt-4">We do not sell your personal information to third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure cloud storage with industry-standard security</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Content moderation and safety measures</li>
            </ul>
            <p className="mt-4">However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">6. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Update or correct your information</li>
              <li>Delete your account and data</li>
              <li>Opt out of analytics tracking</li>
              <li>Export your data</li>
              <li>Report privacy concerns</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at <a href="mailto:support@cravesocial.app" className="underline" style={{ color: colors.accent1 }}>support@cravesocial.app</a> or use the settings in our app.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">7. Children's Privacy</h2>
            <p>Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">8. International Users</h2>
            <p>If you are using our app from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy in the app and updating the "Last Updated" date. Your continued use of our app after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <p className="mt-4">
              <strong>Email:</strong> <a href="mailto:support@cravesocial.app" className="underline" style={{ color: colors.accent1 }}>support@cravesocial.app</a>
            </p>
            <p className="mt-4">We will respond to your inquiry within 30 days.</p>
          </section>

          <div className="mt-12 p-6 rounded-xl" style={{ backgroundColor: colors.background2 }}>
            <p className="text-sm" style={{ color: colors.text1 }}>
              By using Crave, you acknowledge that you have read and understood this Privacy Policy and agree to our collection and use of your information as described herein.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

