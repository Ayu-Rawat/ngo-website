import VolunteerForm from '@/components/VolunteerForm';
import styles from './page.module.css';

export default function Volunteer() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Header Section */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              Join Our Volunteer Team
            </h1>
            <p className={styles.subtitle}>
              Make a meaningful difference in your community. Connect I Network is looking for passionate volunteers 
              to help us create positive change in Dwarka Mor and surrounding areas.
            </p>
          </div>

          <div className={styles.content}>
            {/* Left Side - Volunteer Form */}
            <div className={styles.formSection}>
              <VolunteerForm />
            </div>

            {/* Right Side - Why Volunteer Content */}
            <div className={styles.infoSection}>
              {/* Why Volunteer Section */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <span className={styles.cardEmoji}>🤝</span>
                  Why Volunteer With Us?
                </h2>
                <div className={styles.cardContent}>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>💝</span>
                    <div className={styles.featureContent}>
                      <h3 className={styles.featureTitle}>Make Real Impact</h3>
                      <p className={styles.featureText}>Directly contribute to improving lives in your community through meaningful projects.</p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🌱</span>
                    <div className={styles.featureContent}>
                      <h3 className={styles.featureTitle}>Personal Growth</h3>
                      <p className={styles.featureText}>Develop new skills, gain experience, and build lasting relationships with like-minded people.</p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🎯</span>
                    <div className={styles.featureContent}>
                      <h3 className={styles.featureTitle}>Flexible Commitment</h3>
                      <p className={styles.featureText}>Choose your level of involvement based on your schedule and interests.</p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <span className={styles.featureIcon}>🏆</span>
                    <div className={styles.featureContent}>
                      <h3 className={styles.featureTitle}>Recognition & Certificates</h3>
                      <p className={styles.featureText}>Receive certificates and recognition for your valuable contributions.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Volunteer Needs */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <span className={styles.cardEmoji}>📋</span>
                  Current Volunteer Needs
                </h2>
                <div className={styles.cardContent}>
                  <div className={`${styles.needItem} ${styles.urgent}`}>
                    <h3 className={styles.needTitle}>Education Support</h3>
                    <p className={styles.needText}>Help underprivileged children with homework, reading, and basic computer skills.</p>
                    <span className={`${styles.badge} ${styles.badgeUrgent}`}>Urgent Need</span>
                  </div>
                  
                  <div className={`${styles.needItem} ${styles.high}`}>
                    <h3 className={styles.needTitle}>Healthcare Awareness</h3>
                    <p className={styles.needText}>Assist in organizing health check-up camps and awareness programs.</p>
                    <span className={`${styles.badge} ${styles.badgeHigh}`}>High Priority</span>
                  </div>
                  
                  <div className={`${styles.needItem} ${styles.ongoing}`}>
                    <h3 className={styles.needTitle}>Women Empowerment</h3>
                    <p className={styles.needText}>Support skill development workshops and entrepreneurship programs for women.</p>
                    <span className={`${styles.badge} ${styles.badgeOngoing}`}>Ongoing</span>
                  </div>
                  
                  <div className={`${styles.needItem} ${styles.new}`}>
                    <h3 className={styles.needTitle}>Digital Marketing</h3>
                    <p className={styles.needText}>Help promote our initiatives through social media and content creation.</p>
                    <span className={`${styles.badge} ${styles.badgeNew}`}>New Initiative</span>
                  </div>
                  
                  <div className={`${styles.needItem} ${styles.event}`}>
                    <h3 className={styles.needTitle}>Event Management</h3>
                    <p className={styles.needText}>Organize and coordinate community events, workshops, and fundraising activities.</p>
                    <span className={`${styles.badge} ${styles.badgeEvent}`}>Event Based</span>
                  </div>
                </div>
              </div>

              {/* Volunteer Impact Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-3xl mr-3">📊</span>
                  Our Impact Together
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                    <div className="text-gray-700">Active Volunteers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
                    <div className="text-gray-700">Lives Impacted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">85+</div>
                    <div className="text-gray-700">Programs Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">12+</div>
                    <div className="text-gray-700">Years of Service</div>
                  </div>
                </div>
              </div>

              {/* Volunteer Requirements */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-3xl mr-3">✅</span>
                  Volunteer Requirements
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Age 16 years or above</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Passion for community service</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Basic communication skills</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Minimum 2 hours per week commitment</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Willingness to learn and contribute</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Valid ID proof (for verification)</span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-3xl mr-3">📞</span>
                  Have Questions?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600 text-xl">📧</span>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a href="mailto:volunteer@connectinetwork.org" className="text-blue-600 hover:underline">
                        volunteer@connectinetwork.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 text-xl">📱</span>
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <a href="https://wa.me/919876543210" className="text-green-600 hover:underline">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600 text-xl">📍</span>
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">Dwarka Mor, New Delhi, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
