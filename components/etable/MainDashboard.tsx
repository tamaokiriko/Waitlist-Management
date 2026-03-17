'use client';

import { useState } from 'react';
import { Menu, UserPlus } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { FilterTab } from '@/lib/types';
import { GuestCard } from './GuestCard';
import { HoldSection } from './HoldSection';
import { NotificationModal } from './NotificationModal';
import { Sidebar } from './Sidebar';

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: '1-2', label: '1〜2名' },
  { key: 'table', label: 'テーブル' },
  { key: 'counter', label: 'カウンター' },
];

export function MainDashboard() {
  const {
    waitingCount,
    callingCount,
    guidingCount,
    estimatedWaitTime,
    filterTab,
    setFilterTab,
    filteredGuests,
    sidebarOpen,
    setSidebarOpen,
    setCurrentScreen,
  } = useStore();

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  const handleCallGuest = (id: string) => {
    setSelectedGuestId(id);
    setCallModalOpen(true);
  };

  const handleCallNextGuest = () => {
    const nextGuest = filteredGuests.find(g => g.status === 'WAITING');
    if (nextGuest) {
      handleCallGuest(nextGuest.id);
    }
  };

  const hasWaitingGuests = filteredGuests.some(g => g.status === 'WAITING');

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-[#FD780F] text-white px-4 pt-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <h1 className="text-xl font-bold tracking-tight">ETABLE</h1>

            {/* History Button */}
            <button
              onClick={() => setCurrentScreen('history')}
              className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium"
            >
              履歴
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">{waitingCount}</span>
                <span className="text-lg">組待ち</span>
              </div>
              <p className="text-sm opacity-90 mt-1">
                予想待ち時間：約 <span className="font-semibold">{estimatedWaitTime}</span> 分
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm flex items-center gap-2">
                <span>呼び出し中</span>
                <span className="font-bold">{callingCount}</span>
              </div>
              {guidingCount > 0 && (
                <div className="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm flex items-center gap-2">
                  <span>案内中</span>
                  <span className="font-bold">{guidingCount}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  filterTab === tab.key
                    ? 'text-[#FD780F]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {filterTab === tab.key && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#FD780F] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Guest List */}
        <div className="flex-1 px-4 py-4 space-y-4 overflow-auto">
          {filteredGuests.map(guest => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onCall={handleCallGuest}
            />
          ))}
        </div>

        {/* Hold Section */}
        <HoldSection />

        {/* Floating Action Button */}
        {hasWaitingGuests && (
          <div className="fixed bottom-8 right-6 z-50">
            <button
              onClick={handleCallNextGuest}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#FD780F] rounded-full flex items-center justify-center shadow-lg shadow-orange-300 mb-2">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <span className="px-3 py-1.5 bg-[#082752] text-white text-xs rounded-full font-medium">
                次を呼び出す
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Call Modal */}
      <NotificationModal
        open={callModalOpen}
        onClose={() => {
          setCallModalOpen(false);
          setSelectedGuestId(null);
        }}
        guestId={selectedGuestId}
      />
    </>
  );
}
