import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

function Register() {
    const [step, setStep]       = useState(1);  // 1 = personal, 2 = password
    const [form, setForm]       = useState({
        first_name:   '',
        last_name:    '',
        email:        '',
        phone_number: '',
        password:     '',
        password2:    '',
    });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);
    const [done, setDone]       = useState(false);
    const [showPass, setShowPass]   = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    // Step 1 validation
    const validateStep1 = () => {
        const e = {};
        if (!form.first_name.trim()) e.first_name = 'First name is required.';
        if (!form.last_name.trim())  e.last_name  = 'Last name is required.';
        if (!form.email.trim())      e.email      = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
        if (!form.phone_number.trim()) e.phone_number = 'Phone number is required.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Step 2 validation
    const validateStep2 = () => {
        const e = {};
        if (!form.password) e.password = 'Password is required.';
        else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
        if (!form.password2) e.password2 = 'Please confirm your password.';
        else if (form.password !== form.password2) e.password2 = 'Passwords do not match.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);
        try {
            await API.post('auth/register/', form);
            setDone(true);
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                setErrors(data.errors);
                // If error is on step 1 fields, go back
                const step1Fields = ['first_name', 'last_name', 'email', 'phone_number'];
                const hasStep1Error = step1Fields.some(f => data.errors[f]);
                if (hasStep1Error) setStep(1);
            } else {
                setErrors({ general: data?.message || 'Registration failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Success screen ──
    if (done) {
        return (
            <>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
                    body { font-family: 'DM Sans', sans-serif; background: #F5F7FA; }
                    .done-wrap {
                        min-height: 100vh;
                        display: flex; align-items: center; justify-content: center;
                        padding: 2rem;
                    }
                    .done-card {
                        background: #fff;
                        border-radius: 16px;
                        box-shadow: 0 8px 40px rgba(13,27,42,0.1);
                        padding: 3rem 2.5rem;
                        max-width: 460px;
                        width: 100%;
                        text-align: center;
                    }
                    .done-icon {
                        width: 64px; height: 64px;
                        background: #F0FDF4;
                        border-radius: 50%;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 1.8rem;
                        margin: 0 auto 1.5rem;
                        border: 2px solid #BBF7D0;
                    }
                    .done-title {
                        font-family: 'Cormorant Garamond', serif;
                        font-size: 1.9rem;
                        font-weight: 700;
                        color: #0D1B2A;
                        margin-bottom: 0.75rem;
                    }
                    .done-text {
                        font-size: 0.9rem;
                        color: #64748B;
                        line-height: 1.7;
                        margin-bottom: 2rem;
                    }
                    .done-email {
                        font-weight: 600;
                        color: #0D1B2A;
                    }
                    .done-btn {
                        display: inline-block;
                        background: #0D1B2A;
                        color: #fff;
                        padding: 0.75rem 2rem;
                        border-radius: 8px;
                        font-size: 0.9rem;
                        font-weight: 600;
                        text-decoration: none;
                        transition: all 0.18s;
                    }
                    .done-btn:hover { background: #1E3A5F; }
                `}</style>
                <div className="done-wrap">
                    <div className="done-card">
                        <div className="done-icon">✉️</div>
                        <h2 className="done-title">Check Your Email</h2>
                        <p className="done-text">
                            We've sent a verification link to{' '}
                            <span className="done-email">{form.email}</span>.
                            <br /><br />
                            Click the link in the email to verify your account
                            and complete your registration.
                        </p>
                        <Link to="/login" className="done-btn">
                            Go to Sign In
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

                :root {
                    --navy:   #0D1B2A;
                    --navy-2: #1E3A5F;
                    --white:  #FFFFFF;
                    --snow:   #F5F7FA;
                    --gold:   #C9A030;
                    --red:    #DC2626;
                    --border: #E2E8F0;
                    --text:   #0D1B2A;
                    --dim:    #64748B;
                }

                .auth-page {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    font-family: 'DM Sans', sans-serif;
                }

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

                .al-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    position: relative;
                    z-index: 1;
                }

                .al-brand-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fff;
                    display: block;
                }

                .al-brand-conf {
                    font-size: 0.58rem;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--gold);
                    display: block;
                    margin-top: 2px;
                }

                .al-content {
                    position: relative;
                    z-index: 1;
                }

                .al-tag {
                    font-size: 0.65rem;
                    font-weight: 600;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: var(--gold);
                    margin-bottom: 0.9rem;
                }

                .al-heading {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.15;
                    margin-bottom: 1.25rem;
                }

                .al-perks {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .al-perk {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.65rem;
                    font-size: 0.86rem;
                    color: rgba(255,255,255,0.6);
                    line-height: 1.5;
                }

                .al-perk-dot {
                    width: 18px; height: 18px;
                    border-radius: 50%;
                    background: rgba(201,160,48,0.2);
                    border: 1px solid rgba(201,160,48,0.4);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.6rem;
                    color: var(--gold);
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                .al-bottom {
                    position: relative;
                    z-index: 1;
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.25);
                }

                /* Right side */
                .auth-right {
                    background: var(--white);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2.5rem 2rem;
                    overflow-y: auto;
                }

                .auth-card {
                    width: 100%;
                    max-width: 440px;
                }

                /* Step indicator */
                .step-bar {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    margin-bottom: 2rem;
                }

                .step-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .step-num {
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    transition: all 0.2s;
                }

                .step-num.active {
                    background: var(--navy);
                    color: #fff;
                }

                .step-num.done {
                    background: #16A34A;
                    color: #fff;
                }

                .step-num.inactive {
                    background: var(--snow);
                    color: var(--dim);
                    border: 1.5px solid var(--border);
                }

                .step-label {
                    font-size: 0.76rem;
                    font-weight: 500;
                    color: var(--dim);
                }

                .step-label.active { color: var(--navy); font-weight: 600; }

                .step-line {
                    flex: 1;
                    height: 1.5px;
                    background: var(--border);
                    margin: 0 0.75rem;
                }

                .step-line.done { background: #16A34A; }

                /* Card header */
                .auth-card-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.9rem;
                    font-weight: 700;
                    color: var(--navy);
                    margin-bottom: 0.35rem;
                    line-height: 1;
                }

                .auth-card-sub {
                    font-size: 0.85rem;
                    color: var(--dim);
                    margin-bottom: 1.75rem;
                }

                /* Error */
                .auth-error {
                    background: #FEF2F2;
                    border: 1px solid #FECACA;
                    border-radius: 8px;
                    padding: 0.7rem 0.9rem;
                    font-size: 0.83rem;
                    color: var(--red);
                    margin-bottom: 1.1rem;
                }

                /* Fields */
                .auth-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.85rem;
                }

                .auth-field { margin-bottom: 1rem; }

                .auth-label {
                    display: block;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: var(--navy);
                    margin-bottom: 0.4rem;
                    letter-spacing: 0.02em;
                }

                .auth-input-wrap { position: relative; }

                .auth-input {
                    width: 100%;
                    padding: 0.7rem 0.95rem;
                    border: 1.5px solid var(--border);
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    color: var(--text);
                    background: var(--white);
                    transition: all 0.16s;
                    outline: none;
                }

                .auth-input:focus {
                    border-color: var(--navy);
                    box-shadow: 0 0 0 3px rgba(13,27,42,0.07);
                }

                .auth-input.error { border-color: var(--red); }

                .auth-input.has-icon { padding-right: 2.6rem; }

                .field-error {
                    font-size: 0.74rem;
                    color: var(--red);
                    margin-top: 0.3rem;
                }

                .auth-input-icon {
                    position: absolute;
                    right: 0.8rem;
                    top: 50%; transform: translateY(-50%);
                    background: none; border: none;
                    cursor: pointer; color: var(--dim);
                    font-size: 0.82rem; padding: 2px; line-height: 1;
                }

                /* Buttons */
                .auth-btn-row {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }

                .auth-btn-back {
                    flex: 1;
                    padding: 0.78rem;
                    background: var(--snow);
                    color: var(--navy);
                    border: 1.5px solid var(--border);
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.16s;
                }

                .auth-btn-back:hover { border-color: var(--navy); }

                .auth-btn-next,
                .auth-btn-submit {
                    flex: 2;
                    padding: 0.78rem;
                    background: var(--navy);
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.16s;
                    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
                }

                .auth-btn-next:hover,
                .auth-btn-submit:hover:not(:disabled) {
                    background: var(--navy-2);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 14px rgba(13,27,42,0.2);
                }

                .auth-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

                .auth-spinner {
                    width: 15px; height: 15px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .auth-switch {
                    text-align: center;
                    font-size: 0.83rem;
                    color: var(--dim);
                    margin-top: 1.5rem;
                }

                .auth-switch a {
                    color: var(--navy);
                    font-weight: 600;
                    text-decoration: none;
                }

                .auth-switch a:hover { text-decoration: underline; }

                .password-hint {
                    font-size: 0.73rem;
                    color: var(--dim);
                    margin-top: 0.3rem;
                }

                @media (max-width: 768px) {
                    .auth-page { grid-template-columns: 1fr; }
                    .auth-left { display: none; }
                    .auth-right { padding: 2rem 1.25rem; padding-top: 2.5rem; }
                    .auth-row { grid-template-columns: 1fr; gap: 0; }
                }
            `}</style>

            <div className="auth-page">
                {/* Left panel */}
                <div className="auth-left">
                    <div className="al-brand">
                        <svg width="34" height="38" viewBox="0 0 100 112" fill="none">
                            <path d="M8 76 Q50 64 92 76 L92 90 Q50 78 8 90 Z" fill="rgba(255,255,255,0.6)"/>
                            <path d="M36 63 C29 48 27 33 36 20 C33 33 40 41 40 52 C41 44 43 35 41 24 C46 36 45 50 42 63 Z" fill="#C9A030"/>
                            <path d="M50 60 C43 40 42 22 50 6 C47 22 54 33 53 46 C55 36 58 22 55 12 C62 28 62 46 57 60 Z" fill="#E2B84A"/>
                            <path d="M64 63 C60 50 61 35 67 22 C64 35 67 44 64 54 C67 46 70 37 68 26 C73 40 71 54 66 63 Z" fill="#C9A030"/>
                            <rect x="47.5" y="57" width="5.5" height="20" rx="1.5" fill="white" opacity="0.9"/>
                            <rect x="41" y="63" width="18" height="5.5" rx="1.5" fill="white" opacity="0.9"/>
                        </svg>
                        <div>
                            <span className="al-brand-name">Campmeeting 2026</span>
                            <span className="al-brand-conf">Meridian Ghana Conference · SDA</span>
                        </div>
                    </div>

                    <div className="al-content">
                        <div className="al-tag">Create Account</div>
                        <h2 className="al-heading">
                            Join us for<br />Campmeeting<br />2026
                        </h2>
                        <div className="al-perks">
                            {[
                                'Register for the campmeeting online',
                                'Book your accommodation in advance',
                                'Get notified about programme updates',
                                'Watch the live stream from anywhere',
                            ].map((p, i) => (
                                <div className="al-perk" key={i}>
                                    <div className="al-perk-dot">✓</div>
                                    <span>{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="al-bottom">
                        © 2026 Meridian Ghana Conference, SDA Church
                    </div>
                </div>

                {/* Right form panel */}
                <div className="auth-right">
                    <div className="auth-card">

                        {/* Step indicator */}
                        <div className="step-bar">
                            <div className="step-item">
                                <div className={`step-num ${step === 1 ? 'active' : 'done'}`}>
                                    {step > 1 ? '✓' : '1'}
                                </div>
                                <span className={`step-label ${step === 1 ? 'active' : ''}`}>
                                    Personal Info
                                </span>
                            </div>
                            <div className={`step-line ${step > 1 ? 'done' : ''}`} />
                            <div className="step-item">
                                <div className={`step-num ${step === 2 ? 'active' : 'inactive'}`}>
                                    2
                                </div>
                                <span className={`step-label ${step === 2 ? 'active' : ''}`}>
                                    Password
                                </span>
                            </div>
                        </div>

                        {step === 1 ? (
                            <>
                                <h1 className="auth-card-title">Create Account</h1>
                                <p className="auth-card-sub">Tell us about yourself to get started</p>

                                {errors.general && (
                                    <div className="auth-error">{errors.general}</div>
                                )}

                                {/* Step 1 fields */}
                                <div className="auth-row">
                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="first_name">First Name</label>
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            className={`auth-input ${errors.first_name ? 'error' : ''}`}
                                            placeholder="John"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            autoComplete="given-name"
                                        />
                                        {errors.first_name && <div className="field-error">{errors.first_name}</div>}
                                    </div>
                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="last_name">Last Name</label>
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            className={`auth-input ${errors.last_name ? 'error' : ''}`}
                                            placeholder="Doe"
                                            value={form.last_name}
                                            onChange={handleChange}
                                            autoComplete="family-name"
                                        />
                                        {errors.last_name && <div className="field-error">{errors.last_name}</div>}
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className={`auth-input ${errors.email ? 'error' : ''}`}
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                    {errors.email && <div className="field-error">{errors.email}</div>}
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="phone_number">Phone Number</label>
                                    <input
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        className={`auth-input ${errors.phone_number ? 'error' : ''}`}
                                        placeholder="0241234567"
                                        value={form.phone_number}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                    />
                                    {errors.phone_number && <div className="field-error">{errors.phone_number}</div>}
                                </div>

                                <div className="auth-btn-row">
                                    <button
                                        type="button"
                                        className="auth-btn-next"
                                        onClick={handleNext}
                                        style={{ flex: 1 }}
                                    >
                                        Continue →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="auth-card-title">Set Password</h1>
                                <p className="auth-card-sub">Choose a strong password for your account</p>

                                {errors.general && (
                                    <div className="auth-error">{errors.general}</div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="password">Password</label>
                                        <div className="auth-input-wrap">
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPass ? 'text' : 'password'}
                                                className={`auth-input has-icon ${errors.password ? 'error' : ''}`}
                                                placeholder="At least 8 characters"
                                                value={form.password}
                                                onChange={handleChange}
                                                autoComplete="new-password"
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
                                        {errors.password
                                            ? <div className="field-error">{errors.password}</div>
                                            : <div className="password-hint">Minimum 8 characters with letters and numbers</div>
                                        }
                                    </div>

                                    <div className="auth-field">
                                        <label className="auth-label" htmlFor="password2">Confirm Password</label>
                                        <div className="auth-input-wrap">
                                            <input
                                                id="password2"
                                                name="password2"
                                                type={showPass2 ? 'text' : 'password'}
                                                className={`auth-input has-icon ${errors.password2 ? 'error' : ''}`}
                                                placeholder="Re-enter your password"
                                                value={form.password2}
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                className="auth-input-icon"
                                                onClick={() => setShowPass2(!showPass2)}
                                                tabIndex={-1}
                                            >
                                                {showPass2 ? '🙈' : '👁'}
                                            </button>
                                        </div>
                                        {errors.password2 && <div className="field-error">{errors.password2}</div>}
                                    </div>

                                    <div className="auth-btn-row">
                                        <button
                                            type="button"
                                            className="auth-btn-back"
                                            onClick={() => setStep(1)}
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="auth-btn-submit"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? <><div className="auth-spinner" /> Creating...</>
                                                : 'Create Account'
                                            }
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        <p className="auth-switch">
                            Already have an account?{' '}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
