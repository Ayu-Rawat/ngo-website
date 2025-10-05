'use client';

import { useState } from 'react';
import styles from './VolunteerForm.module.css';

interface VolunteerFormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  age: string;
  address: string;
  city: string;
  pincode: string;
  
  // Professional Information
  occupation: string;
  organization: string;
  experience: string;
  
  // Volunteer Details
  interests: string[];
  availability: string[];
  timeCommitment: string;
  skills: string;
  languages: string[];
  
  // Additional Information
  motivation: string;
  previousVolunteering: string;
  emergencyContact: string;
  emergencyPhone: string;
}

const VolunteerForm = () => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    city: '',
    pincode: '',
    occupation: '',
    organization: '',
    experience: '',
    interests: [],
    availability: [],
    timeCommitment: '',
    skills: '',
    languages: [],
    motivation: '',
    previousVolunteering: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = [
    'Education & Teaching',
    'Healthcare & Medical',
    'Environment & Sustainability',
    'Community Development',
    'Women Empowerment',
    'Child Welfare',
    'Elderly Care',
    'Skill Development',
    'Event Management',
    'Digital Marketing',
    'Photography/Videography',
    'Administrative Support'
  ];

  const availabilityOptions = [
    'Weekdays (Morning)',
    'Weekdays (Evening)',
    'Weekends',
    'Public Holidays',
    'Flexible/As Needed'
  ];

  const languageOptions = [
    'Hindi',
    'English',
    'Punjabi',
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi',
    'Gujarati',
    'Urdu',
    'Other'
  ];

  const handleInputChange = (field: keyof VolunteerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: 'interests' | 'availability' | 'languages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateForm = (): boolean => {
    const required = ['fullName', 'email', 'phone', 'age', 'address', 'city'];
    
    for (const field of required) {
      if (!formData[field as keyof VolunteerFormData]) {
        alert(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
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

    // Age validation
    const age = parseInt(formData.age);
    if (age < 16 || age > 80) {
      alert('Age must be between 16 and 80 years');
      return false;
    }

    if (formData.interests.length === 0) {
      alert('Please select at least one area of interest');
      return false;
    }

    if (formData.availability.length === 0) {
      alert('Please select your availability');
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
          email: '',
          phone: '',
          age: '',
          address: '',
          city: '',
          pincode: '',
          occupation: '',
          organization: '',
          experience: '',
          interests: [],
          availability: [],
          timeCommitment: '',
          skills: '',
          languages: [],
          motivation: '',
          previousVolunteering: '',
          emergencyContact: '',
          emergencyPhone: '',
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
      <h2 className={styles.title}>Volunteer Registration Form</h2>
      <p className={styles.subtitle}>
  Join our mission to make a positive impact in the community. Fill out this form to become a volunteer with Change I Network.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Personal Information */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Personal Information</h3>
          
          <div className={styles.inputRow}>
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
              <label className={styles.label}>Age *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className={styles.input}
                placeholder="Your age"
                min="16"
                max="80"
                required
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={styles.input}
                placeholder="your.email@example.com"
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
                placeholder="10-digit mobile number"
                pattern="[6-9][0-9]{9}"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Address *</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={styles.textarea}
              placeholder="Enter your complete address"
              rows={3}
              required
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={styles.input}
                placeholder="Your city"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>PIN Code</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className={styles.input}
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Professional Information</h3>
          
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className={styles.input}
                placeholder="Your profession/job"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Organization/Company</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className={styles.input}
                placeholder="Where you work/study"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Relevant Experience</label>
            <textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className={styles.textarea}
              placeholder="Any relevant experience or background that might help in volunteering"
              rows={3}
            />
          </div>
        </div>

        {/* Volunteer Preferences */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Volunteer Preferences</h3>
          
          <div className={styles.checkboxSection}>
            <label className={styles.label}>Areas of Interest * (Select all that apply)</label>
            <div className={styles.checkboxGrid}>
              {interestOptions.map((interest) => (
                <label key={interest} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleCheckboxChange('interests', interest)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.checkboxSection}>
            <label className={styles.label}>Availability * (Select all that apply)</label>
            <div className={styles.checkboxGrid}>
              {availabilityOptions.map((availability) => (
                <label key={availability} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(availability)}
                    onChange={() => handleCheckboxChange('availability', availability)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>{availability}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Time Commitment</label>
            <select
              value={formData.timeCommitment}
              onChange={(e) => handleInputChange('timeCommitment', e.target.value)}
              className={styles.select}
            >
              <option value="">Select your availability</option>
              <option value="1-2 hours per week">1-2 hours per week</option>
              <option value="3-5 hours per week">3-5 hours per week</option>
              <option value="6-10 hours per week">6-10 hours per week</option>
              <option value="More than 10 hours per week">More than 10 hours per week</option>
              <option value="Only for events/activities">Only for events/activities</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Special Skills or Talents</label>
            <textarea
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              className={styles.textarea}
              placeholder="Any special skills, talents, or expertise you can contribute (e.g., computer skills, teaching, medical knowledge, etc.)"
              rows={3}
            />
          </div>

          <div className={styles.checkboxSection}>
            <label className={styles.label}>Languages You Speak</label>
            <div className={styles.checkboxGrid}>
              {languageOptions.map((language) => (
                <label key={language} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.languages.includes(language)}
                    onChange={() => handleCheckboxChange('languages', language)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>{language}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Additional Information</h3>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Why do you want to volunteer with us?</label>
            <textarea
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              className={styles.textarea}
              placeholder="Tell us about your motivation to volunteer and what you hope to achieve"
              rows={4}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Previous Volunteering Experience</label>
            <textarea
              value={formData.previousVolunteering}
              onChange={(e) => handleInputChange('previousVolunteering', e.target.value)}
              className={styles.textarea}
              placeholder="Describe any previous volunteering experience (if any)"
              rows={3}
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                className={styles.input}
                placeholder="Emergency contact person"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Emergency Contact Phone</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                className={styles.input}
                placeholder="Emergency contact number"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
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