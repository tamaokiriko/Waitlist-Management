'use client';

import { Trophy, Users, UserX, Clock, BarChart3, FileText, Home } from 'lucide-react';
import { useStore } from '@/lib/store';

export function SummaryScreen() {
  const { setCurrentScreen, todayGuidedCount, cancelledCount, resetGuests } = useStore();

  const handleGoHome = () => {
    resetGuests();
    setCurrentScreen('closed');
  };

  const handleAnalyze = () => {
    setCurrentScreen('analytics');
  };

  const handleSaveReport = () => {
    // Simulate PDF save interaction
    alert('レポートを保存しました');
  };

  // Calculate average wait time (dummy data for demo)
  const avgWaitTime = todayGuidedCount > 0 ? Math.round(Math.random() * 20 + 10) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Trophy Section */}
      <div className="flex flex-col items-center pt-10 pb-6">
        {/* Trophy Badge with double ring decoration */}
        <div className="relative mb-6">
          {/* Outer ring with shadow */}
          <div className="absolute inset-0 w-28 h-28 -top-2 -left-2 rounded-full border-2 border-orange-200/50" />
          <div className="absolute inset-0 w-32 h-32 -top-4 -left-4 rounded-full border border-orange-100/30" />
          
          {/* Main trophy circle */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#FD780F] to-[#F97316] rounded-full flex items-center justify-center shadow-xl shadow-orange-200/50">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          {/* Achievement badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FD780F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            達成！
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#082752] mb-2">本日の営業実績</h1>
        <p className="text-[#FD780F] font-medium flex items-center gap-1">
          <span className="text-red-500">&#9829;</span>
          今日も一日お疲れ様でした！
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 flex-1">
        {/* Two column cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Guided Count */}
          <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FFEDD5] rounded-2xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#FD780F]" />
              <span className="text-xs text-gray-500">案内組数</span>
            </div>
            <p className="text-3xl font-bold text-[#FD780F]">
              {todayGuidedCount}
              <span className="text-sm font-normal text-gray-500 ml-1">組</span>
            </p>
          </div>

          {/* Cancelled Count */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <UserX className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">離脱組数</span>
            </div>
            <p className="text-3xl font-bold text-gray-600">
              {cancelledCount}
              <span className="text-sm font-normal text-gray-500 ml-1">組</span>
            </p>
          </div>
        </div>

        {/* Average Wait Time */}
        <div className="bg-white rounded-2xl p-4 mb-8 flex items-center justify-between border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">平均待ち時間</span>
            </div>
            <p className="text-3xl font-bold text-[#082752]">
              {avgWaitTime}
              <span className="text-sm font-normal text-gray-500 ml-1">分 / 組</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-[#FFF7ED] rounded-full flex items-center justify-center border border-orange-100">
            <Clock className="w-6 h-6 text-[#FD780F]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#082752] text-white rounded-xl font-medium hover:bg-[#0a3060] transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span>さらに詳しく分析する</span>
          </button>

          {/* Save Report Button */}
          <button
            onClick={handleSaveReport}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>レポートを保存</span>
          </button>

          {/* Home Button */}
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>ホームへ戻る</span>
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
