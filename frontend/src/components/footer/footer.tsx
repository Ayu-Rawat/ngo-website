import Link from 'next/link'
import Image from 'next/image'
import styles from './footer.module.css'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* About Section */}
        <div className={styles.footerSection}>
          <div className={styles.logoSection}>
            <Image 
              src="/logo/logo.svg" 
              alt="Change I Network Logo" 
              width={60} 
              height={60}
              className={styles.logo}
            />
            <h3 className={styles.footerTitle}>Change I Network</h3>
          </div>
          <p className={styles.footerDescription}>
            Empowering communities through education, health, environmental care, and social initiatives. Together, we create lasting change.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com/changeinetwork" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com/changeinetwork" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/changeinetwork" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/company/changeinetwork" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Quick Links</h4>
          <ul className={styles.linkList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/donate">Donate</Link></li>
            <li><Link href="/volunteer">Volunteer</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Contact Us</h4>
          <ul className={styles.contactList}>
            <li>
              <FaMapMarkerAlt className={styles.icon} />
              <span>S-4, Manish Chamber II, Plot 6 LSC,<br />Second Floor, Sector-12,<br />Dwarka, New Delhi – 110078</span>
            </li>
            <li>
              <FaPhone className={styles.icon} />
              <a href="tel:+918745082888">+91 8745082888</a>
            </li>
            <li>
              <FaEnvelope className={styles.icon} />
              <a href="mailto:info@changeinetwork.org">info@changeinetwork.org</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p className={styles.copyright}>
            © {currentYear} Change I Network. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <span className={styles.separator}>•</span>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
