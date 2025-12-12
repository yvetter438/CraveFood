'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/Footer';

export default function AdminOrdersPage() {
  const [sessionId, setSessionId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    if (!sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);
    setShowAllOrders(false);

    try {
      const response = await fetch(`/api/admin/get-order?session_id=${sessionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order');
      }

      setOrderData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');
    setOrderData(null);
    setAllOrders([]);

    try {
      const response = await fetch('/api/admin/get-order?list_all=true');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setAllOrders(data.orders);
      setShowAllOrders(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Orders</h1>
          <button
            onClick={fetchAllOrders}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'View All Orders'}
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Or lookup a specific order by Session ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="cs_test_..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={fetchOrder}
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Lookup'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Find the session ID in your terminal logs or success page URL
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* All Orders List */}
        {showAllOrders && allOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Orders ({allOrders.length})</h2>
            
            <div className="space-y-4">
              {allOrders.map((order) => (
                <div 
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setSessionId(order.id);
                    setOrderData(order);
                    setShowAllOrders(false);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-lg text-gray-900">
                        {order.metadata.restaurantName || 'No name'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.metadata.email || order.customer_email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-gray-900">
                        ${(order.amount_total / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.metadata.tierName || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-600">
                      {order.metadata.restaurantAddress || 'No address'}
                    </p>
                    <p className="text-gray-500">
                      {new Date(order.created * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    {order.id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAllOrders && allOrders.length === 0 && !loading && (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-600">No orders found</p>
          </div>
        )}

        {/* Order Details */}
        {orderData && !showAllOrders && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                orderData.status === 'complete' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {orderData.status}
              </span>
            </div>

            {/* Restaurant Info */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Restaurant Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Restaurant Name</p>
                  <p className="font-semibold text-gray-900">{orderData.metadata.restaurantName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Name</p>
                  <p className="font-semibold text-gray-900">{orderData.metadata.contactName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{orderData.metadata.email || orderData.customer_email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{orderData.metadata.phone || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-900">{orderData.metadata.restaurantAddress || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Package Details</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Tier</p>
                  <p className="font-semibold text-gray-900">{orderData.metadata.tierName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-semibold text-gray-900">${(orderData.amount_total / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Video Focus</p>
                  <p className="font-semibold text-gray-900">{orderData.metadata.videoFocus || 'None selected'}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Payment Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Session ID</p>
                  <p className="font-mono text-xs text-gray-900 break-all">{orderData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Intent</p>
                  <p className="font-mono text-xs text-gray-900 break-all">{orderData.payment_intent || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(orderData.created * 1000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-semibold text-gray-900">{orderData.payment_status}</p>
                </div>
              </div>
            </div>

            {/* Raw Data (for debugging) */}
            <details className="mt-6">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                View Raw Data
              </summary>
              <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-auto">
                {JSON.stringify(orderData, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

