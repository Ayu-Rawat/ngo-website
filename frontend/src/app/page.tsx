import Link from 'next/link';
import styles from './page.module.css'
import Image from 'next/image';
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
    </main>
  );
}
