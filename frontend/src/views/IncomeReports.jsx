import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, CreditCard, BarChart2, Loader2 } from 'lucide-react';
import api from '../api/axios';

const SummaryCard = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl mr-5">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && (
        <p className={`text-xs mt-1 font-medium flex items-center ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
          <TrendingUp className={`w-3 h-3 mr-1 ${trend.positive ? '' : 'rotate-180 transform'}`} />
          {trend.value}% from last period
        </p>
      )}
    </div>
  </div>
);

const IncomeReports = () => {
  const [timeRange, setTimeRange] = useState('monthly'); // 'daily' or 'monthly'
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
        setError('Failed to load transaction data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const { chartData, summary } = useMemo(() => {
    const monthlyDataMap = {
      Jan: { name: 'Jan', revenue: 0, orders: 0 },
      Feb: { name: 'Feb', revenue: 0, orders: 0 },
      Mar: { name: 'Mar', revenue: 0, orders: 0 },
      Apr: { name: 'Apr', revenue: 0, orders: 0 },
      May: { name: 'May', revenue: 0, orders: 0 },
      Jun: { name: 'Jun', revenue: 0, orders: 0 },
      Jul: { name: 'Jul', revenue: 0, orders: 0 },
      Aug: { name: 'Aug', revenue: 0, orders: 0 },
      Sep: { name: 'Sep', revenue: 0, orders: 0 },
      Oct: { name: 'Oct', revenue: 0, orders: 0 },
      Nov: { name: 'Nov', revenue: 0, orders: 0 },
      Dec: { name: 'Dec', revenue: 0, orders: 0 },
    };

    const dailyDataMap = {
      Sun: { name: 'Sun', revenue: 0, orders: 0 },
      Mon: { name: 'Mon', revenue: 0, orders: 0 },
      Tue: { name: 'Tue', revenue: 0, orders: 0 },
      Wed: { name: 'Wed', revenue: 0, orders: 0 },
      Thu: { name: 'Thu', revenue: 0, orders: 0 },
      Fri: { name: 'Fri', revenue: 0, orders: 0 },
      Sat: { name: 'Sat', revenue: 0, orders: 0 },
    };

    let totalRevenue = 0;
    let totalOrders = 0;
    let thisMonthRevenue = 0;
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });

    transactions.forEach(t => {
      const date = new Date(t.date || new Date());
      const monthStr = date.toLocaleString('default', { month: 'short' });
      const dayStr = date.toLocaleString('default', { weekday: 'short' });
      const amt = t.totalAmount || 0;

      if (monthlyDataMap[monthStr]) {
        monthlyDataMap[monthStr].revenue += amt;
        monthlyDataMap[monthStr].orders += 1;
      }

      if (dailyDataMap[dayStr]) {
        dailyDataMap[dayStr].revenue += amt;
        dailyDataMap[dayStr].orders += 1;
      }

      totalRevenue += amt;
      totalOrders += 1;

      if (monthStr === currentMonth) {
        thisMonthRevenue += amt;
      }
    });

    const monthlyData = Object.values(monthlyDataMap);
    const dailyData = Object.values(dailyDataMap);

    // Quick re-order so Mon is first for daily
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dailyData.sort((a, b) => daysOrder.indexOf(a.name) - daysOrder.indexOf(b.name));

    return {
      chartData: timeRange === 'monthly' ? monthlyData : dailyData,
      summary: {
        totalRevenue,
        thisMonthRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders) : 0,
        projectedYearly: thisMonthRevenue * 12
      }
    };
  }, [transactions, timeRange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <p className="text-blue-600 font-medium">
            Revenue: Rs. {payload[0].value}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Orders: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-2xl mr-4 text-blue-600">
            <BarChart2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Income Reports</h1>
            <p className="text-slate-500 mt-1">Track your pharmacy's financial performance.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-1 border border-slate-200 inline-flex shadow-sm w-full md:w-auto">
          <button
            onClick={() => setTimeRange('daily')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === 'daily' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === 'monthly' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
          <p>Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="py-12 mb-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100">
          {error}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Total Revenue"
              value={`Rs. ${summary.totalRevenue.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6" />}
            />
            <SummaryCard
              title="Total Orders"
              value={summary.totalOrders}
              icon={<ShoppingBag className="w-6 h-6" />}
            />
            <SummaryCard
              title="Average Order Value"
              value={`Rs. ${summary.averageOrderValue.toFixed(2)}`}
              icon={<CreditCard className="w-6 h-6" />}
            />
            <SummaryCard
              title="Projected Yearly"
              value={`Rs. ${summary.projectedYearly.toFixed(0)}`}
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>

          {/* Charts */}
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-100 w-full overflow-hidden">
            <h3 className="text-xl font-bold text-slate-800 mb-4 md:mb-8">
              {timeRange === 'monthly' ? 'Revenue Overview (Year-to-Date)' : 'Revenue Overview (This Week)'}
            </h3>
            <div className="h-64 md:h-[400px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#64748b"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `Rs. ${value}`}
                    dx={-10}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    hide={true}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    name="Revenue (Rs.)"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="orders"
                    name="Number of Orders"
                    fill="#93c5fd"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IncomeReports;
