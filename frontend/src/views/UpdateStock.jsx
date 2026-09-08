import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Package } from 'lucide-react';
import api from '../api/axios';

const UpdateStock = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [toast, setToast] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/medicines');
      setMedicines(res.data);
    } catch (err) {
      console.error('Failed to fetch medicines', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleInputChange = (id, value) => {
    setPendingUpdates(prev => {
      const newUpdates = { ...prev };
      if (!value || parseInt(value, 10) <= 0) {
        delete newUpdates[id];
      } else {
        newUpdates[id] = parseInt(value, 10);
      }
      return newUpdates;
    });
  };

  const handleBulkUpdate = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    
    setIsUpdating(true);
    try {
      await api.put(`/medicines/bulk-update-stock`, pendingUpdates);
      
      setToast({ type: 'success', message: `Successfully updated ${Object.keys(pendingUpdates).length} medicines!` });
      setPendingUpdates({});
      await fetchMedicines();
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Failed to update stock', err);
      setToast({ type: 'error', message: 'Failed to update stock.' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Update Stock
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">Quickly add new inventory to your existing medicines.</p>
        </div>
        <button
          onClick={handleBulkUpdate}
          disabled={Object.keys(pendingUpdates).length === 0 || isUpdating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isUpdating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
          Save All Changes
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 p-4 rounded-xl shadow-lg border flex items-center gap-3 z-50 ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <RefreshCw className="w-5 h-5 text-red-600" />}
          <p className="font-medium text-sm md:text-base">{toast.message}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="w-full md:max-w-md">
        <input
          type="text"
          placeholder="Search medicine by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base text-slate-800 placeholder-slate-400 shadow-sm"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-full md:min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-tighter sm:tracking-normal">
                <th className="px-2 py-3 md:p-4">Name</th>
                <th className="px-2 py-3 md:p-4 hidden md:table-cell">Generic Name</th>
                <th className="px-2 py-3 md:p-4 text-center">Stock</th>
                <th className="px-2 py-3 md:p-4 text-center">Add Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-2 py-3 md:p-4 text-xs md:text-sm font-medium text-slate-800 break-words">{medicine.name}</td>
                  <td className="px-2 py-3 md:p-4 text-xs md:text-sm text-slate-600 hidden md:table-cell">{medicine.genericName || '-'}</td>
                  <td className="px-2 py-3 md:p-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] md:min-w-[2.5rem] px-1 md:px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] md:text-xs lg:text-sm font-semibold border border-blue-100">
                      {medicine.stockQuantity}
                    </span>
                  </td>
                  <td className="px-2 py-3 md:p-4">
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        min="1"
                        placeholder="+0"
                        value={pendingUpdates[medicine.id] || ''}
                        onChange={(e) => handleInputChange(medicine.id, e.target.value)}
                        className="w-14 sm:w-16 md:w-20 text-center px-1 md:px-2 py-1 md:py-2 text-xs md:text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent transition-all"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMedicines.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No medicines found. Add some medicines first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateStock;
