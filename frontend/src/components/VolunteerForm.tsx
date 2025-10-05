'use client';

import { useState } from 'react';
import styles from './VolunteerForm.module.css';

interface VolunteerFormData {
  fullName: string;
  phone: string;
  email: string;
  residency: string;
}

const INITIAL_FORM_DATA: VolunteerFormData = {
  fullName: '',
  phone: '',
  email: '',
  residency: '',
};

const VolunteerForm = () => {
  const [formData, setFormData] = useState<VolunteerFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleInputChange = (field: keyof VolunteerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }

    if (!formData.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }

    if (!formData.email.trim()) {
      alert('Please enter your email address');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const emailForConfirmation = formData.email.trim();

      const response = await fetch('/api/volunteer-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmittedEmail(emailForConfirmation);
        setSubmitted(true);
        // Reset form
        setFormData(INITIAL_FORM_DATA);
      } else {
        const error = await response.json();
        alert(`Submission failed: ${error.message || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Thank you for stepping up!</h2>
          <p className={styles.successMessage}>
            Your volunteer application is in. Our team will review it and connect with you within 2-3 business days to share the next steps.
          </p>
          <p className={styles.successNote}>
            You will receive a confirmation email shortly
            {submittedEmail && (
              <>
                {' '}
                at <strong>{submittedEmail}</strong>
              </>
            )}
            . We can&apos;t wait to collaborate with you.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSubmittedEmail('');
            }}
            className={styles.newApplicationButton}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={styles.input}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={styles.input}
            placeholder="Enter your 10-digit mobile number"
            pattern="[6-9][0-9]{9}"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={styles.input}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Residency (Optional)</label>
          <input
            type="text"
            value={formData.residency}
            onChange={(e) => handleInputChange('residency', e.target.value)}
            className={styles.input}
            placeholder="Enter your city or area"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            'Submit'
          )}
        </button>

      </form>
    </div>
  );
};

export default VolunteerForm;