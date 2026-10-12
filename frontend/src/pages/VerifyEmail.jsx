import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api';
import useAuth from '../hooks/useAuth';

function VerifyEmail() {
    const [searchParams]        = useSearchParams();
    const [status, setStatus]   = useState('verifying'); // verifying | success | error
    const [message, setMessage] = useState('');
    const { login }             = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No verification token found. Please check your email link.');
            return;
        }

        API.post('auth/verify-email/', { token })
            .then((res) => {
                // Log user in automatically after verification
                login(res.data.user, res.data.tokens);
                setStatus('success');
            })
            .catch((err) => {
                setStatus('error');
                setMessage(
                    err.response?.data?.message ||
                    'Verification failed. The link may have already been used.'
                );
            });
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
                body { font-family: 'DM Sans', sans-serif; background: #F5F7FA; }

                .verify-wrap {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .verify-card {
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 8px 40px rgba(13,27,42,0.1);
                    padding: 3rem 2.5rem;
                    max-width: 440px;
                    width: 100%;
                    text-align: center;
                }

                .verify-icon {
                    width: 68px; height: 68px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.9rem;
                    margin: 0 auto 1.5rem;
                }

                .verify-icon.loading {
                    background: #EFF6FF;
                    border: 2px solid #BFDBFE;
                    animation: pulse 1.2s ease infinite;
                }

                .verify-icon.success {
                    background: #F0FDF4;
                    border: 2px solid #BBF7D0;
                }

                .verify-icon.error {
                    background: #FEF2F2;
                    border: 2px solid #FECACA;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50%       { transform: scale(1.05); }
                }

                .verify-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.9rem;
                    font-weight: 700;
                    color: #0D1B2A;
                    margin-bottom: 0.65rem;
                }

                .verify-text {
                    font-size: 0.88rem;
                    color: #64748B;
                    line-height: 1.7;
                    margin-bottom: 2rem;
                }

                .verify-btn {
                    display: inline-block;
                    background: #0D1B2A;
                    color: #fff;
                    padding: 0.72rem 2rem;
                    border-radius: 8px;
                    font-size: 0.88rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.16s;
                    margin: 0 0.4rem;
                }

                .verify-btn:hover { background: #1E3A5F; }

                .verify-btn-outline {
                    display: inline-block;
                    background: transparent;
                    color: #0D1B2A;
                    padding: 0.72rem 2rem;
                    border-radius: 8px;
                    font-size: 0.88rem;
                    font-weight: 500;
                    text-decoration: none;
                    border: 1.5px solid #E2E8F0;
                    transition: all 0.16s;
                    margin: 0 0.4rem;
                }

                .verify-btn-outline:hover { border-color: #0D1B2A; }
            `}</style>

            <div className="verify-wrap">
                <div className="verify-card">
                    {status === 'verifying' && (
                        <>
                            <div className="verify-icon loading">⏳</div>
                            <h2 className="verify-title">Verifying...</h2>
                            <p className="verify-text">
                                Please wait while we verify your email address.
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="verify-icon success">✅</div>
                            <h2 className="verify-title">Email Verified!</h2>
                            <p className="verify-text">
                                Your account has been verified and you are now logged in.
                                Welcome to Campmeeting 2026!
                            </p>
                            <Link to="/" className="verify-btn">Go to Home</Link>
                            <Link to="/registration" className="verify-btn-outline">
                                Register Now
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="verify-icon error">✕</div>
                            <h2 className="verify-title">Verification Failed</h2>
                            <p className="verify-text">{message}</p>
                            <Link to="/login" className="verify-btn">Go to Sign In</Link>
                            <Link to="/register" className="verify-btn-outline">
                                Try Again
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default VerifyEmail;
