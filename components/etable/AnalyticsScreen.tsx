'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, TrendingUp, AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const chartData = [
  { time: '11:00', value: 20 },
  { time: '12:00', value: 45 },
  { time: '13:00', value: 60 },
  { time: '14:00', value: 40 },
  { time: '15:00', value: 55 },
  { time: '16:00', value: 70 },
  { time: '17:00', value: 85 },
  { time: '18:00', value: 75 },
  { time: '19:00', value: 50 },
  { time: '21:00', value: 30 },
];

const pastRecords = [
  { date: '2025/03/05', count: 142, hasHighTraffic: true },
  { date: '2025/03/04', count: 98, hasHighTraffic: false },
  { date: '2025/03/03', count: 0, hasHighTraffic: false },
  { date: '2025/03/02', count: 185, hasHighTraffic: true },
];

type PeriodTab = 'today' | 'week' | 'month';

export function AnalyticsScreen() {
  const { setCurrentScreen } = useStore();
  const [periodTab, setPeriodTab] = useState<PeriodTab>('week');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#082752]" />
        </button>
        <h1 className="text-lg font-bold text-[#082752]">営業分析</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-gray-400" />
        </button>
      </header>

      <div className="px-4 py-6">
        {/* Period Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          {[
            { key: 'today' as PeriodTab, label: '今日' },
            { key: 'week' as PeriodTab, label: '今週' },
            { key: 'month' as PeriodTab, label: '今月' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setPeriodTab(tab.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodTab === tab.key
                  ? 'bg-[#082752] text-white'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Guided */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#FD780F]" />
              <span className="text-xs text-gray-500">総案内数</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#FD780F]">428</span>
              <span className="text-sm text-gray-500 ml-1">組</span>
            </div>
          </div>

          {/* Escape Rate */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#FD780F]" />
              <span className="text-xs text-gray-500">離脱率</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-[#082752]">4.2</span>
              <span className="text-sm text-gray-500 ml-1">%</span>
            </div>
          </div>
        </div>

        {/* Average Wait Time Card */}
        <div className="bg-[#082752] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">平均待ち時間</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-white">24.5</span>
                <span className="text-lg text-white/70 ml-2">min</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
              <Clock className="w-7 h-7 text-white/50" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs">📊</span>
            </div>
            <span className="text-sm font-medium text-[#082752]">時間帯別・混雑推移</span>
          </div>
          <p className="text-xs text-gray-400 tracking-widest mb-4">PEAK HOUR ANALYSIS</p>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FD780F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FD780F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FD780F"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Past Records */}
        <div>
          <p className="text-xs text-gray-500 mb-3">過去の案内実績</p>
          <div className="space-y-3">
            {pastRecords.map((record, index) => (
              <button
                key={index}
                className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${record.hasHighTraffic ? 'bg-[#FD780F]' : 'bg-gray-300'}`} />
                  <div className="text-left">
                    <p className="font-medium text-[#082752]">{record.date}</p>
                    <p className="text-xs text-gray-500">
                      案内数: <span className="text-[#FD780F]">{record.count}組</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
