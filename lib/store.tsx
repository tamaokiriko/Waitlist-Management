'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Guest, GuestStatus, Settings, AppScreen, FilterTab, SeatType, NotificationMethod } from './types';

interface StoreContextType {
  // App State
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  isReceptionPaused: boolean;
  setIsReceptionPaused: (paused: boolean) => void;
  
  // Guests
  guests: Guest[];
  addGuest: (partySize: number, seatType: SeatType) => void;
  updateGuestStatus: (id: string, status: GuestStatus, notificationMethod?: NotificationMethod) => void;
  removeGuest: (id: string) => void;
  resetGuests: () => void;
  
  // Filter
  filterTab: FilterTab;
  setFilterTab: (tab: FilterTab) => void;
  
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Wait Time Offset
  waitTimeOffset: number;
  setWaitTimeOffset: (offset: number) => void;
  
  // Computed
  waitingCount: number;
  callingCount: number;
  guidingCount: number;
  holdCount: number;
  estimatedWaitTime: number;
  filteredGuests: Guest[];
  holdGuests: Guest[];
  todayGuidedCount: number;
  cancelledCount: number;
}

const defaultSettings: Settings = {
  businessHours: [
    { id: '1', days: ['月', '火', '水', '木', '金'], startTime: '10:00', endTime: '20:00' },
    { id: '2', days: ['土', '日'], startTime: '11:00', endTime: '22:00' },
  ],
  closedDays: [
    { id: '1', type: 'weekly', day: '月' },
    { id: '2', type: 'specific', week: 3, weekday: '水' },
  ],
  acceptingReservations: true,
  todayClosed: false,
  callMessage: '番号{number}のお客様、ご来店をお願いいたします。',
  autoCancelMinutes: 10,
};

// Sample initial guests for demo
const initialGuests: Guest[] = [
  { id: '1', number: 1, partySize: 2, seatType: 'TABLE', status: 'WAITING', createdAt: Date.now() - 300000 },
  { id: '2', number: 2, partySize: 4, seatType: 'TABLE', status: 'WAITING', createdAt: Date.now() - 240000 },
  { id: '4', number: 4, partySize: 2, seatType: 'ANY', status: 'WAITING', createdAt: Date.now() - 120000 },
];

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [isReceptionPaused, setIsReceptionPaused] = useState(false);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nextNumber, setNextNumber] = useState(5);
  const [todayGuidedCount, setTodayGuidedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [waitTimeOffset, setWaitTimeOffset] = useState(0);

  const addGuest = useCallback((partySize: number, seatType: SeatType) => {
    const newGuest: Guest = {
      id: crypto.randomUUID(),
      number: nextNumber,
      partySize,
      seatType,
      status: 'WAITING',
      createdAt: Date.now(),
    };
    setGuests(prev => [...prev, newGuest]);
    setNextNumber(prev => prev + 1);
  }, [nextNumber]);

  const updateGuestStatus = useCallback((id: string, status: GuestStatus, notificationMethod?: NotificationMethod) => {
    setGuests(prev => prev.map(guest => {
      if (guest.id !== id) return guest;
      
      const updates: Partial<Guest> = { status };
      
      if (status === 'CALLING') {
        updates.calledAt = Date.now();
        updates.notificationMethod = notificationMethod;
      } else if (status === 'GUIDING') {
        updates.guidedAt = Date.now();
      } else if (status === 'HOLD') {
        updates.holdAt = Date.now();
      } else if (status === 'COMPLETED') {
        setTodayGuidedCount(prev => prev + 1);
      } else if (status === 'CANCELLED') {
        setCancelledCount(prev => prev + 1);
      }
      
      return { ...guest, ...updates };
    }));
  }, []);

  const removeGuest = useCallback((id: string) => {
    setGuests(prev => prev.filter(guest => guest.id !== id));
  }, []);

  const resetGuests = useCallback(() => {
    setGuests([]);
    setNextNumber(1);
    setTodayGuidedCount(0);
    setCancelledCount(0);
    setWaitTimeOffset(0);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Computed values
  const activeGuests = guests.filter(g => !['COMPLETED', 'CANCELLED', 'HOLD'].includes(g.status));
  const waitingCount = guests.filter(g => g.status === 'WAITING').length;
  const callingCount = guests.filter(g => g.status === 'CALLING').length;
  const guidingCount = guests.filter(g => g.status === 'GUIDING').length;
  const holdCount = guests.filter(g => g.status === 'HOLD').length;
  const estimatedWaitTime = (waitingCount * 10) + waitTimeOffset;
  
  const holdGuests = guests.filter(g => g.status === 'HOLD');
  
  const filteredGuests = activeGuests.filter(guest => {
    switch (filterTab) {
      case '1-2':
        return guest.partySize <= 2;
      case 'table':
        return guest.seatType === 'TABLE';
      case 'counter':
        return guest.seatType === 'COUNTER';
      default:
        return true;
    }
  }).sort((a, b) => {
    // Sort by status priority: GUIDING > CALLING > WAITING
    const statusOrder = { GUIDING: 0, CALLING: 1, WAITING: 2 };
    const orderA = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
    const orderB = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
    if (orderA !== orderB) return orderA - orderB;
    return a.createdAt - b.createdAt;
  });

  return (
    <StoreContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      isReceptionPaused,
      setIsReceptionPaused,
      guests,
      addGuest,
      updateGuestStatus,
      removeGuest,
      resetGuests,
      filterTab,
      setFilterTab,
      settings,
      updateSettings,
      sidebarOpen,
      setSidebarOpen,
      waitTimeOffset,
      setWaitTimeOffset,
      waitingCount,
      callingCount,
      guidingCount,
      holdCount,
      estimatedWaitTime,
      filteredGuests,
      holdGuests,
      todayGuidedCount,
      cancelledCount,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
