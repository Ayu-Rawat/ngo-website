"use client";
import { useState } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import NavLink from './NavLink';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navWrapper}>
                    <Link href="/" className={styles.logo}>
                        <div style={{
                            position: 'relative',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            border: '1px solid #dadadaff',
                        }}>
                            <Image style={{
                                objectFit: 'contain',
                                objectPosition: 'center'
                            }} fill src="/logo/logo.svg" alt="Logo" />
                        </div>
                        <span className={styles.logoName}>Change I Network</span>
                    </Link>
                    <div className={styles.mobileMenuControls}>
                        <NavLink href="/donate" variant="cta">Donate</NavLink>
                        <button 
                            className={styles.menuButton} 
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                {menuOpen ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </>
                                ) : (
                                    <>
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                    <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
                        <NavLink href="/about">About</NavLink>
                        <NavLink href="/volunteer">Volunteer</NavLink>
                        <NavLink href="/photo-gallery">Photo Gallery</NavLink>
                        <div className={styles.desktopCta}>
                            <NavLink href="/donate" variant="cta">Donate</NavLink>
                        </div>
                    </ul>
                </div>
            </nav>
            {menuOpen && (
                <div 
                    className={styles.overlay} 
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}
