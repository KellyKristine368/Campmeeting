import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';

export default function Location() {
    const [settings, setSettings] = useState(null);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        API.get('core/settings/')
            .then(r => setSettings(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const directions = [
        {
            icon: '🚗',
            mode: 'By Car',
            desc: 'Follow the main road to the campground. Ample parking is available on site. Use Google Maps and search for the venue name above.',
        },
        {
            icon: '🚌',
            mode: 'By Bus / Trotro',
            desc: 'Take any bus heading towards the venue area and alight at the main junction. Look for signage directing you to the campground.',
        },
        {
            icon: '🚕',
            mode: 'By Taxi / Uber',
            desc: 'Use the venue address above in your ride-hailing app. Registered attendees will receive detailed directions via email.',
        },
        {
            icon: '✈️',
            mode: 'From the Airport',
            desc: 'The venue is approximately 30–60 minutes from Kotoka International Airport depending on traffic conditions.',
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                :root {
                    --navy:#0D1B2A; --navy2:#1E3A5F; --white:#FFFFFF;
                    --snow:#F5F7FA; --gold:#C9A030; --border:#E2E8F0; --dim:#64748B;
                }
                *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
                body { font-family:'DM Sans',sans-serif; background:var(--snow); color:var(--navy); }

                .page-hero { background:var(--navy); padding:5rem 1.5rem 4rem; text-align:center; }
                .page-hero-tag { font-size:.67rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.75rem; }
                .page-hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,5vw,3.4rem); font-weight:700; color:#fff; margin-bottom:.6rem; }
                .page-hero-sub { font-size:.92rem; color:rgba(255,255,255,.5); max-width:480px; margin:0 auto; }

                /* Venue section */
                .venue-section { padding:3.5rem 1.5rem; background:var(--white); }
                .venue-inner { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1.2fr; gap:3.5rem; align-items:start; }

                .venue-tag { font-size:.67rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.7rem; }
                .venue-name { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,4vw,2.6rem); font-weight:700; color:var(--navy); line-height:1.15; margin-bottom:.75rem; }
                .venue-address { font-size:.92rem; color:var(--dim); line-height:1.8; margin-bottom:2rem; }

                .venue-detail { display:flex; align-items:flex-start; gap:.85rem; margin-bottom:1.1rem; }
                .venue-detail-icon { width:40px; height:40px; border-radius:10px; background:rgba(201,160,48,.1); border:1px solid rgba(201,160,48,.2); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
                .venue-detail-label { font-size:.68rem; font-weight:600; color:var(--dim); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.2rem; }
                .venue-detail-val { font-size:.9rem; color:var(--navy); font-weight:500; }
                .venue-detail-val a { color:var(--navy); text-decoration:none; }
                .venue-detail-val a:hover { text-decoration:underline; }

                .whatsapp-btn { display:inline-flex; align-items:center; gap:.55rem; background:var(--navy); color:#fff; padding:.7rem 1.5rem; border-radius:9px; font-size:.85rem; font-weight:600; text-decoration:none; margin-top:1.5rem; transition:all .18s; }
                .whatsapp-btn:hover { background:var(--navy2); transform:translateY(-1px); box-shadow:0 4px 14px rgba(13,27,42,.2); }

                /* Map */
                .map-wrap { border-radius:16px; overflow:hidden; border:1px solid var(--border); height:420px; background:var(--snow); display:flex; align-items:center; justify-content:center; color:var(--dim); font-size:.88rem; box-shadow:0 4px 24px rgba(13,27,42,.08); }
                .map-wrap iframe { width:100%; height:100%; border:none; }
                .map-placeholder { text-align:center; padding:2rem; }
                .map-placeholder-icon { font-size:2.5rem; margin-bottom:.75rem; }

                /* Directions */
                .directions-section { padding:3.5rem 1.5rem; }
                .directions-inner { max-width:1100px; margin:0 auto; }
                .sec-head { text-align:center; margin-bottom:2.5rem; }
                .sec-tag { font-size:.67rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.5rem; }
                .sec-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,4vw,2.4rem); font-weight:700; color:var(--navy); margin-bottom:.5rem; }
                .sec-sub { font-size:.9rem; color:var(--dim); max-width:480px; margin:0 auto; line-height:1.7; }
                .dir-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:1.25rem; }
                .dir-card { background:var(--white); border:1px solid var(--border); border-radius:14px; padding:1.5rem; transition:all .2s; }
                .dir-card:hover { border-color:rgba(13,27,42,.15); box-shadow:0 6px 20px rgba(13,27,42,.08); transform:translateY(-2px); }
                .dir-icon { font-size:1.8rem; margin-bottom:.75rem; }
                .dir-mode { font-size:.85rem; font-weight:700; color:var(--navy); margin-bottom:.5rem; }
                .dir-desc { font-size:.82rem; color:var(--dim); line-height:1.7; }

                /* Transport info banner */
                .transport-banner { background:var(--navy); margin:0 1.5rem 3.5rem; border-radius:16px; padding:2rem 2.5rem; display:flex; align-items:center; gap:1.5rem; max-width:1100px; margin-left:auto; margin-right:auto; }
                .transport-banner-icon { font-size:2rem; flex-shrink:0; }
                .transport-banner-title { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:700; color:#fff; margin-bottom:.3rem; }
                .transport-banner-text { font-size:.84rem; color:rgba(255,255,255,.55); line-height:1.6; }

                @media(max-width:768px) {
                    .venue-inner { grid-template-columns:1fr; gap:2rem; }
                    .map-wrap { height:280px; }
                    .transport-banner { flex-direction:column; text-align:center; }
                }
            `}</style>

            <Navbar />

            {/* Hero */}
            <div className="page-hero">
                <div className="page-hero-tag">Campmeeting 2026</div>
                <h1 className="page-hero-title">Location</h1>
                <p className="page-hero-sub">
                    Find us — venue details, directions, and transport options.
                </p>
            </div>

            {/* Venue + Map */}
            <section className="venue-section">
                <div className="venue-inner">
                    <div>
                        <div className="venue-tag">Venue</div>
                        <h2 className="venue-name">
                            {settings?.venue_name || 'Campmeeting Grounds'}
                        </h2>
                        <p className="venue-address">
                            {settings?.venue_address || 'Venue address will be announced soon.'}
                        </p>

                        {settings?.church_phone && (
                            <div className="venue-detail">
                                <div className="venue-detail-icon">📞</div>
                                <div>
                                    <div className="venue-detail-label">Phone</div>
                                    <div className="venue-detail-val">
                                        <a href={`tel:${settings.church_phone}`}>
                                            {settings.church_phone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {settings?.church_email && (
                            <div className="venue-detail">
                                <div className="venue-detail-icon">✉️</div>
                                <div>
                                    <div className="venue-detail-label">Email</div>
                                    <div className="venue-detail-val">
                                        <a href={`mailto:${settings.church_email}`}>
                                            {settings.church_email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="venue-detail">
                            <div className="venue-detail-icon">📅</div>
                            <div>
                                <div className="venue-detail-label">Dates</div>
                                <div className="venue-detail-val">
                                    {settings?.start_date
                                        ? `${new Date(settings.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} — ${new Date(settings.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                        : 'Dates to be announced'
                                    }
                                </div>
                            </div>
                        </div>

                        {settings?.whatsapp_number && (
                            <a
                                href={`https://wa.me/${settings.whatsapp_number}`}
                                className="whatsapp-btn"
                                target="_blank"
                                rel="noreferrer"
                            >
                                💬 Ask on WhatsApp
                            </a>
                        )}
                    </div>

                    {/* Map */}
                    <div className="map-wrap">
                        {settings?.google_maps_embed ? (
                            <div
                                style={{ width: '100%', height: '100%' }}
                                dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }}
                            />
                        ) : (
                            <div className="map-placeholder">
                                <div className="map-placeholder-icon">🗺️</div>
                                <p>Map will appear once configured in the admin panel.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Transport banner */}
            <div className="transport-banner">
                <div className="transport-banner-icon">🚐</div>
                <div>
                    <div className="transport-banner-title">Transport Arrangements</div>
                    <p className="transport-banner-text">
                        Registered attendees will receive detailed transport information via email
                        closer to the campmeeting date. Please ensure your registration is complete
                        and your email is verified.
                    </p>
                </div>
            </div>

            {/* Directions */}
            <section className="directions-section">
                <div className="directions-inner">
                    <div className="sec-head">
                        <div className="sec-tag">Getting Here</div>
                        <h2 className="sec-title">How to Get There</h2>
                        <p className="sec-sub">
                            Several transport options are available to reach the campground.
                        </p>
                    </div>
                    <div className="dir-grid">
                        {directions.map(d => (
                            <div className="dir-card" key={d.mode}>
                                <div className="dir-icon">{d.icon}</div>
                                <div className="dir-mode">{d.mode}</div>
                                <div className="dir-desc">{d.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
