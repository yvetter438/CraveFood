'use client';

import React from 'react';
import { Footer } from '@/components/Footer';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            You're All Set! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your bid is now live in the Crave Creator Marketplace.
          </p>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold text-gray-900">Creator Accepts</p>
                  <p className="text-sm text-gray-600">A content creator will see your bid and accept it (usually within a few days)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold text-gray-900">They Visit Your Restaurant</p>
                  <p className="text-sm text-gray-600">The creator will reach out to coordinate their visit</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold text-gray-900">Video Goes Live</p>
                  <p className="text-sm text-gray-600">Professional content about your restaurant is posted to Crave</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-semibold text-gray-900">Track Performance</p>
                  <p className="text-sm text-gray-600">Watch views and clicks roll in over the tracking period</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div className="bg-blue-50 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-gray-700">
              <strong>📧 Check your email</strong> - We've sent a confirmation with all the details. 
              We'll also notify you when a creator accepts your bid.
            </p>
          </div>

          {/* Confirmation ID */}
          {sessionId && (
            <p className="text-xs text-gray-500 mb-6">
              Confirmation: {sessionId.slice(0, 24)}...
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/business"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Create Another Bid
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
