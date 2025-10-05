"use client";
import { useState } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import NavLink from './NavLink';

interface User {
    id: string;
    name: string;
    email: string;
}

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login';
    };

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
                        {user ? (
                            <div className={styles.userMenuWrapper}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    style={{
                                        background: '#f0f0f0',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        width: '42px',
                                        height: '42px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#333'
                                    }}
                                    aria-label="User menu"
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </button>
                                {userMenuOpen && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: 'white',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '8px 0',
                                            minWidth: '180px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            zIndex: 1000
                                        }}
                                    >
                                        <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee' }}>
                                            <div style={{ fontWeight: '500', fontSize: '14px' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{user.email}</div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                padding: '8px 16px',
                                                background: 'none',
                                                border: 'none',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                color: '#d32f2f'
                                            }}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                href="/login"
                                style={{
                                    background: '#f0f0f0',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    width: '42px',
                                    height: '42px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#333',
                                    textDecoration: 'none'
                                }}
                                aria-label="Sign in"
                            >
                                <svg 
                                    width="20" 
                                    height="20" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </Link>
                        )}
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
                        {user && <NavLink href="/dashboard">Dashboard</NavLink>}
                        <div className={styles.desktopCta}>
                            <NavLink href="/donate" variant="cta">Donate</NavLink>
                        </div>
                        <div className={styles.desktopOnly}>
                            {user ? (
                                <div className={styles.userMenuWrapper}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        style={{
                                            background: '#f0f0f0',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            width: '42px',
                                            height: '42px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            color: '#333'
                                        }}
                                        aria-label="User menu"
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </button>
                                    {userMenuOpen && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: 0,
                                                marginTop: '8px',
                                                background: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                padding: '8px 0',
                                                minWidth: '180px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                zIndex: 1000
                                            }}
                                        >
                                            <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee' }}>
                                                <div style={{ fontWeight: '500', fontSize: '14px' }}>{user.name}</div>
                                                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{user.email}</div>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 16px',
                                                    background: 'none',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    color: '#d32f2f'
                                                }}
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <li className={styles.navItem}>
                                    <Link 
                                        href="/login"
                                        style={{
                                            textDecoration: 'none',
                                            color: '#666',
                                            background: '#f8f8f8',
                                            border: '1px solid #e0e0e0',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            display: 'block',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                </li>
                            )}
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
            {userMenuOpen && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                    }}
                    onClick={() => setUserMenuOpen(false)}
                />
            )}
        </>
    );
}
