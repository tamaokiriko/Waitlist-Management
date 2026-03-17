'use client';

import { Home, Users, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/store';

export function DailyResultScreen() {
  const { setCurrentScreen, todayGuidedCount } = useStore();

  const today = new Date();
  const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#082752] text-white px-6 pt-8 pb-12">
        <h1 className="text-xl font-bold mb-2">本日の営業実績</h1>
        <p className="text-white/70 text-sm">{dateStr}</p>
      </header>

      {/* Stats Cards */}
      <div className="px-4 -mt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Guided */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[#FD780F]" />
              <span className="text-xs text-gray-500">総案内数</span>
            </div>
            <p className="text-3xl font-bold text-[#082752]">
              {todayGuidedCount}
              <span className="text-sm font-normal text-gray-500 ml-1">組</span>
            </p>
          </div>

          {/* Average Wait Time */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#FD780F]" />
              <span className="text-xs text-gray-500">平均待ち時間</span>
            </div>
            <p className="text-3xl font-bold text-[#082752]">
              24.5
              <span className="text-sm font-normal text-gray-500 ml-1">min</span>
            </p>
          </div>
        </div>

        {/* Comparison Card */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#22C55E]" />
            <span className="text-sm text-gray-500">前日比</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">案内数</p>
              <p className="text-lg font-semibold text-[#22C55E]">+12%</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">待ち時間</p>
              <p className="text-lg font-semibold text-[#22C55E]">-8%</p>
            </div>
          </div>
        </div>

        {/* Message Card */}
        <div className="bg-gradient-to-r from-[#FFF7ED] to-[#FEF3C7] rounded-2xl p-6 mb-8">
          <p className="text-[#082752] font-medium text-center leading-relaxed">
            お疲れ様でした！<br />
            本日も多くのお客様をご案内できました。
          </p>
        </div>

        {/* Home Button */}
        <button
          onClick={() => setCurrentScreen('closed')}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#082752] text-white rounded-xl hover:bg-[#0a3060] transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">ホームへ戻る</span>
        </button>
      </div>
    </div>
  );
}
