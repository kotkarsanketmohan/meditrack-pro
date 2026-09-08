import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Package, Loader2, XCircle } from 'lucide-react';
import api from '../api/axios';

const LowStock = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const response = await api.get('/medicines/low-stock');
      setMedicines(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch low stock alerts.');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleIgnore = async (medicine) => {
    try {
      await api.put(`/medicines/${medicine.id}/ignore-alert`);
      setMedicines(prev => prev.filter(m => m.id !== medicine.id));
      showToast(`Alert ignored for ${medicine.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to ignore alert.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-bottom-5 text-sm md:text-base">
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-blue-600" />
            Low Stock Alerts
          </h1>
          <p className="text-slate-500 mt-1">Items running low that need your attention.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm md:text-base">
          {error}
        </div>
      )}

      {medicines.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-slate-200 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Inventory looks good!</h3>
          <p className="text-slate-500">You don't have any low stock alerts at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={medicine.name}>
                    {medicine.name}
                  </h3>
                  {medicine.genericName && (
                    <p className="text-sm text-slate-500 line-clamp-1" title={medicine.genericName}>
                      {medicine.genericName}
                    </p>
                  )}
                </div>
                <div className="bg-orange-50 text-orange-700 font-bold px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ml-2">
                  {medicine.stockQuantity} Left
                </div>
              </div>

              <div className="mb-6 space-y-1">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Price:</span> Rs. {medicine.price}
                </p>
                {medicine.manufacturer && (
                  <p className="text-sm text-slate-600 line-clamp-1">
                    <span className="font-semibold">Mfr:</span> {medicine.manufacturer}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={() => navigate('/app/update-stock')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors text-sm"
                >
                  Update Stock
                </button>
                <button
                  onClick={() => handleIgnore(medicine)}
                  className="flex items-center justify-center gap-1 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 font-medium py-2 px-4 rounded-xl border border-slate-200 hover:border-red-200 transition-colors text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Ignore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LowStock;
