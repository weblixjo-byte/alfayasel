'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface OrderItem {
  createdAt: string;
  total: number;
  status: string;
}

interface SalesChartProps {
  orders: OrderItem[];
}

type Timeframe = 'daily' | 'monthly' | 'yearly' | 'custom';
type ChartType = 'line' | 'bar';

export const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Process and filter chart data dynamically in client
  const chartData = useMemo(() => {
    // 1. Filter out cancelled orders
    let filteredOrders = orders.filter((o) => o.status !== 'cancelled');

    // 2. Filter by custom date range if selected
    if (timeframe === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // include entire end day

      filteredOrders = filteredOrders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    // Sort chronologically by date
    filteredOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // 3. Group according to timeframe
    const groups: { [key: string]: number } = {};

    filteredOrders.forEach((o) => {
      const dateObj = new Date(o.createdAt);
      let key = '';

      if (timeframe === 'daily' || timeframe === 'custom') {
        key = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      } else if (timeframe === 'monthly') {
        key = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
      } else if (timeframe === 'yearly') {
        key = dateObj.getFullYear().toString();
      }

      groups[key] = (groups[key] || 0) + o.total;
    });

    return Object.keys(groups).map((key) => ({
      name: key,
      sales: Number(groups[key].toFixed(3)),
    }));
  }, [orders, timeframe, startDate, endDate]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 shadow-xs select-none">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{payload[0].payload.name}</p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {payload[0].value.toFixed(3)} JOD
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 p-6 space-y-6">
      {/* Chart Filter Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Timeframe selector */}
        <div className="flex border border-gray-200 shrink-0">
          {(['daily', 'monthly', 'yearly', 'custom'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-e border-gray-200 last:border-e-0 cursor-pointer ${
                timeframe === tf
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart style toggler */}
        <div className="flex border border-gray-200 shrink-0">
          {(['line', 'bar'] as ChartType[]).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-e border-gray-200 last:border-e-0 cursor-pointer ${
                chartType === type
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Date Pickers (visible only when timeframe is custom) */}
      {timeframe === 'custom' && (
        <div className="flex flex-wrap items-center gap-4 bg-gray-50 border border-gray-200 p-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border border-gray-200 text-xs px-3 py-1.5 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border border-gray-200 text-xs px-3 py-1.5 focus:outline-none focus:border-gray-900"
            />
          </div>
        </div>
      )}

      {/* Graph Area */}
      <div className="w-full h-80 bg-white">
        {chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-200 text-xs text-gray-400 font-bold uppercase tracking-widest">
            No sales data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={{ r: 2, stroke: '#111827', strokeWidth: 1, fill: '#111827' }}
                  activeDot={{ r: 4, stroke: '#111827', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="sales" fill="#111827" maxBarSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
