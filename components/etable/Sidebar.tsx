'use client';

import { useState } from 'react';
import { X, Play, Pause, BarChart3, Star, Settings, Power, LogOut, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { 
    setCurrentScreen, 
    isReceptionPaused, 
    setIsReceptionPaused,
    waitTimeOffset,
    setWaitTimeOffset
  } = useStore();
  
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  if (!open) return null;

  const handleNavigate = (screen: 'dashboard' | 'analytics' | 'reviews' | 'settings') => {
    setCurrentScreen(screen);
    onClose();
  };

  const handleEndBusinessConfirm = () => {
    setCurrentScreen('summary');
    onClose();
    setShowEndConfirm(false);
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-[#FD780F]">E</span>
              <span className="text-[#082752]">TABLE</span>
            </h1>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Operating Mode */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 tracking-widest mb-3">OPERATING MODE</p>
            <div className="space-y-2">
              <button
                onClick={() => setIsReceptionPaused(false)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                  !isReceptionPaused 
                    ? 'bg-[#FFF7ED] border-2 border-[#FD780F] text-[#FD780F]' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Play className="w-5 h-5" />
                <span className="font-medium">通常営業</span>
              </button>
              <button
                onClick={() => setIsReceptionPaused(true)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                  isReceptionPaused 
                    ? 'bg-gray-100 border-2 border-gray-400 text-gray-700' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Pause className="w-5 h-5" />
                <span className="font-medium">受付一時停止</span>
              </button>
            </div>
          </div>

          {/* Analysis & Reports */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 tracking-widest mb-3">ANALYSIS & REPORTS</p>
            <div className="space-y-2">
              <button
                onClick={() => handleNavigate('analytics')}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#082752] text-white rounded-xl hover:bg-[#0a3060] transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">分析・ダッシュボード</span>
              </button>
              <button
                onClick={() => handleNavigate('reviews')}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border-2 border-[#082752] text-[#082752] rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">レビュー分析</span>
              </button>
            </div>
          </div>

          {/* Menu */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 tracking-widest mb-3">MENU</p>
            <button
              onClick={() => handleNavigate('settings')}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-[#082752]">詳細設定</span>
            </button>
          </div>

          {/* Finish Day */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 tracking-widest mb-3">FINISH DAY</p>
            {showEndConfirm ? (
              <div className="bg-[#DC2626] rounded-xl p-4">
                <p className="text-white text-sm text-center mb-4">
                  営業を終了し集計画面へ進みます。よろしいですか？
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleEndBusinessConfirm}
                    className="flex-1 py-3 bg-white text-[#DC2626] rounded-xl font-medium hover:bg-gray-100 transition-colors"
                  >
                    はい
                  </button>
                  <button
                    onClick={() => setShowEndConfirm(false)}
                    className="flex-1 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowEndConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#FEE2E2] text-[#DC2626] rounded-xl hover:bg-[#FECACA] transition-colors"
              >
                <Power className="w-5 h-5" />
                <span className="font-medium">本日の営業を終了</span>
              </button>
            )}
          </div>

          {/* Wait Time Offset */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 tracking-widest mb-3">WAIT TIME OFFSET</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-[#082752]">{waitTimeOffset}</span>
                <span className="text-sm text-gray-400 tracking-widest">MINUTES</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setWaitTimeOffset(waitTimeOffset + 10)}
                  className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-medium text-[#082752] hover:bg-gray-100 transition-colors"
                >
                  +10
                </button>
                <button
                  onClick={() => setWaitTimeOffset(waitTimeOffset + 20)}
                  className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-medium text-[#082752] hover:bg-gray-100 transition-colors"
                >
                  +20
                </button>
                <button
                  onClick={() => setWaitTimeOffset(0)}
                  className="flex-1 py-3 bg-gray-200 rounded-xl font-medium text-gray-500 hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium tracking-widest">LOGOUT</span>
          </button>
        </div>
      </div>
    </>
  );
}
