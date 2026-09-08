import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Plus, Loader2 } from 'lucide-react';
import api from '../api/axios';

const MainDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get('/medicines');
        setMedicines(response.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load inventory.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    const filtered = medicines.filter(med => 
      med.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      med.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      // Primary Sort: Availability (in stock first)
      const aInStock = a.stockQuantity > 0 ? 1 : 0;
      const bInStock = b.stockQuantity > 0 ? 1 : 0;
      
      if (aInStock !== bInStock) {
        return bInStock - aInStock;
      }

      // Secondary Sort: Frequently Selling (highest first)
      const aSales = a.salesCount || a.soldQuantity || a.sold || 0;
      const bSales = b.salesCount || b.soldQuantity || b.sold || 0;
      
      return bSales - aSales;
    });
  }, [searchTerm, medicines]);

  const addToCart = (medicine) => {
    if (medicine.stockQuantity <= 0) {
      showToast('Medicine Out of Stock!', 'error');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id);
      if (existingItem) {
        if (existingItem.quantity + 1 > medicine.stockQuantity) {
          showToast('Cannot add more. Maximum stock reached!', 'error');
          return prevCart;
        }
        return prevCart.map(item => 
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleGoToCheckout = () => {
    navigate('/app/checkout', { state: { cart } });
  };

  return (
    <div className="relative pb-24 px-4 md:px-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-20 right-4 md:right-8 px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 transition-all z-[100] ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <span className="font-medium text-sm md:text-base">{toast.message}</span>
        </div>
      )}

      {/* Top Bar - Search */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 md:mb-6">Point of Sale</h1>
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-base md:text-lg transition-all shadow-sm"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
          <p>Loading inventory...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredMedicines.map((med) => (
            <div key={med.id} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">{med.name}</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap ml-2">
                    Stock: {med.stockQuantity}
                  </span>
                </div>
                <p className="text-slate-500 mb-4 text-sm">{med.genericName}</p>
                <div className="text-xl md:text-2xl font-black text-blue-600 mb-6">
                  Rs. {med.price?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              <button
                onClick={() => addToCart(med)}
                disabled={med.stockQuantity <= 0}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
                  med.stockQuantity <= 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Plus className="w-5 h-5" />
                {med.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
          {filteredMedicines.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No medicines found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleGoToCheckout}
        disabled={totalCartItems === 0}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 p-4 md:p-5 rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 z-50
          ${totalCartItems > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
      >
        <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
        {totalCartItems > 0 && (
          <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-500 text-white text-[10px] md:text-xs font-bold w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {totalCartItems}
          </span>
        )}
      </button>
    </div>
  );
};

export default MainDashboard;
