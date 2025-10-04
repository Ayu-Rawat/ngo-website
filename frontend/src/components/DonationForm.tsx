'use client';

import { useState } from 'react';
import styles from './DonationForm.module.css';

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
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>
            Thank You for Your Donation!
          </h2>
          <p className={styles.successMessage}>
            Your generous contribution of ₹{getFinalAmount()} will help us make a real difference in the community.
          </p>
          <p className={styles.successNote}>
            You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className={styles.anotherDonationButton}
          >
            Make Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Support Change I Network
      </h2>
      
      <p className={styles.subtitle}>
        Your donation helps us continue our mission of making a positive impact in Dwarka Mor and surrounding communities.
      </p>

      {/* Amount Selection */}
      <div className={styles.amountSection}>
        <label className={styles.label}>
          Select Donation Amount
        </label>
        <div className={styles.amountGrid}>
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => handleAmountSelect(amt)}
              className={`${styles.amountButton} ${
                amount === amt.toString() ? styles.amountButtonSelected : ''
              }`}
            >
              ₹{amt}
            </button>
          ))}
          <div className={styles.customAmountContainer}>
            <span className={styles.currencySymbol}>₹</span>
            <input
              type="number"
              placeholder="Custom"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className={styles.input}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Donor Details */}
      <div className={styles.detailsSection}>
        <div className={styles.inputGroup}>
          <label className={styles.inputGroupLabel}>
            Full Name *
          </label>
          <input
            type="text"
            value={donorDetails.name}
            onChange={(e) => setDonorDetails({ ...donorDetails, name: e.target.value })}
            className={styles.textInput}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputGroupLabel}>
              Email Address *
            </label>
            <input
              type="email"
              value={donorDetails.email}
              onChange={(e) => setDonorDetails({ ...donorDetails, email: e.target.value })}
              className={styles.textInput}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputGroupLabel}>
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={donorDetails.phone}
              onChange={(e) => setDonorDetails({ ...donorDetails, phone: e.target.value })}
              className={styles.textInput}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      {/* Donation Button */}
      <button
        onClick={handlePayment}
        disabled={!getFinalAmount() || !donorDetails.name || !donorDetails.email || loading}
        className={styles.donateButton}
      >
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            Processing...
          </div>
        ) : (
          `Donate ₹${getFinalAmount()}`
        )}
      </button>

      {/* Security Note */}
      <p className={styles.securityNote}>
        Secure payment powered by Razorpay. Your payment information is encrypted and secure.
      </p>
    </div>
  );
};

export default DonationForm;