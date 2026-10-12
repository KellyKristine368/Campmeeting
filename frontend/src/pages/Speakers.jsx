import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/speakers/')
      .then((res) => {
        setSpeakers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching guest speakers:", err);
        setLoading(false);
      });
  }, []);

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

        /* Elegant Navy Page Hero - Matches your homepage and contact layout precisely */
        .page-hero { background: var(--navy); padding: 5rem 1.5rem 4rem; text-align: center; }
        .page-hero-tag { font-size: .67rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); margin-bottom: .75rem; }
        .page-hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 700; color: #fff; margin-bottom: .6rem; }
        .page-hero-sub { font-size: .92rem; color: rgba(255,255,255,0.5); max-width: 520px; margin: 0 auto; line-height: 1.6; }

        /* Speakers Grid Container */
        .speakers-section { padding: 4rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .speakers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 2rem; }

        /* Premium Speaker Card Component */
        .speaker-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 24px rgba(13,27,42,.04); transition: all 0.2s ease; }
        .speaker-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(13,27,42,.1); border-color: rgba(13,27,42,.15); }

        .speaker-img-container { aspect-ratio: 4/3; background: #F8FAFC; width: 100%; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }
        .speaker-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .speaker-card:hover .speaker-img { transform: scale(1.02); }

        /* Styled Fallback Avatar for a clean professional aesthetic */
        .speaker-avatar-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1E3A5F 0%, #0D1B2A 100%); color: var(--gold); font-family: 'Cormorant Garamond', serif; font-size: 3.5rem; font-weight: 700; }

        .speaker-content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .speaker-name { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--navy); line-height: 1.2; }
        .speaker-ministry { font-size: .7rem; font-weight: 600; color: var(--gold); text-transform: uppercase; letter-spacing: .08em; margin-top: 0.35rem; display: inline-block; }
        .speaker-bio { font-size: .86rem; color: var(--dim); line-height: 1.6; margin-top: 0.85rem; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

        /* Empty/Loading States */
        .status-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 3rem 2rem; text-align: center; max-width: 440px; margin: 0 auto; box-shadow: 0 4px 24px rgba(13,27,42,.04); }
        .status-icon { font-size: 2.2rem; margin-bottom: 0.75rem; display: block; }
        .status-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--navy); margin-bottom: 0.4rem; }
        .status-text { font-size: .86rem; color: var(--dim); line-height: 1.6; }

        .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--navy); border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Navbar />

      {/* Matching Premium Hero Header */}
      <div className="page-hero">
        <div className="page-hero-tag">Campmeeting 2026</div>
        <h1 className="page-hero-title">Anointed Speakers</h1>
        <p className="page-hero-sub">
          Meet the guest ministers, keynote lecturers, and session coordinators joining us for this year's convocation.
        </p>
      </div>

      <section className="speakers-section">
        {loading ? (
          <div className="status-card">
            <div className="spinner" />
            <div className="status-title">Loading Speakers</div>
            <p className="status-text">Syncing speaker profiles securely from the database...</p>
          </div>
        ) : speakers.length === 0 ? (
          <div className="status-card">
            <span className="status-icon">🎙️</span>
            <div className="status-title">No Profiles Found</div>
            <p className="status-text">Guest speaker records haven't been published to the administrative dashboard yet.</p>
          </div>
        ) : (
          <div className="speakers-grid">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="speaker-card">
                
                {/* Profile Image / Fallback Avatar */}
                <div className="speaker-img-container">
                  {speaker.image ? (
                    <img 
                      src={speaker.image} 
                      alt={speaker.name}
                      className="speaker-img"
                    />
                  ) : (
                    <div className="speaker-avatar-ph">
                      {speaker.name ? speaker.name.charAt(0).toUpperCase() : '🎙️'}
                    </div>
                  )}
                </div>

                {/* Speaker Metadata */}
                <div className="speaker-content">
                  <div>
                    <h3 className="speaker-name">{speaker.name}</h3>
                    {speaker.ministry && (
                      <span className="speaker-ministry">
                        {speaker.ministry}
                      </span>
                    )}
                    {speaker.bio && (
                      <p className="speaker-bio">
                        {speaker.bio}
                      </p>
                    )}
                  </div>
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

export default Speakers;