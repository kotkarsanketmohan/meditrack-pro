import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, ShieldPlus, TrendingUp, ShoppingCart, Database, AlertCircle, Clock, MapPin, Phone, Mail as MailIcon, Send } from 'lucide-react';
import api from '../api/axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('idle'); // idle, loading, success, error

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      await api.post('/public/contact', contactData);
      setContactStatus('success');
      setContactData({ name: '', email: '', message: '' });
    } catch (error) {
      setContactStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative flex flex-col font-sans overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none hidden md:block">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-100/40 blur-3xl mix-blend-multiply"></div>
      </div>

      <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
        <nav className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-primary font-bold text-xl md:text-2xl">
            <Pill className="h-8 w-8 text-blue-600" />
            <span>MediTrack<span className="text-blue-600">Pro</span></span>
          </div>
          <div className="flex gap-2 md:gap-4">
            <a
              href="https://youtu.be/5zvdKq4EkAM?si=Plr5pkZ0LP9KtR44"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 md:px-6 md:py-2.5 text-blue-600 border border-blue-200 bg-transparent font-medium rounded-full hover:bg-blue-50 transition-colors text-sm md:text-base inline-block text-center"
            >
              View Demo
            </a>
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm md:text-base"
            >
              Login / Register
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          The Modern Pharmacy <br className="hidden md:block" /> Management Solution
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
          Streamline your single-user pharmacy operations. Manage inventory, track sales, and analyze income all in one beautiful, secure cloud platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
          <a
            href="#features"
            className="px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
          >
            Learn More
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left px-4 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mb-4">
              <Pill className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Inventory</h3>
            <p className="text-slate-600">Auto-fetch medicine details via OpenFDA integration. Never type out a generic name again.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Income Analytics</h3>
            <p className="text-slate-600">Visualize your daily, monthly, and yearly sales with beautiful built-in charts and reports.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl mb-4">
              <ShieldPlus className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-slate-600">Strict data isolation ensures your patient history and inventory are only accessible by you.</p>
          </div>
        </div>

        <div id="features" className="w-full mt-32 py-24 bg-white relative z-10 border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Everything You Need to Run Your Pharmacy</h2>
              <p className="text-lg md:text-xl text-slate-500">Powerful features designed specifically for modern medical stores.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Quick POS Billing</h4>
                  <p className="text-slate-600">Lightning fast checkout process tailored for pharmacy counters. Add items, calculate totals, and generate receipts instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Real-Time Stock Deduction</h4>
                  <p className="text-slate-600">Inventory automatically syncs with every sale. Never worry about mismatched physical and digital stock counts.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Low Stock Alerts</h4>
                  <p className="text-slate-600">Set custom threshold levels for critical medicines and get notified instantly when it's time to reorder.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Expiry Tracking</h4>
                  <p className="text-slate-600">Proactively manage expiring stock. Reduce wastage and ensure patient safety with automated expiration warnings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-slate-900 text-slate-300 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Get in Touch</h2>
            <p className="text-lg text-slate-400 mb-10 max-w-md">Have questions about MediTrack Pro? Our team is ready to help you optimize your pharmacy operations.</p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
                  <MailIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Email Us</p>
                  <p className="text-lg text-white">meditrackpro01@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Call Us</p>
                  <p className="text-lg text-white">+91 9623295235</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Visit Us</p>
                  <p className="text-lg text-white">Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
            {contactStatus === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-6 rounded-xl text-center">
                <p className="font-semibold text-lg mb-2">Message Sent!</p>
                <p className="text-sm">We'll get back to you as soon as possible.</p>
                <button onClick={() => setContactStatus('idle')} className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm font-medium underline">Send another</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                {contactStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded-xl text-sm mb-4">
                    Failed to send message. Please try again.
                  </div>
                )}
                <div>
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={e => setContactData({ ...contactData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={e => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="Your Email"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows="4"
                    required
                    value={contactData.message}
                    onChange={e => setContactData({ ...contactData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={contactStatus === 'loading'}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-colors ${contactStatus === 'loading' ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}

                >
                  <Send className="h-5 w-5" />
                  {contactStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; 2026 MediTrack Pro. All rights reserved.
        </div>
      </footer>
    </div >
  );
};

export default HomePage;
