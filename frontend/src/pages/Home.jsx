import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';

// ── Countdown hook ──────────────────────────────────────────────
function useCountdown(targetDate) {
    const calc = () => {
        const diff = new Date(targetDate) - new Date();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days:     Math.floor(diff / 86400000),
            hours:    Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        };
    };
    const [time, setTime] = useState(calc);
    useEffect(() => {
        const t = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(t);
    }, [targetDate]);
    return time;
}

// ── Countdown block ─────────────────────────────────────────────
function CountdownUnit({ value, label }) {
    return (
        <div className="cd-unit">
            <div className="cd-num">{String(value).padStart(2, '0')}</div>
            <div className="cd-label">{label}</div>
        </div>
    );
}

// ── Section heading ─────────────────────────────────────────────
function SectionHead({ tag, title, sub }) {
    return (
        <div className="sec-head">
            {tag && <div className="sec-tag">{tag}</div>}
            <h2 className="sec-title">{title}</h2>
            {sub && <p className="sec-sub">{sub}</p>}
        </div>
    );
}

// ── Speaker card ────────────────────────────────────────────────
function SpeakerCard({ speaker }) {
    return (
        <div className="spk-card">
            <div className="spk-photo-wrap">
                {speaker.photo
                    ? <img src={speaker.photo} alt={speaker.name} className="spk-photo" />
                    : <div className="spk-photo-placeholder">{speaker.name?.[0]}</div>
                }
            </div>
            <div className="spk-info">
                <div className="spk-title-badge">{speaker.title || 'Speaker'}</div>
                <h3 className="spk-name">{speaker.name}</h3>
                <p className="spk-church">{speaker.church}</p>
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────
export default function Home() {
    const [speakers,  setSpeakers]  = useState([]);
    const [settings,  setSettings]  = useState(null);
    const [schedule,  setSchedule]  = useState([]);
    const [loadSpk,   setLoadSpk]   = useState(true);

    const campmeetingDate = settings?.start_date || '2026-08-10';
    const countdown = useCountdown(campmeetingDate);

    useEffect(() => {
        API.get('core/settings/')
            .then(r => setSettings(r.data))
            .catch(() => {});

        API.get('speakers/featured/')
            .then(r => { setSpeakers(r.data); setLoadSpk(false); })
            .catch(() => setLoadSpk(false));

        API.get('schedule/?ordering=day,start_time')
            .then(r => setSchedule(r.data.results || r.data))
            .catch(() => {});
    }, []);

    const themeName    = settings?.theme           || 'Revive Us Again';
    const themeVerse   = settings?.theme_scripture || 'Psalm 85:6';
    const venueName    = settings?.venue_name      || 'Campmeeting Grounds';
    const startDate    = settings?.start_date      || 'August 2026';
    const endDate      = settings?.end_date        || '';
    const churchName   = settings?.church_name     || 'Meridian Ghana Conference';
    const regOpen      = settings?.registration_open ?? true;

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

            :root {
                --navy:   #0D1B2A;
                --navy2:  #1E3A5F;
                --navy3:  #162236;
                --white:  #FFFFFF;
                --snow:   #F5F7FA;
                --gold:   #C9A030;
                --gold2:  #E2B84A;
                --border: #E2E8F0;
                --dim:    #64748B;
            }

            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'DM Sans', sans-serif; background: var(--snow); color: var(--navy); }

            /* ── HERO ── */
            .hero {
                min-height: 100vh;
                background: linear-gradient(160deg, var(--navy) 0%, var(--navy2) 55%, #0F2A45 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 5rem 1.5rem 4rem;
                position: relative;
                overflow: hidden;
            }

            .hero::before {
                content: '';
                position: absolute;
                top: -200px; right: -200px;
                width: 700px; height: 700px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(201,160,48,0.06) 0%, transparent 70%);
                pointer-events: none;
            }

            .hero::after {
                content: '';
                position: absolute;
                bottom: -150px; left: -150px;
                width: 600px; height: 600px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
                pointer-events: none;
            }

            .hero-inner {
                position: relative;
                z-index: 1;
                max-width: 900px;
                width: 100%;
            }

            .hero-eyebrow {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                background: rgba(201,160,48,0.12);
                border: 1px solid rgba(201,160,48,0.25);
                border-radius: 100px;
                padding: 0.38rem 1rem;
                font-size: 0.7rem;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--gold2);
                margin-bottom: 2rem;
            }

            .hero-eyebrow-dot {
                width: 6px; height: 6px;
                border-radius: 50%;
                background: var(--gold);
                animation: blink 1.8s ease infinite;
            }

            @keyframes blink {
                0%, 100% { opacity: 1; }
                50%       { opacity: 0.3; }
            }

            /* Fancier, Styled Typography Title Layout */
            .hero-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: clamp(3.2rem, 8vw, 5.8rem);
                font-weight: 600;
                color: var(--white);
                line-height: 1.05;
                margin-bottom: 1rem;
                letter-spacing: -0.02em;
                text-shadow: 0 4px 12px rgba(13, 27, 42, 0.3);
            }

            .hero-title .word-main {
                background: linear-gradient(180deg, #FFFFFF 40%, #E2E8F0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                display: inline-block;
            }

            .hero-title .word-year {
                font-weight: 700;
                font-style: italic;
                background: linear-gradient(135deg, #FFEAA7 0%, var(--gold2) 50%, var(--gold) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                display: inline-block;
                margin-left: 0.15rem;
                padding-right: 0.05em;
            }

            .hero-conf {
                font-size: 0.8rem;
                font-weight: 500;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.45);
                margin-bottom: 1.5rem;
            }

            .hero-theme {
                font-family: 'Cormorant Garamond', serif;
                font-size: clamp(1.2rem, 2.5vw, 1.6rem);
                font-style: italic;
                color: rgba(255,255,255,0.85);
                margin-bottom: 0.4rem;
            }

            .hero-verse {
                font-size: 0.78rem;
                color: rgba(201,160,48,0.7);
                letter-spacing: 0.06em;
                margin-bottom: 2.5rem;
            }

            /* Dates strip */
            .hero-dates {
                display: inline-flex;
                align-items: center;
                gap: 1rem;
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 0.7rem 1.5rem;
                margin-bottom: 2.5rem;
                font-size: 0.85rem;
                color: rgba(255,255,255,0.75);
            }

            .hero-dates strong { color: var(--white); font-weight: 600; }

            .hero-dates-sep {
                width: 4px; height: 4px;
                border-radius: 50%;
                background: rgba(201,160,48,0.6);
            }

            /* CTA buttons */
            .hero-btns {
                display: flex;
                gap: 0.85rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .btn-hero-primary {
                background: var(--white);
                color: var(--navy);
                padding: 0.8rem 2rem;
                border-radius: 8px;
                font-size: 0.88rem;
                font-weight: 700;
                text-decoration: none;
                transition: all 0.18s;
                letter-spacing: 0.02em;
                border: none;
                cursor: pointer;
            }

            .btn-hero-primary:hover {
                background: var(--gold2);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(226,184,74,0.35);
            }

            .btn-hero-outline {
                background: transparent;
                color: var(--white);
                padding: 0.8rem 2rem;
                border-radius: 8px;
                font-size: 0.88rem;
                font-weight: 500;
                text-decoration: none;
                transition: all 0.18s;
                border: 1.5px solid rgba(255,255,255,0.3);
            }

            .btn-hero-outline:hover {
                border-color: rgba(255,255,255,0.7);
                background: rgba(255,255,255,0.06);
            }

            /* Scroll hint */
            .hero-scroll {
                position: absolute;
                bottom: 2rem; left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.4rem;
                color: rgba(255,255,255,0.3);
                font-size: 0.65rem;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                animation: scrollBounce 2s ease infinite;
            }

            @keyframes scrollBounce {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50%       { transform: translateX(-50%) translateY(6px); }
            }

            /* ── COUNTDOWN ── */
            .cd-section {
                background: var(--navy);
                padding: 3.5rem 1.5rem;
            }

            .cd-inner {
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
            }

            .cd-label-top {
                font-size: 0.68rem;
                font-weight: 600;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: var(--gold);
                margin-bottom: 1.5rem;
            }

            .cd-grid {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .cd-unit {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 12px;
                padding: 1.25rem 1.5rem;
                min-width: 90px;
                text-align: center;
            }

            .cd-num {
                font-family: 'Cormorant Garamond', serif;
                font-size: 3rem;
                font-weight: 700;
                color: var(--white);
                line-height: 1;
                letter-spacing: -0.02em;
            }

            .cd-label {
                font-size: 0.62rem;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.35);
                margin-top: 0.35rem;
            }

            .cd-sep {
                font-family: 'Cormorant Garamond', serif;
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--gold);
                opacity: 0.6;
                margin-bottom: 1rem;
                line-height: 1;
            }

            /* ── THEME SECTION ── */
            .theme-section {
                background: var(--white);
                padding: 5rem 1.5rem;
            }

            .theme-inner {
                max-width: 700px;
                margin: 0 auto;
                text-align: center;
            }

            .theme-tag {
                font-size: 0.67rem;
                font-weight: 600;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: var(--gold);
                margin-bottom: 1rem;
            }

            .theme-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: clamp(2rem, 5vw, 3.2rem);
                font-weight: 700;
                color: var(--navy);
                line-height: 1.15;
                margin-bottom: 0.5rem;
            }

            .theme-verse {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1rem;
                font-style: italic;
                color: var(--gold);
                margin-bottom: 1.25rem;
            }

            .theme-divider {
                width: 48px; height: 3px;
                background: var(--gold);
                border-radius: 2px;
                margin: 0 auto 1.25rem;
            }

            .theme-desc {
                font-size: 0.95rem;
                line-height: 1.8;
                color: var(--dim);
                max-width: 560px;
                margin: 0 auto;
            }

            /* ── SHARED SECTION STYLES ── */
            .section {
                padding: 5rem 1.5rem;
            }

            .section.alt { background: var(--snow); }
            .section.dark { background: var(--navy); }

            .section-inner {
                max-width: 1280px;
                margin: 0 auto;
            }

            .sec-head {
                text-align: center;
                margin-bottom: 3rem;
            }

            .sec-tag {
                font-size: 0.67rem;
                font-weight: 600;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: var(--gold);
                margin-bottom: 0.6rem;
            }

            .sec-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: clamp(1.8rem, 4vw, 2.6rem);
                font-weight: 700;
                color: var(--navy);
                line-height: 1.15;
                margin-bottom: 0.6rem;
            }

            .section.dark .sec-title { color: var(--white); }

            .sec-sub {
                font-size: 0.92rem;
                color: var(--dim);
                max-width: 500px;
                margin: 0 auto;
                line-height: 1.7;
            }

            .section.dark .sec-sub { color: rgba(255,255,255,0.5); }

            /* ── SPEAKERS ── */
            .spk-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2.5rem;
            }

            .spk-card {
                background: var(--white);
                border: 1px solid var(--border);
                border-radius: 14px;
                overflow: hidden;
                transition: all 0.22s ease;
            }

            .spk-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 36px rgba(13,27,42,0.1);
                border-color: rgba(13,27,42,0.12);
            }

            .spk-photo-wrap {
                height: 200px;
                overflow: hidden;
                background: var(--snow);
            }

            .spk-photo {
                width: 100%; height: 100%;
                object-fit: cover;
                transition: transform 0.4s ease;
            }

            .spk-card:hover .spk-photo { transform: scale(1.04); }

            .spk-photo-placeholder {
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                font-family: 'Cormorant Garamond', serif;
                font-size: 3.5rem;
                font-weight: 700;
                color: rgba(13,27,42,0.15);
                background: linear-gradient(135deg, var(--snow), #e8edf2);
            }

            .spk-info {
                padding: 1.1rem 1.25rem 1.25rem;
            }

            .spk-title-badge {
                display: inline-block;
                font-size: 0.65rem;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--gold);
                background: rgba(201,160,48,0.1);
                border-radius: 4px;
                padding: 0.2rem 0.55rem;
                margin-bottom: 0.45rem;
            }

            .spk-name {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.2rem;
                font-weight: 700;
                color: var(--navy);
                margin-bottom: 0.2rem;
                line-height: 1.2;
            }

            .spk-church {
                font-size: 0.78rem;
                color: var(--dim);
            }

            .spk-empty {
                text-align: center;
                padding: 3rem;
                color: var(--dim);
                font-size: 0.9rem;
            }

            /* ── SCHEDULE TEASER ── */
            .sched-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                max-width: 760px;
                margin: 0 auto 2.5rem;
            }

            .sched-item {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 10px;
                padding: 1rem 1.25rem;
                display: grid;
                grid-template-columns: 80px 1fr auto;
                align-items: center;
                gap: 1rem;
                transition: background 0.15s;
            }

            .sched-item:hover { background: rgba(255,255,255,0.08); }

            .sched-time {
                font-size: 0.78rem;
                font-weight: 600;
                color: var(--gold);
                white-space: nowrap;
            }

            .sched-title {
                font-size: 0.9rem;
                font-weight: 500;
                color: var(--white);
            }

            .sched-speaker {
                font-size: 0.75rem;
                color: rgba(255,255,255,0.45);
                margin-top: 2px;
            }

            .sched-type {
                font-size: 0.65rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.35);
                white-space: nowrap;
            }

            /* ── ACCOMMODATION ── */
            .acc-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1.25rem;
                margin-bottom: 2.5rem;
            }

            .acc-card {
                background: var(--white);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 1.5rem;
                transition: all 0.2s;
            }

            .acc-card:hover {
                border-color: var(--navy);
                box-shadow: 0 6px 24px rgba(13,27,42,0.08);
                transform: translateY(-2px);
            }

            .acc-type {
                font-size: 0.62rem;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--dim);
                margin-bottom: 0.5rem;
            }

            .acc-name {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.2rem;
                font-weight: 700;
                color: var(--navy);
                margin-bottom: 0.4rem;
            }

            .acc-price {
                font-size: 1.15rem;
                font-weight: 700;
                color: var(--navy);
                margin-bottom: 0.75rem;
            }

            .acc-price span {
                font-size: 0.78rem;
                font-weight: 400;
                color: var(--dim);
            }

            .acc-amenities {
                display: flex;
                flex-wrap: wrap;
                gap: 0.4rem;
            }

            .acc-tag {
                font-size: 0.7rem;
                background: var(--snow);
                color: var(--dim);
                border-radius: 4px;
                padding: 0.2rem 0.55rem;
            }

            /* ── LIVE STREAM PROMO ── */
            .live-banner {
                background: linear-gradient(135deg, var(--navy) 0%, var(--navy2) 100%);
                border-radius: 20px;
                padding: 3.5rem 2rem;
                text-align: center;
                max-width: 780px;
                margin: 0 auto;
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(201,160,48,0.15);
            }

            .live-banner::before {
                content: '';
                position: absolute;
                top: -60px; right: -60px;
                width: 280px; height: 280px;
                border-radius: 50%;
                background: rgba(201,160,48,0.05);
            }

            .live-dot {
                display: inline-flex;
                align-items: center;
                gap: 0.45rem;
                background: rgba(239,68,68,0.15);
                border: 1px solid rgba(239,68,68,0.3);
                border-radius: 100px;
                padding: 0.3rem 0.85rem;
                font-size: 0.68rem;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #FCA5A5;
                margin-bottom: 1.25rem;
                position: relative;
                z-index: 1;
            }

            .live-dot-pulse {
                width: 6px; height: 6px;
                border-radius: 50%;
                background: #EF4444;
                animation: blink 1.2s ease infinite;
            }

            .live-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: clamp(1.6rem, 4vw, 2.4rem);
                font-weight: 700;
                color: var(--white);
                margin-bottom: 0.75rem;
                position: relative;
                z-index: 1;
            }

            .live-sub {
                font-size: 0.9rem;
                color: rgba(255,255,255,0.55);
                margin-bottom: 2rem;
                position: relative;
                z-index: 1;
            }

            /* ── LOCATION ── */
            .loc-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
                align-items: center;
            }

            .loc-venue {
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.8rem;
                font-weight: 700;
                color: var(--navy);
                margin-bottom: 0.75rem;
            }

            .loc-address {
                font-size: 0.9rem;
                color: var(--dim);
                line-height: 1.7;
                margin-bottom: 1.5rem;
            }

            .loc-map {
                background: var(--snow);
                border: 1px solid var(--border);
                border-radius: 14px;
                height: 300px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--dim);
                font-size: 0.88rem;
                overflow: hidden;
            }

            .loc-map iframe {
                width: 100%; height: 100%;
                border: none;
                border-radius: 14px;
            }

            /* ── FINAL CTA ── */
            .cta-section {
                background: var(--navy);
                padding: 5rem 1.5rem;
                text-align: center;
            }

            .cta-title {
                font-family: 'Cormorant Garamond', serif;
                font-size: clamp(2rem, 5vw, 3rem);
                font-weight: 700;
                color: var(--white);
                margin-bottom: 0.75rem;
            }

            .cta-sub {
                font-size: 0.95rem;
                color: rgba(255,255,255,0.5);
                margin-bottom: 2.5rem;
                max-width: 460px;
                margin-left: auto;
                margin-right: auto;
            }

            .cta-btns {
                display: flex;
                gap: 0.85rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .btn-white {
                background: var(--white);
                color: var(--navy);
                padding: 0.82rem 2.2rem;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 700;
                text-decoration: none;
                transition: all 0.18s;
            }

            .btn-white:hover {
                background: var(--gold2);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(226,184,74,0.35);
            }

            .btn-outline-white {
                background: transparent;
                color: var(--white);
                padding: 0.82rem 2.2rem;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 500;
                text-decoration: none;
                transition: all 0.18s;
                border: 1.5px solid rgba(255,255,255,0.28);
            }

            .btn-outline-white:hover {
                border-color: rgba(255,255,255,0.65);
                background: rgba(255,255,255,0.06);
            }

            .view-all {
                text-align: center;
                margin-top: 0.5rem;
            }

            .view-all a {
                font-size: 0.84rem;
                font-weight: 600;
                color: var(--navy);
                text-decoration: none;
                border-bottom: 1.5px solid var(--border);
                padding-bottom: 1px;
                transition: border-color 0.15s;
            }

            .view-all a:hover { border-color: var(--navy); }

            .section.dark .view-all a {
                color: rgba(255,255,255,0.6);
                border-color: rgba(255,255,255,0.15);
            }

            .section.dark .view-all a:hover {
                color: var(--white);
                border-color: rgba(255,255,255,0.5);
            }

            @media (max-width: 768px) {
                .cd-unit { min-width: 68px; padding: 1rem 0.85rem; }
                .cd-num  { font-size: 2.2rem; }
                .loc-grid { grid-template-columns: 1fr; }
                .sched-item { grid-template-columns: 70px 1fr; }
                .sched-type { display: none; }
            }

            @media (max-width: 480px) {
                .cd-grid { gap: 0.3rem; }
                .cd-unit { min-width: 60px; }
                .hero-btns { flex-direction: column; align-items: center; }
            }
        `}</style>

        <Navbar />

        {/* ── HERO ── */}
        <section className="hero">
            <div className="hero-inner">
                <div className="hero-eyebrow">
                    <div className="hero-eyebrow-dot" />
                    Registration Now Open
                </div>

                {/* Highly-styled header mirroring your sketchbook gradient structure */}
                <h1 className="hero-title">
                    <span className="word-main">CampMeeting</span> <span className="word-year">2026</span>
                </h1>

                <div className="hero-conf">
                    {churchName} · Seventh-day Adventist Church
                </div>

                <div className="hero-theme">"{themeName}"</div>
                <div className="hero-verse">— {themeVerse}</div>

                <div className="hero-dates">
                    <strong>{formatDate(startDate)}</strong>
                    <div className="hero-dates-sep" />
                    {endDate && <strong>{formatDate(endDate)}</strong>}
                    <div className="hero-dates-sep" />
                    <span>{venueName}</span>
                </div>

                <div className="hero-btns">
                    {regOpen
                        ? <Link to="/register" className="btn-hero-primary">Register Now</Link>
                        : <span className="btn-hero-primary" style={{ opacity: 0.5, cursor: 'default' }}>
                            Registration Closed
                          </span>
                    }
                    <Link to="/schedule" className="btn-hero-outline">View Programme</Link>
                </div>
            </div>

            <div className="hero-scroll">
                <span>Scroll</span>
                <span>↓</span>
            </div>
        </section>

        {/* ── COUNTDOWN ── */}
        <section className="cd-section">
            <div className="cd-inner">
                <div className="cd-label-top">Campmeeting Begins In</div>
                <div className="cd-grid">
                    <CountdownUnit value={countdown.days}    label="Days"    />
                    <div className="cd-sep">:</div>
                    <CountdownUnit value={countdown.hours}   label="Hours"   />
                    <div className="cd-sep">:</div>
                    <CountdownUnit value={countdown.seconds} label="Minutes" />
                    <div className="cd-sep">:</div>
                    <CountdownUnit value={countdown.seconds} label="Seconds" />
                </div>
            </div>
        </section>

        {/* ── THEME ── */}
        <section className="theme-section">
            <div className="theme-inner">
                <div className="theme-tag">This Year's Theme</div>
                <h2 className="theme-title">"{themeName}"</h2>
                <div className="theme-verse">— {themeVerse}</div>
                <div className="theme-divider" />
                <p className="theme-desc">
                    Join us as we seek God's presence and power for revival and renewal.
                    This year's campmeeting promises powerful preaching, heartfelt worship,
                    and a community of faith coming together in the name of Jesus Christ.
                </p>
            </div>
        </section>

        {/* ── FEATURED SPEAKERS ── */}
        <section className="section alt">
            <div className="section-inner">
                <SectionHead
                    tag="Guest Speakers"
                    title="Meet Our Speakers"
                    sub="Anointed ministers of the Word bringing messages of hope, faith, and revival."
                />
                {loadSpk ? (
                    <div className="spk-empty">Loading speakers...</div>
                ) : speakers.length === 0 ? (
                    <div className="spk-empty">
                        Speakers will be announced soon. Check back shortly.
                    </div>
                ) : (
                    <div className="spk-grid">
                        {speakers.map(s => <SpeakerCard key={s.id} speaker={s} />)}
                    </div>
                )}
                <div className="view-all">
                    <Link to="/speakers">View All Speakers →</Link>
                </div>
            </div>
        </section>

        {/* ── SCHEDULE TEASER ── */}
        <section className="section dark">
            <div className="section-inner">
                <SectionHead
                    tag="Programme"
                    title="What's On"
                    sub="A week packed with worship, prayer, preaching, and fellowship."
                />
                {schedule.length === 0 ? (
                    <div style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', padding:'2rem', fontSize:'0.9rem' }}>
                        Programme coming soon.
                    </div>
                ) : (
                    <div className="sched-list">
                        {schedule.slice(0, 5).map(item => (
                            <div className="sched-item" key={item.id}>
                                <div className="sched-time">
                                    {item.start_time?.slice(0, 5)}
                                </div>
                                <div>
                                    <div className="sched-title">{item.title}</div>
                                    {item.speaker_name && (
                                        <div className="sched-speaker">{item.speaker_name}</div>
                                    )}
                                </div>
                                <div className="sched-type">
                                    {item.session_type_label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="view-all">
                    <Link to="/schedule">Full Programme →</Link>
                </div>
            </div>
        </section>

        {/* ── ACCOMMODATION ── */}
        <section className="section">
            <div className="section-inner">
                <SectionHead
                    tag="Accommodation"
                    title="Where to Stay"
                    sub="On-site and nearby lodging options for all budgets."
                />
                <div className="acc-grid">
                    {[
                        { name: 'On-Site Dormitory', type: 'On-Site', price: 'GHS 50', per: '/night', amenities: ['Shared Rooms', 'Bathrooms', 'Security'] },
                        { name: 'Conference Guesthouse', type: 'On-Site', price: 'GHS 120', per: '/night', amenities: ['Private Room', 'AC', 'Breakfast'] },
                        { name: 'Nearby Hotel', type: 'Off-Site', price: 'GHS 200+', per: '/night', amenities: ['Hotel Amenities', 'Shuttle', 'WiFi'] },
                    ].map((a, i) => (
                        <div className="acc-card" key={i}>
                            <div className="acc-type">{a.type}</div>
                            <div className="acc-name">{a.name}</div>
                            <div className="acc-price">
                                {a.price} <span>{a.per}</span>
                            </div>
                            <div className="acc-amenities">
                                {a.amenities.map(t => (
                                    <span className="acc-tag" key={t}>{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="view-all">
                    <Link to="/accommodation">View All Options →</Link>
                </div>
            </div>
        </section>

        {/* ── LIVE STREAM ── */}
        <section className="section alt">
            <div className="section-inner">
                <div className="live-banner">
                    <div className="live-dot">
                        <div className="live-dot-pulse" />
                        Live Stream Available
                    </div>
                    <h2 className="live-title">Can't Attend in Person?<br />Watch Online</h2>
                    <p className="live-sub">
                        All main services will be streamed live. Watch from anywhere
                        in the world — no registration required.
                    </p>
                    <div className="cta-btns">
                        <Link to="/livestream" className="btn-hero-primary">Watch Live Stream</Link>
                        <Link to="/schedule"   className="btn-hero-outline">View Schedule</Link>
                    </div>
                </div>
            </div>
        </section>

        {/* ── LOCATION ── */}
        <section className="section">
            <div className="section-inner">
                <SectionHead
                    tag="Location"
                    title="Find Us"
                />
                <div className="loc-grid">
                    <div className="loc-info">
                        <h3 className="loc-venue">{venueName}</h3>
                        <p className="loc-address">
                            {settings?.venue_address || 'Venue address will be announced soon.'}<br /><br />
                            <strong>Getting Here:</strong> Transport arrangements will be
                            communicated to registered attendees. Check the Location page for
                            full directions and transport options.
                        </p>
                        <Link to="/location" className="btn-hero-primary"
                            style={{ display:'inline-block', background:'var(--navy)', color:'#fff', fontSize:'0.85rem', padding:'0.7rem 1.5rem' }}>
                            Get Directions →
                        </Link>
                    </div>
                    <div className="loc-map">
                        {settings?.google_maps_embed
                            ? <div dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }} />
                            : <span>Map will appear here once configured in admin.</span>
                        }
                    </div>
                </div>
            </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="cta-section">
            <h2 className="cta-title">Ready to Attend?</h2>
            <p className="cta-sub">
                Secure your spot at Campmeeting 2026. Registration is free —
                just create an account and fill in your details.
            </p>
            <div className="cta-btns">
                <Link to="/register" className="btn-white">Register Now</Link>
                <Link to="/contact"  className="btn-outline-white">Contact Us</Link>
            </div>
        </section>

        <Footer />
        </>
    );
}