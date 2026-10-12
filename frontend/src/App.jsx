import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home         from './pages/Home';
import Login        from './pages/Login';
import Register     from './pages/Register';
import VerifyEmail  from './pages/VerifyEmail';
import Speakers     from './pages/Speakers';
import Schedule     from './pages/Schedule';
import Accommodation from './pages/Accommodation';
import Registration from './pages/Registration';
import LiveStream   from './pages/LiveStream';
import Location     from './pages/Location';
import Contact      from './pages/Contact';
import Profile      from './pages/Profile';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public pages */}
                    <Route path="/"              element={<Home />} />
                    <Route path="/login"         element={<Login />} />
                    <Route path="/register"      element={<Register />} />
                    <Route path="/verify-email"  element={<VerifyEmail />} />
                    <Route path="/speakers"      element={<Speakers />} />
                    <Route path="/schedule"      element={<Schedule />} />
                    <Route path="/accommodation" element={<Accommodation />} />
                    <Route path="/livestream"    element={<LiveStream />} />
                    <Route path="/location"      element={<Location />} />
                    <Route path="/contact"       element={<Contact />} />

                    {/* Protected pages — must be logged in */}
                    <Route path="/registration" element={
                        <ProtectedRoute>
                            <Registration />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;