'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { BusinessHours, ClosedDay } from '@/lib/types';

export function SettingsScreen() {
  const { settings, updateSettings, setCurrentScreen } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [showBusinessHoursModal, setShowBusinessHoursModal] = useState(false);
  const [showClosedDayModal, setShowClosedDayModal] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setCurrentScreen('dashboard');
  };

  const handleCancel = () => {
    setCurrentScreen('dashboard');
  };

  const removeBusinessHours = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      businessHours: prev.businessHours.filter(bh => bh.id !== id)
    }));
  };

  const removeClosedDay = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      closedDays: prev.closedDays.filter(cd => cd.id !== id)
    }));
  };

  const getClosedDayLabel = (cd: ClosedDay) => {
    if (cd.type === 'weekly') {
      return `毎週${cd.day}`;
    }
    return `第${cd.week}${cd.weekday}曜日`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
        <div className="w-8" />
        <h1 className="text-lg font-bold text-[#082752]">設定</h1>
        <button
          onClick={handleCancel}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      <div className="px-4 py-6 pb-32">
        {/* Business Info Section */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#082752] mb-4">営業情報</h2>

          {/* Business Hours */}
          <div className="mb-6">
            <h3 className="text-sm text-[#FD780F] mb-3">営業時間</h3>
            <div className="space-y-3">
              {localSettings.businessHours.map(bh => (
                <div key={bh.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{bh.days.join('・')}</p>
                    <p className="font-medium text-[#082752]">{bh.startTime} ~ {bh.endTime}</p>
                  </div>
                  <button
                    onClick={() => removeBusinessHours(bh.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowBusinessHoursModal(true)}
                className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                営業時間を追加
              </button>
            </div>
          </div>

          {/* Closed Days */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-500 mb-3">定休日</h3>
            <div className="space-y-3">
              {localSettings.closedDays.map(cd => (
                <div key={cd.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <p className="font-medium text-[#082752]">{getClosedDayLabel(cd)}</p>
                  <button
                    onClick={() => removeClosedDay(cd.id)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowClosedDayModal(true)}
                className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                定休日を追加
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#082752]">順番待ち受付</p>
                <p className="text-xs text-gray-500">新規の順番待ち受付を停止します</p>
              </div>
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, acceptingReservations: !prev.acceptingReservations }))}
                className={`w-12 h-7 rounded-full transition-colors ${localSettings.acceptingReservations ? 'bg-[#082752]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${localSettings.acceptingReservations ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#082752]">本日の受付停止（例外）</p>
                <p className="text-xs text-gray-500">OFFにすると、新規の順番待ち受付を停止します</p>
              </div>
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, todayClosed: !prev.todayClosed }))}
                className={`w-12 h-7 rounded-full transition-colors ${localSettings.todayClosed ? 'bg-[#082752]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${localSettings.todayClosed ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Message Settings */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#082752] mb-4">メッセージ設定</h2>
          
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-2">呼び出しメッセージ</h3>
            <textarea
              value={localSettings.callMessage}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, callMessage: e.target.value }))}
              className="w-full p-4 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FD780F]/20 focus:border-[#FD780F]"
              rows={2}
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-[#FD780F] mb-2">
              <Clock className="w-4 h-4" />
              <span>プレビュー</span>
            </div>
            <div className="p-4 bg-[#082752] text-white rounded-xl text-sm leading-relaxed">
              <p className="font-medium mb-1">
                {localSettings.callMessage.replace('{number}', '12')}
              </p>
              <p className="text-white/70 text-xs">スタッフまでお声がけください。</p>
            </div>
          </div>
        </section>

        {/* Auto Rules */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#082752] mb-4">自動ルール設定</h2>
          
          <div>
            <h3 className="text-sm text-gray-500 mb-2">自動キャンセルに移行する時間（分）</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localSettings.autoCancelMinutes}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, autoCancelMinutes: parseInt(e.target.value) || 10 }))}
                className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FD780F]/20 focus:border-[#FD780F]"
              />
              <span className="text-gray-500">分</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-white border-t border-gray-100">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={handleCancel}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-[#082752] text-white rounded-xl font-medium hover:bg-[#0a3060] transition-colors"
          >
            保存
          </button>
        </div>
      </div>

      {/* Business Hours Modal */}
      {showBusinessHoursModal && (
        <BusinessHoursModal
          onClose={() => setShowBusinessHoursModal(false)}
          onSave={(bh) => {
            setLocalSettings(prev => ({
              ...prev,
              businessHours: [...prev.businessHours, bh]
            }));
            setShowBusinessHoursModal(false);
          }}
        />
      )}

      {/* Closed Day Modal */}
      {showClosedDayModal && (
        <ClosedDayModal
          onClose={() => setShowClosedDayModal(false)}
          onSave={(cd) => {
            setLocalSettings(prev => ({
              ...prev,
              closedDays: [...prev.closedDays, cd]
            }));
            setShowClosedDayModal(false);
          }}
        />
      )}
    </div>
  );
}

// Business Hours Modal
function BusinessHoursModal({ onClose, onSave }: { onClose: () => void; onSave: (bh: BusinessHours) => void }) {
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('20:00');

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const adjustTime = (type: 'start' | 'end', direction: 'up' | 'down') => {
    const current = type === 'start' ? startTime : endTime;
    const [hours] = current.split(':').map(Number);
    let newHours = direction === 'up' ? hours + 1 : hours - 1;
    if (newHours < 0) newHours = 23;
    if (newHours > 23) newHours = 0;
    const newTime = `${String(newHours).padStart(2, '0')}:00`;
    if (type === 'start') setStartTime(newTime);
    else setEndTime(newTime);
  };

  const handleSave = () => {
    if (selectedDays.length === 0) return;
    onSave({
      id: crypto.randomUUID(),
      days: selectedDays,
      startTime,
      endTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />
        
        <h2 className="text-xl font-bold text-[#082752] mt-4 mb-6 text-center">営業時間の設定</h2>

        {/* Time Pickers */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">開始</p>
            <div className="flex items-center gap-2">
              <button onClick={() => adjustTime('start', 'down')} className="text-gray-400 hover:text-gray-600">{'<'}</button>
              <span className="text-3xl font-bold text-[#082752]">{startTime}</span>
              <button onClick={() => adjustTime('start', 'up')} className="text-gray-400 hover:text-gray-600">{'>'}</button>
            </div>
          </div>
          <span className="text-gray-400 mt-6">〜</span>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">終了</p>
            <div className="flex items-center gap-2">
              <button onClick={() => adjustTime('end', 'down')} className="text-gray-400 hover:text-gray-600">{'<'}</button>
              <span className="text-3xl font-bold text-[#082752]">{endTime}</span>
              <button onClick={() => adjustTime('end', 'up')} className="text-gray-400 hover:text-gray-600">{'>'}</button>
            </div>
          </div>
        </div>

        {/* Day Selection */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-3">対象の曜日</p>
          <div className="grid grid-cols-4 gap-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`py-3 rounded-xl border-2 font-medium transition-colors ${
                  selectedDays.includes(day)
                    ? 'border-[#082752] bg-[#082752] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={selectedDays.length === 0}
          className="w-full py-4 bg-[#082752] text-white rounded-xl font-medium hover:bg-[#0a3060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存する
        </button>
      </div>
    </div>
  );
}

// Closed Day Modal
function ClosedDayModal({ onClose, onSave }: { onClose: () => void; onSave: (cd: ClosedDay) => void }) {
  const [type, setType] = useState<'weekly' | 'specific'>('weekly');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const days = ['月', '火', '水', '木', '金', '土', '日'];

  const handleSave = () => {
    if (type === 'weekly' && selectedDay) {
      onSave({ id: crypto.randomUUID(), type: 'weekly', day: selectedDay });
    } else if (type === 'specific' && selectedWeek && selectedDay) {
      onSave({ id: crypto.randomUUID(), type: 'specific', week: selectedWeek, weekday: selectedDay });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />
        
        <h2 className="text-xl font-bold text-[#082752] mt-4 mb-6 text-center">定休日の追加</h2>

        {/* Type Selection */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
          <button
            onClick={() => setType('weekly')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              type === 'weekly' ? 'bg-white text-[#082752] shadow-sm' : 'text-gray-500'
            }`}
          >
            毎週
          </button>
          <button
            onClick={() => setType('specific')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              type === 'specific' ? 'bg-white text-[#082752] shadow-sm' : 'text-gray-500'
            }`}
          >
            特定週
          </button>
        </div>

        {/* Week Selection (for specific) */}
        {type === 'specific' && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">第何週</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-colors ${
                    selectedWeek === week
                      ? 'border-[#082752] bg-[#082752] text-white'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  第{week}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Day Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-3 rounded-xl border-2 font-medium transition-colors ${
                  selectedDay === day
                    ? 'border-[#082752] bg-[#082752] text-white'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!selectedDay || (type === 'specific' && !selectedWeek)}
          className="w-full py-4 bg-[#082752] text-white rounded-xl font-medium hover:bg-[#0a3060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="text-lg">✓</span>
          ルールを追加する
        </button>
      </div>
    </div>
  );
}
