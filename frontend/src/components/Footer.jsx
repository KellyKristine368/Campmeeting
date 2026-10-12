import { Link } from 'react-router-dom';

function Footer() {
    const year = new Date().getFullYear();

    const cols = {
        'The Event': [
            { to: '/',           label: 'Home'        },
            { to: '/speakers',   label: 'Speakers'    },
            { to: '/schedule',   label: 'Programme'   },
            { to: '/livestream', label: 'Live Stream' },
        ],
        'Attend': [
            { to: '/registration',  label: 'Register'      },
            { to: '/accommodation', label: 'Accommodation' },
            { to: '/location',      label: 'Location'      },
            { to: '/contact',       label: 'Contact Us'    },
        ],
    };

    return (
        <>
            <style>{`
                .ft {
                    background: var(--navy, #0D1B2A);
                    color: rgba(255,255,255,0.6);
                    font-family: 'DM Sans', sans-serif;
                    margin-top: auto;
                }

                /* Scripture banner */
                .ft-verse {
                    background: rgba(201,160,48,0.1);
                    border-top: 1px solid rgba(201,160,48,0.2);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    text-align: center;
                    padding: 1.1rem 2rem;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1rem;
                    font-style: italic;
                    color: rgba(201,160,48,0.8);
                    letter-spacing: 0.02em;
                }

                /* Main grid */
                .ft-body {
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 3.5rem 2rem 3rem;
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 3rem;
                }

                /* Brand */
                .ft-brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.1rem;
                }

                .ft-brand-text {}

                .ft-brand-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.45rem;
                    font-weight: 700;
                    color: #fff;
                    display: block;
                    line-height: 1.1;
                }

                .ft-brand-conf {
                    font-size: 0.62rem;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(201,160,48,0.8);
                    display: block;
                    margin-top: 3px;
                }

                .ft-tagline {
                    font-size: 0.87rem;
                    line-height: 1.7;
                    color: rgba(255,255,255,0.42);
                    max-width: 290px;
                    margin-bottom: 1.5rem;
                }

                /* Socials */
                .ft-socials {
                    display: flex;
                    gap: 0.5rem;
                }

                .ft-social {
                    width: 34px; height: 34px;
                    border-radius: 7px;
                    border: 1px solid rgba(255,255,255,0.12);
                    display: flex; align-items: center; justify-content: center;
                    color: rgba(255,255,255,0.5);
                    text-decoration: none;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.18s;
                }

                .ft-social:hover {
                    border-color: rgba(201,160,48,0.6);
                    color: rgba(201,160,48,0.9);
                    background: rgba(201,160,48,0.08);
                }

                /* Link columns */
                .ft-col-title {
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.28);
                    margin-bottom: 1rem;
                }

                .ft-col ul {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 0.55rem;
                }

                .ft-col a {
                    font-size: 0.86rem;
                    color: rgba(255,255,255,0.55);
                    text-decoration: none;
                    transition: color 0.15s;
                }

                .ft-col a:hover { color: rgba(255,255,255,0.9); }

                /* Bottom bar */
                .ft-bar {
                    border-top: 1px solid rgba(255,255,255,0.07);
                }

                .ft-bar-inner {
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 1.2rem 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.27);
                }

                .ft-bar-links {
                    display: flex;
                    gap: 1.5rem;
                }

                .ft-bar a {
                    color: rgba(255,255,255,0.27);
                    text-decoration: none;
                    transition: color 0.15s;
                }

                .ft-bar a:hover { color: rgba(255,255,255,0.55); }

                /* SDA flame inline SVG in footer */
                .ft-flame {
                    flex-shrink: 0;
                }

                @media (max-width: 768px) {
                    .ft-body {
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }
                    .ft-brand { grid-column: 1 / -1; }
                    .ft-bar-inner { flex-direction: column; text-align: center; }
                }

                @media (max-width: 480px) {
                    .ft-body { grid-template-columns: 1fr; }
                }
            `}</style>

            <footer className="ft">
                {/* Scripture */}
                <div className="ft-verse">
                    "Wilt thou not revive us again: that thy people may rejoice in thee?" — Psalm 85:6
                </div>

                <div className="ft-body">
                    {/* Brand */}
                    <div className="ft-brand">
                        <div className="ft-brand-logo">
                            {/* SDA Flame SVG inline */}
                            <svg className="ft-flame" width="40" height="44" viewBox="0 0 100 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 76 Q50 64 92 76 L92 90 Q50 78 8 90 Z" fill="rgba(255,255,255,0.7)"/>
                                <line x1="50" y1="67" x2="50" y2="91" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5"/>
                                <path d="M36 63 C29 48 27 33 36 20 C33 33 40 41 40 52 C41 44 43 35 41 24 C46 36 45 50 42 63 Z" fill="#C9A030"/>
                                <path d="M50 60 C43 40 42 22 50 6 C47 22 54 33 53 46 C55 36 58 22 55 12 C62 28 62 46 57 60 Z" fill="#E2B84A"/>
                                <path d="M64 63 C60 50 61 35 67 22 C64 35 67 44 64 54 C67 46 70 37 68 26 C73 40 71 54 66 63 Z" fill="#C9A030"/>
                                <rect x="47.5" y="57" width="5.5" height="20" rx="1.5" fill="white" opacity="0.9"/>
                                <rect x="41" y="63" width="18" height="5.5" rx="1.5" fill="white" opacity="0.9"/>
                            </svg>
                            <div className="ft-brand-text">
                                <span className="ft-brand-title">Campmeeting 2026</span>
                                <span className="ft-brand-conf">Meridian Ghana Conference · SDA Church</span>
                            </div>
                        </div>
                        <p className="ft-tagline">
                            A week of spiritual renewal, fellowship, and revival.
                            Join believers across Ghana for an unforgettable campmeeting experience.
                        </p>
                        <div className="ft-socials">
                            <a href="#" className="ft-social" aria-label="Facebook">f</a>
                            <a href="#" className="ft-social" aria-label="Instagram">ig</a>
                            <a href="#" className="ft-social" aria-label="YouTube">▶</a>
                            <a href="#" className="ft-social" aria-label="WhatsApp">W</a>
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(cols).map(([title, items]) => (
                        <div className="ft-col" key={title}>
                            <div className="ft-col-title">{title}</div>
                            <ul>
                                {items.map(({ to, label }) => (
                                    <li key={to}><Link to={to}>{label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="ft-bar">
                    <div className="ft-bar-inner">
                        <span>© {year} Meridian Ghana Conference, Seventh-day Adventist Church. All rights reserved.</span>
                        <div className="ft-bar-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Use</a>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
