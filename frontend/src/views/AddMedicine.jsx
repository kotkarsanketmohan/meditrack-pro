import React, { useState } from 'react';
import axios from 'axios';
import { CloudDownload, PackagePlus, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

const AddMedicine = () => {
  const [brandName, setBrandName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  
  const [isFetching, setIsFetching] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
  };

  const handleFetchDetails = async () => {
    if (!brandName.trim()) {
      showToast('Please enter a brand name first.', 'error');
      return;
    }

    setIsFetching(true);
    setIsManualEntry(false);
    
    try {
      const response = await axios.get(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${brandName}"&limit=1`
      );
      
      const openfda = response.data.results[0]?.openfda;
      
      if (openfda && openfda.generic_name && openfda.manufacturer_name) {
        setGenericName(openfda.generic_name[0] || '');
        setManufacturer(openfda.manufacturer_name[0] || '');
        showToast('Details fetched successfully!', 'success');
      } else {
        throw new Error('Incomplete data from FDA');
      }
    } catch (error) {
      console.error('Error fetching from OpenFDA:', error);
      setIsManualEntry(true);
      setGenericName('');
      setManufacturer('');
      showToast('Medicine not found in FDA database. Please enter manually.', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName || !genericName || !manufacturer || !price || !stock) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await api.post('/medicines', {
        name: brandName,
        genericName,
        manufacturer,
        price: parseFloat(price),
        stockQuantity: parseInt(stock, 10)
      });
      
      showToast('Medicine Saved to Database!', 'success');
      
      // Clear form
      setBrandName('');
      setGenericName('');
      setManufacturer('');
      setPrice('');
      setStock('');
      setIsManualEntry(false);
    } catch (error) {
      console.error('Error adding medicine:', error);
      showToast(error.response?.data?.message || 'Failed to add medicine.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4 md:px-0">
      <div className="flex items-center mb-8">
        <div className="bg-blue-100 p-3 rounded-2xl mr-4 text-blue-600">
          <PackagePlus className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Add New Medicine</h1>
          <p className="text-slate-500 mt-1">Register a new product to your pharmacy inventory.</p>
        </div>
      </div>

      {toast.show && (
        <div className={`mb-6 p-4 rounded-xl flex items-center animate-fade-in
          ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3 shrink-0" /> : <AlertCircle className="w-5 h-5 mr-3 shrink-0" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          
          {/* Section 1: Online Fetch */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>
              Search Medicine
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="E.g. Tylenol, Advil"
                  required
                />
              </div>
              <div className="sm:pt-6">
                <button
                  type="button"
                  onClick={handleFetchDetails}
                  disabled={isFetching || !brandName}
                  className={`w-full md:w-auto flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-colors
                    ${isFetching || !brandName 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'}`}
                >
                  <CloudDownload className={`w-5 h-5 mr-2 ${isFetching ? 'animate-pulse' : ''}`} />
                  {isFetching ? 'Fetching...' : 'Fetch Details Online'}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-8"></div>

          {/* Section 2: Auto-filled/Editable Details */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>
                Medicine Details
              </h2>
              {!isManualEntry && (
                <span className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  <Info className="w-3 h-3 mr-1" /> Auto-filled by OpenFDA
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Generic Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  disabled={!isManualEntry}
                  className={`w-full rounded-xl border px-4 py-3 transition-colors ${
                    !isManualEntry 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed focus:outline-none' 
                      : 'bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Auto-filled generic name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Manufacturer <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  disabled={!isManualEntry}
                  className={`w-full rounded-xl border px-4 py-3 transition-colors ${
                    !isManualEntry 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed focus:outline-none' 
                      : 'bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Auto-filled manufacturer"
                  required
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 mb-8"></div>

          {/* Section 3: Local Inventory Details */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">3</span>
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Retail Price (Rs.) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">Rs. </span>
                  </div>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-12 rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Stock Quantity <span className="text-red-500">*</span></label>
                <input 
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold text-lg py-4 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-slate-900/20 flex items-center justify-center ${
              isSubmitting ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <PackagePlus className="w-6 h-6 mr-2" />
            )}
            {isSubmitting ? 'Adding...' : 'Add to Inventory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
