import Link from 'next/link';
import styles from './page.module.css'
import testimonialsStyles from './testimonials.module.css'
import Image from 'next/image';

const testimonialText = [
  {
    "initiative": "Paathshaala – Learning Today, Leading Tomorrow",
    "review": "Paathshaala helped my daughter gain confidence in her studies. The volunteers truly care and make learning enjoyable for every child.",
    "name": "Rekha Sharma",
    "role": "Parent"
  },
  {
    "initiative": "Paathshaala – Learning Today, Leading Tomorrow",
    "review": "Teaching at Paathshaala showed me how education can change lives. Seeing parents support their kids’ learning is truly rewarding.",
    "name": "Ravi Patel",
    "role": "Volunteer"
  },
  {
    "initiative": "Paryavaran – My Locality, I Care",
    "review": "Our park has never looked cleaner since Paryavaran started. The initiative brought our community together for a great cause.",
    "name": "Anita Verma",
    "role": "Resident"
  },
  {
    "initiative": "Paryavaran – My Locality, I Care",
    "review": "Volunteering for Paryavaran made me value cleanliness and the environment more. It’s amazing to see so many people take part.",
    "name": "Arjun Mehra",
    "role": "Student Volunteer"
  },
  {
    "initiative": "Perfect Health",
    "review": "The free health camp helped my family get essential checkups. The volunteers were kind and professional throughout.",
    "name": "Ramesh Kumar",
    "role": "Beneficiary"
  },
  {
    "initiative": "Perfect Health",
    "review": "I joined their blood donation drive and learned so much about preventive health. Everything was well-organized and impactful.",
    "name": "Priya Nair",
    "role": "Volunteer"
  },
  {
    "initiative": "Pahal – An Initiative",
    "review": "Performing in Pahal’s street play was unforgettable. It felt great to spread awareness and inspire others.",
    "name": "Neha Joshi",
    "role": "Volunteer Performer"
  },
  {
    "initiative": "Pahal – An Initiative",
    "review": "During the winter drive, the team provided warm clothes and food to many families. Their compassion really touched our hearts.",
    "name": "Amina Begum",
    "role": "Beneficiary"
  },
  {
    "initiative": "General Impact",
    "review": "This NGO’s dedication across education, health, and environment is inspiring. They’re making real changes on the ground.",
    "name": "Vikas Mehta",
    "role": "Supporter"
  },
  {
    "initiative": "General Impact",
    "review": "Volunteering here taught me the power of small actions. The team works with genuine passion and care.",
    "name": "Shruti Patel",
    "role": "Volunteer"
  },
  {
    "initiative": "Paathshaala – Learning Today, Leading Tomorrow",
    "review": "The sessions at Paathshaala made learning easier for my son. He’s now excited to go to school every day.",
    "name": "Suman Gupta",
    "role": "Parent"
  },
  {
    "initiative": "Paathshaala – Learning Today, Leading Tomorrow",
    "review": "I’ve seen children grow in confidence and curiosity here. Paathshaala truly gives them a better start in life.",
    "name": "Rahul Desai",
    "role": "Volunteer"
  },
  {
    "initiative": "Paryavaran – My Locality, I Care",
    "review": "Thanks to Paryavaran, our streets are cleaner and greener. It’s motivating to see everyone take responsibility for their surroundings.",
    "name": "Manisha Tiwari",
    "role": "Local Resident"
  },
  {
    "initiative": "Paryavaran – My Locality, I Care",
    "review": "Joining the weekend clean-up drives was an eye-opener. I now encourage others to keep our area clean too.",
    "name": "Deepak Sharma",
    "role": "Volunteer"
  },
  {
    "initiative": "Perfect Health",
    "review": "The NGO’s health awareness session helped my family understand the importance of regular checkups. It’s a great initiative for our community.",
    "name": "Lata Singh",
    "role": "Beneficiary"
  },
  {
    "initiative": "Perfect Health",
    "review": "I volunteered at the medical camp and was amazed by the response. People were grateful and genuinely benefited.",
    "name": "Sahil Mehra",
    "role": "Volunteer Doctor"
  },
  {
    "initiative": "Pahal – An Initiative",
    "review": "Pahal’s events make social causes engaging and meaningful. Their team brings real energy and creativity to every campaign.",
    "name": "Ritika Jain",
    "role": "Volunteer"
  },
  {
    "initiative": "Pahal – An Initiative",
    "review": "The food distribution drive during monsoon was a big relief for our area. The volunteers worked selflessly throughout.",
    "name": "Kavita Devi",
    "role": "Beneficiary"
  },
  {
    "initiative": "General Impact",
    "review": "I’ve supported this NGO for years and seen how sincerely they work. Every program leaves a visible positive change.",
    "name": "Harish Malhotra",
    "role": "Donor"
  },
  {
    "initiative": "General Impact",
    "review": "The NGO’s commitment to community service is inspiring. Their initiatives create awareness and hope in every neighborhood.",
    "name": "Sneha Kapoor",
    "role": "Volunteer"
  }
]

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
        radial-gradient(125% 125% at 50% 90%, transparent 40%, #a1ff85ff 100%)
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
                <h3 className={styles.programCardTitle}>Paatshaala – Learning Today, Leading Tomorrow</h3>
                <p className={styles.programCardDescription}>
Paatshaala strives to make the Right to Education a reality for children from economically weaker sections. The program focuses on changing parents’ perspectives about education and providing them with the tools to help their children succeed.
</p>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImageContainer}>
                <Image src="/programs/program2.jpg" alt="Program 2" fill style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.programContent}>
                <div className={styles.programNumber}>2</div>
                <h3 className={styles.programCardTitle}>Paryavaran – My Locality, I Care</h3>
                <p className={styles.programCardDescription}>This initiative promotes civic responsibility and environmental awareness among local residents. Every weekend, CIN members and volunteers conduct cleanliness drives in parks and public spaces. </p>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImageContainer}>
                <Image src="/programs/program3.jpg" alt="Program 3" fill style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.programContent}>
                <div className={styles.programNumber}>3</div>
                <h3 className={styles.programCardTitle}>Perfect Health</h3>
                <p className={styles.programCardDescription}>Under this program, CIN raises health awareness through community activities such as medical camps, blood donation drives, and eye check-ups. The initiative aims to promote preventive healthcare and a healthier lifestyle among underprivileged communities.</p>
              </div>
            </div>

            <div className={styles.programCard}>
              <div className={styles.programImageContainer}>
                <Image src="/programs/program4.jpg" alt="Program 4" fill style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.programContent}>
                <div className={styles.programNumber}>4</div>
                <h3 className={styles.programCardTitle}>Pahal – An Initiative</h3>
                <p className={styles.programCardDescription}>Pahal serves as CIN’s platform for launching impactful social initiatives—ranging from awareness street plays and voter drives to orphanage support, food and winter relief distributions, and the “Donate a Flag” campaign.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={testimonialsStyles.testimonialsContainer}>
        <div className={testimonialsStyles.testimonialsScroll}>
          {[...testimonialText, ...testimonialText].map((t, idx) => (
            <figure key={`first-${idx}`} className={testimonialsStyles.card}>
              <div className={testimonialsStyles.initiative}>{t.initiative}</div>
              <div className={testimonialsStyles.review}>{t.review}</div>
              <div className={testimonialsStyles.name}>{t.name}</div>
              <div className={testimonialsStyles.role}>{t.role}</div>
            </figure>
          ))}
        </div>
        <div className={testimonialsStyles.testimonialsScrollReverse}>
          {[...testimonialText, ...testimonialText].map((t, idx) => (
            <figure key={`second-${idx}`} className={testimonialsStyles.card}>
              <div className={testimonialsStyles.initiative}>{t.initiative}</div>
              <div className={testimonialsStyles.review}>{t.review}</div>
              <div className={testimonialsStyles.name}>{t.name}</div>
              <div className={testimonialsStyles.role}>{t.role}</div>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
