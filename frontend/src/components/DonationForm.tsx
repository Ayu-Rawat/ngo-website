'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaCreditCard, FaInfoCircle, FaSyncAlt, FaUser } from 'react-icons/fa';
import styles from './DonationForm.module.css';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonorDetails {
  name: string;
  phone: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

type DonationType = 'one-time' | 'monthly';

const DonationForm = () => {
  const [donationType, setDonationType] = useState<DonationType>('one-time');
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorDetails, setDonorDetails] = useState<DonorDetails>({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [lastAmount, setLastAmount] = useState<number | null>(null);
  const predefinedAmounts = [100, 500, 1000, 2000, 5000];

  // Fetch current user session on component mount
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch('/api/user/session');
        if (response.ok) {
          const userData = await response.json();
          if (userData.user) {
            setUser(userData.user);
            // Pre-fill donor details with user information
            setDonorDetails({
              name: userData.user.name || '',
              phone: '',
            });
          }
        }
      } catch (error) {
        console.log('No user session found or error fetching user:', error);
        // This is fine - user is not logged in
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    console.log("Amount Changed:", amount, customAmount);
  }, [amount, customAmount]);

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

  const handleOneTimePayment = async (finalAmount: number) => {
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
          donorEmail: user?.email,
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
  name: 'Change I Network',
        description: 'One-time Donation for NGO - Making a Difference',
        image: '/favicon.ico',
        order_id: order.id,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: true,
          paylater: true
        },
        prefill: {
          name: donorDetails.name,
          email: user?.email,
          contact: donorDetails.phone,
        },
        notes: {
          purpose: 'One-time Donation',
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
                payment_method: response.method || 'unknown',
              }),
            });

            const result = await verifyResponse.json();

            if (result.success) {
              setShowSuccess(true);
              setLastAmount(finalAmount);
              resetForm();
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
      throw error;
    }
  };

  const handleMonthlySubscription = async (finalAmount: number) => {
    try {
      // Step 1: Create a plan
      const planResponse = await fetch('/api/create-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          interval: 'monthly',
        }),
      });

      if (!planResponse.ok) {
        throw new Error('Failed to create subscription plan');
      }

      const plan = await planResponse.json();

      // Step 2: Create subscription
      const subscriptionResponse = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          customerEmail: user?.email,
          customerName: donorDetails.name,
          customerPhone: donorDetails.phone,
          amount: finalAmount, // Add amount for database storage
        }),
      });

      if (!subscriptionResponse.ok) {
        const errorData = await subscriptionResponse.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const subscription = await subscriptionResponse.json();

      // Step 3: Open Razorpay for authentication
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscription.subscription_id,
  name: 'Change I Network',
        description: `Monthly Donation of ₹${finalAmount}`,
        image: '/favicon.ico',
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: false, // EMI not supported for subscriptions
          paylater: false // Pay later not supported for subscriptions
        },
        prefill: {
          name: donorDetails.name,
          email: user?.email,
          contact: donorDetails.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: function (response: any) {
          console.log('Subscription payment successful:', response);
          setSubscriptionDetails({
            ...subscription,
            payment_id: response.razorpay_payment_id,
          });
          setShowSuccess(true);
          resetForm();
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
      console.error('Subscription error:', error);
      throw error;
    }
  };

  const resetForm = () => {
    setAmount('');
    setCustomAmount('');
    setDonorDetails({ name: '', phone: '' });
    setLoading(false);
  };

  const handlePayment = async () => {
    const finalAmount = getFinalAmount();

    // Validation
    if (finalAmount < 1) {
      alert('Please enter a valid amount (minimum ₹1)');
      return;
    }

    // Check if user is logged in
    if (!user) {
      if (confirm('You need to be logged in to make a donation. Would you like to log in now?')) {
        window.location.href = '/login';
      }
      return;
    }

    if (!donorDetails.name.trim()) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      if (donationType === 'one-time') {
        await handleOneTimePayment(finalAmount);
      } else {
        await handleMonthlySubscription(finalAmount);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Failed to process payment. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <FaCheckCircle aria-hidden="true" className={styles.successIcon} />
          <h2 className={styles.successTitle}>
            Thank You for Your {donationType === 'monthly' ? 'Monthly ' : ''}Donation!
          </h2>
          <p className={styles.successMessage}>
            {donationType === 'monthly' ? (
              <>
                Your monthly contribution of ₹{getFinalAmount()} will help us make a sustained difference in the community.
                <br />
                <strong>Your first payment will be charged today, and then monthly on this date.</strong>
              </>
            ) : (
              <>
                Your generous contribution of ₹{lastAmount} will help us make a real difference in the community.
              </>
            )}
          </p>
          <p className={styles.successNote}>
            You will receive a confirmation email shortly.
            {donationType === 'monthly' && (
              <><br />You can manage or cancel your subscription anytime by contacting us.</>
            )}
          </p>
          {subscriptionDetails && (
            <div className={styles.subscriptionInfo}>
              <p><strong>Subscription ID:</strong> {subscriptionDetails.subscription_id}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
          )}
          <button
            onClick={() => {
              setShowSuccess(false);
              setSubscriptionDetails(null);
            }}
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
      {/* Donation Type Selection */}
      <div className={styles.donationTypeSection}>
        <label className={styles.label}>Choose Donation Type</label>
        <div className={styles.donationTypeButtons}>
          <button
            onClick={() => setDonationType('one-time')}
            className={`${styles.donationTypeButton} ${
              donationType === 'one-time' ? styles.donationTypeButtonSelected : ''
            }`}
          >
            <FaCreditCard aria-hidden="true" className={styles.donationTypeIcon} />
            <div>
              <div className={styles.donationTypeTitle}>One-time</div>
              {/* <div className={styles.donationTypeDesc}>Make a single donation</div> */}
            </div>
          </button>
          <button
            onClick={() => setDonationType('monthly')}
            className={`${styles.donationTypeButton} ${
              donationType === 'monthly' ? styles.donationTypeButtonSelected : ''
            }`}
          >
            <FaSyncAlt aria-hidden="true" className={styles.donationTypeIcon} />
            <div>
              <div className={styles.donationTypeTitle}>Monthly</div>
              {/* <div className={styles.donationTypeDesc}>Recurring monthly donation</div> */}
            </div>
          </button>
        </div>
        {donationType === 'monthly' && (
          <div className={styles.monthlyNote}>
            <FaInfoCircle aria-hidden="true" className={styles.monthlyNoteIcon} />
            Monthly donations provide sustained support and can be cancelled anytime.
          </div>
        )}
      </div>

      {/* Amount Selection */}
      <div className={styles.amountSection}>
        <label className={styles.label}>
          Select Donation Amount {donationType === 'monthly' && '(per month)'}
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
              {donationType === 'monthly' && <span className={styles.monthlyLabel}>/month</span>}
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
            {donationType === 'monthly' && customAmount && (
              <span className={styles.monthlyLabelCustom}>/month</span>
            )}
          </div>
        </div>
      </div>

      {/* Donor Details */}
      <div className={styles.detailsSection}>
        {user && (
          <div className={styles.userNote}>
            <FaUser aria-hidden="true" className={styles.userIcon} />
            <span>Welcome back, {user.name}! Your details have been pre-filled.</span>
          </div>
        )}
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
        <div className={styles.inputGroup}>
            <label className={styles.inputGroupLabel}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={donorDetails.phone}
              onChange={(e) => setDonorDetails({ ...donorDetails, phone: e.target.value })}
              className={styles.textInput}
              placeholder="Enter your phone number"
              required={true}
            />
        </div>        
      </div>

      {/* Donation Button */}
      <button
        onClick={handlePayment}
        disabled={
          !getFinalAmount() || 
          !donorDetails.name || 
          !donorDetails.phone ||
          loading
        }
        className={styles.donateButton}
      >
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            Processing...
          </div>
        ) : (
          <>
            {donationType === 'one-time' ? 'Donate' : 'Subscribe for'} ₹{getFinalAmount()}
            {donationType === 'monthly' && '/month'}
          </>
        )}
      </button>

      {/* Security Note */}
      <p className={styles.securityNote}>
        Secure payment powered by Razorpay. Supports UPI, Cards, NetBanking, Wallets
        {donationType === 'one-time' && ', EMI, and Pay Later options'}. 
        Your payment information is encrypted and secure.
        {donationType === 'monthly' && (
          <><br />Monthly subscriptions can be cancelled anytime by contacting us.</>
        )}
      </p>
    </div>
  );
};

export default DonationForm;