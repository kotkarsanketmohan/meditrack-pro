import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Phone, MapPin, FileText, Save, Loader2, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    email: '',
    mobileNo: '',
    address: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setFormData({
          pharmacyName: localStorage.getItem('pharmacyName') || response.data.pharmacyName || '',
          email: localStorage.getItem('email') || response.data.email || '',
          mobileNo: response.data.mobileNo || '',
          address: response.data.address || '',
          licenseNumber: response.data.licenseNumber || ''
        });
      } catch (error) {
        console.error('Failed to load profile', error);
        setFormData({
          pharmacyName: localStorage.getItem('pharmacyName') || '',
          email: localStorage.getItem('email') || '',
          mobileNo: '',
          address: '',
          licenseNumber: ''
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/profile', formData);
      setFormData({
        pharmacyName: response.data.pharmacyName || '',
        email: response.data.email || '',
        mobileNo: response.data.mobileNo || '',
        address: response.data.address || '',
        licenseNumber: response.data.licenseNumber || ''
      });
      setIsEditing(false);
      showToast('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      showToast('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 md:right-8 bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm md:text-base">{toast.message}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">Manage your pharmacy details and contact information.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 md:px-8 py-6 border-b border-slate-100 bg-slate-50/50 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            General Information
          </h2>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pharmacy Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Pharmacy Name
              </label>
              <input
                type="text"
                name="pharmacyName"
                value={formData.pharmacyName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${!isEditing ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'}`}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${!isEditing ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'}`}
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${!isEditing ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'}`}
                placeholder="Enter mobile number"
              />
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                License / GST Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border ${!isEditing ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'}`}
                placeholder="e.g. DL-123456"
              />
            </div>

            {/* Address */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border resize-none ${!isEditing ? 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'}`}
                placeholder="Enter complete pharmacy address"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-6 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
