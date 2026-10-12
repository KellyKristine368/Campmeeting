import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Import the SDA logo — place SDA_logo.png in your src/assets/ folder
import sdaLogo from '../assets/SDA_logo.png';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen,   setMenuOpen]   = useState(false);
    const [dropOpen,   setDropOpen]   = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close user dropdown when clicking outside
    useEffect(() => {
        const close = e => { if (!e.target.closest('.user-menu')) setDropOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
        setDropOpen(false);
        navigate('/');
    };

    const navLinks = [
        { to: '/',              label: 'Home'          },
        { to: '/speakers',      label: 'Speakers'      },
        { to: '/schedule',      label: 'Programme'     },
        { to: '/accommodation', label: 'Accommodation' },
        { to: '/livestream',    label: 'Live Stream'   },
        { to: '/location',      label: 'Location'      },
        { to: '/contact',       label: 'Contact'       },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

                :root {
                    --navy:   #0D1B2A;
                    --navy2:  #1E3A5F;
                    --white:  #FFFFFF;
                    --snow:   #F5F7FA;
                    --gold:   #C9A030;
                    --gold2:  #E2B84A;
                    --border: #E2E8F0;
                    --dim:    #64748B;
                }
                *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
                body { font-family:'DM Sans',sans-serif; background:var(--snow); color:var(--navy); }

                /* ── Topbar ── */
                .nb-topbar {
                    background:var(--navy);
                    text-align:center;
                    padding:.4rem 1rem;
                    font-family:'DM Sans',sans-serif;
                    font-size:.68rem; font-weight:500;
                    letter-spacing:.06em;
                    color:rgba(255,255,255,.5);
                    border-bottom:1px solid rgba(255,255,255,.06);
                }
                .nb-topbar em {
                    color:var(--gold); font-style:normal; font-weight:600;
                }

                /* ── Navbar shell ── */
                .nb-wrap {
                    position:sticky; top:0; z-index:900;
                    background:var(--white);
                    border-bottom:2.5px solid var(--navy);
                    transition:box-shadow .3s ease;
                }
                .nb-wrap.scrolled {
                    box-shadow:0 4px 24px rgba(13,27,42,.12);
                }
                .nb-inner {
                    max-width:1320px; margin:0 auto;
                    height:68px;
                    display:flex; align-items:center;
                    padding:0 1.75rem; gap:1.5rem;
                }

                /* ── Logo ── */
                .nb-logo {
                    display:flex; align-items:center;
                    gap:.75rem; text-decoration:none; flex-shrink:0;
                }
                .nb-logo-img {
                    width:46px; height:46px;
                    object-fit:contain;
                    border-radius:50%;
                    /* subtle shadow so it lifts off the white navbar */
                    filter:drop-shadow(0 1px 4px rgba(13,27,42,.18));
                    flex-shrink:0;
                }
                .nb-logo-sep {
                    width:1px; height:38px;
                    background:var(--border); flex-shrink:0;
                }
                .nb-logo-title {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.2rem; font-weight:700;
                    color:var(--navy); display:block;
                    line-height:1; letter-spacing:.01em;
                }
                .nb-logo-sub {
                    font-family:'DM Sans',sans-serif;
                    font-size:.58rem; font-weight:600;
                    letter-spacing:.1em; text-transform:uppercase;
                    color:var(--gold); display:block; margin-top:3px;
                }

                /* ── Nav links ── */
                .nb-links {
                    display:flex; align-items:center;
                    list-style:none; flex:1; gap:0;
                }
                .nb-links a {
                    display:block; font-size:.8rem; font-weight:500;
                    color:rgba(13,27,42,.6); text-decoration:none;
                    padding:.44rem .78rem; border-radius:6px;
                    letter-spacing:.025em; transition:all .15s; white-space:nowrap;
                }
                .nb-links a:hover { color:var(--navy); background:var(--snow); }
                .nb-links a.active {
                    color:var(--navy); font-weight:600; background:var(--snow);
                    position:relative;
                }
                .nb-links a.active::after {
                    content:''; position:absolute;
                    bottom:-1px; left:50%; transform:translateX(-50%);
                    width:20px; height:2.5px;
                    background:var(--gold); border-radius:2px;
                }

                /* ── Action buttons ── */
                .nb-actions {
                    display:flex; align-items:center;
                    gap:.6rem; flex-shrink:0;
                }
                .nb-btn-outline {
                    font-family:'DM Sans',sans-serif; font-size:.8rem;
                    font-weight:500; color:var(--navy);
                    background:transparent; border:1.5px solid var(--border);
                    padding:.46rem 1.05rem; border-radius:7px;
                    cursor:pointer; text-decoration:none;
                    transition:all .15s; white-space:nowrap;
                }
                .nb-btn-outline:hover { border-color:var(--navy); background:var(--snow); }
                .nb-btn-solid {
                    font-family:'DM Sans',sans-serif; font-size:.8rem;
                    font-weight:600; color:var(--white);
                    background:var(--navy); border:none;
                    padding:.46rem 1.2rem; border-radius:7px;
                    cursor:pointer; text-decoration:none;
                    transition:all .15s; white-space:nowrap;
                }
                .nb-btn-solid:hover {
                    background:var(--navy2); transform:translateY(-1px);
                    box-shadow:0 4px 14px rgba(13,27,42,.22);
                }

                /* ── User dropdown ── */
                .user-menu { position:relative; }
                .nb-user-btn {
                    display:flex; align-items:center; gap:.5rem;
                    background:var(--snow); border:1.5px solid var(--border);
                    border-radius:8px; padding:.35rem .8rem .35rem .4rem;
                    cursor:pointer; transition:all .15s;
                    font-family:'DM Sans',sans-serif; font-size:.8rem;
                    font-weight:500; color:var(--navy);
                }
                .nb-user-btn:hover { border-color:var(--navy); }
                .nb-avatar {
                    width:28px; height:28px; border-radius:50%;
                    background:var(--navy); color:var(--white);
                    display:flex; align-items:center; justify-content:center;
                    font-size:.7rem; font-weight:700; flex-shrink:0;
                }
                .nb-chevron { font-size:.5rem; opacity:.4; transition:transform .2s; }
                .nb-chevron.open { transform:rotate(180deg); }
                .nb-dropdown {
                    position:absolute; top:calc(100% + 8px); right:0;
                    background:var(--white); border:1px solid var(--border);
                    border-radius:12px; box-shadow:0 12px 36px rgba(13,27,42,.13);
                    min-width:208px; overflow:hidden;
                    animation:nbDrop .16s ease; z-index:999;
                }
                @keyframes nbDrop {
                    from{opacity:0;transform:translateY(-5px) scale(.98)}
                    to{opacity:1;transform:translateY(0) scale(1)}
                }
                .nb-drop-head {
                    padding:.85rem 1rem .7rem;
                    background:var(--snow); border-bottom:1px solid var(--border);
                }
                .nb-drop-name { font-size:.87rem; font-weight:600; color:var(--navy); }
                .nb-drop-email { font-size:.73rem; color:var(--dim); margin-top:1px; }
                .nb-drop-item {
                    display:block; padding:.62rem 1rem;
                    font-size:.83rem; color:var(--navy);
                    text-decoration:none; transition:background .12s;
                    cursor:pointer; width:100%; text-align:left;
                    background:none; border:none;
                    font-family:'DM Sans',sans-serif;
                }
                .nb-drop-item:hover { background:var(--snow); }
                .nb-drop-item.danger { color:#DC2626; border-top:1px solid var(--border); }

                /* ── Hamburger ── */
                .nb-burger {
                    display:none; flex-direction:column;
                    justify-content:center; gap:5px;
                    background:none; border:1.5px solid var(--border);
                    border-radius:7px; cursor:pointer;
                    padding:9px 10px; width:42px; height:40px; flex-shrink:0;
                }
                .nb-burger span {
                    display:block; width:18px; height:2px;
                    background:var(--navy); border-radius:2px; transition:all .26s ease;
                }
                .nb-burger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
                .nb-burger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
                .nb-burger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

                /* ── Mobile overlay ── */
                .nb-overlay {
                    display:none; position:fixed; inset:0;
                    background:rgba(13,27,42,.4); z-index:800;
                    animation:fadeIn .25s ease;
                }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                .nb-overlay.open { display:block; }

                /* ── Mobile drawer ── */
                .nb-drawer {
                    position:fixed; top:0; right:0; bottom:0;
                    width:min(300px,82vw);
                    background:var(--white); z-index:850;
                    transform:translateX(100%);
                    transition:transform .3s cubic-bezier(.4,0,.2,1);
                    display:flex; flex-direction:column;
                    box-shadow:-6px 0 32px rgba(13,27,42,.18);
                }
                .nb-drawer.open { transform:translateX(0); }
                .nb-drawer-head {
                    background:var(--navy); padding:1.1rem 1.25rem;
                    display:flex; align-items:center; justify-content:space-between;
                }
                .nb-drawer-logo {
                    display:flex; align-items:center; gap:.65rem;
                }
                .nb-drawer-logo-img {
                    width:36px; height:36px; border-radius:50%; object-fit:contain;
                    filter:brightness(1.1);
                }
                .nb-drawer-title {
                    font-family:'Cormorant Garamond',serif;
                    color:#fff; font-size:.95rem; font-weight:700; display:block;
                }
                .nb-drawer-conf {
                    color:rgba(255,255,255,.45); font-size:.58rem;
                    letter-spacing:.1em; text-transform:uppercase; margin-top:2px; display:block;
                }
                .nb-drawer-close {
                    width:30px; height:30px; background:rgba(255,255,255,.1);
                    border:1px solid rgba(255,255,255,.15); border-radius:6px;
                    color:white; cursor:pointer; font-size:.9rem;
                    display:flex; align-items:center; justify-content:center;
                }
                .nb-drawer-nav { flex:1; overflow-y:auto; padding:.75rem 0; }
                .nb-m-link {
                    display:block; padding:.78rem 1.5rem;
                    font-size:.92rem; font-weight:500; color:var(--navy);
                    text-decoration:none; border-left:3px solid transparent; transition:all .14s;
                }
                .nb-m-link:hover { background:var(--snow); border-left-color:var(--gold); }
                .nb-m-link.active { background:var(--snow); border-left-color:var(--navy); font-weight:600; }
                .nb-drawer-foot {
                    padding:1.1rem 1.25rem; border-top:1px solid var(--border);
                    display:flex; flex-direction:column; gap:.6rem;
                }
                .nb-drawer-foot a, .nb-drawer-foot button {
                    display:block; text-align:center; width:100%;
                }

                @media(max-width:1060px) { .nb-links { display:none; } }
                @media(max-width:640px) { .nb-actions { display:none; } .nb-burger { display:flex; } }
            `}</style>

            {/* Topbar */}
            <div className="nb-topbar">
                <em>Campmeeting 2026</em>
                &nbsp;·&nbsp; Meridian Ghana Conference
                &nbsp;·&nbsp; Seventh-day Adventist Church
            </div>

            {/* Main navbar */}
            <div className={`nb-wrap ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nb-inner">

                    {/* ── Logo — real SDA image ── */}
                    <Link to="/" className="nb-logo">
                        <img
                            src={sdaLogo}
                            alt="Seventh-day Adventist Church Logo"
                            className="nb-logo-img"
                        />
                        <div className="nb-logo-sep" />
                        <div>
                            <span className="nb-logo-title">Campmeeting 2026</span>
                            <span className="nb-logo-sub">Meridian Ghana Conference · SDA</span>
                        </div>
                    </Link>

                    {/* Desktop links */}
                    <ul className="nb-links">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    end={to === '/'}
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop actions */}
                    <div className="nb-actions">
                        {isAuthenticated ? (
                            <div className="user-menu">
                                <button
                                    className="nb-user-btn"
                                    onClick={() => setDropOpen(!dropOpen)}
                                >
                                    <div className="nb-avatar">
                                        {user?.first_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    {user?.first_name || 'Account'}
                                    <span className={`nb-chevron ${dropOpen ? 'open' : ''}`}>▼</span>
                                </button>

                                {dropOpen && (
                                    <div className="nb-dropdown">
                                        <div className="nb-drop-head">
                                            <div className="nb-drop-name">
                                                {user?.first_name} {user?.last_name}
                                            </div>
                                            <div className="nb-drop-email">{user?.email}</div>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="nb-drop-item"
                                            onClick={() => setDropOpen(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/registration"
                                            className="nb-drop-item"
                                            onClick={() => setDropOpen(false)}
                                        >
                                            My Registration
                                        </Link>
                                        <button
                                            className="nb-drop-item danger"
                                            onClick={handleLogout}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login"    className="nb-btn-outline">Sign In</Link>
                                <Link to="/register" className="nb-btn-solid">Register Now</Link>
                            </>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        className={`nb-burger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Open menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* Mobile overlay */}
            <div
                className={`nb-overlay ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* Mobile drawer */}
            <div className={`nb-drawer ${menuOpen ? 'open' : ''}`}>
                <div className="nb-drawer-head">
                    <div className="nb-drawer-logo">
                        <img
                            src={sdaLogo}
                            alt="SDA Logo"
                            className="nb-drawer-logo-img"
                        />
                        <div>
                            <span className="nb-drawer-title">Campmeeting 2026</span>
                            <span className="nb-drawer-conf">Meridian Ghana Conference</span>
                        </div>
                    </div>
                    <button
                        className="nb-drawer-close"
                        onClick={() => setMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <nav className="nb-drawer-nav">
                    {navLinks.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `nb-m-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                            end={to === '/'}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="nb-drawer-foot">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/profile"
                                className="nb-btn-outline"
                                onClick={() => setMenuOpen(false)}
                            >
                                My Profile
                            </Link>
                            <button className="nb-btn-solid" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="nb-btn-outline"
                                onClick={() => setMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="nb-btn-solid"
                                onClick={() => setMenuOpen(false)}
                            >
                                Register Now
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Navbar;
