import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/schedule/')
      .then((res) => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading event schedule:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        :root {
          --navy: #0D1B2A; --navy2: #1E3A5F; --white: #FFFFFF;
          --snow: #F5F7FA; --gold: #C9A030; --border: #E2E8F0;
          --dim: #64748B;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--snow); color: var(--navy); }

        /* Premium Navy Page Hero - Matches your homepage and speakers layouts exactly */
        .page-hero { background: var(--navy); padding: 5rem 1.5rem 4rem; text-align: center; }
        .page-hero-tag { font-size: .67rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); margin-bottom: .75rem; }
        .page-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 700; color: #fff; margin-bottom: .6rem; }
        .page-hero-sub { font-size: .92rem; color: rgba(255,255,255,0.5); max-width: 520px; margin: 0 auto; line-height: 1.6; }

        /* Timeline Layout Layout */
        .schedule-section { padding: 4rem 1.5rem; max-width: 900px; margin: 0 auto; }
        .timeline-container { position: relative; border-left: 2px solid rgba(13, 27, 42, 0.1); margin-left: 1rem; padding-bottom: 1rem; }

        /* Schedule Timeline Row */
        .timeline-item { position: relative; padding-left: 2rem; margin-bottom: 2.5rem; }
        .timeline-item:last-child { margin-bottom: 0; }
        
        /* Interactive Dot Marker */
        .timeline-dot { position: absolute; left: -7px; top: 6px; background: var(--navy); height: 12px; width: 12px; border-radius: 50%; border: 2px solid var(--white); box-shadow: 0 0 0 4px rgba(13, 27, 42, 0.06); transition: all 0.2s ease; }
        .timeline-item:hover .timeline-dot { background: var(--gold); box-shadow: 0 0 0 6px rgba(201, 160, 48, 0.15); }

        /* Dynamic Desktop Floating Date Tag */
        .timeline-date-sidebar { font-size: .75rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 0.4rem; display: block; }

        /* Premium Schedule Cards */
        .schedule-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; box-shadow: 0 4px 24px rgba(13,27,42,.03); transition: all 0.22s ease; }
        .schedule-card:hover { transform: translateX(4px); box-shadow: 0 8px 24px rgba(13,27,42,.08); border-color: rgba(13,27,42,.12); }
        
        .schedule-meta-row { display: flex; flex-direction: column; sm:flex-row sm:items-center justify-between gap: 0.5rem; margin-bottom: 0.5rem; }
        .schedule-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--navy); line-height: 1.2; }
        .schedule-location { font-size: .72rem; font-weight: 600; px: 0.65rem; py: 0.25rem; background: var(--snow); border-radius: 6px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--navy); border: 1px solid var(--border); align-self: flex-start; sm:align-self: auto; }
        .schedule-time { font-size: .8rem; font-weight: 600; color: var(--dim); display: flex; align-items: center; gap: 0.4rem; }
        .schedule-desc { font-size: .88rem; color: var(--dim); line-height: 1.6; margin-top: 1rem; border-top: 1px dashed var(--border); padding-top: 0.9rem; }

        /* Status Panels */
        .status-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 3rem 2rem; text-align: center; max-width: 440px; margin: 0 auto; box-shadow: 0 4px 24px rgba(13,27,42,.04); }
        .status-icon { font-size: 2.2rem; margin-bottom: 0.75rem; display: block; }
        .status-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--navy); margin-bottom: 0.4rem; }
        .status-text { font-size: .86rem; color: var(--dim); line-height: 1.6; }

        .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--navy); border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Navbar />

      {/* Synchronized Theme Hero Header */}
      <div className="page-hero">
        <div className="page-hero-tag">Campmeeting 2026</div>
        <h1 className="page-hero-title">Programme Timeline</h1>
        <p className="page-hero-sub">
          Plan your attendance around our systematically arranged timeline of events and services.
        </p>
      </div>

      <section className="schedule-section">
        {loading ? (
          <div className="status-card">
            <div className="spinner" />
            <div className="status-title">Loading Itinerary</div>
            <p className="status-text">Fetching live programmed sessions from our server records...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="status-card">
            <span className="status-icon">📅</span>
            <div className="status-title">Timeline Empty</div>
            <p className="status-text">The official convention agenda hasn't been mapped to the timeline database yet.</p>
          </div>
        ) : (
          <div className="timeline-container">
            {sessions.map((session) => (
              <div key={session.id} className="timeline-item">
                
                {/* Visual Timeline Nodes */}
                <div className="timeline-dot" />
                
                {/* Event Wrapper */}
                <div className="schedule-card">
                  <div className="timeline-date-sidebar">
                    {formatDate(session.start_time)}
                  </div>
                  
                  <div className="schedule-meta-row">
                    <h3 className="schedule-title">{session.title}</h3>
                    <span className="schedule-location">
                      {session.location || 'Main Auditorium'}
                    </span>
                  </div>
                  
                  <div className="schedule-time">
                    🕒 {new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(session.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  
                  {session.description && (
                    <p className="schedule-desc">{session.description}</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Schedule;