import styles from './page.module.css'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import Image from 'next/image'
export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '20px',
          width: '100%',
          height: 'clamp(200px, 30vw, 400px)',
          overflow: 'hidden',
          border: '3px solid #c5ff87aa',
        }}>
          <Image
            src="/banner.jpg"
            alt="About Change I Network"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            />
        </div>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.lead}>
          Change I Network (CIN) is an NGO with a mission to bring positive change in the lives of people.
        </p>
        <p className={styles.paragraph}>
          Change I Network started its operations about two years back, with its headquarters in New Delhi. CIN's members are running four of its flagship programmes (4 Ps) through its branches in different parts of the country.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Genesis</h2>
          <blockquote className={styles.quote}>
            <p>“We can’t help everyone, but everyone can help someone.”</p>
          </blockquote>
          <p className={styles.paragraph}>
            Inspired by this very quote, a group of professionals came together to form Change I Network. Thus, it is being run by working professionals who are committed to dedicating their time, resources, and skills to serve society.
          </p>
          <p className={styles.paragraph}>
            This organization strives to bring about a positive change in society by helping people.
          </p>
          <p className={styles.paragraph}>
            The concept of CIN originated from the anti-corruption and socio-political movements happening across the globe, which have seen immense youth participation.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Vision and Mission</h2>
          <p className={styles.paragraph}>
            To enable civil society across the world to engage proactively in the change process through the philosophy of civic-driven change and to bring sustainable change in the lives of underprivileged children, youth, women, and the elderly.
          </p>
        </section>

        <section className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <div className={styles.contactContent}>
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} aria-hidden="true" />
                <div>
                  <p className={styles.contactLabel}>Address</p>
                  <p className={styles.contactValue}>
                    S-4, Manish Chamber II, Plot 6 LSC,
                    <br /> Second Floor, Sector-12,
                    <br /> Dwarka, New Delhi – 110078
                  </p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} aria-hidden="true" />
                <div>
                  <p className={styles.contactLabel}>Phone</p>
                  <a className={styles.contactLink} href="tel:+918745082888">
                    +91 8745082888
                  </a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} aria-hidden="true" />
                <div>
                  <p className={styles.contactLabel}>Email</p>
                  <a className={styles.contactLink} href="mailto:info@changeinetwork.org">
                    info@changeinetwork.org
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.socialSection}>
              <p className={styles.contactLabel}>Follow us</p>
              <div className={styles.socialGrid}>
                <a
                  className={styles.socialLink}
                  href="https://facebook.com/changeinetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebook aria-hidden="true" />
                  <span>Facebook</span>
                </a>
                <a
                  className={styles.socialLink}
                  href="https://twitter.com/changeinetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter aria-hidden="true" />
                  <span>Twitter</span>
                </a>
                <a
                  className={styles.socialLink}
                  href="https://instagram.com/changeinetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram aria-hidden="true" />
                  <span>Instagram</span>
                </a>
                <a
                  className={styles.socialLink}
                  href="https://linkedin.com/company/changeinetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
