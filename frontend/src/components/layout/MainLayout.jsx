import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Home, Plus, FileText, BarChart2, User, Info, LogOut, Pill, Layers, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [todaysIncome, setTodaysIncome] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTodaysIncome = async () => {
      try {
        const res = await api.get('/transactions');
        const today = new Date().toDateString();
        const todaysBills = res.data.filter(bill => new Date(bill.purchaseDate).toDateString() === today);
        const sum = todaysBills.reduce((acc, curr) => acc + curr.totalAmount, 0);
        setTodaysIncome(sum);
      } catch (err) {
        console.error('Failed to load transactions for income tracking', err);
      }
    };
    fetchTodaysIncome();
    
    // Optional: Refresh income every minute
    const interval = setInterval(fetchTodaysIncome, 60000);
    
    // Listen for custom event from CheckoutPage
    window.addEventListener('transactionCompleted', fetchTodaysIncome);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('transactionCompleted', fetchTodaysIncome);
    };
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/app/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Low Stock Alerts', path: '/app/low-stock', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Add Medicine', path: '/app/add-medicine', icon: <Plus className="w-5 h-5" /> },
    { name: 'Update Stock', path: '/app/update-stock', icon: <Layers className="w-5 h-5" /> },
    { name: 'Purchase History', path: '/app/history', icon: <FileText className="w-5 h-5" /> },
    { name: 'Income Reports', path: '/app/reports', icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Profile', path: '/app/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Help', path: '/app/help', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/20 z-20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-30 h-full bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 md:w-20 -translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-100 px-4">
          <Pill className="h-8 w-8 text-blue-600 shrink-0" />
          {isSidebarOpen && <span className="ml-2 font-bold text-xl text-slate-800">MediTrack<span className="text-blue-600">Pro</span></span>}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center px-3 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
              onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false) }}
              title={!isSidebarOpen ? link.name : undefined}
            >
              <span className="shrink-0">{link.icon}</span>
              {isSidebarOpen && <span className="ml-3 whitespace-nowrap">{link.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden sm:block text-slate-600 font-medium bg-green-50 text-green-700 px-4 py-1.5 rounded-full border border-green-100">
              Today's Income: <span className="font-bold">Rs. {todaysIncome.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-slate-500 hover:text-red-600 transition-colors focus:outline-none"
            >
              <LogOut className="w-5 h-5 mr-1" />
              <span className="font-medium hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;
