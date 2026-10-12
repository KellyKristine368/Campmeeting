import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../api';
import useAuth from '../hooks/useAuth';

export default function Accommodation() {
    const [items,      setItems]      = useState([]);
    const [filtered,   setFiltered]   = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [filter,     setFilter]     = useState('all');
    const [booking,    setBooking]    = useState(null);
    const [form,       setForm]       = useState({ check_in_date: '', check_out_date: '' });
    const [errors,     setErrors]     = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [bookError,  setBookError]  = useState('');
    const [bookDone,   setBookDone]   = useState(false);
    const [nights,     setNights]     = useState(0);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        API.get('accommodation/')
            .then(r => {
                const data = r.data.results || r.data;
                setItems(data);
                setFiltered(data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Filter by type
    useEffect(() => {
        if (filter === 'all') { setFiltered(items); return; }
        setFiltered(items.filter(i => i.accommodation_type === filter));
    }, [filter, items]);

    // Calculate nights whenever dates change
    useEffect(() => {
        if (form.check_in_date && form.check_out_date) {
            const diff =
                (new Date(form.check_out_date) - new Date(form.check_in_date)) / 86400000;
            setNights(diff > 0 ? diff : 0);
        } else {
            setNights(0);
        }
    }, [form.check_in_date, form.check_out_date]);

    const handleFormChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setBookError('');
    };

    const openBooking = acc => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/accommodation' } } });
            return;
        }
        setBooking(acc);
        setForm({ check_in_date: '', check_out_date: '' });
        setErrors({});
        setBookError('');
        setBookDone(false);
        setNights(0);
        document.body.style.overflow = 'hidden';
    };

    const closeBooking = () => {
        setBooking(null);
        document.body.style.overflow = '';
    };

    const validateBooking = () => {
        const e = {};
        if (!form.check_in_date)  e.check_in_date  = 'Check-in date is required.';
        if (!form.check_out_date) e.check_out_date = 'Check-out date is required.';
        if (form.check_in_date && form.check_out_date) {
            if (new Date(form.check_out_date) <= new Date(form.check_in_date)) {
                e.check_out_date = 'Check-out must be after check-in.';
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleBookSubmit = async e => {
        e.preventDefault();
        if (!validateBooking()) return;
        setSubmitting(true);
        setBookError('');
        try {
            await API.post('accommodation/bookings/', {
                accommodation:  booking.id,
                check_in_date:  form.check_in_date,
                check_out_date: form.check_out_date,
            });
            setBookDone(true);
        } catch (err) {
            setBookError(
                err.response?.data?.message ||
                'Booking failed. Please try again.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const total =
        booking && nights > 0
            ? (parseFloat(booking.price_per_night) * nights).toFixed(2)
            : null;

    const FILTERS = [
        { key: 'all',     label: 'All Options'        },
        { key: 'onsite',  label: 'On-Site'            },
        { key: 'offsite', label: 'Off-Site / Hotels'  },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                :root {
                    --navy:#0D1B2A; --navy2:#1E3A5F; --white:#FFFFFF;
                    --snow:#F5F7FA; --gold:#C9A030; --gold2:#E2B84A;
                    --border:#E2E8F0; --dim:#64748B; --red:#DC2626; --green:#16A34A;
                }
                *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
                body { font-family:'DM Sans',sans-serif; background:var(--snow); color:var(--navy); }

                /* ── Hero ── */
                .page-hero {
                    background:var(--navy);
                    padding:5rem 1.5rem 4rem;
                    text-align:center;
                    position:relative; overflow:hidden;
                }
                .page-hero::before {
                    content:''; position:absolute;
                    top:-100px; right:-100px;
                    width:500px; height:500px; border-radius:50%;
                    background:radial-gradient(circle,rgba(201,160,48,.06) 0%,transparent 70%);
                    pointer-events:none;
                }
                .page-hero-tag {
                    font-size:.67rem; font-weight:600; letter-spacing:.16em;
                    text-transform:uppercase; color:var(--gold); margin-bottom:.75rem;
                    position:relative; z-index:1;
                }
                .page-hero-title {
                    font-family:'Cormorant Garamond',serif;
                    font-size:clamp(2.4rem,6vw,3.8rem);
                    font-weight:700; color:#fff; margin-bottom:.65rem;
                    line-height:1.05; position:relative; z-index:1;
                }
                .page-hero-sub {
                    font-size:.95rem; color:rgba(255,255,255,.5);
                    max-width:480px; margin:0 auto; line-height:1.75;
                    position:relative; z-index:1;
                }

                /* ── Filter bar ── */
                .filter-bar {
                    background:var(--white);
                    border-bottom:1px solid var(--border);
                    padding:1rem 1.5rem;
                    position:sticky; top:70px; z-index:100;
                }
                .filter-bar-inner {
                    max-width:1280px; margin:0 auto;
                    display:flex; align-items:center;
                    justify-content:space-between; flex-wrap:wrap; gap:.75rem;
                }
                .filter-btns { display:flex; gap:.5rem; flex-wrap:wrap; }
                .filter-btn {
                    font-family:'DM Sans',sans-serif;
                    font-size:.78rem; font-weight:500;
                    padding:.38rem 1rem; border-radius:100px;
                    border:1.5px solid var(--border);
                    background:none; cursor:pointer; color:var(--dim);
                    transition:all .15s;
                }
                .filter-btn:hover { border-color:var(--navy); color:var(--navy); }
                .filter-btn.active { background:var(--navy); color:#fff; border-color:var(--navy); }
                .filter-count { font-size:.8rem; color:var(--dim); font-weight:500; }

                /* ── Grid ── */
                .acc-section { padding:3rem 1.5rem 5rem; }
                .acc-inner { max-width:1280px; margin:0 auto; }
                .acc-grid {
                    display:grid;
                    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
                    gap:1.5rem;
                }

                /* ── Card ── */
                .acc-card {
                    background:var(--white);
                    border:1px solid var(--border);
                    border-radius:16px; overflow:hidden;
                    transition:all .25s ease;
                    display:flex; flex-direction:column;
                }
                .acc-card:hover {
                    transform:translateY(-5px);
                    box-shadow:0 18px 48px rgba(13,27,42,.11);
                    border-color:rgba(13,27,42,.12);
                }
                .acc-card.unavailable { opacity:.55; pointer-events:none; }

                .acc-img {
                    height:210px; overflow:hidden;
                    background:linear-gradient(135deg,var(--snow),#e8edf2);
                    position:relative;
                }
                .acc-img img {
                    width:100%; height:100%; object-fit:cover;
                    transition:transform .45s ease;
                }
                .acc-card:hover .acc-img img { transform:scale(1.05); }
                .acc-img-ph {
                    width:100%; height:100%;
                    display:flex; align-items:center; justify-content:center;
                    font-size:3rem;
                }
                .acc-avail-badge {
                    position:absolute; top:.85rem; right:.85rem;
                    font-size:.65rem; font-weight:700;
                    padding:.22rem .65rem; border-radius:100px;
                    letter-spacing:.04em; text-transform:uppercase;
                }
                .acc-avail-badge.available {
                    background:rgba(22,163,74,.9); color:#fff;
                }
                .acc-avail-badge.full {
                    background:rgba(220,38,38,.85); color:#fff;
                }

                .acc-body { padding:1.5rem; flex:1; display:flex; flex-direction:column; }
                .acc-type-badge {
                    display:inline-block; font-size:.6rem; font-weight:600;
                    letter-spacing:.1em; text-transform:uppercase;
                    color:var(--gold); background:rgba(201,160,48,.1);
                    border-radius:4px; padding:.2rem .55rem; margin-bottom:.55rem;
                }
                .acc-name {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.3rem; font-weight:700; color:var(--navy);
                    margin-bottom:.4rem; line-height:1.2;
                }
                .acc-desc {
                    font-size:.82rem; color:var(--dim); line-height:1.65;
                    margin-bottom:.9rem; flex:1;
                    display:-webkit-box; -webkit-line-clamp:3;
                    -webkit-box-orient:vertical; overflow:hidden;
                }
                .acc-amenities {
                    display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:1.1rem;
                }
                .acc-amenity {
                    font-size:.68rem; background:var(--snow); color:var(--dim);
                    border-radius:4px; padding:.2rem .55rem;
                    border:1px solid var(--border);
                }
                .acc-capacity {
                    font-size:.75rem; color:var(--dim);
                    margin-bottom:.9rem;
                    display:flex; align-items:center; gap:.4rem;
                }
                .acc-capacity-icon {
                    width:16px; height:16px; opacity:.5;
                }

                .acc-footer {
                    display:flex; align-items:center;
                    justify-content:space-between;
                    padding-top:1rem; border-top:1px solid var(--border);
                    gap:.75rem;
                }
                .acc-price {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.4rem; font-weight:700; color:var(--navy);
                    line-height:1;
                }
                .acc-price-unit {
                    font-family:'DM Sans',sans-serif;
                    font-size:.72rem; font-weight:400; color:var(--dim);
                    margin-left:2px;
                }
                .acc-book-btn {
                    background:var(--navy); color:#fff; border:none;
                    padding:.58rem 1.35rem; border-radius:8px;
                    font-family:'DM Sans',sans-serif; font-size:.82rem;
                    font-weight:600; cursor:pointer; transition:all .18s;
                    white-space:nowrap;
                }
                .acc-book-btn:hover {
                    background:var(--navy2); transform:translateY(-1px);
                    box-shadow:0 4px 14px rgba(13,27,42,.22);
                }

                /* ── Skeleton ── */
                .skeleton {
                    background:linear-gradient(90deg,#e8edf2 25%,#f0f4f8 50%,#e8edf2 75%);
                    background-size:200% 100%;
                    animation:shimmer 1.4s infinite;
                }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .sk-card { background:var(--white); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
                .sk-img { height:210px; }
                .sk-body { padding:1.5rem; display:flex; flex-direction:column; gap:.55rem; }
                .sk-line { height:11px; border-radius:6px; }

                /* ── Empty state ── */
                .empty-state {
                    text-align:center; padding:5rem 1.5rem; color:var(--dim);
                }
                .empty-icon { font-size:3rem; margin-bottom:1rem; }
                .empty-title {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.6rem; font-weight:700; color:var(--navy); margin-bottom:.5rem;
                }
                .empty-text { font-size:.9rem; line-height:1.7; }

                /* ── Booking modal ── */
                .modal-overlay {
                    position:fixed; inset:0;
                    background:rgba(13,27,42,.6);
                    backdrop-filter:blur(6px);
                    -webkit-backdrop-filter:blur(6px);
                    z-index:2000;
                    display:flex; align-items:center; justify-content:center;
                    padding:1.5rem;
                    animation:fadeIn .2s ease;
                }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                .modal {
                    background:var(--white); border-radius:20px;
                    max-width:500px; width:100%; max-height:90vh;
                    overflow-y:auto;
                    animation:slideUp .22s cubic-bezier(.4,0,.2,1);
                }
                @keyframes slideUp {
                    from{opacity:0;transform:translateY(14px) scale(.98)}
                    to{opacity:1;transform:translateY(0) scale(1)}
                }
                .modal-header {
                    padding:1.75rem 1.75rem 0;
                    display:flex; align-items:flex-start;
                    justify-content:space-between; gap:1rem;
                }
                .modal-header-left {}
                .modal-tag {
                    font-size:.62rem; font-weight:600; letter-spacing:.12em;
                    text-transform:uppercase; color:var(--gold); margin-bottom:.35rem;
                }
                .modal-title {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.6rem; font-weight:700; color:var(--navy); line-height:1.1;
                }
                .modal-close {
                    width:34px; height:34px; border-radius:8px;
                    background:var(--snow); border:1.5px solid var(--border);
                    display:flex; align-items:center; justify-content:center;
                    font-size:.9rem; cursor:pointer; flex-shrink:0;
                    transition:border-color .15s;
                }
                .modal-close:hover { border-color:var(--navy); }
                .modal-body { padding:1.5rem 1.75rem 2rem; }

                /* Price summary row */
                .modal-price-row {
                    display:flex; align-items:center; justify-content:space-between;
                    background:var(--snow); border:1px solid var(--border);
                    border-radius:10px; padding:.85rem 1.1rem;
                    margin-bottom:1.25rem;
                }
                .modal-price-label { font-size:.82rem; color:var(--dim); font-weight:500; }
                .modal-price-val {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.25rem; font-weight:700; color:var(--navy);
                }

                /* Form fields */
                .form-row { display:grid; grid-template-columns:1fr 1fr; gap:.85rem; }
                .form-field { margin-bottom:.85rem; }
                .form-label {
                    display:block; font-size:.78rem; font-weight:600;
                    color:var(--navy); margin-bottom:.38rem;
                }
                .form-input {
                    width:100%; padding:.7rem .95rem;
                    border:1.5px solid var(--border); border-radius:8px;
                    font-family:'DM Sans',sans-serif; font-size:.88rem;
                    color:var(--navy); outline:none; transition:all .16s;
                }
                .form-input:focus {
                    border-color:var(--navy);
                    box-shadow:0 0 0 3px rgba(13,27,42,.07);
                }
                .form-input.error { border-color:var(--red); }
                .field-error { font-size:.73rem; color:var(--red); margin-top:.28rem; }

                /* Total calculation */
                .booking-total {
                    display:flex; align-items:center; justify-content:space-between;
                    background:rgba(13,27,42,.04); border:1px solid var(--border);
                    border-radius:10px; padding:.9rem 1.1rem;
                    margin:.75rem 0 1.25rem;
                }
                .booking-total-label { font-size:.84rem; color:var(--dim); }
                .booking-total-amount {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.5rem; font-weight:700; color:var(--navy);
                }

                /* Error */
                .book-error {
                    background:#FEF2F2; border:1px solid #FECACA;
                    border-radius:8px; padding:.7rem .95rem;
                    font-size:.83rem; color:var(--red);
                    margin-bottom:1rem;
                    display:flex; gap:.4rem; align-items:flex-start;
                }

                /* Submit button */
                .modal-submit {
                    width:100%; padding:.82rem;
                    background:var(--navy); color:#fff; border:none;
                    border-radius:9px; font-family:'DM Sans',sans-serif;
                    font-size:.9rem; font-weight:600; cursor:pointer;
                    transition:all .18s;
                    display:flex; align-items:center; justify-content:center; gap:.45rem;
                }
                .modal-submit:hover:not(:disabled) {
                    background:var(--navy2); transform:translateY(-1px);
                    box-shadow:0 4px 16px rgba(13,27,42,.22);
                }
                .modal-submit:disabled { opacity:.65; cursor:not-allowed; }
                .spinner {
                    width:15px; height:15px;
                    border:2px solid rgba(255,255,255,.3);
                    border-top-color:#fff; border-radius:50%;
                    animation:spin .7s linear infinite;
                }
                @keyframes spin { to{transform:rotate(360deg)} }

                /* Booking success */
                .book-success {
                    text-align:center; padding:1.5rem 0;
                }
                .book-success-icon {
                    width:68px; height:68px; border-radius:50%;
                    background:#F0FDF4; border:2px solid #BBF7D0;
                    display:flex; align-items:center; justify-content:center;
                    font-size:1.9rem; margin:0 auto 1.25rem;
                }
                .book-success-title {
                    font-family:'Cormorant Garamond',serif;
                    font-size:1.7rem; font-weight:700; color:var(--navy);
                    margin-bottom:.6rem;
                }
                .book-success-text {
                    font-size:.88rem; color:var(--dim);
                    line-height:1.75; margin-bottom:1.5rem;
                }
                .book-success-btn {
                    display:inline-block; background:var(--navy); color:#fff;
                    padding:.7rem 1.75rem; border-radius:8px;
                    font-size:.88rem; font-weight:600; text-decoration:none;
                    transition:all .16s; margin:.3rem;
                }
                .book-success-btn:hover { background:var(--navy2); }
                .book-success-btn-outline {
                    display:inline-block; background:none; color:var(--navy);
                    border:1.5px solid var(--border); padding:.7rem 1.75rem;
                    border-radius:8px; font-size:.88rem; font-weight:500;
                    text-decoration:none; transition:all .16s; margin:.3rem;
                    cursor:pointer;
                }
                .book-success-btn-outline:hover { border-color:var(--navy); }

                /* Info note */
                .login-note {
                    background:rgba(201,160,48,.08);
                    border:1px solid rgba(201,160,48,.18);
                    border-radius:10px; padding:1rem 1.25rem;
                    font-size:.84rem; color:var(--navy);
                    margin-bottom:1.5rem;
                    display:flex; align-items:flex-start; gap:.6rem;
                }

                @media(max-width:768px) {
                    .acc-grid { grid-template-columns:1fr; }
                    .form-row { grid-template-columns:1fr; }
                    .modal-body { padding:1.25rem 1.25rem 1.75rem; }
                    .modal-header { padding:1.25rem 1.25rem 0; }
                }
            `}</style>

            <Navbar />

            {/* Hero */}
            <div className="page-hero">
                <div className="page-hero-tag">Campmeeting 2026</div>
                <h1 className="page-hero-title">Accommodation</h1>
                <p className="page-hero-sub">
                    On-site and nearby lodging options for every budget.
                    Book early to secure your preferred option.
                </p>
            </div>

            {/* Filter bar */}
            <div className="filter-bar">
                <div className="filter-bar-inner">
                    <div className="filter-btns">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                                onClick={() => setFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    {!loading && (
                        <span className="filter-count">
                            {filtered.length} option{filtered.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Grid */}
            <section className="acc-section">
                <div className="acc-inner">
                    {loading ? (
                        <div className="acc-grid">
                            {[...Array(6)].map((_, i) => (
                                <div className="sk-card" key={i}>
                                    <div className="sk-img skeleton" />
                                    <div className="sk-body">
                                        <div className="sk-line skeleton" style={{ width: '35%' }} />
                                        <div className="sk-line skeleton" style={{ width: '75%' }} />
                                        <div className="sk-line skeleton" style={{ width: '100%' }} />
                                        <div className="sk-line skeleton" style={{ width: '90%' }} />
                                        <div className="sk-line skeleton" style={{ width: '60%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🏨</div>
                            <div className="empty-title">No Options Available</div>
                            <p className="empty-text">
                                Accommodation options will be posted soon. Check back shortly.
                            </p>
                        </div>
                    ) : (
                        <div className="acc-grid">
                            {filtered.map(acc => (
                                <div
                                    className={`acc-card ${!acc.is_available ? 'unavailable' : ''}`}
                                    key={acc.id}
                                >
                                    <div className="acc-img">
                                        {acc.image
                                            ? <img src={acc.image} alt={acc.name} loading="lazy" />
                                            : <div className="acc-img-ph">🏨</div>
                                        }
                                        <div className={`acc-avail-badge ${acc.is_available ? 'available' : 'full'}`}>
                                            {acc.is_available ? 'Available' : 'Fully Booked'}
                                        </div>
                                    </div>

                                    <div className="acc-body">
                                        <div className="acc-type-badge">
                                            {acc.accommodation_type_label || acc.accommodation_type}
                                        </div>
                                        <h2 className="acc-name">{acc.name}</h2>
                                        {acc.description && (
                                            <p className="acc-desc">{acc.description}</p>
                                        )}
                                        {acc.capacity && (
                                            <div className="acc-capacity">
                                                👥 Capacity: {acc.capacity} person{acc.capacity !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                        {acc.amenities_list?.length > 0 && (
                                            <div className="acc-amenities">
                                                {acc.amenities_list.map(a => (
                                                    <span className="acc-amenity" key={a}>{a}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="acc-footer">
                                            <div>
                                                <div className="acc-price">
                                                    GHS {parseFloat(acc.price_per_night).toFixed(2)}
                                                    <span className="acc-price-unit">/night</span>
                                                </div>
                                            </div>
                                            {acc.is_available && (
                                                <button
                                                    className="acc-book-btn"
                                                    onClick={() => openBooking(acc)}
                                                >
                                                    Book Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Booking modal */}
            {booking && (
                <div
                    className="modal-overlay"
                    onClick={e => { if (e.target === e.currentTarget) closeBooking(); }}
                >
                    <div className="modal">
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <div className="modal-tag">Book Accommodation</div>
                                <div className="modal-title">{booking.name}</div>
                            </div>
                            <button className="modal-close" onClick={closeBooking}>✕</button>
                        </div>

                        <div className="modal-body">
                            {bookDone ? (
                                <div className="book-success">
                                    <div className="book-success-icon">🎉</div>
                                    <div className="book-success-title">Booking Confirmed!</div>
                                    <p className="book-success-text">
                                        Your accommodation at <strong>{booking.name}</strong> has
                                        been booked successfully. A confirmation email will be
                                        sent to you shortly.
                                    </p>
                                    <div>
                                        <a href="/profile" className="book-success-btn">
                                            View My Booking
                                        </a>
                                        <button
                                            className="book-success-btn-outline"
                                            onClick={closeBooking}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Price info */}
                                    <div className="modal-price-row">
                                        <span className="modal-price-label">
                                            {booking.accommodation_type_label} ·{' '}
                                            Capacity: {booking.capacity}
                                        </span>
                                        <span className="modal-price-val">
                                            GHS {parseFloat(booking.price_per_night).toFixed(2)}
                                            <span style={{ fontFamily: 'DM Sans', fontSize: '.72rem', fontWeight: 400, color: 'var(--dim)' }}>
                                                /night
                                            </span>
                                        </span>
                                    </div>

                                    {bookError && (
                                        <div className="book-error">
                                            <span>⚠</span> {bookError}
                                        </div>
                                    )}

                                    <form onSubmit={handleBookSubmit}>
                                        <div className="form-row">
                                            <div className="form-field">
                                                <label className="form-label">Check-in Date</label>
                                                <input
                                                    type="date"
                                                    name="check_in_date"
                                                    className={`form-input ${errors.check_in_date ? 'error' : ''}`}
                                                    value={form.check_in_date}
                                                    onChange={handleFormChange}
                                                />
                                                {errors.check_in_date && (
                                                    <div className="field-error">{errors.check_in_date}</div>
                                                )}
                                            </div>
                                            <div className="form-field">
                                                <label className="form-label">Check-out Date</label>
                                                <input
                                                    type="date"
                                                    name="check_out_date"
                                                    className={`form-input ${errors.check_out_date ? 'error' : ''}`}
                                                    value={form.check_out_date}
                                                    onChange={handleFormChange}
                                                />
                                                {errors.check_out_date && (
                                                    <div className="field-error">{errors.check_out_date}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Running total */}
                                        {nights > 0 && total && (
                                            <div className="booking-total">
                                                <span className="booking-total-label">
                                                    {nights} night{nights !== 1 ? 's' : ''} ×
                                                    GHS {parseFloat(booking.price_per_night).toFixed(2)}
                                                </span>
                                                <span className="booking-total-amount">
                                                    GHS {total}
                                                </span>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="modal-submit"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <><div className="spinner" /> Confirming booking...</>
                                            ) : (
                                                nights > 0
                                                    ? `Confirm Booking — GHS ${total}`
                                                    : 'Confirm Booking'
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
