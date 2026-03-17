'use client';

import { useStore } from '@/lib/store';

export function HoldSection() {
  const { holdGuests, holdCount, updateGuestStatus, removeGuest } = useStore();

  if (holdCount === 0) return null;

  return (
    <div className="px-4 py-4">
      {/* Section header with line */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-gray-500 whitespace-nowrap">保留中：{holdCount}名</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="space-y-3">
        {holdGuests.map(guest => (
          <div 
            key={guest.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Guest info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-[#082752]">No.{guest.number}</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#FD780F] text-white">
                    保留
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {guest.partySize}名 / {guest.seatType === 'TABLE' ? 'テーブル' : guest.seatType === 'COUNTER' ? 'カウンター' : 'どちらでも'}
                </p>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeGuest(guest.id)}
                  className="px-4 py-2 text-sm font-medium text-[#FD780F] hover:bg-orange-50 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => updateGuestStatus(guest.id, 'WAITING')}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-[#082752]"
                >
                  待機に戻す
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
