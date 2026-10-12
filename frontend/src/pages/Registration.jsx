import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Registration() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: 'Male',
    selectedRoom: '',
    notes: ''
  });
  
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Fetch available hostel rooms from Django on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    axios.get('http://127.0.0.1:8000/api/rooms/', {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
      .then((res) => {
        setRooms(res.data);
        setLoadingRooms(false);
      })
      .catch((err) => {
        console.error("Error loading accommodation spaces:", err);
        setLoadingRooms(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit data to /api/registrations/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const token = localStorage.getItem('access_token');

    try {
      await axios.post('http://127.0.0.1:8000/api/registrations/', {
        full_name: formData.fullName,
        phone_number: formData.phone,
        gender: formData.gender,
        room: formData.selectedRoom,
        special_notes: formData.notes
      }, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Registration successful! Your attendance and room allocation are locked in.' 
      });
      
      // Reset form fields
      setFormData({ fullName: '', phone: '', gender: 'Male', selectedRoom: '', notes: '' });
    } catch (err) {
      console.error(err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.detail || 'Failed to process registration. Please double-check your fields.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        {/* Header Block */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-blue-950 tracking-tight">Camp Registration</h2>
          <p className="text-sm text-slate-500 mt-2">Secure your seat and hostel space for Camp Meeting 2026</p>
        </div>

        {/* Status Alerts */}
        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-semibold mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-100' 
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Legal Name</label>
            <input 
              type="text" required name="fullName" value={formData.fullName} onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Caleb Opoku-Amankwah"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
            <input 
              type="tel" required name="phone" value={formData.phone} onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="024XXXXXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
            <select 
              name="gender" value={formData.gender} onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel & Room Selection</label>
            {loadingRooms ? (
              <div className="text-xs text-slate-400 mt-2 animate-pulse">Scanning vacant room allocations...</div>
            ) : (
              <select 
                required name="selectedRoom" value={formData.selectedRoom} onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Choose an Available Room --</option>
                {rooms.map((room) => {
                  const remaining = room.capacity - (room.current_occupants || 0);
                  return (
                    <option key={room.id} value={room.id} disabled={remaining <= 0}>
                      {room.name} ({remaining > 0 ? `${remaining} spots left` : 'Full'})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Special Requests / Medical Notes</label>
            <textarea 
              name="notes" rows="3" value={formData.notes} onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Any medical or layout conditions our administrative panel should note..."
            />
          </div>

          <button 
            type="submit" disabled={submitting}
            className="w-full bg-blue-900 text-white rounded-xl p-3 text-sm font-bold shadow-md hover:bg-blue-950 transition duration-150 disabled:opacity-50"
          >
            {submitting ? 'Processing Registration...' : 'Complete Registration'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Registration;