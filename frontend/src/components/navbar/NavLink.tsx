'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './navbar.module.css';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    variant?: 'default' | 'cta';
}

export default function NavLink({ href, children, variant = 'default' }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    const className = variant === 'cta' 
        ? `${styles.ctaLink} ${isActive ? styles.ctaLinkActive : ''}` 
        : `${styles.navItem} ${isActive ? styles.navItemActive : ''}`;

    return (
        <li className={className}>
            <Link href={href}>
                {children}
            </Link>
        </li>
    );
}
