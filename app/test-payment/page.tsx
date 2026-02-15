/**
 * Payment Test Page
 * Access at: http://localhost:3000/test-payment
 *
 * This page tests the complete payment flow:
 * 1. Check subscription status
 * 2. Create Razorpay order
 * 3. Process payment
 * 4. Verify and activate subscription
 */

"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function TestPaymentPage() {
  const [status, setStatus] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    addLog("✅ Razorpay script loaded");

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check subscription status
  const checkStatus = async () => {
    setLoading(true);
    addLog("📡 Fetching subscription status...");

    try {
      const res = await fetch("/api/subscription/status");
      const data = await res.json();
      setStatus(data);
      addLog(
        `✅ Status: ${data.subscription?.status || data.status || "No subscription"}`,
      );
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    }

    setLoading(false);
  };

  // Create order
  const createOrder = async () => {
    setLoading(true);
    addLog("📡 Creating Razorpay order...");

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.error) {
        addLog(`❌ Error: ${data.error}`);
        setLoading(false);
        return;
      }

      setOrder(data);
      addLog(`✅ Order created: ${data.order.id}`);
      addLog(`💰 Amount: ₹${data.order.amount / 100}`);
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    }

    setLoading(false);
  };

  // Open Razorpay checkout
  const openPayment = () => {
    if (!order) {
      addLog("❌ Create order first!");
      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    addLog(`🔑 Using key: ${razorpayKey}`);
    addLog("💳 Opening Razorpay checkout...");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.order.amount,
      currency: order.order.currency,
      name: "WaChat",
      description: "Premium Subscription - ₹500/month",
      order_id: order.order.id,
      handler: async function (response: any) {
        addLog("✅ Payment completed! Verifying...");
        addLog(`Payment ID: ${response.razorpay_payment_id}`);

        // Verify payment
        try {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            addLog("🎉 SUBSCRIPTION ACTIVATED!");
            addLog(`Status: ${verifyData.subscription.status}`);
            // Refresh status
            checkStatus();
          } else {
            addLog(`❌ Verification failed: ${verifyData.error}`);
          }
        } catch (error: any) {
          addLog(`❌ Verify error: ${error.message}`);
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#10B981",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    setLoading(true);
    addLog("📡 Cancelling subscription...");

    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        addLog("✅ Subscription cancelled");
        checkStatus();
      } else {
        addLog(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Payment System Test</h1>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={checkStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              1. Check Status
            </button>
            <button
              onClick={createOrder}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              2. Create Order
            </button>
            <button
              onClick={openPayment}
              disabled={loading || !order}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              3. Pay Now
            </button>
            <button
              onClick={cancelSubscription}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
          {status ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(status, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">Click "Check Status" to view</p>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(order, null, 2)}
            </pre>
          </div>
        )}

        {/* Test Card Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">💳 Test Card Details</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Card Number:</strong>{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded">
                4111 1111 1111 1111
              </code>
            </p>
            <p>
              <strong>Expiry:</strong> Any future date (e.g., 12/28)
            </p>
            <p>
              <strong>CVV:</strong> Any 3 digits (e.g., 123)
            </p>
            <p>
              <strong>OTP:</strong>{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded">1234</code> (for
              test mode)
            </p>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-gray-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">📜 Logs</h2>
          <div className="font-mono text-sm text-green-400 h-64 overflow-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="py-1">
                  {log}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-4 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}
