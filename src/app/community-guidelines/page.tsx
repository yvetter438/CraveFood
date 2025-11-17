import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';

export default function CommunityGuidelines() {
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
          Community Guidelines
        </h1>
        <p className="text-2xl mb-12" style={{ color: colors.accent1 }}>
          Building a Positive Community
        </p>

        <div className="prose max-w-none space-y-8" style={{ color: colors.text2 }}>
          <p>
            Crave is a place to share your love of food and discover new restaurants. These guidelines help us maintain a welcoming community for everyone.
          </p>

          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.accent1 }}>What We Encourage</h2>
            <ul className="space-y-3">
              <li><strong>Authentic Food Content</strong> - Share genuine experiences at restaurants and showcase delicious food</li>
              <li><strong>Helpful Reviews</strong> - Provide honest, constructive feedback about your dining experiences</li>
              <li><strong>Respectful Engagement</strong> - Be kind and courteous in comments and interactions with others</li>
              <li><strong>Food Tips & Recommendations</strong> - Share what you loved and help others discover great food</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.accent2 }}>What's Not Allowed</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Hate Speech & Harassment</h3>
                <p>No attacks based on race, religion, gender, sexual orientation, disability, or any other protected characteristic. Bullying and harassment are not tolerated.</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Violence & Graphic Content</h3>
                <p>Don't post content depicting violence, gore, or anything that promotes dangerous activities.</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Sexual Content</h3>
                <p>Crave is focused on food. Sexually explicit or suggestive content is not appropriate.</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Spam & Misleading Content</h3>
                <p>No spam, scams, or misleading information. Don't impersonate others or spread misinformation about restaurants or food.</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Copyright Violations</h3>
                <p>Only post content you have the right to share. Don't steal others' videos or use copyrighted music without permission.</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Unsolicited Commercial Content</h3>
                <p>Don't use Crave solely for advertising or promotional purposes without providing genuine value to the community.</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-2">Dangerous Misinformation</h3>
                <p>Don't spread false health claims or misleading information that could harm others (e.g., fake allergy advice, dangerous food challenges).</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.accent3 }}>How We Enforce These Guidelines</h2>
            <ul className="space-y-3">
              <li><strong>Pre-Moderation:</strong> All videos are reviewed before appearing in the public feed to ensure they meet our guidelines.</li>
              <li><strong>Community Reports:</strong> You can report content that violates our guidelines. Each report is reviewed by our moderation team.</li>
              <li><strong>Content Removal:</strong> Content that violates these guidelines will be removed. Repeat violations may result in account suspension.</li>
              <li><strong>Transparency:</strong> We'll notify you if your content is removed and explain why.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Privacy & Data Collection</h2>
            <ul className="space-y-3">
              <li><strong>Respect Privacy:</strong> Respect other users' privacy and personal information. Do not share personal details in comments or posts.</li>
              <li><strong>Data Usage:</strong> We collect anonymous usage data to improve the app experience. This includes analytics (PostHog, AppsFlyer) and crash reporting (Sentry).</li>
              <li><strong>Content for Improvement:</strong> Your content may be used anonymously for app improvement and feature development.</li>
              <li><strong>Report Privacy Violations:</strong> If you see someone sharing personal information or violating privacy, report it immediately.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">How to Report Violations</h2>
            <p>If you see content that violates these guidelines:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li>Tap the three dots (•••) on the post or comment</li>
              <li>Select "Report"</li>
              <li>Choose the reason for your report</li>
              <li>Our team will review it within 24-48 hours</li>
            </ol>
            <p className="mt-4">Reports are confidential. The person won't know you reported them.</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Blocking Users</h2>
            <p>You can block users to prevent them from seeing your content or interacting with you. To block someone:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li>Go to their profile</li>
              <li>Tap the three dots (•••) next to the Follow button</li>
              <li>Select "Block User"</li>
            </ol>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Questions or Appeals</h2>
            <p>If you have questions about these guidelines or want to appeal a content removal decision, please contact us at:</p>
            <p className="mt-4">
              <a href="mailto:support@cravesocial.app" className="underline font-semibold" style={{ color: colors.accent1 }}>support@cravesocial.app</a>
            </p>
          </section>

          <div className="mt-12 p-8 rounded-xl" style={{ backgroundColor: colors.background2 }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text1 }}>Thank You!</h3>
            <p style={{ color: colors.text1 }}>
              By following these guidelines, you're helping us build a positive community where everyone can share their love of food. We appreciate your cooperation!
            </p>
          </div>

          <p className="text-sm mt-8" style={{ color: colors.text2, opacity: 0.6 }}>
            Last Updated: October 26, 2025
          </p>
        </div>
      </div>
    </main>
  );
}

