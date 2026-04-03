import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface DataPoint {
  day: string;
  value: number;
  isSelected?: boolean;
}

interface ProfitTrendChartProps {
  data: DataPoint[];
  className?: string;
}

export const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ data, className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-stone-100 flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-stone-800">Monthly Profit Trend</h3>
        <div className="flex items-center gap-2">
          {['Expense', 'Revenue', 'Average', 'Today'].map((label, idx) => (
            <button
              key={idx}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors",
                label === 'Today' && "bg-stone-50"
              )}
            >
              {label}
              <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-stone-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[240px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F2F2F2" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#A5A5A5', fontWeight: 500 }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-xl border border-stone-100">
                      <p className="text-[10px] font-medium text-stone-400 mb-1">Sales On This Day</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#158BF5]" />
                        <span className="text-sm font-bold text-stone-800">{data.value.toLocaleString()}</span>
                        <span className="text-xs font-bold text-green-600">+2.5%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={24}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isSelected ? '#158BF5' : '#F2F2F2'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-dashed border-stone-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-stone-800">₱6,390.80</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="px-2 py-1 rounded-lg bg-[#DDF3A1]/50 text-[#4E8712] text-xs font-bold">+2.5%</span>
           <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">vs. last month</span>
        </div>
      </div>
    </div>
  );
};
