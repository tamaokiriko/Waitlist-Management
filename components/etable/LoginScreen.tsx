'use client';

import { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export function LoginScreen() {
  const { setCurrentScreen } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setCurrentScreen('closed');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-[#FD780F]">E</span>
            <span className="text-[#082752]">TABLE</span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <p className="text-xs tracking-[0.3em] text-gray-400 mb-12">
          PREMIUM WAITLIST APP
        </p>

        {/* Form */}
        <div className="space-y-4">
          {/* Email Input */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-4">
            <User className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="電話番号 または メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-4">
            <Lock className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full mt-6 bg-gradient-to-r from-[#FD780F] to-[#FFB347] text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all"
          >
            <span>ログイン</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-16">
          &copy; 2025 ETABLE. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
