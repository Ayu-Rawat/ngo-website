'use client';

import { useState } from 'react';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonorDetails {
  name: string;
  email: string;
  phone?: string;
}

const DonationForm = () => {
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorDetails, setDonorDetails] = useState<DonorDetails>({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const predefinedAmounts = [100, 500, 1000, 2000, 5000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmount('');
  };

  const getFinalAmount = (): number => {
    return parseInt(customAmount || amount || '0');
  };

  const handlePayment = async () => {
    const finalAmount = getFinalAmount();

    // Validation
    if (finalAmount < 1) {
      alert('Please enter a valid amount (minimum ₹1)');
      return;
    }

    if (!donorDetails.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!donorDetails.email.trim()) {
      alert('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donorDetails.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          donorName: donorDetails.name,
          donorEmail: donorDetails.email,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Connect I Network',
        description: 'Donation for NGO - Making a Difference',
        image: '/favicon.ico', // Add your NGO logo here
        order_id: order.id,
        prefill: {
          name: donorDetails.name,
          email: donorDetails.email,
          contact: donorDetails.phone,
        },
        notes: {
          purpose: 'Donation',
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: finalAmount,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donorDetails,
              }),
            });

            const result = await verifyResponse.json();

            if (result.success) {
              setShowSuccess(true);
              // Reset form
              setAmount('');
              setCustomAmount('');
              setDonorDetails({ name: '', email: '', phone: '' });
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto p-8 bg-green-50 rounded-lg border border-green-200">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Thank You for Your Donation!
          </h2>
          <p className="text-green-700 mb-4">
            Your generous contribution of ₹{getFinalAmount()} will help us make a real difference in the community.
          </p>
          <p className="text-sm text-green-600 mb-6">
            You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Support Connect I Network
      </h2>
      
      <p className="text-gray-600 mb-6 text-center">
        Your donation helps us continue our mission of making a positive impact in Dwarka Mor and surrounding communities.
      </p>

      {/* Amount Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Donation Amount
        </label>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleAmountSelect(amt)}
              className={`p-3 rounded-lg border transition-colors ${
                amount === amt.toString()
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
      </div>

      {/* Donor Details */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={donorDetails.name}
            onChange={(e) => setDonorDetails({ ...donorDetails, name: e.target.value })}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={donorDetails.email}
            onChange={(e) => setDonorDetails({ ...donorDetails, email: e.target.value })}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={donorDetails.phone}
            onChange={(e) => setDonorDetails({ ...donorDetails, phone: e.target.value })}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Donation Button */}
      <button
        onClick={handlePayment}
        disabled={!getFinalAmount() || !donorDetails.name || !donorDetails.email || loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Donate ₹${getFinalAmount()}`
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Secure payment powered by Razorpay. Your payment information is encrypted and secure.
      </p>
    </div>
  );
};

export default DonationForm;