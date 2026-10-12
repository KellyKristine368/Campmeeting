import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';

export default function Contact() {
    const [form, setForm] = useState({
        name: '', email: '', subject: '', message: '',
    });
    const [errors,      setErrors]      = useState({});
    const [loading,     setLoading]     = useState(false);
    const [done,        setDone]        = useState(false);
    const [serverError, setServerError] = useState('');
    const [settings,    setSettings]    = useState(null);

    useEffect(() => {
        API.get('core/settings/')
            .then(r => setSettings(r.data))
            .catch(() => {});
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setServerError('');
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim())    e.name    = 'Your name is required.';
        if (!form.email.trim())   e.email   = 'Your email is required.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
        if (!form.subject.trim()) e.subject = 'A subject is required.';
        if (!form.message.trim()) e.message = 'Please write a message.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await API.post('contact/', form);
            setDone(true);
        } catch (err) {
            setServerError(
                err.response?.data?.message ||
                'Failed to send your message. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const contactDetails = [
        settings?.church_email && {
            icon: '✉️',
            label: 'Email',
            value: settings.church_email,
            href: `mailto:${settings.church_email}`,
        },
        settings?.church_phone && {
            icon: '📞',
            label: 'Phone',
            value: settings.church_phone,
            href: `tel:${settings.church_phone}`,
        },
        settings?.venue_address && {
            icon: '📍',
            label: 'Venue',
            value: settings.venue_address,
            href: null,
        },
        settings?.whatsapp_number && {
            icon: '💬',
            label: 'WhatsApp',
            value: 'Chat with us on WhatsApp',
            href: `https://wa.me/${settings.whatsapp_number}`,
        },
    ].filter(Boolean);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                :root {
                    --navy:#0D1B2A; --navy2:#1E3A5F; --white:#FFFFFF;
                    --snow:#F5F7FA; --gold:#C9A030; --border:#E2E8F0;
                    --dim:#64748B; --red:#DC2626; --green:#16A34A;
                }
                *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
                body { font-family:'DM Sans',sans-serif; background:var(--snow); color:var(--navy); }

                .page-hero { background:var(--navy); padding:5rem 1.5rem 4rem; text-align:center; }
                .page-hero-tag { font-size:.67rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.75rem; }
                .page-hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,5vw,3.4rem); font-weight:700; color:#fff; margin-bottom:.6rem; }
                .page-hero-sub { font-size:.92rem; color:rgba(255,255,255,.5); max-width:480px; margin:0 auto; }

                /* Layout */
                .contact-section { padding:4rem 1.5rem; }
                .contact-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1.5fr; gap:4rem; align-items:start; }

                /* Left info side */
                .contact-info-tag { font-size:.67rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.7rem; }
                .contact-info-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.6rem,4vw,2.2rem); font-weight:700; color:var(--navy); margin-bottom:.8rem; line-height:1.15; }
                .contact-info-desc { font-size:.9rem; color:var(--dim); line-height:1.8; margin-bottom:2.5rem; }

                .contact-detail { display:flex; align-items:flex-start; gap:.85rem; margin-bottom:1.25rem; }
                .contact-detail-icon { width:42px; height:42px; border-radius:11px; background:rgba(201,160,48,.1); border:1px solid rgba(201,160,48,.18); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
                .contact-detail-label { font-size:.68rem; font-weight:600; color:var(--dim); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.2rem; }
                .contact-detail-val { font-size:.9rem; color:var(--navy); font-weight:500; }
                .contact-detail-val a { color:var(--navy); text-decoration:none; transition:color .15s; }
                .contact-detail-val a:hover { color:var(--gold); }

                /* Social links */
                .social-row { display:flex; gap:.6rem; margin-top:2rem; }
                .social-btn { width:38px; height:38px; border-radius:9px; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--dim); font-size:.82rem; font-weight:700; text-decoration:none; transition:all .16s; }
                .social-btn:hover { border-color:var(--navy); color:var(--navy); background:var(--snow); }

                /* Form card */
                .form-card { background:var(--white); border:1px solid var(--border); border-radius:18px; padding:2.25rem; box-shadow:0 4px 24px rgba(13,27,42,.06); }
                .form-card-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; color:var(--navy); margin-bottom:.3rem; }
                .form-card-sub { font-size:.84rem; color:var(--dim); margin-bottom:1.75rem; }

                .server-error { background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:.75rem 1rem; font-size:.84rem; color:var(--red); margin-bottom:1.25rem; display:flex; gap:.5rem; align-items:flex-start; }

                .form-row { display:grid; grid-template-columns:1fr 1fr; gap:.85rem; }
                .form-field { margin-bottom:1rem; }
                .form-label { display:block; font-size:.78rem; font-weight:600; color:var(--navy); margin-bottom:.4rem; letter-spacing:.02em; }
                .form-input { width:100%; padding:.7rem .95rem; border:1.5px solid var(--border); border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.88rem; color:var(--navy); outline:none; transition:all .16s; background:var(--white); }
                .form-input:focus { border-color:var(--navy); box-shadow:0 0 0 3px rgba(13,27,42,.07); }
                .form-input.error { border-color:var(--red); }
                .form-textarea { resize:vertical; min-height:140px; }
                .field-error { font-size:.73rem; color:var(--red); margin-top:.28rem; }

                .form-submit { width:100%; padding:.8rem; background:var(--navy); color:#fff; border:none; border-radius:9px; font-family:'DM Sans',sans-serif; font-size:.9rem; font-weight:600; cursor:pointer; transition:all .18s; display:flex; align-items:center; justify-content:center; gap:.5rem; margin-top:.5rem; letter-spacing:.02em; }
                .form-submit:hover:not(:disabled) { background:var(--navy2); transform:translateY(-1px); box-shadow:0 4px 16px rgba(13,27,42,.22); }
                .form-submit:disabled { opacity:.65; cursor:not-allowed; }
                .spinner { width:15px; height:15px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
                @keyframes spin { to { transform:rotate(360deg); } }

                /* Success state */
                .done-state { text-align:center; padding:2.5rem 1rem; }
                .done-icon { width:68px; height:68px; background:#F0FDF4; border:2px solid #BBF7D0; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.9rem; margin:0 auto 1.25rem; }
                .done-title { font-family:'Cormorant Garamond',serif; font-size:1.7rem; font-weight:700; color:var(--navy); margin-bottom:.6rem; }
                .done-text { font-size:.88rem; color:var(--dim); line-height:1.75; margin-bottom:1.5rem; }
                .done-reset { background:none; border:1.5px solid var(--border); color:var(--navy); padding:.55rem 1.25rem; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.84rem; cursor:pointer; transition:all .15s; }
                .done-reset:hover { border-color:var(--navy); }

                @media(max-width:768px) {
                    .contact-inner { grid-template-columns:1fr; gap:2.5rem; }
                    .form-row { grid-template-columns:1fr; }
                }
            `}</style>

            <Navbar />

            {/* Hero */}
            <div className="page-hero">
                <div className="page-hero-tag">Campmeeting 2026</div>
                <h1 className="page-hero-title">Contact Us</h1>
                <p className="page-hero-sub">
                    Have a question? Our team is happy to help.
                </p>
            </div>

            <section className="contact-section">
                <div className="contact-inner">

                    {/* Left info */}
                    <div>
                        <div className="contact-info-tag">Get In Touch</div>
                        <h2 className="contact-info-title">
                            We're Here<br />to Help
                        </h2>
                        <p className="contact-info-desc">
                            Have questions about registration, accommodation, the programme,
                            or anything else? Reach out and we'll get back to you as soon
                            as possible.
                        </p>

                        {contactDetails.map((d, i) => (
                            <div className="contact-detail" key={i}>
                                <div className="contact-detail-icon">{d.icon}</div>
                                <div>
                                    <div className="contact-detail-label">{d.label}</div>
                                    <div className="contact-detail-val">
                                        {d.href
                                            ? <a href={d.href} target={d.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{d.value}</a>
                                            : d.value
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Social links */}
                        {(settings?.facebook_url || settings?.instagram_url || settings?.youtube_channel_url) && (
                            <div className="social-row">
                                {settings?.facebook_url && (
                                    <a href={settings.facebook_url} className="social-btn" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
                                )}
                                {settings?.instagram_url && (
                                    <a href={settings.instagram_url} className="social-btn" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
                                )}
                                {settings?.youtube_channel_url && (
                                    <a href={settings.youtube_channel_url} className="social-btn" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right form */}
                    <div className="form-card">
                        {done ? (
                            <div className="done-state">
                                <div className="done-icon">✅</div>
                                <div className="done-title">Message Sent!</div>
                                <p className="done-text">
                                    Thank you for reaching out, {form.name.split(' ')[0]}!
                                    We've received your message and will get back to you
                                    within 24–48 hours.
                                </p>
                                <button
                                    className="done-reset"
                                    onClick={() => {
                                        setDone(false);
                                        setForm({ name: '', email: '', subject: '', message: '' });
                                    }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="form-card-title">Send a Message</div>
                                <p className="form-card-sub">Fill in the form and we'll be in touch.</p>

                                {serverError && (
                                    <div className="server-error">
                                        <span>⚠</span> {serverError}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label className="form-label">Your Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                className={`form-input ${errors.name ? 'error' : ''}`}
                                                placeholder="John Doe"
                                                value={form.name}
                                                onChange={handleChange}
                                            />
                                            {errors.name && <div className="field-error">{errors.name}</div>}
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Email Address</label>
                                            <input
                                                name="email"
                                                type="email"
                                                className={`form-input ${errors.email ? 'error' : ''}`}
                                                placeholder="you@example.com"
                                                value={form.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && <div className="field-error">{errors.email}</div>}
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">Subject</label>
                                        <input
                                            name="subject"
                                            type="text"
                                            className={`form-input ${errors.subject ? 'error' : ''}`}
                                            placeholder="What is your message about?"
                                            value={form.subject}
                                            onChange={handleChange}
                                        />
                                        {errors.subject && <div className="field-error">{errors.subject}</div>}
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            name="message"
                                            className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                                            placeholder="Write your message here..."
                                            value={form.message}
                                            onChange={handleChange}
                                        />
                                        {errors.message && <div className="field-error">{errors.message}</div>}
                                    </div>

                                    <button type="submit" className="form-submit" disabled={loading}>
                                        {loading
                                            ? <><div className="spinner" /> Sending...</>
                                            : 'Send Message'
                                        }
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}