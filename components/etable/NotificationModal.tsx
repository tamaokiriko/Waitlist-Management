'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Mail, Send } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { NotificationMethod } from '@/lib/types';

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  guestId: string | null;
}

export function NotificationModal({ open, onClose, guestId }: NotificationModalProps) {
  const { guests, updateGuestStatus } = useStore();
  const [selectedMethod, setSelectedMethod] = useState<NotificationMethod | null>(null);

  const guest = guests.find(g => g.id === guestId);

  useEffect(() => {
    if (open) {
      setSelectedMethod(null);
    }
  }, [open]);

  if (!open || !guest) return null;

  const getPreviewMessage = () => {
    if (selectedMethod === 'LINE') {
      return `まもなくご案内です！整理券No.${guest.number}をご用意ください。[詳細を確認するボタン]`;
    }
    if (selectedMethod === 'EMAIL') {
      const position = guests.filter(g => g.status === 'WAITING').findIndex(g => g.id === guest.id);
      return `【ETABLE】あと${position + 1}組でご案内予定です。店頭へお越しください。(No.${guest.number})`;
    }
    return '';
  };

  const handleSend = () => {
    if (!selectedMethod) return;
    updateGuestStatus(guest.id, 'CALLING', selectedMethod);
    onClose();
  };

  const getButtonColor = () => {
    if (selectedMethod === 'LINE') return 'bg-[#22C55E] hover:bg-[#16A34A]';
    if (selectedMethod === 'EMAIL') return 'bg-[#082752] hover:bg-[#0a3060]';
    return 'bg-gray-300 cursor-not-allowed';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#082752] mb-8">通知手段の選択</h2>

        {/* Target Guest */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 mb-2">呼び出し対象</p>
          <p className="text-5xl font-bold text-[#FD780F]">No.{guest.number}</p>
        </div>

        {/* Method Selection */}
        <div className="flex justify-center gap-6 mb-8">
          {/* LINE */}
          <button
            onClick={() => setSelectedMethod('LINE')}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
              selectedMethod === 'LINE'
                ? 'border-[#22C55E] bg-[#DCFCE7]'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}>
              <MessageCircle className={`w-8 h-8 ${selectedMethod === 'LINE' ? 'text-[#22C55E]' : 'text-gray-400'}`} />
            </div>
            <span className={`text-sm font-bold ${selectedMethod === 'LINE' ? 'text-[#082752]' : 'text-gray-500'}`}>
              LINE
            </span>
          </button>

          {/* Email */}
          <button
            onClick={() => setSelectedMethod('EMAIL')}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
              selectedMethod === 'EMAIL'
                ? 'border-[#082752] bg-[#082752]'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}>
              <Mail className={`w-8 h-8 ${selectedMethod === 'EMAIL' ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <span className={`text-sm font-bold ${selectedMethod === 'EMAIL' ? 'text-[#082752]' : 'text-gray-500'}`}>
              メール
            </span>
          </button>
        </div>

        {/* Preview */}
        {selectedMethod && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2">送信内容プレビュー</p>
            <div className="p-4 bg-gray-100 rounded-xl text-sm text-gray-700 leading-relaxed">
              {getPreviewMessage()}
            </div>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!selectedMethod}
          className={`w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors ${getButtonColor()}`}
        >
          <Send className="w-5 h-5" />
          <span>通知を送信して呼び出す</span>
        </button>
      </div>
    </div>
  );
}
