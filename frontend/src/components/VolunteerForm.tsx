'use client';

import { useState } from 'react';
import styles from './VolunteerForm.module.css';

interface VolunteerFormData {
  fullName: string;
  phone: string;
  email: string;
  residency: string;
}

const VolunteerForm = () => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: '',
    phone: '',
    email: '',
    residency: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      const response = await fetch('/api/volunteer-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          residency: '',
        });
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
          <h2 className={styles.successTitle}>Thank You for Volunteering!</h2>
          <p className={styles.successMessage}>
            Your volunteer application has been submitted successfully. Our team will review your application and contact you within 2-3 business days.
          </p>
          <p className={styles.successNote}>
            You will receive a confirmation email shortly at {formData.email}.
          </p>
          <button
            onClick={() => setSubmitted(false)}
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
      <h2 className={styles.title}>Join Our Volunteer Team</h2>
      <p className={styles.subtitle}>
        Fill out this simple form to become a volunteer with Connect I Network and make a difference in your community.
      </p>

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
              Submitting Application...
            </div>
          ) : (
            'Submit Volunteer Application'
          )}
        </button>

        <p className={styles.formNote}>
          * Required fields. Your information will be kept confidential and used only for volunteer coordination purposes.
        </p>
      </form>
    </div>
  );
};

export default VolunteerForm;