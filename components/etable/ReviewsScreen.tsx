'use client';

import { ArrowLeft, Star, Tag } from 'lucide-react';
import { useStore } from '@/lib/store';

const keywords = ['#親切', '#長い', '#清潔', '#美味しい', '#丁寧', '#遅い'];

const reviews = [
  {
    name: '田中 太郎',
    initial: '田',
    rating: 5,
    date: '2026/3/14',
    comment: '接客が非常に丁寧で、料理も美味しかったです。また来ます！',
  },
  {
    name: '佐藤 美咲',
    initial: '佐',
    rating: 4,
    date: '2026/3/13',
    comment: '待ち時間は少し長かったですが、事前に説明があったので納得できました。',
  },
  {
    name: '鈴木 一郎',
    initial: '鈴',
    rating: 3,
    date: '2026/3/12',
    comment: '味は良いのですが、呼び出し後の案内が少しスムーズではなかったです。',
  },
  {
    name: '高橋 健二',
    initial: '高',
    rating: 5,
    date: '2026/3/11',
    comment: '清潔感のある店内で、家族連れでも安心して利用できました。',
  },
  {
    name: '伊藤 恵',
    initial: '伊',
    rating: 2,
    date: '2026/3/10',
    comment: '混雑していたせいか、注文してから出てくるまでが遅かったです。',
  },
];

export function ReviewsScreen() {
  const { setCurrentScreen } = useStore();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= rating ? 'text-[#FD780F] fill-[#FD780F]' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center z-10">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#082752]" />
        </button>
        <h1 className="text-lg font-bold text-[#082752] ml-2">レビュー分析</h1>
      </header>

      <div className="px-4 py-6">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <p className="text-xs text-gray-500 mb-2">総合スコア</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-[#082752]">3.8</span>
            <span className="text-sm text-gray-400">/5.0</span>
            <div className="ml-auto flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i <= 4 ? 'text-[#FD780F] fill-[#FD780F]' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-[#082752] to-[#0a3060] rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#FD780F] rounded-full flex items-center justify-center">
              <span className="text-xs text-white">AI</span>
            </div>
            <span className="text-sm text-white/70">AI要約分析</span>
          </div>
          <p className="text-white text-sm leading-relaxed">
            今週は接客や店内の清潔さが高評価ですが、混雑時の待ち時間や料理の提供スピードに一部不満が出ています。
            待ち時間の事前説明を徹底することで、顧客満足度を維持できています。
          </p>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">主なキーワード</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  keyword.includes('長い') || keyword.includes('遅い')
                    ? 'bg-orange-100 text-[#FD780F]'
                    : 'bg-blue-50 text-[#082752]'
                }`}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Review List */}
        <div>
          <p className="text-xs text-gray-500 mb-3">レビュー一覧：{reviews.length}件</p>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-[#082752]">
                    {review.initial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-[#082752]">{review.name}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
