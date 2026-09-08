import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize cart from navigation state, fallback to empty array
  const initialCart = location.state?.cart || [];
  const [cart, setCart] = useState(initialCart);
  const [patientName, setPatientName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const grandTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        patientName,
        totalAmount: grandTotal,
        items: cart.map(item => ({
          medicineId: item.id,
          quantity: item.quantity
        }))
      };

      await api.post('/transactions/checkout', payload);
      
      // Notify layout to update Today's Income
      window.dispatchEvent(new Event('transactionCompleted'));
      
      // Show success state and clear cart
      setCart([]);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 2500);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center fade-in px-4">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Order Placed!</h2>
        <p className="text-xl text-slate-600">
          Successfully processed for <span className="font-bold text-slate-900">{patientName}</span>.
        </p>
        <p className="text-slate-500 mt-4">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 md:px-8">
      {/* Header */}
      <button 
        onClick={() => navigate('/app/dashboard')}
        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-8 focus:outline-none"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

      {cart.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100">
          <p className="text-xl text-slate-500 mb-4">Your cart is empty.</p>
          <button 
            onClick={() => navigate('/app/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Medicines
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Review Form (Left Side) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Order Items</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {cart.map(item => (
                  <div key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                      <p className="text-slate-500 text-sm">{item.generic_name}</p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full md:w-auto gap-6 mt-4 md:mt-0">
                      <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-slate-500 hover:bg-white hover:text-slate-800 rounded-md transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-slate-500 hover:bg-white hover:text-slate-800 rounded-md transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-slate-800 text-lg">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">Rs. {item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Summary (Right Side) */}
          <div className="lg:col-span-1">
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Summary</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="E.g. John Doe"
                  required
                />
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-800">Rs. {grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-medium text-slate-800">Rs. 0.00</span>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-lg font-bold text-slate-800">Grand Total</span>
                  <span className="text-3xl font-black text-blue-600">Rs. {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className={`w-full flex items-center justify-center text-white font-bold text-lg py-4 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-slate-900/20 ${
                  isSubmitting || cart.length === 0 ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Place Order'}
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
