'use client';

import { useState } from 'react';
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Guest } from '@/lib/types';

type HistoryTab = 'all' | 'completed' | 'cancelled';

export function HistoryScreen() {
  const { setCurrentScreen, guests, updateGuestStatus } = useStore();
  const [activeTab, setActiveTab] = useState<HistoryTab>('all');

  // Get completed and cancelled guests from store
  const historyGuests = guests.filter(
    (g) => g.status === 'COMPLETED' || g.status === 'CANCELLED'
  );

  const completedGuests = historyGuests.filter((g) => g.status === 'COMPLETED');
  const cancelledGuests = historyGuests.filter((g) => g.status === 'CANCELLED');

  const filteredGuests = (() => {
    switch (activeTab) {
      case 'completed':
        return completedGuests;
      case 'cancelled':
        return cancelledGuests;
      default:
        return historyGuests;
    }
  })();

  // Sort by number descending (newest first)
  const sortedGuests = [...filteredGuests].sort((a, b) => b.number - a.number);

  // Calculate wait time in minutes
  const getWaitTime = (guest: Guest) => {
    const waitMs = guest.calledAt
      ? guest.calledAt - guest.createdAt
      : Date.now() - guest.createdAt;
    return Math.floor(waitMs / 60000);
  };

  const handleRestore = (guestId: string) => {
    updateGuestStatus(guestId, 'WAITING');
  };

  const tabs: { key: HistoryTab; label: string; count: number }[] = [
    { key: 'all', label: 'すべて', count: historyGuests.length },
    { key: 'completed', label: '案内済', count: completedGuests.length },
    { key: 'cancelled', label: 'キャンセル', count: cancelledGuests.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white px-4 py-4 flex items-center z-10 border-b border-gray-100">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="w-10 h-10 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-[#082752]" />
        </button>
        <h1 className="text-xl font-bold text-[#082752] ml-2">案内・キャンセル履歴</h1>
      </header>

      {/* Tab Menu */}
      <div className="bg-white px-4 pt-6 pb-0 border-b border-gray-100">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-2 pb-4 relative"
            >
              <span
                className={`text-base font-medium transition-colors ${
                  activeTab === tab.key ? 'text-[#FD780F]' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`min-w-[24px] h-6 px-2 rounded-full text-sm flex items-center justify-center ${
                  activeTab === tab.key
                    ? 'bg-orange-100 text-[#FD780F]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#FD780F] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="px-4 py-4">
        <div className="space-y-3">
          {sortedGuests.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              履歴がありません
            </div>
          ) : (
            sortedGuests.map((guest) => (
              <div
                key={guest.id}
                className="bg-white rounded-[32px] p-5 border border-gray-100 flex items-center"
              >
                {/* Left: Number Section */}
                <div className="pr-5 border-r border-gray-200 text-center min-w-[60px]">
                  <span className="text-xs text-gray-400 tracking-wider">NO.</span>
                  <p className="text-3xl font-bold text-[#082752]">{guest.number}</p>
                </div>

                {/* Center: Info Section */}
                <div className="flex-1 pl-5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-bold text-[#082752]">
                      {guest.partySize}名
                    </span>
                    {guest.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" />
                        案内完了
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-sm font-medium">
                        <X className="w-4 h-4" />
                        店舗側でキャンセル
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    待機: {getWaitTime(guest)} 分
                  </p>
                </div>

                {/* Right: Restore Button */}
                <button
                  onClick={() => handleRestore(guest.id)}
                  className="flex flex-col items-center gap-1 p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400">復元</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
