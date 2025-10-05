import VolunteerForm from '@/components/VolunteerForm';
import styles from './page.module.css';

const volunteerBenefits = [
  {
    icon: '💝',
    title: 'Make real impact',
    description: 'Support neighbourhood initiatives that directly uplift families across Dwarka Mor and nearby communities.',
  },
  {
    icon: '🌱',
    title: 'Grow with purpose',
    description: 'Build new skills, learn from experienced mentors, and collaborate with people who care as much as you do.',
  },
  {
    icon: '🎯',
    title: 'Flexible commitment',
    description: 'Choose opportunities that fit your availability—weekends, evenings, or special events—we make it work.',
  },
  {
    icon: '🏆',
    title: 'Earn recognition',
    description: 'Receive certificates, recommendations, and shout-outs that highlight your contribution to lasting change.',
  },
];

const applicationSteps = [
  'Share your basic details.',
  'Our team connects within 2-3 business days.',
  'Pick a task that fits your skills and interests, and get started.',
];

export default function Volunteer() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <VolunteerForm />
          </div>

          <div className={styles.rightColumn}>
            <header className={styles.header}>
              <span className={styles.pill}>Volunteer with Change I Network</span>
              <h1 className={styles.title}>Bring your time. We&apos;ll turn it into change.</h1>
              <p className={styles.description}>
                We partner with local communities to design programs around education, healthcare, livelihoods, and inclusion.
                Every volunteer complements on-ground teams and helps us reach more people with dignity.
              </p>
            </header>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                Why volunteer with us
              </h2>
              <div className={styles.featureList}>
                {volunteerBenefits.map((benefit) => (
                  <div key={benefit.title} className={styles.featureItem}>
                    <span className={styles.featureIcon}>{benefit.icon}</span>
                    <div className={styles.featureBody}>
                      <h3 className={styles.featureHeading}>{benefit.title}</h3>
                      <p className={styles.featureText}>{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>
                What happens after you apply
              </h2>
              <ol className={styles.stepList}>
                {applicationSteps.map((step, index) => (
                  <li key={step} className={styles.stepItem}>
                    <span className={styles.stepBadge}>{index + 1}</span>
                    <p className={styles.stepText}>{step}</p>
                  </li>
                ))}
              </ol>
              <p className={styles.note}>
                Your information helps us coordinate the right opportunities. We never share personal details without your consent.
              </p>
            </section>

            {/*
              The section below includes additional volunteer marketing content that is intentionally hidden.
              Please keep it commented out unless there is explicit approval to bring it back.
              <div className={styles.card}>
                ...
              </div>
            */}
          </div>
        </div>
      </div>
    </main>
  );
}
