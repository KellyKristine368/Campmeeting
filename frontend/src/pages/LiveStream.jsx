import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';

export default function LiveStream() {
    const [current, setCurrent] = useState(null);
    const [replays, setReplays] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('livestream/current/')
            .then(r => setCurrent(r.data))
            .catch(() => {});

        API.get('livestream/?is_replay=true')
            .then(r => setReplays(r.data.results || r.data))
            .catch(() => {});

        API.get('schedule/?is_live_streamed=true&ordering=day,start_time')
            .then(r => setSchedule((r.data.results || r.data).slice(0, 6)))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|v=)([^&?/]+)/);
        return match ? match[1] : null;
    };

    const liveId = getYouTubeId(current?.youtube_url);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                :root {
                    --navy:#0D1B2A; --navy2:#1E3A5F; --white:#FFFFFF;
                    --snow:#F5F7FA; --gold:#C9A030; --gold2:#E2B84A;
                    --border:#E2E8F0; --dim:#64748B;
                }
                *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
                body { font-family:'DM Sans',sans-serif; background:var(--snow); color:var(--navy); }

                .page-hero { background:var(--navy); padding:5rem 1.5rem 4rem; text-align:center; }
                .page-hero-tag { font-size:.67rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.75rem; }
                .page-hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,5vw,3.4rem); font-weight:700; color:#fff; margin-bottom:.6rem; }
                .page-hero-sub { font-size:.92rem; color:rgba(255,255,255,.5); max-width:480px; margin:0 auto; }

                /* Live badge */
                .live-badge { display:inline-flex; align-items:center; gap:.45rem; background:rgba(239,68,68,.15); border:1px solid rgba(239,68,68,.3); border-radius:100px; padding:.32rem .85rem; font-size:.68rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#FCA5A5; margin-bottom:1.25rem; }
                .live-pulse { width:6px; height:6px; border-radius:50%; background:#EF4444; animation:blink 1.2s infinite; }
                @shadow-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
                .offline-badge { display:inline-flex; align-items:center; gap:.45rem; background:rgba(100,116,139,.1); border:1px solid rgba(100,116,139,.2); border-radius:100px; padding:.32rem .85rem; font-size:.68rem; font-weight:600; color:var(--dim); margin-bottom:1.25rem; }

                /* Player section */
                .player-section { background:var(--white); padding:3.5rem 1.5rem; }
                .player-inner { max-width:960px; margin:0 auto; }
                .player-head { text-align:center; margin-bottom:2rem; }
                .player-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.6rem,4vw,2.4rem); font-weight:700; color:var(--navy); margin-bottom:.5rem; }
                .player-sub { font-size:.88rem; color:var(--dim); line-height:1.7; max-width:500px; margin:0 auto; }
                .player-wrap { background:var(--navy); border-radius:16px; overflow:hidden; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; box-shadow:0 16px 48px rgba(13,27,42,.2); }
                .player-wrap iframe { width:100%; height:100%; border:none; }
                .player-placeholder { text-align:center; color:rgba(255,255,255,.4); padding:3rem; }
                .player-placeholder-icon { font-size:3.5rem; margin-bottom:1.25rem; }
                .player-placeholder-title { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:700; color:rgba(255,255,255,.6); margin-bottom:.6rem; }
                .player-placeholder-sub { font-size:.86rem; line-height:1.7; }

                /* Upcoming streamed sessions */
                .stream-schedule { padding:3.5rem 1.5rem; }
                .stream-schedule-inner { max-width:960px; margin:0 auto; }
                .sec-head { text-align:center; margin-bottom:2.5rem; }
                .sec-tag { font-size:.67rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.5rem; }
                .sec-title { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,4vw,2.4rem); font-weight:700; color:var(--navy); margin-bottom:.5rem; }
                .sec-sub { font-size:.9rem; color:var(--dim); max-width:480px; margin:0 auto; line-height:1.7; }
                .stream-list { display:flex; flex-direction:column; gap:.75rem; }
                .stream-item { background:var(--white); border:1px solid var(--border); border-radius:12px; padding:1.1rem 1.4rem; display:grid; grid-template-columns:100px 1fr auto; align-items:center; gap:1rem; transition:all .18s; }
                .stream-item:hover { border-color:rgba(13,27,42,.15); box-shadow:0 4px 16px rgba(13,27,42,.07); }
                .stream-time { font-size:.8rem; font-weight:700; color:var(--gold); }
                .stream-date { font-size:.72rem; color:var(--dim); margin-top:1px; }
                .stream-title { font-size:.92rem; font-weight:600; color:var(--navy); }
                .stream-speaker { font-size:.78rem; color:var(--dim); margin-top:2px; }
                .stream-live-tag { display:inline-flex; align-items:center; gap:.3rem; font-size:.65rem; font-weight:600; color:#EF4444; background:rgba(239,68,68,.08); padding:.2rem .55rem; border-radius:4px; }

                /* Replay grid */
                .replay-section { background:var(--white); padding:3.5rem 1.5rem; }
                .replay-inner { max-width:960px; margin:0 auto; }
                .replay-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.25rem; }
                .replay-card { border:1px solid var(--border); border-radius:14px; overflow:hidden; cursor:pointer; transition:all .2s; }
                .replay-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(13,27,42,.1); }
                .replay-thumb { aspect-ratio:16/9; background:var(--navy); position:relative; overflow:hidden; }
                .replay-thumb img { width:100%; height:100%; object-fit:cover; }
                .replay-thumb-ph { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2rem; color:rgba(255,255,255,.3); }
                .replay-overlay { position:absolute; inset:0; background:rgba(13,27,42,.4); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
                .replay-card:hover .replay-overlay { opacity:1; }
                .replay-play-btn { width:48px; height:48px; border-radius:50%; background:rgba(255,255,255,.9); display:flex; align-items:center; justify-content:center; font-size:1.1rem; }
                .replay-body { padding:1rem; background:var(--white); }
                .replay-date { font-size:.72rem; color:var(--gold); font-weight:600; margin-bottom:.3rem; }
                .replay-title { font-size:.9rem; font-weight:600; color:var(--navy); line-height:1.35; }
                .replay-shadow-desc { font-size:.78rem; color:var(--dim); margin-top:.3rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

                .empty-state { text-align:center; padding:3rem 1.5rem; color:var(--dim); font-size:.9rem; }
                .empty-icon { font-size:2.5rem; margin-bottom:.75rem; }

                @media(max-width:640px) {
                    .stream-item { grid-template-columns:80px 1fr; }
                    .stream-live-tag { display:none; }
                }
            `}</style>

            <Navbar />

            {/* Hero */}
            <div className="page-hero">
                <div className="page-hero-tag">Campmeeting 2026</div>
                <h1 className="page-hero-title">Live Stream</h1>
                <p className="page-hero-sub">
                    Watch all services live or catch up on replays anytime, anywhere.
                </p>
            </div>

            {/* Player */}
            <section className="player-section">
                <div className="player-inner">
                    <div className="player-head">
                        {current?.is_live
                            ? <div className="live-badge"><div className="live-pulse" /> We Are Live Now</div>
                            : <div className="offline-badge">● Stream Offline</div>
                        }
                        <h2 className="player-title">{current?.title || 'Campmeeting 2026 Live'}</h2>
                        {current?.description && (
                            <p className="player-sub">{current.description}</p>
                        )}
                    </div>

                    <div className="player-wrap">
                        {liveId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${liveId}?autoplay=${current?.is_live ? 1 : 0}&rel=0`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Campmeeting Live Stream"
                            />
                        ) : (
                            <div className="player-placeholder">
                                <div className="player-placeholder-icon">📺</div>
                                <div className="player-placeholder-title">No Active Stream</div>
                                <p className="player-placeholder-sub">
                                    The live stream will appear here automatically when services begin.
                                    Check the schedule below for upcoming streamed sessions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Upcoming streamed sessions */}
            <section className="stream-schedule">
                <div className="stream-schedule-inner">
                    <div className="sec-head">
                        <div className="sec-tag">What's Coming</div>
                        <h2 className="sec-title">Streamed Sessions</h2>
                        <p className="sec-sub">These sessions will be broadcast live online.</p>
                    </div>

                    {schedule.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📅</div>
                            <p>Programme schedule will be announced soon.</p>
                        </div>
                    ) : (
                        <div className="stream-list">
                            {schedule.map(item => (
                                <div className="stream-item" key={item.id}>
                                    <div>
                                        <div className="stream-time">{item.start_time?.slice(0, 5)}</div>
                                        <div className="stream-date">
                                            {new Date(item.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="stream-title">{item.title}</div>
                                        {item.speaker_name && (
                                            <div className="stream-speaker">{item.speaker_name}</div>
                                        )}
                                    </div>
                                    <div className="stream-live-tag">
                                        <div className="live-pulse" /> Live
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Replays */}
            <section className="replay-section">
                <div className="replay-inner">
                    <div className="sec-head">
                        <div className="sec-tag">Past Services</div>
                        <h2 className="sec-title">Replay Archive</h2>
                        <p className="sec-sub">
                            Missed a service? Watch all recordings below.
                        </p>
                    </div>

                    {replays.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🎬</div>
                            <p>No replays yet. Check back after services begin.</p>
                        </div>
                    ) : (
                        <div className="replay-grid">
                            {replays.map(r => {
                                const ytId = getYouTubeId(r.youtube_url);
                                return (
                                    <div
                                        className="replay-card"
                                        key={r.id}
                                        onClick={() => r.youtube_url && window.open(r.youtube_url, '_blank')}
                                    >
                                        <div className="replay-thumb">
                                            {ytId
                                                ? <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={r.title} />
                                                : <div className="replay-thumb-ph">▶</div>
                                            }
                                            <div className="replay-overlay">
                                                <div className="replay-play-btn">▶</div>
                                            </div>
                                        </div>
                                        <div className="replay-body">
                                            <div className="replay-date">
                                                {r.scheduled_for
                                                    ? new Date(r.scheduled_for).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : ''
                                                }
                                            </div>
                                            <div className="replay-title">{r.title}</div>
                                            {r.description && (
                                                <div className="replay-shadow-desc">{r.description}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}