import Link from 'next/link';
import styles from './page.module.css'
import Image from 'next/image';
import ScrollReveal from '@/components/modules/ScrollReveal/ScrollReveal';
export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Change I Network</h1>
          <p className={styles.description}>
          Change I Network (CIN) is a NGO with a mission to bring
          <br />
          positive change in the lives of people.          
          </p>

          <Link href="/donate" className={styles.ctaButton}>Donate Now</Link>
        </div>
        <div className={styles.cover}>

        </div>
        <div className={styles.bg}>
          <div className={styles.ov1}>
            <div className={styles.imageContainer}>
              <Image src="/home/1.jpg" alt="Background Image 1" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
            </div>
            <div className={styles.imageContainer}>
              <Image src="/home/2.jpg" alt="Background Image 2" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
            </div>
          </div>
          <div className={styles.ov2}>
            <div style={{
              marginLeft: 'clamp(100px, 20vw, 600px)',
            }} className={styles.imageContainer}>
              <Image src="/home/5.jpg" alt="Background Image 3" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
            </div>
            <div className={styles.imageContainer}>
              <Image src="/home/6.jpg" alt="Background Image 4" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
            </div>            
          </div>
        </div>
      </div>
      <div     
      style={{
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #a1ff85ff 100%)
      `,
      backgroundSize: "100% 100%",
    }} className={styles.tagLine}>
        <h1>
          We believe real change begins with us — empowering every child, woman, and youth to rise, act, and inspire a better tomorrow.
        </h1>
      </div>
      <div className={styles.programs}>
        <div className={styles.programsHeader}>
          <h2 className={styles.programsTitle}>Programs</h2>
          <p className={styles.programsDescription}>Empowering communities through impactful initiatives and sustainable development</p>
        </div>
        
        <div className={styles.programsContainer}>
          <div className={styles.programsGrid}>
            <div className={styles.programCard}>
              <div className={styles.programImageContainer}>
                <Image src="/programs/program1.jpg" alt="Program 1" fill style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.programContent}>
                <div className={styles.programNumber}>1</div>
                <h3 className={styles.programCardTitle}>Education for All</h3>
                <p className={styles.programCardDescription}>Providing quality education and learning opportunities to underprivileged children</p>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImageContainer}>
                <Image src="/programs/program2.jpg" alt="Program 2" fill style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.programContent}>
                <div className={styles.programNumber}>2</div>
                <h3 className={styles.programCardTitle}>Women Empowerment</h3>
                <p className={styles.programCardDescription}>Supporting women through skill development and entrepreneurship programs</p>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImageContainer}>
                <Image src="/programs/program3.jpg" alt="Program 3" fill style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.programContent}>
                <div className={styles.programNumber}>3</div>
                <h3 className={styles.programCardTitle}>Youth Development</h3>
                <p className={styles.programCardDescription}>Inspiring youth leadership and creating positive change in communities</p>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImageContainer}>
                <Image src="/programs/program4.jpg" alt="Program 4" fill style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.programContent}>
                <div className={styles.programNumber}>4</div>
                <h3 className={styles.programCardTitle}>Health & Wellness</h3>
                <p className={styles.programCardDescription}>Promoting healthy living and providing access to essential healthcare services</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
