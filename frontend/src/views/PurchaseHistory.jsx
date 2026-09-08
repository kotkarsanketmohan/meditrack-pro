import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, Calendar, User, DollarSign, Loader2 } from 'lucide-react';
import api from '../api/axios';

const PurchaseHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredOrders = useMemo(() => {
    return transactions.filter(order => {
      const patientMatch = order.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = String(order.id).toLowerCase().includes(searchTerm.toLowerCase());
      return patientMatch || idMatch;
    });
  }, [searchTerm, transactions]);

  const toggleExpand = (id) => {
    setExpandedRowId(prev => prev === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
          <FileText className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Purchase History</h1>
          <p className="text-slate-500 mt-1">Review past orders and transaction details.</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
          placeholder="Search by Patient Name or Order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
            <p>Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="py-12 m-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>No orders found matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="overflow-x-hidden md:overflow-x-auto p-4 md:p-0">
            <table className="w-full text-left border-collapse md:min-w-[600px] block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="bg-slate-50 text-slate-600 text-xs md:text-sm font-semibold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y-0 md:divide-y divide-slate-100">
                {filteredOrders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`block md:table-row bg-white border border-slate-200 md:border-0 rounded-xl md:rounded-none mb-4 md:mb-0 p-4 md:p-0 hover:bg-slate-50 transition-colors cursor-pointer ${expandedRowId === order.id ? 'bg-blue-50/10 md:bg-blue-50/50 ring-2 md:ring-0 ring-blue-500' : ''}`}
                      onClick={() => toggleExpand(order.id)}
                    >
                      <td className="flex justify-between items-center md:table-cell py-2 md:px-6 md:py-4 border-b border-slate-100 md:border-0 font-medium text-slate-900">
                        <span className="md:hidden font-semibold text-slate-500">Order ID:</span>
                        <span>{order.id}</span>
                      </td>
                      <td className="flex justify-between items-center md:table-cell py-2 md:px-6 md:py-4 border-b border-slate-100 md:border-0 text-slate-600 whitespace-nowrap">
                        <span className="md:hidden font-semibold text-slate-500">Date & Time:</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(order.purchaseDate)}
                        </div>
                      </td>
                      <td className="flex justify-between items-center md:table-cell py-2 md:px-6 md:py-4 border-b border-slate-100 md:border-0 text-slate-800 font-medium">
                        <span className="md:hidden font-semibold text-slate-500">Patient Name:</span>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          {order.patientName}
                        </div>
                      </td>
                      <td className="flex justify-between items-center md:table-cell py-2 md:px-6 md:py-4 border-b border-slate-100 md:border-0 text-right font-bold text-slate-800">
                        <span className="md:hidden font-semibold text-slate-500">Total Amount:</span>
                        <span>Rs. {order.totalAmount.toFixed(2)}</span>
                      </td>
                      <td className="flex justify-center items-center md:table-cell py-3 md:px-6 md:py-4 text-center text-slate-400">
                        <span className="md:hidden font-semibold text-blue-500 mr-2">{expandedRowId === order.id ? 'Hide Details' : 'View Details'}</span>
                        {expandedRowId === order.id ? <ChevronUp className="inline w-5 h-5 md:text-slate-400 text-blue-500" /> : <ChevronDown className="inline w-5 h-5 md:text-slate-400 text-blue-500" />}
                      </td>
                    </tr>
                    
                    {/* Expandable Details Section */}
                    {expandedRowId === order.id && (
                      <tr className="block md:table-row bg-slate-50/80 md:border-b border-slate-200 rounded-b-xl md:rounded-none mb-4 md:mb-0">
                        <td colSpan="5" className="block md:table-cell px-4 py-6">
                          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Order Items</h4>
                            <ul className="space-y-3">
                              {order.items.map((item, index) => (
                                <li key={index} className="flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2">
                                  <div>
                                    <span className="font-semibold text-slate-800">{item.name || item.medicine?.name || 'Unknown'}</span>
                                    {(item.generic_name || item.medicine?.genericName) && (
                                      <span className="text-slate-500 ml-2 text-xs">({item.generic_name || item.medicine?.genericName})</span>
                                    )}
                                  </div>
                                  <div className="flex justify-between sm:gap-8 min-w-[140px]">
                                    <span className="text-slate-600">{item.quantity} x Rs. {(item.price || item.medicine?.price || 0).toFixed(2)}</span>
                                    <span className="font-bold text-slate-800">Rs. {(item.quantity * (item.price || item.medicine?.price || 0)).toFixed(2)}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end items-center gap-4">
                              <span className="text-slate-500">Grand Total</span>
                              <span className="font-black text-blue-600 text-lg">Rs. {order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
