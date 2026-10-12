import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import useAuth from '../hooks/useAuth';

export default function Profile() {
    const [profile,   setProfile]   = useState(null);
    const [reg,       setReg]       = useState(null);
    const [loading,   setLoading]   = useState(true);
    const [editing,   setEditing]   = useState(false);
    const [form,      setForm]      = useState({ first_name: '', last_name: '', phone_number: '' });
    const [saving,    setSaving]    = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveDone,  setSaveDone]  = useState(false);

    // Password change
    const [showPwForm,   setShowPwForm]   = useState(false);
    const [pwForm,       setPwForm]       = useState({ old_password: '', new_password: '', new_password2: '' });
    const [pwErrors,     setPwErrors]     = useState({});
    const [pwLoading,    setPwLoading]    = useState(false);
    const [pwDone,       setPwDone]       = useState(false);

    const { logout } = useAuth();
    const navigate   = useNavigate();

    useEffect(() => {
        Promise.all([
            API.get('auth/profile/'),
            API.get('registrations/my/').catch(() => ({ data: null })),
        ]).then(([pRes, rRes]) => {
            setProfile(pRes.data);
            setForm({
                first_name:   pRes.data.first_name  || '',
                last_name:    pRes.data.last_name   || '',
                phone_number: pRes.data.phone_number || '',
            });
            setReg(rRes.data);
        }).catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const handleFormChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSaveError('');
        setSaveDone(false);
    };

    const handleSave = async e => {
        e.preventDefault();
        setSaving(true);
        setSaveError('');
        try {
            const r = await API.patch('auth/profile/', form);
            setProfile(r.data);
            setEditing(false);
            setSaveDone(true);
            setTimeout(() => setSaveDone(false), 3000);
        } catch (err) {
            setSaveError(err.response?.data?.message || 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handlePwChange = e => {
        setPwForm({ ...pwForm, [e.target.name]: e.target.value });
        setPwErrors({ ...pwErrors, [e.target.name]: '' });
    };

    const handlePwSubmit = async e => {
        e.preventDefault();
        const errs = {};
        if (!pwForm.old_password)  errs.old_password  = 'Current password is required.';
        if (!pwForm.new_password)  errs.new_password  = 'New password is required.';
        else if (pwForm.new_password.length < 8) errs.new_password = 'At least 8 characters.';
        if (pwForm.new_password !== pwForm.new_password2) errs.new_password2 = 'Passwords do not match.';
        if (Object.keys(errs).length) { setPwErrors(errs); return; }

        setPwLoading(true);
        try {
            await API.post('auth/change-password/', pwForm);
            setPwDone(true);
            setPwForm({ old_password: '', new_password: '', new_password2: '' });
            setTimeout(() => { setPwDone(false); setShowPwForm(false); }, 3000);
        } catch (err) {
            setPwErrors({ old_password: err.response?.data?.message || 'Incorrect password.' });
        } finally {
            setPwLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const statusStyle = {
        confirmed: { bg: 'rgba(22,163,74,.1)',   color: '#16A34A' },
        pending:   { bg: 'rgba(217,119,6,.1)',   color: '#D97706' },
        cancelled: { bg: 'rgba(220,38,38,.1)',   color: '#DC2626' },
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                    Loading your profile...
                </div>
                <Footer />
            </>
        );
    }

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

                .page-hero { background:var(--navy); padding:4rem 1.5rem 3rem; }
                .page-hero-inner { max-width:900px; margin:0 auto; display:flex; align-items:center; gap:1.5rem; }
                .profile-avatar { width:72px; height:72px; border-radius:50%; background:rgba(201,160,48,.2); border:3px solid rgba(201,160,48,.4); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:700; color:var(--gold2,#E2B84A); flex-shrink:0; }
                .page-hero-text {}
                .page-hero-name { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:700; color:#fff; line-height:1.1; }
                .page-hero-email { font-size:.84rem; color:rgba(255,255,255,.5); margin-top:.2rem; }
                .verified-pill { display:inline-flex; align-items:center; gap:.3rem; font-size:.7rem; font-weight:600; padding:.2rem .65rem; border-radius:100px; margin-top:.4rem; }
                .verified-pill.yes { background:rgba(22,163,74,.2); color:#4ADE80; }
                .verified-pill.no  { background:rgba(217,119,6,.2);  color:#FCD34D; }

                /* Layout */
                .profile-wrap { padding:2.5rem 1.5rem 4rem; }
                .profile-inner { max-width:900px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem; }

                /* Cards */
                .p-card { background:var(--white); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
                .p-card-head { display:flex; align-items:center; justify-content:space-between; padding:1.4rem 1.75rem; border-bottom:1px solid var(--border); }
                .p-card-title { font-family:'Cormorant Garamond',serif; font-size:1.25rem; font-weight:700; color:var(--navy); }
                .p-card-body { padding:1.75rem; }
                .p-edit-btn { background:var(--snow); border:1.5px solid var(--border); border-radius:7px; padding:.38rem .9rem; font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:500; color:var(--navy); cursor:pointer; transition:all .15s; }
                .p-edit-btn:hover { border-color:var(--navy); }

                /* Profile field grid */
                .p-field-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
                .p-field-label { font-size:.68rem; font-weight:600; color:var(--dim); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.3rem; }
                .p-field-val { font-size:.92rem; color:var(--navy); font-weight:500; }

                /* Edit form */
                .form-row { display:grid; grid-template-columns:1fr 1fr; gap:.85rem; }
                .form-field { margin-bottom:.9rem; }
                .form-label { display:block; font-size:.78rem; font-weight:600; color:var(--navy); margin-bottom:.38rem; }
                .form-input { width:100%; padding:.68rem .95rem; border:1.5px solid var(--border); border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.88rem; color:var(--navy); outline:none; transition:all .16s; }
                .form-input:focus { border-color:var(--navy); box-shadow:0 0 0 3px rgba(13,27,42,.07); }
                .form-input.error { border-color:var(--red); }
                .field-error { font-size:.73rem; color:var(--red); margin-top:.28rem; }

                .save-row { display:flex; align-items:center; gap:.75rem; margin-top:.5rem; }
                .btn-save { background:var(--navy); color:#fff; border:none; padding:.65rem 1.5rem; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.86rem; font-weight:600; cursor:pointer; transition:all .16s; }
                .btn-save:hover { background:var(--navy2); }
                .btn-save:disabled { opacity:.65; cursor:not-allowed; }
                .btn-cancel { background:none; border:1.5px solid var(--border); color:var(--navy); padding:.65rem 1.1rem; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.86rem; cursor:pointer; transition:all .15s; }
                .btn-cancel:hover { border-color:var(--navy); }
                .save-success { font-size:.82rem; color:var(--green); font-weight:500; }
                .save-error { font-size:.82rem; color:var(--red); }

                /* Password change */
                .pw-toggle { background:none; border:none; font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:600; color:var(--navy); cursor:pointer; text-decoration:underline; padding:0; }
                .pw-form { margin-top:1.25rem; padding-top:1.25rem; border-top:1px solid var(--border); }
                .pw-success { background:rgba(22,163,74,.08); border:1px solid rgba(22,163,74,.2); border-radius:8px; padding:.7rem 1rem; font-size:.84rem; color:var(--green); margin-bottom:1rem; }

                /* Registration card */
                .reg-status { display:inline-flex; align-items:center; gap:.35rem; font-size:.78rem; font-weight:700; padding:.28rem .8rem; border-radius:100px; }
                .reg-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.1rem; margin-top:1.25rem; }
                .reg-field-label { font-size:.68rem; font-weight:600; color:var(--dim); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.25rem; }
                .reg-field-val { font-size:.9rem; color:var(--navy); font-weight:500; }

                .no-reg { text-align:center; padding:2.5rem 1.5rem; }
                .no-reg-icon { font-size:2.5rem; margin-bottom:.75rem; }
                .no-reg-title { font-family:'Cormorant Garamond',serif; font-size:1.35rem; font-weight:700; color:var(--navy); margin-bottom:.5rem; }
                .no-reg-text { font-size:.86rem; color:var(--dim); line-height:1.7; margin-bottom:1.5rem; }
                .no-reg-btn { display:inline-block; background:var(--navy); color:#fff; padding:.7rem 1.75rem; border-radius:9px; font-size:.86rem; font-weight:600; text-decoration:none; transition:all .16s; }
                .no-reg-btn:hover { background:var(--navy2); transform:translateY(-1px); }

                /* Danger zone */
                .danger-zone { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; }
                .danger-text {}
                .danger-title { font-size:.9rem; font-weight:600; color:var(--navy); margin-bottom:.2rem; }
                .danger-desc { font-size:.8rem; color:var(--dim); }
                .btn-logout { background:none; border:1.5px solid #FECACA; color:var(--red); padding:.6rem 1.25rem; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:.84rem; font-weight:600; cursor:pointer; transition:all .16s; }
                .btn-logout:hover { background:#FEF2F2; border-color:var(--red); }

                .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
                @keyframes spin { to { transform:rotate(360deg); } }

                @media(max-width:640px) {
                    .p-field-grid, .form-row, .reg-grid { grid-template-columns:1fr; }
                    .page-hero-inner { flex-direction:column; text-align:center; }
                }
            `}</style>

            <Navbar />

            {/* Hero */}
            <div className="page-hero">
                <div className="page-hero-inner">
                    <div className="profile-avatar">
                        {profile?.first_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="page-hero-text">
                        <div className="page-hero-name">
                            {profile?.first_name} {profile?.last_name}
                        </div>
                        <div className="page-hero-email">{profile?.email}</div>
                        <div className={`verified-pill ${profile?.is_verified ? 'yes' : 'no'}`}>
                            {profile?.is_verified ? '✓ Verified' : '⚠ Not Verified'}
                        </div>
                    </div>
                </div>
            </div>

            <section className="profile-wrap">
                <div className="profile-inner">

                    {/* ── Personal Info card ── */}
                    <div className="p-card">
                        <div className="p-card-head">
                            <div className="p-card-title">Personal Information</div>
                            {!editing && (
                                <button className="p-edit-btn" onClick={() => setEditing(true)}>
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className="p-card-body">
                            {editing ? (
                                <form onSubmit={handleSave}>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label className="form-label">First Name</label>
                                            <input
                                                name="first_name"
                                                type="text"
                                                className="form-input"
                                                value={form.first_name}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                name="last_name"
                                                type="text"
                                                className="form-input"
                                                value={form.last_name}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            name="phone_number"
                                            type="tel"
                                            className="form-input"
                                            value={form.phone_number}
                                            onChange={handleFormChange}
                                            placeholder="0241234567"
                                        />
                                    </div>
                                    {saveError && <div style={{ fontSize: '.82rem', color: 'var(--red)', marginBottom: '.75rem' }}>{saveError}</div>}
                                    <div className="save-row">
                                        <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
                                        <button type="submit" className="btn-save" disabled={saving}>
                                            {saving ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {saveDone && (
                                        <div style={{ fontSize: '.82rem', color: 'var(--green)', marginBottom: '1rem', fontWeight: 600 }}>
                                            ✓ Profile updated successfully.
                                        </div>
                                    )}
                                    <div className="p-field-grid">
                                        <div>
                                            <div className="p-field-label">First Name</div>
                                            <div className="p-field-val">{profile?.first_name || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="p-field-label">Last Name</div>
                                            <div className="p-field-val">{profile?.last_name || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="p-field-label">Email</div>
                                            <div className="p-field-val">{profile?.email}</div>
                                        </div>
                                        <div>
                                            <div className="p-field-label">Phone</div>
                                            <div className="p-field-val">{profile?.phone_number || '—'}</div>
                                        </div>
                                        <div>
                                            <div className="p-field-label">Member Since</div>
                                            <div className="p-field-val">
                                                {profile?.date_joined
                                                    ? new Date(profile.date_joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : '—'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Registration card ── */}
                    <div className="p-card">
                        <div className="p-card-head">
                            <div className="p-card-title">My Registration</div>
                            {reg && (
                                <div
                                    className="reg-status"
                                    style={{
                                        background: statusStyle[reg.status]?.bg,
                                        color: statusStyle[reg.status]?.color,
                                    }}
                                >
                                    {reg.status?.charAt(0).toUpperCase() + reg.status?.slice(1)}
                                </div>
                            )}
                        </div>
                        <div className="p-card-body">
                            {reg ? (
                                <>
                                    <div style={{ fontSize: '.8rem', color: 'var(--dim)' }}>
                                        Registered on {new Date(reg.registered_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="reg-grid">
                                        {[
                                            ['Full Name',     reg.full_name],
                                            ['Phone',        reg.phone],
                                            ['Conference',   reg.conference_name],
                                            ['District',     reg.district_name],
                                            ['Local Church', reg.local_church_name],
                                            ['Church Role',  reg.church_role || '—'],
                                            ['SDA Member',   reg.is_church_member ? 'Yes' : 'No'],
                                            ['Accommodation',reg.needs_accommodation ? 'Yes' : 'No'],
                                        ].map(([label, val]) => (
                                            <div key={label}>
                                                <div className="reg-field-label">{label}</div>
                                                <div className="reg-field-val">{val || '—'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="no-reg">
                                    <div className="no-reg-icon">📋</div>
                                    <div className="no-reg-title">Not Registered Yet</div>
                                    <p className="no-reg-text">
                                        You haven't completed your campmeeting registration.
                                        Register now to secure your spot!
                                    </p>
                                    <Link to="/registration" className="no-reg-btn">
                                        Register for Campmeeting 2026
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Security card ── */}
                    <div className="p-card">
                        <div className="p-card-head">
                            <div className="p-card-title">Security</div>
                        </div>
                        <div className="p-card-body">
                            <button className="pw-toggle" onClick={() => setShowPwForm(!showPwForm)}>
                                {showPwForm ? 'Cancel' : 'Change Password'}
                            </button>

                            {showPwForm && (
                                <div className="pw-form">
                                    {pwDone && (
                                        <div className="pw-success">✓ Password changed successfully.</div>
                                    )}
                                    <form onSubmit={handlePwSubmit}>
                                        <div className="form-field">
                                            <label className="form-label">Current Password</label>
                                            <input
                                                name="old_password"
                                                type="password"
                                                className={`form-input ${pwErrors.old_password ? 'error' : ''}`}
                                                value={pwForm.old_password}
                                                onChange={handlePwChange}
                                            />
                                            {pwErrors.old_password && <div className="field-error">{pwErrors.old_password}</div>}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-field">
                                                <label className="form-label">New Password</label>
                                                <input
                                                    name="new_password"
                                                    type="password"
                                                    className={`form-input ${pwErrors.new_password ? 'error' : ''}`}
                                                    value={pwForm.new_password}
                                                    onChange={handlePwChange}
                                                    placeholder="Min. 8 characters"
                                                />
                                                {pwErrors.new_password && <div className="field-error">{pwErrors.new_password}</div>}
                                            </div>
                                            <div className="form-field">
                                                <label className="form-label">Confirm New Password</label>
                                                <input
                                                    name="new_password2"
                                                    type="password"
                                                    className={`form-input ${pwErrors.new_password2 ? 'error' : ''}`}
                                                    value={pwForm.new_password2}
                                                    onChange={handlePwChange}
                                                />
                                                {pwErrors.new_password2 && <div className="field-error">{pwErrors.new_password2}</div>}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-save" disabled={pwLoading}>
                                            {pwLoading ? <><span className="spinner" /> Changing...</> : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Danger zone ── */}
                    <div className="p-card">
                        <div className="p-card-head">
                            <div className="p-card-title">Account</div>
                        </div>
                        <div className="p-card-body">
                            <div className="danger-zone">
                                <div className="danger-text">
                                    <div className="danger-title">Sign Out</div>
                                    <div className="danger-desc">
                                        You will be logged out of your account on this device.
                                    </div>
                                </div>
                                <button className="btn-logout" onClick={handleLogout}>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}