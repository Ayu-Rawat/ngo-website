import Link from 'next/link';
import styles from './page.module.css'
import testimonialsStyles from './testimonials.module.css'
import Image from 'next/image';
import { FaHandsHelping, FaHeart } from 'react-icons/fa';

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

const faq = [
  {
    question: "What is Change I Network (CIN)?",
    answer:
      "Change I Network (CIN) is a non-governmental organization (NGO) founded by a group of professionals committed to bringing positive change in society. It focuses on empowering underprivileged children, youth, women, and the elderly through education, health, environmental, and social initiatives."
  },
  {
    question: "What are the main programs run by CIN?",
    answer: `
      CIN runs four major initiatives across India:<br/><br/>
      <strong>Paatshaala (Learning Today, Leading Tomorrow)</strong> – Focused on promoting education for children from economically weaker sections.<br/>
      <strong>Paryavaran (My Locality, I Care)</strong> – Encourages civic responsibility and environmental awareness through cleanliness drives.<br/>
      <strong>Perfect Health</strong> – Conducts health camps, blood donation drives, and awareness programs.<br/>
      <strong>Pahal (An Initiative)</strong> – A platform for special projects like orphanage support, voter drives, and street plays on social issues.
    `
  },
  {
    question: "How can I contribute or volunteer for Change I Network?",
    answer:
      "You can contribute by donating, volunteering in any of our programs, or collaborating with us for events and awareness drives. To donate, please visit our official <a href='/donate' target='_blank' rel='noopener noreferrer'>Donate</a> page on the website."
  },
  {
    question: "How does CIN ensure transparency in donations?",
    answer:
      "All contributions are used solely for CIN’s registered social welfare programs. Detailed expenditure reports and updates are shared with donors upon request or during our annual review meets."
  },
  {
    question: "Where is Change I Network located?",
    answer:
      "Our head office is located at S-4, Manish Chamber II, Plot 6 LSC, Second Floor, Sector-12, Dwarka, New Delhi – 110078."
  },
  {
    question: "What impact has CIN made so far?",
    answer:
      "Over 50+ children have been enrolled in formal schools under Paatshaala. Multiple health and blood donation camps have been organized under Perfect Health. Cleanliness and awareness drives have been conducted across Delhi and nearby regions. Street plays and voter awareness programs have been run under the Pahal initiative."
  },
  {
    question: "I want to raise funds for CIN’s medical or social cause. How can I start?",
    answer:
      "You can start a fundraiser by reaching out to our official support team at <a href='mailto:info@changeinetwork.org'>info@changeinetwork.org</a> or connecting with us on <a href='https://facebook.com/changeinetwork' target='_blank' rel='noopener noreferrer'>Facebook</a>. Our team will guide you through the process."
  },
  {
    question: "I don’t see a specific cause listed. Can I still start a campaign?",
    answer:
      "Yes. CIN welcomes unique social and community causes that align with our mission. Contact us to discuss your idea, and we’ll help set it up."
  },
  {
    question: "How do I get regular updates on CIN’s work?",
    answer: `
      Follow us on our social media channels:<br/><br/>
      <strong>Facebook:</strong> <a href='https://facebook.com/changeinetwork' target='_blank' rel='noopener noreferrer'>facebook.com/changeinetwork</a><br/>
      <strong>Twitter:</strong> <a href='https://twitter.com/changeinetwork' target='_blank' rel='noopener noreferrer'>twitter.com/changeinetwork</a><br/>
      <strong>Website:</strong> <a href='https://www.changeinetwork.org' target='_blank' rel='noopener noreferrer'>www.changeinetwork.org</a>
    `
  },
  {
    question: "I have more questions. Who do I contact?",
    answer:
      "You can write to us at <a href='mailto:info@changeinetwork.org'>info@changeinetwork.org</a> or call us at <a href='tel:+918745082888'>+91 8745082888</a>. Our team will be happy to assist you."
  }
];

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
      <div className={styles.testimonialsHeader}>
        <h2 className={styles.testimonialsTitle}>What people are saying</h2>
        <p className={styles.testimonialsDescription}>Real stories from the people we've touched and the volunteers who make it happen</p>
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
      <div className={styles.faqSection}>
        <div className={styles.leftFaq}>
          <h2 className={styles.faqTitle}>FAQ</h2>
          <p className={styles.faqDescription}>Answers to common questions about Change I Network and our work</p>
        </div>
        <div className={styles.rightFaq}>
          {faq.map((item, idx) => (
            <details key={idx} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span>{item.question}</span>
              </summary>
              <div
                className={styles.faqAnswer}
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </details>
          ))}
        </div>
      </div>
      <div style={{
      backgroundImage: `
        linear-gradient(90deg, rgba(16,185,129,0.25) 1px, transparent 0),
        linear-gradient(180deg, rgba(16,185,129,0.25) 1px, transparent 0),
        repeating-linear-gradient(45deg, rgba(16,185,129,0.2) 0 2px, transparent 2px 6px)
      `,
      backgroundSize: "24px 24px, 24px 24px, 24px 24px",
      }}className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to make a difference?</h2>
        <p className={styles.ctaDescription}>Join us in empowering communities and creating lasting change. Your support matters.</p>
        <div className={styles.ctaButtonContainer}>
          <Link href="/donate" className={styles.ctaButtonBig}>
            <div className={styles.ctaButtonIcon}>
              <FaHeart aria-hidden="true" className={styles.icon} />
            </div>
            Donate Now
          </Link>
          <Link href="/volunteer" className={styles.ctaButtonBig}>
            <div className={styles.ctaButtonIcon}>
              <FaHandsHelping aria-hidden="true" className={styles.icon} />
            </div>
            Volunteer
          </Link>
        </div>
      </div>
    </main>
  );
}
