'use client';

import { useStore } from '@/lib/store';
import { LoginScreen } from './LoginScreen';
import { ClosedScreen } from './ClosedScreen';
import { MainDashboard } from './MainDashboard';
import { SettingsScreen } from './SettingsScreen';
import { AnalyticsScreen } from './AnalyticsScreen';
import { ReviewsScreen } from './ReviewsScreen';
import { DailyResultScreen } from './DailyResultScreen';
import { HistoryScreen } from './HistoryScreen';
import { SummaryScreen } from './SummaryScreen';

export function EtableApp() {
  const { currentScreen } = useStore();

  switch (currentScreen) {
    case 'login':
      return <LoginScreen />;
    case 'closed':
      return <ClosedScreen />;
    case 'dashboard':
      return <MainDashboard />;
    case 'settings':
      return <SettingsScreen />;
    case 'analytics':
      return <AnalyticsScreen />;
    case 'reviews':
      return <ReviewsScreen />;
    case 'daily-result':
      return <DailyResultScreen />;
    case 'history':
      return <HistoryScreen />;
    case 'summary':
      return <SummaryScreen />;
    default:
      return <LoginScreen />;
  }
}
