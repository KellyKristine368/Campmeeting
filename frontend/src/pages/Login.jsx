import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import useAuth from '../hooks/useAuth';

// SDA Flame SVG
function SDAFlame({ size = 48 }) {
    return (
        <svg width={size} height={size * 1.1} viewBox="0 0 100 112" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 76 Q50 64 92 76 L92 90 Q50 78 8 90 Z" fill="#0D1B2A" opacity="0.85"/>
            <line x1="50" y1="67" x2="50" y2="91" stroke="#0D1B2A" strokeWidth="2.5" opacity="0.5"/>
            <path d="M36 63 C29 48 27 33 36 20 C33 33 40 41 40 52 C41 44 43 35 41 24 C46 36 45 50 42 63 Z" fill="#C9A030"/>
            <path d="M50 60 C43 40 42 22 50 6 C47 22 54 33 53 46 C55 36 58 22 55 12 C62 28 62 46 57 60 Z" fill="#E2B84A"/>
            <path d="M64 63 C60 50 61 35 67 22 C64 35 67 44 64 54 C67 46 70 37 68 26 C73 40 71 54 66 63 Z" fill="#C9A030"/>
            <rect x="47.5" y="57" width="5.5" height="20" rx="1.5" fill="#0D1B2A" opacity="0.9"/>
            <rect x="41" y="63" width="18" height="5.5" rx="1.5" fill="#0D1B2A" opacity="0.9"/>
        </svg>
    );
}

function Login() {
    const [form, setForm]       = useState({ email: '', password: '' });
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const { login }  = useAuth();
    const navigate   = useNavigate();
    const location   = useLocation();

    // After login, go back to where they came from (or home)
    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await API.post('auth/login/', form);
            login(res.data.user, res.data);
            navigate(from, { replace: true });
        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.detail
                || 'Invalid email or password. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

                :root {
                    --navy:    #0D1B2A;
                    --navy-2:  #1E3A5F;
                    --white:   #FFFFFF;
                    --snow:    #F5F7FA;
                    --gold:    #C9A030;
                    --red:     #DC2626;
                    --border:  #E2E8F0;
                    --text:    #0D1B2A;
                    --text-sm: #64748B;
                }

                .auth-page {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    font-family: 'DM Sans', sans-serif;
                }

                /* ── Left panel ── */
                .auth-left {
                    background: var(--navy);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                }

                .auth-left::before {
                    content: '';
                    position: absolute;
                    top: -80px; right: -80px;
                    width: 360px; height: 360px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.03);
                }

                .auth-left::after {
                    content: '';
                    position: absolute;
                    bottom: -120px; left: -60px;
                    width: 420px; height: 420px;
                    border-radius: 50%;
                    background: rgba(201,160,48,0.05);
                }

                .auth-left-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    position: relative;
                    z-index: 1;
                }

                .auth-left-brand-text {}

                .auth-left-brand-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fff;
                    display: block;
                }

                .auth-left-brand-conf {
                    font-size: 0.58rem;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--gold);
                    display: block;
                    margin-top: 2px;
                }

                .auth-left-content {
                    position: relative;
                    z-index: 1;
                }

                .auth-left-label {
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: var(--gold);
                    margin-bottom: 0.9rem;
                }

                .auth-left-heading {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2.6rem;
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.15;
                    margin-bottom: 1.25rem;
                }

                .auth-left-verse {
                    font-size: 0.88rem;
                    line-height: 1.75;
                    color: rgba(255,255,255,0.5);
                    font-style: italic;
                    border-left: 2px solid rgba(201,160,48,0.4);
                    padding-left: 1rem;
                    max-width: 320px;
                }

                .auth-left-bottom {
                    position: relative;
                    z-index: 1;
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.25);
                }

                /* ── Right panel (form) ── */
                .auth-right {
                    background: var(--white);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 2rem;
                }

                .auth-card {
                    width: 100%;
                    max-width: 420px;
                }

                .auth-card-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--navy);
                    margin-bottom: 0.4rem;
                    line-height: 1;
                }

                .auth-card-sub {
                    font-size: 0.87rem;
                    color: var(--text-sm);
                    margin-bottom: 2rem;
                }

                /* Error banner */
                .auth-error {
                    background: #FEF2F2;
                    border: 1px solid #FECACA;
                    border-radius: 8px;
                    padding: 0.75rem 1rem;
                    font-size: 0.84rem;
                    color: var(--red);
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                }

                /* Info banner (e.g. "check your email") */
                .auth-info {
                    background: #EFF6FF;
                    border: 1px solid #BFDBFE;
                    border-radius: 8px;
                    padding: 0.75rem 1rem;
                    font-size: 0.84rem;
                    color: #1D4ED8;
                    margin-bottom: 1.25rem;
                }

                /* Form fields */
                .auth-field {
                    margin-bottom: 1.1rem;
                }

                .auth-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--navy);
                    margin-bottom: 0.45rem;
                    letter-spacing: 0.02em;
                }

                .auth-input-wrap {
                    position: relative;
                }

                .auth-input {
                    width: 100%;
                    padding: 0.72rem 1rem;
                    border: 1.5px solid var(--border);
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    color: var(--text);
                    background: var(--white);
                    transition: all 0.18s;
                    outline: none;
                }

                .auth-input:focus {
                    border-color: var(--navy);
                    box-shadow: 0 0 0 3px rgba(13,27,42,0.07);
                }

                .auth-input.has-icon { padding-right: 2.8rem; }

                .auth-input-icon {
                    position: absolute;
                    right: 0.9rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-sm);
                    font-size: 0.85rem;
                    padding: 2px;
                    line-height: 1;
                }

                /* Forgot password */
                .auth-forgot {
                    display: block;
                    text-align: right;
                    font-size: 0.78rem;
                    color: var(--text-sm);
                    text-decoration: none;
                    margin-top: 0.35rem;
                    transition: color 0.15s;
                }

                .auth-forgot:hover { color: var(--navy); }

                /* Submit button */
                .auth-submit {
                    width: 100%;
                    padding: 0.82rem;
                    background: var(--navy);
                    color: var(--white);
                    border: none;
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.18s;
                    letter-spacing: 0.02em;
                    margin-top: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .auth-submit:hover:not(:disabled) {
                    background: var(--navy-2);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(13,27,42,0.22);
                }

                .auth-submit:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .auth-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                /* Divider */
                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 1.5rem 0;
                    color: var(--border);
                    font-size: 0.75rem;
                    color: var(--text-sm);
                }

                .auth-divider::before,
                .auth-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--border);
                }

                /* Switch link */
                .auth-switch {
                    text-align: center;
                    font-size: 0.84rem;
                    color: var(--text-sm);
                    margin-top: 1.5rem;
                }

                .auth-switch a {
                    color: var(--navy);
                    font-weight: 600;
                    text-decoration: none;
                }

                .auth-switch a:hover { text-decoration: underline; }

                /* Mobile */
                @media (max-width: 768px) {
                    .auth-page { grid-template-columns: 1fr; }
                    .auth-left { display: none; }
                    .auth-right { padding: 2rem 1.25rem; align-items: flex-start; padding-top: 3rem; }
                }
            `}</style>

            <div className="auth-page">
                {/* Left decorative panel */}
                <div className="auth-left">
                    <div className="auth-left-brand">
                        <svg width="36" height="40" viewBox="0 0 100 112" fill="none">
                            <path d="M8 76 Q50 64 92 76 L92 90 Q50 78 8 90 Z" fill="rgba(255,255,255,0.6)"/>
                            <path d="M36 63 C29 48 27 33 36 20 C33 33 40 41 40 52 C41 44 43 35 41 24 C46 36 45 50 42 63 Z" fill="#C9A030"/>
                            <path d="M50 60 C43 40 42 22 50 6 C47 22 54 33 53 46 C55 36 58 22 55 12 C62 28 62 46 57 60 Z" fill="#E2B84A"/>
                            <path d="M64 63 C60 50 61 35 67 22 C64 35 67 44 64 54 C67 46 70 37 68 26 C73 40 71 54 66 63 Z" fill="#C9A030"/>
                            <rect x="47.5" y="57" width="5.5" height="20" rx="1.5" fill="white" opacity="0.9"/>
                            <rect x="41" y="63" width="18" height="5.5" rx="1.5" fill="white" opacity="0.9"/>
                        </svg>
                        <div className="auth-left-brand-text">
                            <span className="auth-left-brand-name">Campmeeting 2026</span>
                            <span className="auth-left-brand-conf">Meridian Ghana Conference · SDA</span>
                        </div>
                    </div>

                    <div className="auth-left-content">
                        <div className="auth-left-label">Welcome Back</div>
                        <h2 className="auth-left-heading">
                            Sign in to your<br />account
                        </h2>
                        <p className="auth-left-verse">
                            "The Lord is good, a stronghold in the day of trouble;
                            and He knows those who trust in Him."
                            <br /><br />— Nahum 1:7
                        </p>
                    </div>

                    <div className="auth-left-bottom">
                        © 2026 Meridian Ghana Conference, SDA Church
                    </div>
                </div>

                {/* Right form panel */}
                <div className="auth-right">
                    <div className="auth-card">
                        <h1 className="auth-card-title">Sign In</h1>
                        <p className="auth-card-sub">
                            Welcome back — enter your details to continue
                        </p>

                        {/* Error message */}
                        {error && (
                            <div className="auth-error">
                                <span>⚠</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="auth-input"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password */}
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="password">
                                    Password
                                </label>
                                <div className="auth-input-wrap">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        className="auth-input has-icon"
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="auth-input-icon"
                                        onClick={() => setShowPass(!showPass)}
                                        tabIndex={-1}
                                    >
                                        {showPass ? '🙈' : '👁'}
                                    </button>
                                </div>
                                <a href="#" className="auth-forgot">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><div className="auth-spinner" /> Signing in...</>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">or</div>

                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <Link to="/register">Create one now</Link>
                        </p>

                        <p className="auth-switch" style={{ marginTop: '0.5rem' }}>
                            Didn't get a verification email?{' '}
                            <Link to="/register" state={{ resend: true }}>Resend it</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
