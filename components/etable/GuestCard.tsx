'use client';

import { useState, useEffect } from 'react';
import { Check, Phone, ArrowRight, MoreVertical, Clock, Pause, Timer, X, LogIn } from 'lucide-react';
import type { Guest } from '@/lib/types';
import { useStore } from '@/lib/store';

interface GuestCardProps {
  guest: Guest;
  onCall: (id: string) => void;
}

function formatElapsedTime(startTime: number): string {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getSeatTypeLabel(seatType: string): string {
  switch (seatType) {
    case 'TABLE': return 'テーブル';
    case 'COUNTER': return 'カウンター';
    default: return 'どちらでも';
  }
}

export function GuestCard({ guest, onCall }: GuestCardProps) {
  const { updateGuestStatus, removeGuest } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('0:00');

  // Timer for elapsed time
  useEffect(() => {
    if (guest.status === 'CALLING' && guest.calledAt) {
      const interval = setInterval(() => {
        setElapsedTime(formatElapsedTime(guest.calledAt!));
      }, 1000);
      return () => clearInterval(interval);
    }
    if (guest.status === 'GUIDING' && guest.guidedAt) {
      const interval = setInterval(() => {
        setElapsedTime(formatElapsedTime(guest.guidedAt!));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [guest.status, guest.calledAt, guest.guidedAt]);

  const getStatusBadge = () => {
    switch (guest.status) {
      case 'CALLING':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#FD780F] text-white">
            案内待ち
          </span>
        );
      case 'GUIDING':
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#22C55E] text-white">
            案内中
          </span>
        );
      default:
        return null;
    }
  };

  const getCardBgColor = () => {
    switch (guest.status) {
      case 'CALLING':
        return 'bg-gradient-to-r from-[#FFF7ED] to-white';
      case 'GUIDING':
        return 'bg-gradient-to-r from-[#F0FDF4] to-white';
      default:
        return 'bg-white';
    }
  };

  const getActionButton = () => {
    switch (guest.status) {
      case 'WAITING':
        return (
          <button
            onClick={() => onCall(guest.id)}
            className="flex flex-col items-center justify-center bg-[#082752] text-white w-28 h-full min-h-[120px] hover:bg-[#0a3060] transition-colors rounded-l-none rounded-r-2xl"
          >
            <Phone className="w-7 h-7 mb-2" />
            <span className="text-sm font-medium">呼び出し</span>
          </button>
        );
      case 'CALLING':
        return (
          <button
            onClick={() => updateGuestStatus(guest.id, 'GUIDING')}
            className="flex flex-col items-center justify-center bg-[#22C55E] text-white w-28 h-full min-h-[120px] hover:bg-[#16A34A] transition-colors rounded-l-none rounded-r-2xl"
          >
            <ArrowRight className="w-7 h-7 mb-2" />
            <span className="text-sm font-medium">案内する</span>
          </button>
        );
      case 'GUIDING':
        return (
          <button
            onClick={() => updateGuestStatus(guest.id, 'COMPLETED')}
            className="flex flex-col items-center justify-center bg-[#FD780F] text-white w-28 h-full min-h-[120px] hover:bg-[#e56d0d] transition-colors rounded-l-none rounded-r-2xl"
          >
            <LogIn className="w-7 h-7 mb-2" />
            <span className="text-sm font-medium">案内完了</span>
          </button>
        );
      default:
        return null;
    }
  };

  const getMenuItems = () => {
    const items = [];
    
    // WAITING status: Phone, Hold, Cancel
    if (guest.status === 'WAITING') {
      items.push({
        icon: Phone,
        label: '電話をかける',
        color: 'text-[#FD780F]',
        iconColor: 'text-[#FD780F]',
        onClick: () => {
          setMenuOpen(false);
        }
      });
      items.push({
        icon: Pause,
        label: '保留にする',
        color: 'text-[#082752]',
        iconColor: 'text-[#082752]',
        onClick: () => {
          updateGuestStatus(guest.id, 'HOLD');
          setMenuOpen(false);
        }
      });
      items.push({
        icon: X,
        label: 'キャンセル',
        color: 'text-[#FD780F]',
        iconColor: 'text-[#FD780F]',
        onClick: () => {
          updateGuestStatus(guest.id, 'CANCELLED');
          setMenuOpen(false);
        }
      });
    }

    // CALLING status: Phone, Hold, Extend Timer, Cancel
    if (guest.status === 'CALLING') {
      items.push({
        icon: Phone,
        label: '電話をかける',
        color: 'text-[#FD780F]',
        iconColor: 'text-[#FD780F]',
        onClick: () => {
          setMenuOpen(false);
        }
      });
      items.push({
        icon: Pause,
        label: '保留にする',
        color: 'text-[#082752]',
        iconColor: 'text-[#082752]',
        onClick: () => {
          updateGuestStatus(guest.id, 'HOLD');
          setMenuOpen(false);
        }
      });
      items.push({
        icon: Timer,
        label: 'タイマーを延長する',
        color: 'text-[#FD780F]',
        iconColor: 'text-[#FD780F]',
        onClick: () => {
          setMenuOpen(false);
        }
      });
      items.push({
        icon: X,
        label: 'キャンセル',
        color: 'text-[#FD780F]',
        iconColor: 'text-[#FD780F]',
        onClick: () => {
          updateGuestStatus(guest.id, 'CANCELLED');
          setMenuOpen(false);
        }
      });
    }

    // GUIDING status: Phone, Cancel
    if (guest.status === 'GUIDING') {
      items.push({
        icon: Phone,
        label: '電話をかける',
        color: 'text-[#FD780F]',
        iconColor: 'text-[#FD780F]',
        onClick: () => {
          setMenuOpen(false);
        }
      });
      items.push({
        icon: X,
        label: 'キャンセル',
        color: 'text-[#FD780F]',
        iconColor: 'text-[#FD780F]',
        onClick: () => {
          updateGuestStatus(guest.id, 'CANCELLED');
          setMenuOpen(false);
        }
      });
    }

    return items;
  };

  return (
    <div className={`relative rounded-2xl shadow-lg overflow-visible ${getCardBgColor()}`}>
      <div className="flex">
        {/* Left dots indicator */}
        <div className="flex flex-col justify-center gap-1 px-3 py-4">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Main content */}
        <div className="flex-1 py-5 pr-2">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-bold text-[#082752]">No.{guest.number}</span>
            {getStatusBadge()}
            
            {/* Three dot menu */}
            <div className="relative ml-auto">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-full transition-colors ${menuOpen ? 'bg-gray-100 ring-2 ring-[#082752]' : 'hover:bg-gray-100'}`}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Info row */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4" />
            <span>{guest.partySize}名</span>
            <span className="text-gray-300">|</span>
            <span>{getSeatTypeLabel(guest.seatType)}</span>
          </div>

          {/* Timer row */}
          {guest.status === 'CALLING' && guest.calledAt && (
            <div className="flex items-center gap-1 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-xs text-[#FD780F] border border-orange-200">
                <Clock className="w-3 h-3" />
                呼び出しから {elapsedTime}
              </span>
            </div>
          )}
          {guest.status === 'GUIDING' && guest.guidedAt && (
            <div className="flex items-center gap-1 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-xs text-[#22C55E] border border-green-200">
                <Clock className="w-3 h-3" />
                案内から {elapsedTime}
              </span>
            </div>
          )}
        </div>

        {/* Action button - right side with square corners on right */}
        <div className="flex-shrink-0">
          {getActionButton()}
        </div>
      </div>

      {/* Dropdown menu - positioned with high z-index */}
      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-14 left-8 z-[110] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[200px]">
            {getMenuItems().map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
