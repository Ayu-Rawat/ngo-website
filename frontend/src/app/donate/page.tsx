import DonationForm from '@/components/DonationForm';
import { FaBookOpen, FaUtensils, FaHeartbeat, FaTools } from 'react-icons/fa';
import styles from './page.module.css';

export default function Donate() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Side - Donation Form */}
          <div className={styles.leftColumn}>
            <DonationForm />
          </div>

          {/* Right Side - Other Content */}
          <div className={styles.rightColumn}>
            {/* Header Section */}
            <div className={styles.header}>
              <h1 className={styles.title}>Support Our Mission</h1>
              <p className={styles.description}>
                Change I Network is dedicated to creating positive change in Dwarka Mor and surrounding communities. 
                Your donation helps us provide essential services, education, and support to those who need it most.
              </p>
            </div>

            {/* Impact Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Families Helped</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Community Programs</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>1000+</div>
                <div className={styles.statLabel}>Lives Impacted</div>
              </div>
            </div>

            {/* How Your Money Helps */}
            <div className={styles.impactSection}>
              <h2 className={styles.sectionTitle}>
                How Your Donation Makes a Difference
              </h2>
              <div className={styles.impactGrid}>
                <div className={styles.impactItem}>
                  <div className={styles.iconContainer}>
                    <FaBookOpen aria-hidden="true" className={styles.icon} />
                  </div>
                  <div className={styles.impactContent}>
                    <h3 className={styles.impactTitle}>Education Support</h3>
                    <p className={styles.impactDescription}>
                      ₹500 can provide school supplies for a child for an entire year
                    </p>
                  </div>
                </div>
                
                <div className={styles.impactItem}>
                  <div className={styles.iconContainer}>
                    <FaUtensils aria-hidden="true" className={styles.icon} />
                  </div>
                  <div className={styles.impactContent}>
                    <h3 className={styles.impactTitle}>Meal Programs</h3>
                    <p className={styles.impactDescription}>
                      ₹100 can provide nutritious meals for a family of four for a day
                    </p>
                  </div>
                </div>
                
                <div className={styles.impactItem}>
                  <div className={styles.iconContainer}>
                    <FaHeartbeat aria-hidden="true" className={styles.icon} />
                  </div>
                  <div className={styles.impactContent}>
                    <h3 className={styles.impactTitle}>Healthcare</h3>
                    <p className={styles.impactDescription}>
                      ₹1000 can cover basic medical check-ups for 10 community members
                    </p>
                  </div>
                </div>
                
                <div className={styles.impactItem}>
                  <div className={styles.iconContainer}>
                    <FaTools aria-hidden="true" className={styles.icon} />
                  </div>
                  <div className={styles.impactContent}>
                    <h3 className={styles.impactTitle}>Skill Development</h3>
                    <p className={styles.impactDescription}>
                      ₹2000 can fund vocational training for one person for a month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={styles.contact}>
              <p className={styles.contactText}>
                Have questions about your donation? 
                <br />
                Contact us at{' '}
                <a href="mailto:donate@connectinetwork.org" className={styles.contactLink}>
                  donate@connectinetwork.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
