// extracted from index.html (inline scripts)

// モーダルの表示・非表示
function toggleBusinessModal(show) {
  const modal = document.getElementById('business-hours-modal');
  modal.classList.toggle('hidden', !show);
  if (show) {
    // 開く時に初期化
    document.querySelectorAll('.day-select-btn').forEach(btn => {
      btn.classList.remove('bg-[#082752]', 'text-white', 'border-[#082752]');
    });
  }
}

// 定休日追加モーダル（ハーフモーダル）
let closedWeeklyDay = null; // "月"など
let closedSpecificWeek = null; // 1..4
let closedSpecificDay = null; // "月"など
let closedActiveMode = 'weekly'; // 'weekly' | 'specific'

function toggleClosedDaysModal(show) {
  const modal = document.getElementById('closed-days-modal');
  if (!modal) return;
  modal.classList.toggle('hidden', !show);
}

function updateClosedAddButtonState() {
  const addBtn = document.getElementById('add-closed-rule');
  if (!addBtn) return;

  const canAdd =
    closedActiveMode === 'weekly'
      ? !!closedWeeklyDay
      : !!closedSpecificWeek && !!closedSpecificDay;

  addBtn.disabled = !canAdd;

  if (canAdd) {
    addBtn.className =
      'mt-6 w-full py-5 bg-[#082752] text-white rounded-3xl font-bold text-lg active:scale-95 transition-transform';
  } else {
    addBtn.className =
      'mt-6 w-full py-5 bg-gray-100 text-gray-400 rounded-3xl font-bold text-lg cursor-not-allowed transition-transform';
  }
}

function initClosedDaysModal() {
  closedWeeklyDay = null;
  closedSpecificWeek = null;
  closedSpecificDay = null;
  closedActiveMode = 'weekly';

  const weeklyTab = document.getElementById('closed-days-tab-weekly');
  const specificTab = document.getElementById('closed-days-tab-specific');
  const weeklyPanel = document.getElementById('closed-days-panel-weekly');
  const specificPanel = document.getElementById('closed-days-panel-specific');

  if (weeklyTab && specificTab) {
    weeklyTab.className =
      'flex-1 py-3 rounded-xl text-sm font-medium bg-[#082752] text-white';
    specificTab.className =
      'flex-1 py-3 rounded-xl text-sm font-medium text-gray-500';
  }
  if (weeklyPanel && specificPanel) {
    weeklyPanel.classList.remove('hidden');
    specificPanel.classList.add('hidden');
  }

  // 選択状態を確実にリセット（文字色/枠色の競合を起こさないため、初期クラスを明示的に戻す）
  document
    .querySelectorAll('#closed-days-modal .closed-day-btn, #closed-days-modal .closed-week-btn')
    .forEach((btn) => {
      btn.classList.remove('bg-[#082752]', 'text-white', 'border-[#082752]');
      btn.classList.add('bg-white', 'text-[#082752]', 'border-gray-200');
    });

  updateClosedAddButtonState();
}

function openClosedDaysModal() {
  initClosedDaysModal();
  toggleClosedDaysModal(true);
}

function setClosedRuleBtnActive(btn, active) {
  if (!btn) return;
  if (active) {
    btn.classList.add('bg-[#082752]', 'text-white', 'border-[#082752]');
    btn.classList.remove('bg-white', 'text-[#082752]', 'border-gray-200');
  } else {
    btn.classList.remove('bg-[#082752]', 'text-white', 'border-[#082752]');
    btn.classList.add('bg-white', 'text-[#082752]', 'border-gray-200');
  }
}

// 曜日の選択イベント（イベント委譲で効率化）
      // 注: クリックイベントは後述の DOMContentLoaded 側でボタン全数に対して配線します

      // クリック配線（保存/背景クローズ）は DOMContentLoaded 側で実装
    

      // React/Store のロジックをプレーンJSに移植

      const initialGuests = [
        { id: '1', number: 1, partySize: 2, seatType: 'TABLE', status: 'WAITING', createdAt: Date.now() - 300000 },
        { id: '2', number: 2, partySize: 4, seatType: 'TABLE', status: 'WAITING', createdAt: Date.now() - 240000 },
        { id: '4', number: 4, partySize: 2, seatType: 'ANY', status: 'WAITING', createdAt: Date.now() - 120000 },
      ];

      const state = {
        currentScreen: 'login',
        previousScreen: null,
        isReceptionPaused: false,
        guests: initialGuests.slice(),
        filterTab: 'all',
        historyTab: 'all', // 'all' | 'completed' | 'cancelled'
        sidebarOpen: false,
        nextNumber: 5,
        todayGuidedCount: 0,
        cancelledCount: 0,
        waitTimeOffset: 0,
        selectedGuestIdForCall: null,
        callModalOpen: false,
        // 通知設定モーダル（LINE/EMAIL選択）用
        notifyMethod: null, // 'LINE' | 'EMAIL' | null
        // カードメニューの開閉：同一操作で backdrop 側イベントが走るのを抑制
        menuToggleLockUntil: 0,
        // 右下の固定ボタン表示制御（カードメニュー表示中は非表示）
        openCardMenuId: null,
        showEndConfirm: false,
        email: '',
        password: '',
        closedSliderX: 0,
        closedIsDragging: false,
      };

      function setCurrentScreen(screen) {
        state.previousScreen = state.currentScreen;
        if (screen === 'history') {
          state.historyTab = 'all';
        }
        state.currentScreen = screen;
        render();
      }

      function setIsReceptionPaused(paused) {
        state.isReceptionPaused = paused;
        render();
      }

      function setFilterTab(tab) {
        state.filterTab = tab;
        render();
      }

      function setSidebarOpen(open) {
        state.sidebarOpen = open;
        render();
      }

      function setWaitTimeOffset(offset) {
        state.waitTimeOffset = offset;
        render();
      }

      function setHistoryTab(tab) {
        state.historyTab = tab;
        render();
      }

      function restoreGuestToWaiting(id) {
        state.guests = state.guests.map((guest) => {
          if (guest.id !== id) return guest;
          return {
            ...guest,
            status: 'WAITING',
            // 復元後は「待機の末尾」に自然に戻す
            createdAt: Date.now(),
            // 後方互換：キャンセル/完了関連フィールドがあれば解除
            cancelReason: undefined,
            calledAt: undefined,
            guidedAt: undefined,
            holdAt: undefined,
            notificationMethod: undefined,
          };
        });
        render();
      }

      function getCancelReasonLabel(cancelReason, fallbackNumber) {
        const reason = cancelReason || (() => {
          const mod = fallbackNumber % 3;
          if (mod === 0) return 'shop';
          if (mod === 1) return 'customer';
          return 'timeout';
        })();

        switch (reason) {
          case 'shop':
            return '店舗側でキャンセル';
          case 'customer':
            return 'お客様都合でキャンセル';
          case 'timeout':
            return '時間超過で自動キャンセル';
          default:
            return '時間超過で自動キャンセル';
        }
      }

      function getWaitMinutes(createdAt) {
        const diffMs = Date.now() - createdAt;
        const mins = Math.max(0, Math.floor(diffMs / 60000));
        return mins;
      }

      function addGuest(partySize, seatType) {
        const newGuest = {
          id: crypto.randomUUID(),
          number: state.nextNumber,
          partySize,
          seatType,
          status: 'WAITING',
          createdAt: Date.now(),
        };
        state.guests = [...state.guests, newGuest];
        state.nextNumber += 1;
        render();
      }

      function updateGuestStatus(id, status, notificationMethod) {
        state.guests = state.guests.map((guest) => {
          if (guest.id !== id) return guest;
          const updates = { status };
          if (status === 'CALLING') {
            updates.calledAt = Date.now();
            updates.notificationMethod = notificationMethod;
          } else if (status === 'GUIDING') {
            updates.guidedAt = Date.now();
          } else if (status === 'HOLD') {
            updates.holdAt = Date.now();
          } else if (status === 'COMPLETED') {
            state.todayGuidedCount += 1;
          } else if (status === 'CANCELLED') {
            state.cancelledCount += 1;
            // 履歴で区別表示できるようにキャンセル理由を付与（UIで選択が無いので番号に基づく簡易分類）
            if (!updates.cancelReason && !guest.cancelReason) {
              const mod = guest.number % 3;
              updates.cancelReason = mod === 0 ? 'shop' : mod === 1 ? 'customer' : 'timeout';
            } else if (guest.cancelReason) {
              updates.cancelReason = guest.cancelReason;
            }
          }
          return Object.assign({}, guest, updates);
        });
        render();
      }

      function removeGuest(id) {
        state.guests = state.guests.filter((g) => g.id !== id);
        render();
      }

      function resetGuests() {
        state.guests = [];
        state.nextNumber = 1;
        state.todayGuidedCount = 0;
        state.cancelledCount = 0;
        state.waitTimeOffset = 0;
        render();
      }

      function computeDerived() {
        const waitingCount = state.guests.filter((g) => g.status === 'WAITING').length;
        const callingCount = state.guests.filter((g) => g.status === 'CALLING').length;
        const guidingCount = state.guests.filter((g) => g.status === 'GUIDING').length;
        const holdCount = state.guests.filter((g) => g.status === 'HOLD').length;
        const estimatedWaitTime = waitingCount * 10 + state.waitTimeOffset;

        const activeGuests = state.guests.filter(
          (g) => !['COMPLETED', 'CANCELLED', 'HOLD'].includes(g.status)
        );
        let filteredGuests = activeGuests.filter((guest) => {
          switch (state.filterTab) {
            case '1-2':
              return guest.partySize <= 2;
            case 'table':
              return guest.seatType === 'TABLE';
            case 'counter':
              return guest.seatType === 'COUNTER';
            default:
              return true;
          }
        });
        filteredGuests = filteredGuests.sort((a, b) => {
          const statusOrder = { GUIDING: 0, CALLING: 1, WAITING: 2 };
          const orderA = statusOrder[a.status] ?? 3;
          const orderB = statusOrder[b.status] ?? 3;
          if (orderA !== orderB) return orderA - orderB;
          return a.createdAt - b.createdAt;
        });

        const holdGuests = state.guests.filter((g) => g.status === 'HOLD');

        return {
          waitingCount,
          callingCount,
          guidingCount,
          holdCount,
          estimatedWaitTime,
          filteredGuests,
          holdGuests,
        };
      }

      function formatElapsedTime(startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return minutes + ':' + String(seconds).padStart(2, '0');
      }

      function getSeatTypeLabel(seatType) {
        switch (seatType) {
          case 'TABLE':
            return 'テーブル';
          case 'COUNTER':
            return 'カウンター';
          default:
            return 'どちらでも';
        }
      }

      function renderLogin() {
        return (
          '<div id="login-screen" class="min-h-screen bg-white flex flex-col items-center px-6">' +
    '  <div class="w-full max-w-sm flex-1 flex flex-col items-start pt-10">' +
    '    <img src="./public/etable-logo-orange.svg" alt="ETABLE" class="login-logo-img" />' +
    '    <p id="login-subtitle" class="login-subtitle text-[11px] tracking-[0.35em] text-gray-300 mb-10 text-left">PREMIUM WAITLIST APP</p>' +
          '    <div class="w-full space-y-4">' +
          '      <div class="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4">' +
          '        <svg class="w-5 h-5 text-gray-400" stroke-width="1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Z"></path>' +
          '          <path d="M6 20c0-2.21 2.686-4 6-4s6 1.79 6 4"></path>' +
          '        </svg>' +
          '        <div class="relative flex-1">' +
          '          <div id="login-email-label" class="login-placeholder-label">電話番号 または メールアドレス</div>' +
          '          <input id="login-email" type="text" class="w-full text-sm text-gray-700 outline-none bg-transparent pr-2" />' +
          '        </div>' +
          '      </div>' +
          '      <div class="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4">' +
          '        <svg class="w-5 h-5 text-gray-400" stroke-width="1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '          <rect x="3" y="11" width="18" height="10" rx="2"></rect>' +
          '          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>' +
          '        </svg>' +
          '        <div class="relative flex-1">' +
          '          <div id="login-password-label" class="login-placeholder-label">パスワード</div>' +
          '          <input id="login-password" type="password" class="w-full text-sm text-gray-700 outline-none bg-transparent pr-2" />' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          '    <button id="login-button" class="w-full mt-6 bg-[#FD780F] text-white font-semibold h-[56px] rounded-full flex items-center justify-center gap-3 active:scale-[0.99] transition-transform">' +
          '      <span>ログイン</span>' +
          '      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '        <path d="M5 12h14"></path>' +
          '        <path d="m13 18 6-6-6-6"></path>' +
          '      </svg>' +
          '    </button>' +
          '  </div>' +
          '  <p class="text-center text-xs text-gray-400 mb-8">&copy; 2025 ETABLE. All Rights Reserved.</p>' +
          '</div>'
        );
      }

      function renderClosedScreen() {
        return (
          '<div class="min-h-screen bg-white flex flex-col">' +
          '  <div class="px-6 pt-8">' +
          '    <h1 class="text-2xl font-bold tracking-tight">' +
          '      <span class="text-[#FD780F]">E</span>' +
          '      <span class="text-[#082752]">TABLE</span>' +
          '    </h1>' +
          '  </div>' +
          '  <div class="flex-1 flex flex-col items-center justify-center px-6">' +
          '    <div class="w-28 h-28 rounded-full bg-[#FFF7ED] flex items-center justify-center mb-8">' +
          '      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FD780F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '        <circle cx="12" cy="12" r="10"></circle>' +
          '        <polyline points="12 6 12 12 16 14"></polyline>' +
          '        <line x1="4" y1="4" x2="20" y2="20"></line>' +
          '      </svg>' +
          '    </div>' +
          '    <h2 class="text-3xl font-bold text-[#082752] mb-4">受付停止中</h2>' +
          '    <p class="text-gray-400 text-center text-sm leading-relaxed">' +
          '      今日もたくさんのお客様に<br />' +
          '      美味しい体験を届けましょう。' +
          '    </p>' +
          '  </div>' +
          '  <div class="px-6 pb-12">' +
          '    <div id="closed-slider-container" class="relative bg-gray-100 rounded-full h-16 flex items-center overflow-hidden">' +
          '      <span class="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">スライドして開店</span>' +
          '      <div id="closed-slider" class="absolute left-1 top-1 bottom-1 w-14 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform" style="transform: translateX(' +
          state.closedSliderX +
          'px)">' +
          '        <svg class="w-6 h-6 text-[#FD780F]" viewBox="0 0 24 24" fill="#FD780F" stroke="#FD780F">' +
          '          <polygon points="5 3 19 12 5 21 5 3"></polygon>' +
          '        </svg>' +
          '      </div>' +
          '    </div>' +
          '  </div>' +
          '</div>'
        );
      }

      function renderGuestCard(guest) {
        // 色はコンポーネントではなく「状態」に紐づける（CSSで一元管理）
        const statusClass =
          guest.status === 'WAITING'
            ? 'status-call'
            : guest.status === 'CALLING'
            ? 'status-waiting'
            : guest.status === 'GUIDING'
            ? 'status-guiding'
            : '';

        const statusBadge =
          guest.status === 'CALLING'
            ? '<span class="status-badge">案内待ち</span>'
            : guest.status === 'GUIDING'
            ? '<span class="status-badge">案内中</span>'
            : '';

        let actionButton = '';
        if (guest.status === 'WAITING') {
          actionButton =
            '<button data-action="call" data-id="' +
            guest.id +
            '" class="action-button flex flex-col items-center justify-center text-white w-28 h-full min-h-[120px] rounded-l-none rounded-r-2xl">' +
            '  <svg class="w-7 h-7 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
            '    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.34a2 2 0 0 1-.45 2.18L8.09 9.91a16 16 0 0 0 6 6l1.67-1.24a2 2 0 0 1 2.18-.45 11.36 11.36 0 0 0 2.34.72A2 2 0 0 1 22 16.92Z"></path>' +
            '  </svg>' +
            '  <span class="text-sm font-medium">呼び出し</span>' +
            '</button>';
        } else if (guest.status === 'CALLING') {
          actionButton =
            '<button data-action="guide" data-id="' +
            guest.id +
            '" class="action-button flex flex-col items-center justify-center text-white w-28 h-full min-h-[120px] rounded-l-none rounded-r-2xl">' +
            '  <svg class="w-7 h-7 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
            '    <path d="M5 12h14"></path>' +
            '    <path d="m13 18 6-6-6-6"></path>' +
            '  </svg>' +
            '  <span class="text-sm font-medium">案内する</span>' +
            '</button>';
        } else if (guest.status === 'GUIDING') {
          actionButton =
            '<button data-action="complete" data-id="' +
            guest.id +
            '" class="action-button flex flex-col items-center justify-center text-white w-28 h-full min-h-[120px] rounded-l-none rounded-r-2xl">' +
            '  <svg class="w-7 h-7 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
            '    <path d="M19 12H9"></path>' +
            '    <path d="m12 15-3-3 3-3"></path>' +
            '  </svg>' +
            '  <span class="text-sm font-medium">案内完了</span>' +
            '</button>';
        }

        let timerRow = '';
        if (guest.status === 'CALLING' && guest.calledAt) {
          timerRow =
            '<div class="flex items-center gap-1 mt-3">' +
            '  <span class="time-badge inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs">' +
            '    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
            '      <circle cx="12" cy="12" r="10"></circle>' +
            '      <path d="M12 6v6l4 2"></path>' +
            '    </svg>' +
            '    呼び出しから <span data-elapsed-id="' +
            guest.id +
            '">' +
            formatElapsedTime(guest.calledAt) +
            '</span>' +
            '  </span>' +
            '</div>';
        } else if (guest.status === 'GUIDING' && guest.guidedAt) {
          timerRow =
            '<div class="flex items-center gap-1 mt-3">' +
            '  <span class="time-badge inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs">' +
            '    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
            '      <circle cx="12" cy="12" r="10"></circle>' +
            '      <path d="M12 6v6l4 2"></path>' +
            '    </svg>' +
            '    案内から <span data-elapsed-id="' +
            guest.id +
            '">' +
            formatElapsedTime(guest.guidedAt) +
            '</span>' +
            '  </span>' +
            '</div>';
        }

        const menuItems = []; // メニューの中身自体はロジックを維持しつつイベントで処理
        // WAITING
        if (guest.status === 'WAITING') {
          menuItems.push({
            icon: 'phone',
            label: '電話をかける',
            color: 'text-[#FD780F]',
            iconColor: 'text-[#FD780F]',
            action: 'phone',
          });
          menuItems.push({
            icon: 'pause',
            label: '保留にする',
            color: 'text-[#082752]',
            iconColor: 'text-[#082752]',
            action: 'hold',
          });
          menuItems.push({
            icon: 'x',
            label: 'キャンセル',
            color: 'text-[#FD780F]',
            iconColor: 'text-[#FD780F]',
            action: 'cancel',
          });
        }
        if (guest.status === 'CALLING') {
          menuItems.push({
            icon: 'phone',
            label: '電話をかける',
            color: 'text-[#FD780F]',
            iconColor: 'text-[#FD780F]',
            action: 'phone',
          });
          menuItems.push({
            icon: 'pause',
            label: '保留にする',
            color: 'text-[#082752]',
            iconColor: 'text-[#082752]',
            action: 'hold',
          });
          menuItems.push({
            icon: 'timer',
            label: 'タイマーを延長する',
            color: 'text-[#FD780F]',
            iconColor: 'text-[#FD780F]',
            action: 'extend',
          });
          menuItems.push({
            icon: 'x',
            label: 'キャンセル',
            color: 'text-[#FD780F]',
            iconColor: 'text-[#FD780F]',
            action: 'cancel',
          });
        }
        if (guest.status === 'GUIDING') {
          menuItems.push({
            icon: 'phone',
            label: '電話をかける',
            color: 'text-[#FD780F]',
            iconColor: 'text-[#FD780F]',
            action: 'phone',
          });
          menuItems.push({
            icon: 'x',
            label: 'キャンセル',
            color: 'text-[#FD780F]',
            iconColor: 'text-[#FD780F]',
            action: 'cancel',
          });
        }

        const menuHtml =
          '<div class="absolute top-14 left-8 z-[110] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[200px] hidden" data-menu="' +
          guest.id +
          '">' +
          menuItems
            .map(function (item) {
              let iconSvg = '';
              if (item.icon === 'phone') {
                iconSvg =
                  '<svg class="w-5 h-5 ' +
                  item.iconColor +
                  '" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                  '  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.34a2 2 0 0 1-.45 2.18L8.09 9.91a16 16 0 0 0 6 6l1.67-1.24a2 2 0 0 1 2.18-.45 11.36 11.36 0 0 0 2.34.72A2 2 0 0 1 22 16.92Z"></path>' +
                  '</svg>';
              } else if (item.icon === 'pause') {
                iconSvg =
                  '<svg class="w-5 h-5 ' +
                  item.iconColor +
                  '" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                  '  <rect x="6" y="4" width="4" height="16"></rect>' +
                  '  <rect x="14" y="4" width="4" height="16"></rect>' +
                  '</svg>';
              } else if (item.icon === 'timer') {
                iconSvg =
                  '<svg class="w-5 h-5 ' +
                  item.iconColor +
                  '" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                  '  <path d="M10 2h4"></path>' +
                  '  <path d="M12 14v-4"></path>' +
                  '  <path d="M4 13a8 8 0 1 0 8-8"></path>' +
                  '</svg>';
              } else if (item.icon === 'x') {
                iconSvg =
                  '<svg class="w-5 h-5 ' +
                  item.iconColor +
                  '" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                  '  <path d="M18 6 6 18"></path>' +
                  '  <path d="m6 6 12 12"></path>' +
                  '</svg>';
              }
              return (
                '<button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors" data-menu-action="' +
                item.action +
                '" data-id="' +
                guest.id +
                '">' +
                iconSvg +
                '<span class="text-sm font-medium ' +
                item.color +
                '">' +
                item.label +
                '</span>' +
                '</button>'
              );
            })
            .join('') +
          '</div>';

        return (
          '<div class="guest-card ' +
          statusClass +
          ' relative rounded-2xl shadow-lg overflow-visible' +
          '" data-guest-card="' +
          guest.id +
          '">' +
          '  <div class="flex">' +
          '    <div class="flex flex-col justify-center gap-1 px-3 py-4">' +
          '      <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>' +
          '      <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>' +
          '      <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>' +
          '    </div>' +
          '    <div class="flex-1 py-5 pr-2">' +
          '      <div class="flex items-center gap-3 mb-3">' +
          '        <span class="text-3xl font-bold text-[#082752]">No.' +
          guest.number +
          '</span>' +
          statusBadge +
          '        <div class="relative ml-auto">' +
          '          <button class="p-2 rounded-full transition-colors hover:bg-gray-100" data-menu-toggle="' +
          guest.id +
          '">' +
          '            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <circle cx="12" cy="5" r="1"></circle>' +
          '              <circle cx="12" cy="12" r="1"></circle>' +
          '              <circle cx="12" cy="19" r="1"></circle>' +
          '            </svg>' +
          '          </button>' +
          '        </div>' +
          '      </div>' +
          '      <div class="flex items-center gap-2 text-sm text-gray-600">' +
          '        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '          <path d="M5 13c0 3.866 3.134 7 7 7s7-3.134 7-7"></path>' +
          '          <path d="M9 11l3 3 5-5"></path>' +
          '        </svg>' +
          '        <span>' +
          guest.partySize +
          '名</span>' +
          '        <span class="text-gray-300">|</span>' +
          '        <span>' +
          getSeatTypeLabel(guest.seatType) +
          '</span>' +
          '      </div>' +
          timerRow +
          '    </div>' +
          '    <div class="flex-shrink-0">' +
          actionButton +
          '    </div>' +
          '  </div>' +
          '  <div class="fixed inset-0 z-[100] hidden" data-menu-backdrop="' +
          guest.id +
          '"></div>' +
          menuHtml +
          '</div>'
        );
      }

      function renderHoldSection(holdGuests, holdCount) {
        if (holdCount === 0) return '';
        return (
          '<div class="px-4 py-4">' +
          '  <div class="flex items-center gap-3 mb-4">' +
          '    <span class="text-sm text-gray-500 whitespace-nowrap">保留中：' +
          holdCount +
          '名</span>' +
          '    <div class="flex-1 h-px bg-gray-200"></div>' +
          '  </div>' +
          '  <div class="space-y-3">' +
          holdGuests
            .map(function (guest) {
              return (
                '<div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">' +
                '  <div class="flex items-center justify-between gap-4">' +
                '    <div class="flex-1">' +
                '      <div class="flex items-center gap-2 mb-1">' +
                '        <span class="text-lg font-bold text-[#082752]">No.' +
                guest.number +
                '</span>' +
                '        <span class="px-2 py-0.5 text-xs font-medium rounded bg-[#FD780F] text-white">保留</span>' +
                '      </div>' +
                '      <p class="text-sm text-gray-500">' +
                guest.partySize +
                '名 / ' +
                (guest.seatType === 'TABLE'
                  ? 'テーブル'
                  : guest.seatType === 'COUNTER'
                  ? 'カウンター'
                  : 'どちらでも') +
                '</p>' +
                '    </div>' +
                '    <div class="flex items-center gap-2">' +
                '      <button data-hold-cancel="' +
                guest.id +
                '" class="px-4 py-2 text-sm font-medium text-[#FD780F] hover:bg-orange-50 rounded-lg transition-colors">キャンセル</button>' +
                '      <button data-hold-back="' +
                guest.id +
                '" class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition-colors text-[#082752]">待機に戻す</button>' +
                '    </div>' +
                '  </div>' +
                '</div>'
              );
            })
            .join('') +
          '  </div>' +
          '</div>'
        );
      }

      function renderSidebar(derived) {
        if (!state.sidebarOpen) return '';
        return (
          '<div>' +
          '  <div class="fixed inset-0 z-40 bg-black/50" id="sidebar-backdrop"></div>' +
          '  <div class="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl flex flex-col" id="sidebar-panel">' +
          '    <div class="p-6 border-b border-gray-100">' +
          '      <div class="flex items-center justify-between">' +
          '        <h1 class="text-xl font-bold tracking-tight">' +
          '          <span class="text-[#FD780F]">E</span>' +
          '          <span class="text-[#082752]">TABLE</span>' +
          '        </h1>' +
          '        <button id="sidebar-close" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">' +
          '          <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <path d="M18 6 6 18"></path>' +
          '            <path d="m6 6 12 12"></path>' +
          '          </svg>' +
          '        </button>' +
          '      </div>' +
          '    </div>' +
          '    <div class="flex-1 overflow-y-auto px-6 py-4">' +
          '      <div class="mb-6">' +
          '        <p class="text-xs text-gray-400 tracking-widest mb-3">OPERATING MODE</p>' +
          '        <div class="space-y-2">' +
          '          <button id="mode-normal" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ' +
          (!state.isReceptionPaused
            ? 'bg-[#FFF7ED] border-2 border-[#FD780F] text-[#FD780F]'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100') +
          '">' +
          '            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <polygon points="5 3 19 12 5 21 5 3"></polygon>' +
          '            </svg>' +
          '            <span class="font-medium">通常営業</span>' +
          '          </button>' +
          '          <button id="mode-paused" class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ' +
          (state.isReceptionPaused
            ? 'bg-gray-100 border-2 border-gray-400 text-gray-700'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100') +
          '">' +
          '            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <rect x="6" y="4" width="4" height="16"></rect>' +
          '              <rect x="14" y="4" width="4" height="16"></rect>' +
          '            </svg>' +
          '            <span class="font-medium">受付一時停止</span>' +
          '          </button>' +
          '        </div>' +
          '      </div>' +
          '      <div class="mb-6">' +
          '        <p class="text-xs text-gray-400 tracking-widest mb-3">ANALYSIS & REPORTS</p>' +
          '        <div class="space-y-2">' +
          '          <button id="nav-analytics" class="w-full flex items-center gap-3 px-4 py-3.5 bg-[#082752] text-white rounded-xl hover:bg-[#0a3060] transition-colors">' +
          '            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <path d="M3 3v18h18"></path>' +
          '              <path d="M7 13l3-3 4 4 5-5"></path>' +
          '            </svg>' +
          '            <span class="font-medium">分析・ダッシュボード</span>' +
          '          </button>' +
          '          <button id="nav-reviews" class="w-full flex items-center gap-3 px-4 py-3.5 bg-white border-2 border-[#082752] text-[#082752] rounded-xl hover:bg-gray-50 transition-colors">' +
          '            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>' +
          '            </svg>' +
          '            <span class="font-medium">レビュー分析</span>' +
          '          </button>' +
          '        </div>' +
          '      </div>' +
          '      <div class="mb-6">' +
          '        <p class="text-xs text-gray-400 tracking-widest mb-3">MENU</p>' +
          '        <button id="nav-settings" class="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">' +
          '          <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <circle cx="12" cy="12" r="3"></circle>' +
          '            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l0 0a2 2 0 1 1-2.83 2.83l0 0A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l0 0a2 2 0 1 1-3.32 0l0 0A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82-.33l0 0a2 2 0 1 1-2.83-2.83l0 0A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l0 0a2 2 0 1 1 0-3.32l0 0A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l0 0a2 2 0 1 1 2.83-2.83l0 0A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82l0 0a2 2 0 1 1 3.32 0l0 0A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1-.6l0 0a2 2 0 1 1 2.83 2.83l0 0A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 0 5Z"></path>' +
          '          </svg>' +
          '          <span class="font-medium text-[#082752]">詳細設定</span>' +
          '        </button>' +
          '      </div>' +
          '      <div class="mb-6">' +
          '        <p class="text-xs text-gray-400 tracking-widest mb-3">FINISH DAY</p>' +
          (state.showEndConfirm
            ? '<div class="bg-[#DC2626] rounded-xl p-4">' +
              '  <p class="text-white text-sm text-center mb-4">営業を終了し集計画面へ進みます。よろしいですか？</p>' +
              '  <div class="flex gap-2">' +
              '    <button id="finish-day-yes" class="flex-1 py-3 bg-white text-[#DC2626] rounded-xl font-medium hover:bg-gray-100 transition-colors">はい</button>' +
              '    <button id="finish-day-cancel" class="flex-1 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors">キャンセル</button>' +
              '  </div>' +
              '</div>'
            : '<button id="finish-day" class="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#FEE2E2] text-[#DC2626] rounded-xl hover:bg-[#FECACA] transition-colors">' +
              '  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
              '    <path d="M18 6 6 18"></path>' +
              '    <path d="m6 6 12 12"></path>' +
              '  </svg>' +
              '  <span class="font-medium">本日の営業を終了</span>' +
              '</button>') +
          '      </div>' +
          '      <div class="mb-6">' +
          '        <p class="text-xs text-gray-400 tracking-widest mb-3">WAIT TIME OFFSET</p>' +
          '        <div class="bg-gray-50 rounded-xl p-4">' +
          '          <div class="flex items-baseline justify-center gap-2 mb-4">' +
          '            <span class="text-5xl font-bold text-[#082752]">' +
          state.waitTimeOffset +
          '</span>' +
          '            <span class="text-sm text-gray-400 tracking-widest">MINUTES</span>' +
          '          </div>' +
          '          <div class="flex gap-2">' +
          '            <button id="offset-plus-10" class="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-medium text-[#082752] hover:bg-gray-100 transition-colors">+10</button>' +
          '            <button id="offset-plus-20" class="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-medium text-[#082752] hover:bg-gray-100 transition-colors">+20</button>' +
          '            <button id="offset-reset" class="flex-1 py-3 bg-gray-200 rounded-xl font-medium text-gray-500 hover:bg-gray-300 transition-colors flex items-center justify-center">' +
          '              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '                <polyline points="1 4 1 10 7 10"></polyline>' +
          '                <path d="M3.51 15a9 9 0 1 0 .49-5"></path>' +
          '              </svg>' +
          '            </button>' +
          '          </div>' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          '    <div class="p-6 border-t border-gray-100">' +
          '      <button id="logout" class="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors">' +
          '        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>' +
          '          <polyline points="16 17 21 12 16 7"></polyline>' +
          '          <line x1="21" y1="12" x2="9" y2="12"></line>' +
          '        </svg>' +
          '        <span class="font-medium tracking-widest">LOGOUT</span>' +
          '      </button>' +
          '    </div>' +
          '  </div>' +
          '</div>'
        );
      }

      function renderNotificationModal(derived) {
        if (!state.callModalOpen || !state.selectedGuestIdForCall) return '';
        const guest = state.guests.find((g) => g.id === state.selectedGuestIdForCall);
        if (!guest) return '';

        const notifyMethod = state.notifyMethod; // 'LINE' | 'EMAIL' | null
        const isLine = notifyMethod === 'LINE';
        const isEmail = notifyMethod === 'EMAIL';

        const previewText = (() => {
          if (notifyMethod === 'LINE') {
            return (
              'まもなくご案内です！整理券No.' +
              guest.number +
              'をご用意ください。[詳細を確認するボタン]'
            );
          }

          if (notifyMethod === 'EMAIL') {
            const position =
              state.guests
                .filter((g) => g.status === 'WAITING')
                .findIndex((g) => g.id === guest.id) + 1;
            return (
              '【ETABLE】あと' +
              position +
              '組でご案内予定です。店頭へお越しください。(No.' +
              guest.number +
              ')'
            );
          }

          return '';
        })();

        const previewHidden = !notifyMethod;

        const sendBtnDisabled = !notifyMethod;
        const sendBtnClass = (() => {
          if (!notifyMethod) {
            return 'w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 bg-gray-300 cursor-not-allowed transition-colors';
          }
          if (notifyMethod === 'LINE') {
            return 'w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] transition-colors';
          }
          return 'w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 bg-[#082752] hover:bg-[#0a3060] transition-colors';
        })();

        const lineBoxClass = isLine
          ? 'w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-[#22C55E] bg-[#DCFCE7] transition-all'
          : 'w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-gray-200 bg-gray-50 hover:border-gray-300 transition-all';
        const lineIconClass = isLine ? 'w-8 h-8 text-[#22C55E]' : 'w-8 h-8 text-gray-400';
        const lineLabelClass = isLine ? 'text-sm font-bold text-[#22C55E]' : 'text-sm font-bold text-gray-500';

        const emailBoxClass = isEmail
          ? 'w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-[#082752] bg-[#082752] transition-all'
          : 'w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-gray-200 bg-gray-50 hover:border-gray-300 transition-all';
        const emailIconClass = isEmail ? 'w-8 h-8 text-white' : 'w-8 h-8 text-gray-400';
        const emailLabelClass = isEmail ? 'text-sm font-bold text-white' : 'text-sm font-bold text-gray-500';

        return (
          '<div class="fixed inset-0 z-50 flex items-center justify-center p-4" id="notify-modal-root">' +
          '  <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="notify-backdrop"></div>' +
          '  <div class="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl notify-panel">' +
          '    <button id="notify-close" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">' +
          '      <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '        <path d="M18 6 6 18"></path>' +
          '        <path d="m6 6 12 12"></path>' +
          '      </svg>' +
          '    </button>' +
          '    <h2 class="text-xl font-bold text-[#082752] mb-8">通知手段の選択</h2>' +
          '    <div class="text-center mb-8">' +
          '      <p class="text-sm text-gray-400 mb-2">呼び出し対象</p>' +
          '      <p class="text-5xl font-bold text-[#FD780F]">No.' +
          guest.number +
          '</p>' +
          '    </div>' +
          '    <div class="flex justify-center gap-6 mb-8">' +
          '      <button id="notify-line" class="flex flex-col items-center gap-2">' +
          '        <div id="notify-line-box" class="' +
          lineBoxClass +
          '">' +
          // LINE風：吹き出し（崩れにくいようにパスで定義）
          '          <svg id="notify-line-icon" class="' +
          lineIconClass +
          '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          '            <path d="M21 12c0 4.418-4.03 8-9 8-1.42 0-2.76-.29-3.93-.82L3 21l1.84-4.23A7.92 7.92 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>' +
          '            <path d="M8.5 12h.01"></path>' +
          '            <path d="M12 12h.01"></path>' +
          '            <path d="M15.5 12h.01"></path>' +
          '          </svg>' +
          '        </div>' +
          '        <span id="notify-line-label" class="' +
          lineLabelClass +
          '">LINE</span>' +
          '      </button>' +
          '      <button id="notify-email" class="flex flex-col items-center gap-2">' +
          '        <div id="notify-email-box" class="' +
          emailBoxClass +
          '">' +
          '          <svg id="notify-email-icon" class="' +
          emailIconClass +
          '" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <rect x="3" y="5" width="18" height="14" rx="2"></rect>' +
          '            <polyline points="3 7 12 13 21 7"></polyline>' +
          '          </svg>' +
          '        </div>' +
          '        <span id="notify-email-label" class="' +
          emailLabelClass +
          '">メール</span>' +
          '      </button>' +
          '    </div>' +
          '    <div id="notify-preview" class="' +
          (previewHidden ? 'hidden' : '') +
          ' mb-6">' +
          '      <p class="text-xs text-gray-400 mb-2">送信内容プレビュー</p>' +
          '      <div class="p-4 bg-gray-100 rounded-xl text-sm text-gray-700 leading-relaxed" id="notify-preview-text">' +
          previewText +
          '</div>' +
          '    </div>' +
          '    <button id="notify-send" ' +
          (sendBtnDisabled ? 'disabled' : '') +
          ' class="' +
          sendBtnClass +
          '">' +
          '      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '        <path d="m22 2-7 20-4-9-9-4 20-7z"></path>' +
          '      </svg>' +
          '      <span>通知を送信して呼び出す</span>' +
          '    </button>' +
          '  </div>' +
          '</div>'
        );
      }

      function renderDashboard() {
        const derived = computeDerived();
        const filterTabs = [
          { key: 'all', label: 'すべて' },
          { key: '1-2', label: '1〜2名' },
          { key: 'table', label: 'テーブル' },
          { key: 'counter', label: 'カウンター' },
        ];
        const hasWaitingGuests = derived.filteredGuests.some((g) => g.status === 'WAITING');

        return (
          '<div class="bg-background flex flex-col">' +
          '  <header class="bg-[#FD780F] text-white px-4 pt-4 pb-6 rounded-b-[34px] overflow-hidden">' +
          '    <div class="flex items-center justify-between mb-4">' +
          '      <button id="menu-button" class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">' +
          '        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '          <line x1="3" y1="6" x2="21" y2="6"></line>' +
          '          <line x1="3" y1="12" x2="21" y2="12"></line>' +
          '          <line x1="3" y1="18" x2="21" y2="18"></line>' +
          '        </svg>' +
          '      </button>' +
          '      <h1 class="text-xl font-bold tracking-tight">ETABLE</h1>' +
          '      <button id="history-button" class="px-4 py-2 bg-white rounded-full text-sm font-semibold text-[#082752]">履歴</button>' +
          '    </div>' +
          '    <div class="flex items-end justify-between">' +
          '      <div>' +
          '        <div class="flex items-baseline gap-1">' +
          '          <span class="text-5xl font-bold">' +
          derived.waitingCount +
          '</span>' +
          '          <span class="text-lg">組待ち</span>' +
          '        </div>' +
          '        <p class="text-sm opacity-90 mt-1">予想待ち時間：約 <span class="font-semibold">' +
          derived.estimatedWaitTime +
          '</span> 分</p>' +
          '      </div>' +
          '      <div class="flex flex-col gap-2">' +
          '        <div class="px-2.5 py-1 bg-[#FFF7ED] rounded-full text-xs flex items-center gap-2 text-[#FD780F]">' +
          '          <span class="leading-none font-medium">呼び出し中</span>' +
          '          <span class="font-bold text-sm leading-none">' +
          derived.callingCount +
          '</span>' +
          '        </div>' +
          '        </div>' +
          (derived.guidingCount > 0
            ? '<div class="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full text-sm flex items-center gap-2">' +
              '  <span>案内中</span>' +
              '  <span class="font-bold">' +
              derived.guidingCount +
              '</span>' +
              '</div>'
            : '') +
          '      </div>' +
          '    </div>' +
          '  </header>' +
          '  <div class="bg-white border-b border-gray-100 mt-2 py-2">' +
          '    <div class="flex">' +
          filterTabs
            .map(function (tab) {
              const isActive = state.filterTab === tab.key;
              return (
                '<button data-filter="' +
                tab.key +
                '" class="flex-1 py-3 text-sm font-medium transition-colors relative ' +
                (isActive ? 'text-[#FD780F]' : 'text-gray-500 hover:text-gray-700') +
                '">' +
                tab.label +
                (isActive
                  ? '<div class="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#FD780F] rounded-full"></div>'
                  : '') +
                '</button>'
              );
            })
            .join('') +
          '    </div>' +
          '  </div>' +
          '  <div class="flex-1 px-4 py-4 pb-32 space-y-4 overflow-auto" id="guest-list">' +
          derived.filteredGuests.map(renderGuestCard).join('') +
          '  </div>' +
          renderHoldSection(derived.holdGuests, derived.holdCount) +
          (hasWaitingGuests && !state.sidebarOpen && !state.openCardMenuId
            ? '<div class="fixed bottom-8 right-6 z-50">' +
              '  <button id="call-next" class="flex flex-col items-center">' +
              '    <div class="w-16 h-16 bg-[#FD780F] rounded-full flex items-center justify-center shadow-lg shadow-orange-300 mb-2">' +
              '      <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
              '        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.34a2 2 0 0 1-.45 2.18L8.09 9.91a16 16 0 0 0 6 6l1.67-1.24a2 2 0 0 1 2.18-.45 11.36 11.36 0 0 0 2.34.72A2 2 0 0 1 22 16.92Z"></path>' +
              '      </svg>' +
              '    </div>' +
              '    <span class="px-3 py-1.5 bg-[#082752] text-white text-xs rounded-full font-medium">次を呼び出す</span>' +
              '  </button>' +
              '</div>'
            : '') +
          renderSidebar(derived) +
          renderNotificationModal(derived) +
          '</div>'
        );
      }

      function renderPlaceholderScreen(title) {
        return (
          '<div class="min-h-screen bg-white flex flex-col">' +
          '  <div class="px-6 pt-8 flex items-center justify-between">' +
          '    <h1 class="text-2xl font-bold tracking-tight">' +
          '      <span class="text-[#FD780F]">E</span>' +
          '      <span class="text-[#082752]">TABLE</span>' +
          '    </h1>' +
          '    <button id="back-dashboard" class="px-4 py-2 bg-[#082752] text-white rounded-full text-sm font-medium">受付に戻る</button>' +
          '  </div>' +
          '  <div class="flex-1 flex flex-col items-center justify-center px-6 text-center">' +
          '    <h2 class="text-2xl font-bold text-[#082752] mb-2">' +
          title +
          '</h2>' +
          '    <p class="text-gray-400 text-sm">この画面の詳細レイアウトはReact版と同様に拡張可能です。</p>' +
          '  </div>' +
          '</div>'
        );
      }

      function renderSummaryScreen() {
        const completedCount = state.guests.filter((g) => g.status === 'COMPLETED').length;
        const cancelledCount = state.guests.filter((g) => g.status === 'CANCELLED').length;

        // 簡易的な平均待ち時間（COMPLETED の createdAt→completedAt を分単位で平均）
        const completedGuests = state.guests.filter(
          (g) => g.status === 'COMPLETED' && typeof g.completedAt === 'number'
        );
        const avgWaitMinutes = (() => {
          if (completedGuests.length === 0) return 0;
          const total = completedGuests.reduce((sum, g) => {
            const diffMs = g.completedAt - g.createdAt;
            const min = Math.max(0, Math.round(diffMs / 60000));
            return sum + min;
          }, 0);
          return Math.round((total / completedGuests.length) * 10) / 10;
        })();

        return (
          '<div class="sales-summary-page">' +
          '  <div class="sales-summary-inner">' +
          '    <div class="sales-hero">' +
          '      <div class="sales-hero-badge">達成！</div>' +
          '      <div class="sales-hero-icon">' +
          '        <div class="sales-hero-ring">' +
          '          <div class="sales-hero-core">' +
          '            <svg class="sales-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <path d="M8 21h8"></path>' +
          '              <path d="M12 17v4"></path>' +
          '              <path d="M7 4h10v4a5 5 0 0 1-10 0V4z"></path>' +
          '              <path d="M5 6H3v1a4 4 0 0 0 4 4"></path>' +
          '              <path d="M19 6h2v1a4 4 0 0 1-4 4"></path>' +
          '            </svg>' +
          '          </div>' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          '' +
          '    <h1 class="sales-title">本日の営業実績</h1>' +
          '    <p class="sales-subtitle"><span class="sales-heart">❤️</span> 今日も一日お疲れ様でした！</p>' +
          '' +
          '    <div class="sales-grid-2">' +
          '      <div class="sales-card sales-card--guided">' +
          '        <div class="sales-card-label">' +
          '          <span class="sales-card-label-icon sales-card-label-icon--orange">' +
          '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <path d="M3 3v18h18"></path>' +
          '              <path d="M7 13l3-3 4 4 5-5"></path>' +
          '            </svg>' +
          '          </span>' +
          '          <span>案内組数</span>' +
          '        </div>' +
          '        <div class="sales-metric">' +
          '          <span class="sales-metric-value sales-metric-value--orange font-en">' +
          completedCount +
          '</span>' +
          '          <span class="sales-metric-unit">組</span>' +
          '        </div>' +
          '      </div>' +
          '' +
          '      <div class="sales-card sales-card--drop">' +
          '        <div class="sales-card-label">' +
          '          <span class="sales-card-label-icon sales-card-label-icon--gray">' +
          '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <path d="M10.29 3.86 1.82 12.34a1 1 0 0 0 0 1.41l8.47 8.48a1 1 0 0 0 1.71-.71V4.57a1 1 0 0 0-1.71-.71Z"></path>' +
          '              <path d="M21.82 11.66 13.34 3.18A1 1 0 0 0 12 3.9V20.1a1 1 0 0 0 1.71.71l8.47-8.48a1 1 0 0 0 0-1.41Z"></path>' +
          '            </svg>' +
          '          </span>' +
          '          <span>離脱組数</span>' +
          '        </div>' +
          '        <div class="sales-metric">' +
          '          <span class="sales-metric-value sales-metric-value--navy font-en">' +
          cancelledCount +
          '</span>' +
          '          <span class="sales-metric-unit">組</span>' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          '' +
          '    <div class="sales-card-wide">' +
          '      <div class="sales-wide-left">' +
          '        <div class="sales-card-label">' +
          '          <span>平均待ち時間</span>' +
          '        </div>' +
          '        <div class="sales-wide-metric">' +
          '          <span class="sales-wide-value font-en">' +
          avgWaitMinutes +
          '</span>' +
          '          <span class="sales-wide-unit">分 / 組</span>' +
          '        </div>' +
          '      </div>' +
          '      <div class="sales-wide-right">' +
          '        <div class="sales-wide-iconbox">' +
          '          <svg class="sales-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <circle cx="12" cy="12" r="10"></circle>' +
          '            <path d="M12 6v6l4 2"></path>' +
          '          </svg>' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          '' +
          '    <div class="sales-actions">' +
          '      <button id="summary-analyze" class="sales-btn sales-btn--primary" type="button">' +
          '        <span class="sales-btn-icon sales-btn-icon--orange">' +
          '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <path d="M4 19V5"></path>' +
          '            <path d="M9 19V9"></path>' +
          '            <path d="M14 19v-6"></path>' +
          '            <path d="M19 19V7"></path>' +
          '          </svg>' +
          '        </span>' +
          '        <span class="sales-btn-text">さらに詳しく分析する</span>' +
          '      </button>' +
          '' +
          '      <button id="summary-save" class="sales-btn sales-btn--secondary" type="button">' +
          '        <span class="sales-btn-icon sales-btn-icon--muted">' +
          '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' +
          '            <path d="M14 2v6h6"></path>' +
          '            <path d="M8 13h8"></path>' +
          '            <path d="M8 17h6"></path>' +
          '          </svg>' +
          '        </span>' +
          '        <span class="sales-btn-text">レポートを保存</span>' +
          '      </button>' +
          '' +
          '      <button id="summary-home" class="sales-btn sales-btn--outline" type="button">' +
          '        <span class="sales-btn-icon sales-btn-icon--outline">' +
          '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <path d="M3 10.5 12 3l9 7.5"></path>' +
          '            <path d="M5 10v11h14V10"></path>' +
          '          </svg>' +
          '        </span>' +
          '        <span class="sales-btn-text">ホームへ戻る</span>' +
          '      </button>' +
          '    </div>' +
          '  </div>' +
          '</div>'
        );
      }

      function renderHistoryScreen() {
        const completedGuests = state.guests.filter((g) => g.status === 'COMPLETED');
        const cancelledGuests = state.guests.filter((g) => g.status === 'CANCELLED');
        const allCount = completedGuests.length + cancelledGuests.length;

        const tab = state.historyTab ?? 'all';

        const completedCount = completedGuests.length;
        const cancelledCount = cancelledGuests.length;

        const tabBtn = (key, label, count, isActive) => {
          const textClass = isActive ? 'text-[#FD780F]' : 'text-gray-500';
          const badgeClass = isActive
            ? 'bg-[#FD780F] text-white'
            : 'bg-gray-100 text-gray-500 border border-gray-200';

          return (
            '<button data-history-tab="' +
            key +
            '" class="flex-1 py-3 text-sm font-medium transition-colors relative ' +
            textClass +
            '">' +
            '  <div class="flex items-center justify-center gap-2">' +
            '    <span>' +
            label +
            '    </span>' +
            '    <span class="inline-flex items-center px-2 py-0.5 text-xs rounded-full ' +
            badgeClass +
            '">' +
            count +
            '    </span>' +
            '  </div>' +
            (isActive
              ? '<div class="absolute bottom-1 left-3 right-3 h-0.5 bg-[#FD780F] rounded-full"></div>'
              : '') +
            '</button>'
          );
        };

        // カード本体は DOM 構築（innerHTML でカードを雑に組み立てない）
        return (
          '<div class="min-h-screen bg-background">' +
          '  <header class="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">' +
          '    <button id="back-dashboard" class="w-8 h-8 flex items-center justify-center">' +
          '      <svg class="w-5 h-5 text-[#082752]" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '        <path d="M15 18l-6-6 6-6"></path>' +
          '      </svg>' +
          '    </button>' +
          '    <h1 class="text-lg font-bold text-[#082752]">案内・キャンセル履歴</h1>' +
          '    <div class="w-8 h-8"></div>' +
          '  </header>' +
          '  <div class="px-4 py-6">' +
          '    <div class="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">' +
          tabBtn('all', 'すべて', allCount, tab === 'all') +
          tabBtn('completed', '案内済', completedCount, tab === 'completed') +
          tabBtn('cancelled', 'キャンセル', cancelledCount, tab === 'cancelled') +
          '    </div>' +
          '    <div class="space-y-3" id="history-cards"></div>' +
          '  </div>' +
          '</div>'
        );
      }

      function createHistoryRestoreIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'w-4 h-4');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1.5');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        // "復元"（左回転矢印）アイコン（シンプル線）
        const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('d', 'M3 12a9 9 0 0 1 9-9');
        const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p2.setAttribute('d', 'M3 3v6h6');
        const p3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p3.setAttribute('d', 'M21 12a9 9 0 0 1-9 9');
        const p4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p4.setAttribute('d', 'M21 21v-6h-6');

        svg.appendChild(p1);
        svg.appendChild(p2);
        svg.appendChild(p3);
        svg.appendChild(p4);
        return svg;
      }

      function renderHistoryCardsDOM() {
        const container = document.getElementById('history-cards');
        if (!container) return;

        container.innerHTML = '';

        const tab = state.historyTab ?? 'all';

        let guests = state.guests.filter((g) => {
          if (g.status !== 'COMPLETED' && g.status !== 'CANCELLED') return false;
          if (tab === 'completed') return g.status === 'COMPLETED';
          if (tab === 'cancelled') return g.status === 'CANCELLED';
          return true;
        });

        guests = guests.sort((a, b) => b.createdAt - a.createdAt);

        if (guests.length === 0) {
          const empty = document.createElement('div');
          empty.className =
            'bg-white rounded-[32px] p-6 border border-gray-100 text-center text-sm text-gray-400';
          empty.textContent = '履歴がありません';
          container.appendChild(empty);
          return;
        }

        guests.forEach((guest) => {
          const waitMinutes = getWaitMinutes(guest.createdAt);
          const partyLabel = `${guest.partySize}名`;

          const badge = document.createElement('span');
          badge.className = guest.status === 'COMPLETED'
            ? 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#DCFCE7] text-[#16A34A] border border-green-200'
            : 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]';
          badge.textContent =
            guest.status === 'COMPLETED'
              ? '案内完了'
              : getCancelReasonLabel(guest.cancelReason, guest.number);

          const card = document.createElement('div');
          card.className =
            'bg-white rounded-[32px] p-5 border border-gray-100 flex items-center justify-between shadow-sm';

          const left = document.createElement('div');
          left.className = 'flex items-center gap-4 flex-1';

          // No. ブロック
          const noBlock = document.createElement('div');
          noBlock.className = 'flex flex-col';
          const noLabel = document.createElement('span');
          noLabel.className = 'text-xs text-gray-400 font-medium font-en';
          noLabel.textContent = 'No.';
          const noValue = document.createElement('span');
          noValue.className = 'text-4xl font-bold text-[#082752] leading-none font-en';
          noValue.textContent = guest.number;
          noBlock.appendChild(noLabel);
          noBlock.appendChild(noValue);

          // 縦線
          const divider = document.createElement('div');
          divider.className = 'w-px h-10 bg-gray-200';

          // 中央ブロック（人数/ステータス/待機）
          const mid = document.createElement('div');
          mid.className = 'flex flex-col';

          const midRow = document.createElement('div');
          midRow.className = 'flex items-center gap-2';
          const party = document.createElement('span');
          party.className = 'text-sm font-semibold text-[#082752]';
          party.textContent = partyLabel;
          midRow.appendChild(party);
          midRow.appendChild(badge);

          const wait = document.createElement('div');
          wait.className = 'mt-2 text-xs text-gray-400 whitespace-nowrap';
          // 「待機:」は日本語、「分」の数字部分だけ英数字フォントに寄せる
          wait.textContent = '';
          const waitPrefix = document.createElement('span');
          waitPrefix.textContent = '待機: ';
          waitPrefix.className = 'font-jp';
          const waitMinutesEl = document.createElement('span');
          waitMinutesEl.textContent = waitMinutes;
          waitMinutesEl.className = 'font-en';
          const waitUnit = document.createElement('span');
          waitUnit.textContent = '分';
          waitUnit.className = 'font-jp';
          wait.appendChild(waitPrefix);
          wait.appendChild(waitMinutesEl);
          wait.appendChild(waitUnit);

          mid.appendChild(midRow);
          mid.appendChild(wait);

          left.appendChild(noBlock);
          left.appendChild(divider);
          left.appendChild(mid);

          // 復元ボタン（右独立）
          const restoreBtn = document.createElement('button');
          restoreBtn.type = 'button';
          restoreBtn.className =
            'w-[92px] py-2 rounded-xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2';
          restoreBtn.setAttribute('data-restore-id', guest.id);

          const icon = createHistoryRestoreIcon();
          const label = document.createElement('span');
          label.textContent = '復元';
          restoreBtn.appendChild(icon);
          restoreBtn.appendChild(label);

          card.appendChild(left);
          card.appendChild(restoreBtn);

          container.appendChild(card);
        });
      }

      function renderAnalyticsScreen() {
        // React版 AnalyticsScreen.tsx の構造をそのまま再現しつつ、
        // グラフ部分のみ SVG のエリアチャートで表現
        const pastRecords = [
          { date: '2025/03/05', count: 142, hasHighTraffic: true },
          { date: '2025/03/04', count: 98, hasHighTraffic: false },
          { date: '2025/03/03', count: 0, hasHighTraffic: false },
          { date: '2025/03/02', count: 185, hasHighTraffic: true },
        ];

        return (
          '<div class="min-h-screen bg-background">' +
          // Header
          '  <header class="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">' +
          '    <button id="back-dashboard" class="w-8 h-8 flex items-center justify-center">' +
          '      <svg class="w-5 h-5 text-[#082752]" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '        <path d="M15 18l-6-6 6-6"></path>' +
          '      </svg>' +
          '    </button>' +
          '    <h1 class="text-lg font-bold text-[#082752]">営業分析</h1>' +
          '    <div class="w-8 h-8"></div>' +
          '  </header>' +
          '  <div class="px-4 py-6">' +
          // 期間タブ
          '    <div class="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">' +
          '      <button class="flex-1 py-2 rounded-lg text-sm font-medium text-gray-500">今日</button>' +
          '      <button class="flex-1 py-2 rounded-lg text-sm font-medium bg-[#082752] text-white">今週</button>' +
          '      <button class="flex-1 py-2 rounded-lg text-sm font-medium text-gray-500">今月</button>' +
          '    </div>' +
          // 上部2カラムカード（総案内数 / 離脱率）
          '    <div class="grid grid-cols-2 gap-4 mb-6">' +
          '      <div class="bg-white rounded-2xl p-4 shadow-sm">' +
          '        <div class="flex items-center gap-2 mb-2">' +
          '          <svg class="w-4 h-4 text-[#FD780F]" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <path d="M3 3v18h18"></path>' +
          '            <path d="M7 13l3-3 4 4 5-5"></path>' +
          '          </svg>' +
          '          <span class="text-xs text-gray-500">総案内数</span>' +
          '        </div>' +
          '        <div class="flex items-baseline">' +
          '          <span class="text-3xl font-bold text-[#FD780F]">428</span>' +
          '          <span class="text-sm text-gray-500 ml-1">組</span>' +
          '        </div>' +
          '      </div>' +
          '      <div class="bg-white rounded-2xl p-4 shadow-sm">' +
          '        <div class="flex items-center gap-2 mb-2">' +
          '          <svg class="w-4 h-4 text-[#FD780F]" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '            <path d="M10.29 3.86 1.82 12.34a1 1 0 0 0 0 1.41l8.47 8.48a1 1 0 0 0 1.71-.71V4.57a1 1 0 0 0-1.71-.71Z"></path>' +
          '            <path d="M21.82 11.66 13.34 3.18A1 1 0 0 0 12 3.9V20.1a1 1 0 0 0 1.71.71l8.47-8.48a1 1 0 0 0 0-1.41Z"></path>' +
          '          </svg>' +
          '          <span class="text-xs text-gray-500">離脱率</span>' +
          '        </div>' +
          '        <div class="flex items-baseline">' +
          '          <span class="text-3xl font-bold text-[#082752]">4.2</span>' +
          '          <span class="text-sm text-gray-500 ml-1">%</span>' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          // 濃紺カード（平均待ち時間）
          '    <div class="bg-[#082752] rounded-2xl p-5 mb-6">' +
          '      <div class="flex items-center justify-between">' +
          '        <div>' +
          '          <div class="flex items-center gap-2 mb-2">' +
          '            <svg class="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <circle cx="12" cy="12" r="10"></circle>' +
          '              <polyline points="12 6 12 12 16 14"></polyline>' +
          '            </svg>' +
          '            <span class="text-sm text-white/70">平均待ち時間</span>' +
          '          </div>' +
          '          <div class="flex items-baseline">' +
          '            <span class="text-4xl font-bold text-white">24.5</span>' +
          '            <span class="text-lg text-white/70 ml-2">min</span>' +
          '          </div>' +
          '        </div>' +
          '        <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">' +
          '          <div class="w-10 h-10 bg-[#FD780F] rounded-full flex items-center justify-center">' +
          '            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <circle cx="12" cy="12" r="10"></circle>' +
          '              <polyline points="12 6 12 12 16 14"></polyline>' +
          '            </svg>' +
          '          </div>' +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          // グラフカード（エリアチャートをSVGで表現）
          '    <div class="bg-white rounded-2xl p-5 shadow-sm mb-6">' +
          '      <div class="flex items-center gap-2 mb-1">' +
          '        <div class="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">' +
          '          <span class="text-xs">📊</span>' +
          '        </div>' +
          '        <span class="text-sm font-medium text-[#082752]">時間帯別・混雑推移</span>' +
          '      </div>' +
          '      <p class="text-xs text-gray-400 tracking-widest mb-4">PEAK HOUR ANALYSIS</p>' +
          '      <div class="h-48">' +
          '        <svg viewBox="0 0 320 160" class="w-full h-full">' +
          // オレンジのグラデーション
          '          <defs>' +
          '            <linearGradient id="analyticsArea" x1="0" y1="0" x2="0" y2="1">' +
          '              <stop offset="0%" stop-color="#FD780F" stop-opacity="0.3" />' +
          '              <stop offset="100%" stop-color="#FD780F" stop-opacity="0" />' +
          '            </linearGradient>' +
          '          </defs>' +
          // 面
          '          <path d="M0 140 C 40 110, 80 90, 120 100 C 160 120, 200 80, 240 70 C 280 90, 300 110, 320 120 L 320 160 L 0 160 Z" fill="url(#analyticsArea)" />' +
          // 線
          '          <path d="M0 140 C 40 110, 80 90, 120 100 C 160 120, 200 80, 240 70 C 280 90, 300 110, 320 120" fill="none" stroke="#FD780F" stroke-width="2" />' +
          '        </svg>' +
          '      </div>' +
          '    </div>' +
          // 過去の案内実績リスト
          '    <div>' +
          '      <p class="text-xs text-gray-500 mb-3">過去の案内実績</p>' +
          '      <div class="space-y-3">' +
          pastRecords
            .map(function (record) {
              return (
                '<button class="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">' +
                '  <div class="flex items-center gap-3">' +
                '    <div class="w-2 h-2 rounded-full ' +
                (record.hasHighTraffic ? 'bg-[#FD780F]' : 'bg-gray-300') +
                '"></div>' +
                '    <div class="text-left">' +
                '      <p class="font-medium text-[#082752] text-sm">' +
                record.date +
                '</p>' +
                '      <p class="text-xs text-gray-500">' +
                '        案内数: <span class="text-[#FD780F]">' +
                record.count +
                '組</span>' +
                '      </p>' +
                '    </div>' +
                '  </div>' +
                '  <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                '    <path d="m9 18 6-6-6-6"></path>' +
                '  </svg>' +
                '</button>'
              );
            })
            .join('') +
          '      </div>' +
          '    </div>' +
          '  </div>' +
          '</div>'
        );
      }

      // レビュー分析画面（AI要約 / ポジティブ・改善点 / 直近レビュー一覧）
      function renderReviewsScreen() {
        // ダミーレビュー
        const reviews = [
          { id: 1, rating: 5, title: '案内がとてもスムーズでした', content: '到着してからの案内が早く、スタッフの方も丁寧でした。' },
          { id: 2, rating: 4, title: '待ち時間の見積もりが正確', content: 'アプリの表示と実際の待ち時間にズレがなく安心できました。' },
          { id: 3, rating: 3, title: 'ピークタイムは少し待ちました', content: '混雑時はやや待ちましたが、状況が分かるのはよかったです。' },
          { id: 4, rating: 2, title: '通知が少し遅れました', content: '呼び出し通知が体感で数分遅く感じました。改善に期待しています。' },
          { id: 5, rating: 5, title: '店内の案内までスムーズ', content: '席までスムーズに案内してもらえ、トータルで満足度が高いです。' },
        ];

        const positivePoints = [
          '案内がスムーズで、待ち時間のストレスが少ない。',
          '待ち時間の予測が概ね正確で、来店タイミングを調整しやすい。',
          'スタッフの対応が丁寧で安心感がある。',
        ];

        const improvementPoints = [
          'ピークタイムの待ち時間をもう少し短縮したいという声がある。',
          '通知タイミングが遅く感じられるケースが一部で見られる。',
          '初回利用時の操作説明を、もう少し分かりやすくしてほしいという要望がある。',
        ];

        const renderStars = function (rating) {
          return (
            '<div class="flex items-center gap-0.5">' +
            [1, 2, 3, 4, 5]
              .map(function (i) {
                const active = i <= rating;
                return (
                  '<svg class="w-3 h-3 ' +
                  (active ? 'text-[#FD780F] fill-[#FD780F]' : 'text-gray-300') +
                  '" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                  '  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>' +
                  '</svg>'
                );
              })
              .join('') +
            '</div>'
          );
        };

        return (
          '<div class="min-h-screen bg-background">' +
          // Header（既存と同テイスト）
          '  <header class="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center z-10">' +
          '    <button id="back-dashboard" class="w-8 h-8 flex items-center justify-center">' +
          '      <svg class="w-5 h-5 text-[#082752]" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '        <path d="M15 18l-6-6 6-6"></path>' +
          '      </svg>' +
          '    </button>' +
          '    <h1 class="text-lg font-bold text-[#082752] ml-2">レビュー分析</h1>' +
          '  </header>' +
          '  <div class="px-4 py-6 space-y-6">' +
          // 総合スコアカード（AI要約の前に配置されている元デザイン）
          '    <div class="bg-white rounded-2xl p-5 shadow-sm">' +
          '      <p class="text-xs text-gray-500 mb-2">総合スコア</p>' +
          '      <div class="flex items-center gap-3">' +
          '        <span class="text-4xl font-bold text-[#082752]">3.8</span>' +
          '        <span class="text-sm text-gray-400">/5.0</span>' +
          '        <div class="ml-auto flex items-center gap-0.5">' +
          [1, 2, 3, 4, 5]
            .map(function (i) {
              const active = i <= 4;
              return (
                '<svg class="w-5 h-5 ' +
                (active ? 'text-[#FD780F] fill-[#FD780F]' : 'text-gray-300') +
                '" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                '  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>' +
                '</svg>'
              );
            })
            .join('') +
          '        </div>' +
          '      </div>' +
          '    </div>' +
          // AI要約（濃紺グラデ・元クラス準拠）
          '    <div class="bg-gradient-to-r from-[#082752] to-[#0a3060] rounded-2xl p-5">' +
          '      <div class="flex items-center gap-2 mb-3">' +
          '        <div class="w-6 h-6 bg-[#FD780F] rounded-full flex items-center justify-center">' +
          '          <span class="text-xs text-white">AI</span>' +
          '        </div>' +
          '        <span class="text-sm text-white/70">AI要約分析</span>' +
          '      </div>' +
          '      <p class="text-white text-sm leading-relaxed">' +
          '        直近のレビューから、受付体験に対する満足度は高い水準を維持しています。' +
          '        一方で、ピークタイムの待ち時間や通知タイミングに関する改善要望も確認されています。' +
          '      </p>' +
          '    </div>' +
          // ポジティブ / 改善点（既存カードスタイルを流用）
          '    <div class="grid grid-cols-1 gap-4">' +
          '      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">' +
          '        <h2 class="text-sm font-semibold text-[#082752] mb-2">ポジティブな意見</h2>' +
          '        <ul class="space-y-1.5 text-sm text-gray-700">' +
          positivePoints
            .map(function (p) {
              return (
                '<li class="flex items-start gap-2">' +
                '  <span class="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#FD780F]"></span>' +
                '  <span>' +
                p +
                '</span>' +
                '</li>'
              );
            })
            .join('') +
          '        </ul>' +
          '      </div>' +
          '      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">' +
          '        <h2 class="text-sm font-semibold text-[#082752] mb-2">改善点</h2>' +
          '        <ul class="space-y-1.5 text-sm text-gray-700">' +
          improvementPoints
            .map(function (p) {
              return (
                '<li class="flex items-start gap-2">' +
                '  <span class="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#082752]"></span>' +
                '  <span>' +
                p +
                '</span>' +
                '</li>'
              );
            })
            .join('') +
          '        </ul>' +
          '      </div>' +
          '    </div>' +
          // 直近レビュー一覧（元レビューリストカードに合わせたサイズ）
          '    <div>' +
          '      <p class="text-xs text-gray-500 mb-3">直近のレビュー一覧：' +
          reviews.length +
          '件</p>' +
          '      <div class="space-y-4">' +
          reviews
            .map(function (r) {
              return (
                '<div class="bg-white rounded-2xl p-4 shadow-sm">' +
                '  <div class="flex items-start gap-3 mb-3">' +
                '    <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-[#082752]">' +
                r.title.charAt(0) +
                '</div>' +
                '    <div class="flex-1">' +
                '      <div class="flex items-center justify-between mb-1">' +
                '        <span class="font-medium text-[#082752] text-sm">' +
                r.title +
                '</span>' +
                '        <span class="text-xs text-gray-400">直近</span>' +
                '      </div>' +
                renderStars(r.rating) +
                '    </div>' +
                '  </div>' +
                '  <p class="text-sm text-gray-600 leading-relaxed">' +
                r.content +
                '</p>' +
                '</div>'
              );
            })
            .join('') +
          '      </div>' +
          '    </div>' +
          '  </div>' +
          '</div>'
        );
      }

      function renderSettingsScreen() {
        return (
          '<div class="min-h-screen bg-white">' +
          '  <header class="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">' +
          '    <div class="w-8"></div>' +
          '    <h1 class="text-base font-bold text-[#082752]">設定</h1>' +
          '    <button id="settings-close" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">' +
          '      <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '        <path d="M18 6 6 18"></path>' +
          '        <path d="m6 6 12 12"></path>' +
          '      </svg>' +
          '    </button>' +
          '  </header>' +
          '  <div class="px-4 py-6 pb-32 space-y-6">' +
          // 1. 営業情報セクション
          '    <section class="space-y-4">' +
          '      <h2 class="text-sm font-bold text-[#082752]">営業情報</h2>' +
          '      <div id="hours-list" class="space-y-4">' +
          '        <div class="bg-white rounded-[32px] p-5 border border-gray-100 flex items-center justify-between">' +
          '          <div>' +
          '            <p class="text-xs text-gray-400 mb-1">月・火・水・木・金</p>' +
          '            <p class="text-base font-semibold text-[#082752]">10:00〜20:00</p>' +
          '          </div>' +
          '          <button class="card-delete-btn p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="削除">' +
          '            <svg class="icon-delete w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '              <path d="M3 6h18"></path>' +
          '              <path d="M8 6V4h8v2"></path>' +
          '              <path d="M19 6l-1 16H6L5 6"></path>' +
          '              <path d="M10 11v6"></path>' +
          '              <path d="M14 11v6"></path>' +
          '            </svg>' +
          '          </button>' +
          '        </div>' +
          '        <div class="bg-white rounded-[32px] p-5 border border-gray-100 flex items-center justify-between">' +
          '          <div>' +
          '            <p class="text-xs text-gray-400 mb-1">土・日</p>' +
          '            <p class="text-base font-semibold text-[#082752]">11:00〜22:00</p>' +
          '          </div>' +
          '          <button class="card-delete-btn p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="削除">' +
          '            <svg class="icon-delete w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '              <path d="M3 6h18"></path>' +
          '              <path d="M8 6V4h8v2"></path>' +
          '              <path d="M19 6l-1 16H6L5 6"></path>' +
          '              <path d="M10 11v6"></path>' +
          '              <path d="M14 11v6"></path>' +
          '            </svg>' +
          '          </button>' +
          '        </div>' +
          '        <button id="open-hours-modal" class="w-full py-4 border border-dashed border-gray-300 rounded-[32px] text-sm text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">' +
          '          <span class="text-lg">＋</span>' +
          '          <span>営業時間追加</span>' +
          '        </button>' +
          '      </div>' +
          '    </section>' +
          // 2. 定休日セクション
          '    <section class="space-y-4">' +
          '      <h2 class="text-sm font-semibold text-[#082752]">定休日</h2>' +
          '      <div id="closed-list" class="space-y-4">' +
          '        <div class="bg-white rounded-[32px] p-5 border border-gray-100 flex items-center justify-between">' +
          '          <p class="text-base font-semibold text-[#082752]">毎週月</p>' +
          '          <button class="card-delete-btn p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="削除">' +
          '            <svg class="icon-delete w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '              <path d="M3 6h18"></path>' +
          '              <path d="M8 6V4h8v2"></path>' +
          '              <path d="M19 6l-1 16H6L5 6"></path>' +
          '              <path d="M10 11v6"></path>' +
          '              <path d="M14 11v6"></path>' +
          '            </svg>' +
          '          </button>' +
          '        </div>' +
          '        <div class="bg-white rounded-[32px] p-5 border border-gray-100 flex items-center justify-between">' +
          '          <p class="text-base font-semibold text-[#082752]">第3水曜日</p>' +
          '          <button class="card-delete-btn p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="削除">' +
          '            <svg class="icon-delete w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '              <path d="M3 6h18"></path>' +
          '              <path d="M8 6V4h8v2"></path>' +
          '              <path d="M19 6l-1 16H6L5 6"></path>' +
          '              <path d="M10 11v6"></path>' +
          '              <path d="M14 11v6"></path>' +
          '            </svg>' +
          '          </button>' +
          '        </div>' +
          '        <button id="open-closed-days-modal" class="w-full py-4 border border-dashed border-gray-300 rounded-[32px] text-sm text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">' +
          '          <span class="text-lg">＋</span>' +
          '          <span>定休日を追加</span>' +
          '        </button>' +
          '      </div>' +
          '    </section>' +
          // 3. 順番待ち受付・例外停止
          '    <section class="space-y-4">' +
          '      <h2 class="text-sm font-semibold text-[#082752]">受付設定</h2>' +
          '      <div class="bg-white rounded-[32px] p-5 border border-gray-100 space-y-4">' +
          '        <div class="flex items-center justify-between">' +
          '          <div>' +
          '            <p class="font-medium text-sm text-[#082752]">順番待ち受付</p>' +
          '            <p class="text-xs text-gray-500">新規の順番待ち受付を停止します</p>' +
          '          </div>' +
          '          <div class="w-12 h-7 rounded-full bg-[#082752] flex items-center px-1">' +
          '            <div class="w-5 h-5 bg-white rounded-full shadow translate-x-5"></div>' +
          '          </div>' +
          '        </div>' +
          '        <div class="flex items-center justify-between">' +
          '          <div>' +
          '            <p class="font-medium text-sm text-[#082752]">本日の受付停止（例外）</p>' +
          '            <p class="text-xs text-gray-500">OFFにすると、本日の受付を例外的に停止します</p>' +
          '          </div>' +
          '          <div class="w-12 h-7 rounded-full bg-gray-300 flex items-center px-1">' +
          '            <div class="w-5 h-5 bg-white rounded-full shadow translate-x-0"></div>' +
          '          </div>' +
          '        </div>' +
          '      </div>' +
          '    </section>' +
          // 4. メッセージ設定
          '    <section class="space-y-4">' +
          '      <h2 class="text-sm font-semibold text-[#082752]">メッセージ設定</h2>' +
          '      <div class="bg-white rounded-[32px] p-5 border border-gray-100 space-y-4">' +
          '        <div>' +
          '          <p class="text-xs text-gray-500 mb-2">呼び出しメッセージ</p>' +
          '          <textarea id="call-message-input" rows="3" spellcheck="false" class="bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-700 outline-none resize-none leading-relaxed" >番号 {number} のお客様、ご来店をお願いいたします。</textarea>' +
          '        </div>' +
          '        <div>' +
          '          <p class="flex items-center gap-2 text-xs text-gray-500 mb-2">' +
          '            <svg class="w-4 h-4 text-[#FD780F]" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
          '              <circle cx="12" cy="12" r="10"></circle>' +
          '              <polyline points="12 6 12 12 16 14"></polyline>' +
          '            </svg>' +
          '            プレビュー' +
          '          </p>' +
          '          <div class="bg-[#082752] rounded-[32px] px-6 py-5 text-white text-sm leading-relaxed shadow-sm">' +
          '            <p id="call-message-preview-text" class="font-medium mb-1">番号 12 のお客様、ご来店をお願いいたします。</p>' +
          '            <p class="text-xs text-white/70">スタッフまでお声がけください。</p>' +
          '          </div>' +
          '        </div>' +
          '      </div>' +
          '    </section>' +
          // 5. 自動ルール設定
          '    <section class="space-y-4">' +
          '      <h2 class="text-sm font-semibold text-[#082752]">自動ルール設定</h2>' +
          '      <div class="bg-white rounded-[32px] p-5 border border-gray-100">' +
          '        <p class="text-xs text-gray-500 mb-2">自動キャンセルに移行する時間（分）</p>' +
          '        <div class="flex items-center">' +
          '          <div class="flex-1 flex items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3">' +
          '            <input id="auto-cancel-minutes-input" type="number" inputmode="numeric" min="1" max="120" step="1" value="10" class="flex-1 text-sm text-[#082752] bg-transparent outline-none text-center tabular-nums" />' +
          '            <span class="text-xs text-gray-400">分</span>' +
          '          </div>' +
          '        </div>' +
          '      </div>' +
          '    </section>' +
          '  </div>' +
          '  <div class="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-white border-t border-gray-100">' +
          '    <div class="max-w-md mx-auto flex gap-3">' +
          '      <button id="settings-cancel" class="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-[#082752] bg-white">キャンセル</button>' +
          '      <button id="settings-save" class="flex-1 py-3 rounded-2xl bg-[#082752] text-sm font-medium text-white">保存</button>' +
          '    </div>' +
          '  </div>' +
          '</div>'
        );
      }

      function renderApp() {
        switch (state.currentScreen) {
          case 'login':
            return renderLogin();
          case 'closed':
            return renderClosedScreen();
          case 'dashboard':
            return renderDashboard();
          case 'settings':
            return renderSettingsScreen();
          case 'analytics':
            return renderAnalyticsScreen();
          case 'reviews':
            return renderReviewsScreen();
          case 'history':
            return renderHistoryScreen();
          case 'summary':
            return renderSummaryScreen();
          default:
            return renderLogin();
        }
      }

      function attachEvents() {
        const root = document.getElementById('app-root');
        if (!root) return;

        if (state.currentScreen === 'login') {
          const emailInput = document.getElementById('login-email');
          const passwordInput = document.getElementById('login-password');
          const emailLabel = document.getElementById('login-email-label');
          const passwordLabel = document.getElementById('login-password-label');
          const loginButton = document.getElementById('login-button');

          const syncLoginLabels = () => {
            if (emailLabel && emailInput) emailLabel.classList.toggle('hidden', !!emailInput.value);
            if (passwordLabel && passwordInput) passwordLabel.classList.toggle('hidden', !!passwordInput.value);
          };

          if (emailInput) {
            emailInput.addEventListener('input', (e) => {
              state.email = e.target.value;
              syncLoginLabels();
            });
          }
          if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
              state.password = e.target.value;
              syncLoginLabels();
            });
          }

          // 初期状態反映（入力値がある場合に備えて）
          syncLoginLabels();

          if (loginButton) {
            loginButton.addEventListener('click', () => {
              setCurrentScreen('closed');
            });
          }
          return;
        }

        if (state.currentScreen === 'closed') {
          const maxSlide = 280;
          const container = document.getElementById('closed-slider-container');
          const slider = document.getElementById('closed-slider');
          if (!container || !slider) return;

          const handleStart = () => {
            state.closedIsDragging = true;
          };
          const handleMove = (clientX) => {
            if (!state.closedIsDragging) return;
            const rect = container.getBoundingClientRect();
            const newX = Math.max(0, Math.min(clientX - rect.left - 30, maxSlide));
            state.closedSliderX = newX;
            slider.style.transform = 'translateX(' + newX + 'px)';
          };
          const handleEnd = () => {
            if (state.closedSliderX > maxSlide * 0.8) {
              state.closedSliderX = 0;
              state.closedIsDragging = false;
              setCurrentScreen('dashboard');
            } else {
              state.closedSliderX = 0;
              state.closedIsDragging = false;
              slider.style.transform = 'translateX(0px)';
            }
          };

          slider.addEventListener('mousedown', (e) => handleStart(e.clientX));
          slider.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX));

          const onMouseMove = (e) => handleMove(e.clientX);
          const onTouchMove = (e) => handleMove(e.touches[0].clientX);
          const onMouseUp = () => handleEnd();
          const onTouchEnd = () => handleEnd();

          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
          window.addEventListener('touchmove', onTouchMove);
          window.addEventListener('touchend', onTouchEnd);
          return;
        }

        if (state.currentScreen === 'dashboard') {
          const derived = computeDerived();

          const menuButton = document.getElementById('menu-button');
          if (menuButton) {
            menuButton.addEventListener('click', () => {
              setSidebarOpen(true);
            });
          }
          const historyButton = document.getElementById('history-button');
          if (historyButton) {
            historyButton.addEventListener('click', () => {
              setCurrentScreen('history');
            });
          }

          document.querySelectorAll('[data-filter]').forEach((el) => {
            el.addEventListener('click', () => {
              const tab = el.getAttribute('data-filter');
              setFilterTab(tab);
            });
          });

          const callNextButton = document.getElementById('call-next');
          if (callNextButton) {
            callNextButton.addEventListener('click', () => {
              const nextGuest = derived.filteredGuests.find((g) => g.status === 'WAITING');
              if (nextGuest) {
                state.selectedGuestIdForCall = nextGuest.id;
                state.callModalOpen = true;
                state.notifyMethod = null;
                render();
              }
            });
          }

          document.querySelectorAll('[data-action="call"]').forEach((el) => {
            el.addEventListener('click', () => {
              const id = el.getAttribute('data-id');
              state.selectedGuestIdForCall = id;
              state.callModalOpen = true;
              state.notifyMethod = null;
              render();
            });
          });
          document.querySelectorAll('[data-action="guide"]').forEach((el) => {
            el.addEventListener('click', () => {
              const id = el.getAttribute('data-id');
              updateGuestStatus(id, 'GUIDING');
            });
          });
          document.querySelectorAll('[data-action="complete"]').forEach((el) => {
            el.addEventListener('click', () => {
              const id = el.getAttribute('data-id');
              updateGuestStatus(id, 'COMPLETED');
            });
          });

          document.querySelectorAll('[data-hold-cancel]').forEach((el) => {
            el.addEventListener('click', () => {
              const id = el.getAttribute('data-hold-cancel');
              // 保留中のキャンセルも履歴に反映する（待機一覧からは外す）
              updateGuestStatus(id, 'CANCELLED');
            });
          });
          document.querySelectorAll('[data-hold-back]').forEach((el) => {
            el.addEventListener('click', () => {
              const id = el.getAttribute('data-hold-back');
              updateGuestStatus(id, 'WAITING');
            });
          });

          document.querySelectorAll('[data-menu-toggle]').forEach((el) => {
            el.addEventListener('click', (e) => {
              // backdrop の click が同一操作で走ってしまうケースを抑制
              state.menuToggleLockUntil = Date.now() + 160;
              e.stopPropagation();
              const id = el.getAttribute('data-menu-toggle');
              const menu = document.querySelector('[data-menu="' + id + '"]');
              const backdrop = document.querySelector('[data-menu-backdrop="' + id + '"]');
              if (!menu || !backdrop) return;
              const callNext = document.getElementById('call-next');
              const isHidden = menu.classList.contains('hidden');
              document
                .querySelectorAll('[data-menu]')
                .forEach((m) => m.classList.add('hidden'));
              document
                .querySelectorAll('[data-menu-backdrop]')
                .forEach((b) => b.classList.add('hidden'));
              if (isHidden) {
                menu.classList.remove('hidden');
                backdrop.classList.remove('hidden');
                state.openCardMenuId = id;
                // メニュー開閉はDOM操作で完結（renderすると即閉じに見えるため）
                if (callNext) callNext.style.display = 'none';
                return;
              }
              state.openCardMenuId = null;
              if (callNext) callNext.style.display = '';
            });
          });

          document.querySelectorAll('[data-menu-backdrop]').forEach((el) => {
            el.addEventListener('click', (e) => {
              if (Date.now() < state.menuToggleLockUntil) return;
              // クリック対象が backdrop 自身以外なら閉じない（メニュー内クリック誤判定防止）
              if (e.target !== el) return;
              const callNext = document.getElementById('call-next');
              document
                .querySelectorAll('[data-menu]')
                .forEach((m) => m.classList.add('hidden'));
              document
                .querySelectorAll('[data-menu-backdrop]')
                .forEach((b) => b.classList.add('hidden'));
              state.openCardMenuId = null;
              if (callNext) callNext.style.display = '';
            });
          });

          document.querySelectorAll('[data-menu-action]').forEach((el) => {
            el.addEventListener('click', (e) => {
              e.stopPropagation();
              const id = el.getAttribute('data-id');
              const action = el.getAttribute('data-menu-action');
              const callNext = document.getElementById('call-next');

              // メニューを一旦閉じてから次へ遷移（通知モーダルなど）
              document.querySelectorAll('[data-menu]').forEach((m) => m.classList.add('hidden'));
              document
                .querySelectorAll('[data-menu-backdrop]')
                .forEach((b) => b.classList.add('hidden'));
              state.openCardMenuId = null;
              if (callNext) callNext.style.display = '';

              if (action === 'phone') {
                state.selectedGuestIdForCall = id;
                state.callModalOpen = true;
                state.notifyMethod = null;
                state.menuToggleLockUntil = Date.now() + 160;
                render();
                return;
              }

              if (action === 'hold') {
                updateGuestStatus(id, 'HOLD');
              } else if (action === 'cancel') {
                updateGuestStatus(id, 'CANCELLED');
              }
            });
          });

          const historyBtn = document.getElementById('history-button');
          if (historyBtn) {
            historyBtn.addEventListener('click', () => {
              setCurrentScreen('history');
            });
          }

          if (state.sidebarOpen) {
            const sidebarBackdrop = document.getElementById('sidebar-backdrop');
            const sidebarClose = document.getElementById('sidebar-close');
            if (sidebarBackdrop) {
              sidebarBackdrop.addEventListener('click', () => setSidebarOpen(false));
            }
            if (sidebarClose) {
              sidebarClose.addEventListener('click', () => setSidebarOpen(false));
            }

            const modeNormal = document.getElementById('mode-normal');
            const modePaused = document.getElementById('mode-paused');
            if (modeNormal) {
              modeNormal.addEventListener('click', () => setIsReceptionPaused(false));
            }
            if (modePaused) {
              modePaused.addEventListener('click', () => setIsReceptionPaused(true));
            }

            const navAnalytics = document.getElementById('nav-analytics');
            const navReviews = document.getElementById('nav-reviews');
            const navSettings = document.getElementById('nav-settings');
            const navigateFromSidebar = (screen) => {
              setSidebarOpen(false);
              setTimeout(() => {
                setCurrentScreen(screen);
              }, 150);
            };
            if (navAnalytics) {
              navAnalytics.addEventListener('click', () => navigateFromSidebar('analytics'));
            }
            if (navReviews) {
              navReviews.addEventListener('click', () => navigateFromSidebar('reviews'));
            }
            if (navSettings) {
              navSettings.addEventListener('click', () => navigateFromSidebar('settings'));
            }

            const finishDay = document.getElementById('finish-day');
            const finishDayYes = document.getElementById('finish-day-yes');
            const finishDayCancel = document.getElementById('finish-day-cancel');
            if (finishDay) {
              finishDay.addEventListener('click', () => {
                state.showEndConfirm = true;
                render();
              });
            }
            if (finishDayYes) {
              finishDayYes.addEventListener('click', () => {
                setCurrentScreen('summary');
                state.showEndConfirm = false;
                setSidebarOpen(false);
              });
            }
            if (finishDayCancel) {
              finishDayCancel.addEventListener('click', () => {
                state.showEndConfirm = false;
                render();
              });
            }

            const offsetPlus10 = document.getElementById('offset-plus-10');
            const offsetPlus20 = document.getElementById('offset-plus-20');
            const offsetReset = document.getElementById('offset-reset');
            if (offsetPlus10) {
              offsetPlus10.addEventListener('click', () =>
                setWaitTimeOffset(state.waitTimeOffset + 10)
              );
            }
            if (offsetPlus20) {
              offsetPlus20.addEventListener('click', () =>
                setWaitTimeOffset(state.waitTimeOffset + 20)
              );
            }
            if (offsetReset) {
              offsetReset.addEventListener('click', () => setWaitTimeOffset(0));
            }

            const logout = document.getElementById('logout');
            if (logout) {
              logout.addEventListener('click', () => {
                setCurrentScreen('login');
                setSidebarOpen(false);
              });
            }
          }

          if (state.callModalOpen && state.selectedGuestIdForCall) {
            const guest = state.guests.find((g) => g.id === state.selectedGuestIdForCall);
            const modalRoot = document.getElementById('notify-modal-root');
            if (modalRoot && guest) {
              let isClosing = false;

              const btnLine = document.getElementById('notify-line');
              const btnEmail = document.getElementById('notify-email');
              const lineBox = document.getElementById('notify-line-box');
              const lineIcon = document.getElementById('notify-line-icon');
              const lineLabel = document.getElementById('notify-line-label');
              const emailBox = document.getElementById('notify-email-box');
              const emailIcon = document.getElementById('notify-email-icon');
              const emailLabel = document.getElementById('notify-email-label');

              const preview = document.getElementById('notify-preview');
              const previewText = document.getElementById('notify-preview-text');
              const sendBtn = document.getElementById('notify-send');

              const backdrop = document.getElementById('notify-backdrop');
              const close = document.getElementById('notify-close');

              const LINE_BOX_INACTIVE =
                'w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-gray-200 bg-gray-50 hover:border-gray-300 transition-all';
              const LINE_BOX_ACTIVE =
                'w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-[#22C55E] bg-[#DCFCE7] transition-all';
              const METHOD_ICON_INACTIVE = 'w-8 h-8 text-gray-400';
              const METHOD_ICON_ACTIVE = 'w-8 h-8 text-[#22C55E]';
              const METHOD_LABEL_INACTIVE = 'text-sm font-bold text-gray-500';
              const METHOD_LABEL_ACTIVE = 'text-sm font-bold text-[#22C55E]';

              const EMAIL_BOX_ACTIVE =
                'w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-[#082752] bg-[#082752] transition-all';
              const EMAIL_ICON_ACTIVE = 'w-8 h-8 text-white';
              const EMAIL_LABEL_ACTIVE = 'text-sm font-bold text-white';

              const SEND_DISABLED_CLASS =
                'w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 bg-gray-300 cursor-not-allowed transition-colors';
              const SEND_LINE_CLASS =
                'w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] transition-colors';
              const SEND_EMAIL_CLASS =
                'w-full py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 bg-[#082752] hover:bg-[#0a3060] transition-colors';

              const computePreviewText = (method) => {
                if (method === 'LINE') {
                  return (
                    'まもなくご案内です！整理券No.' +
                    guest.number +
                    'をご用意ください。[詳細を確認するボタン]'
                  );
                }
                if (method === 'EMAIL') {
                  const position =
                    state.guests
                      .filter((g) => g.status === 'WAITING')
                      .findIndex((g) => g.id === guest.id) + 1;
                  return (
                    '【ETABLE】あと' +
                    position +
                    '組でご案内予定です。店頭へお越しください。(No.' +
                    guest.number +
                    ')'
                  );
                }
                return '';
              };

              const applyMethodUI = (method) => {
                state.notifyMethod = method; // selection state persist

                const lineActive = method === 'LINE';
                const emailActive = method === 'EMAIL';

                // ボタン（高さ/余白が変わらないように className を固定セット）
                if (lineBox) lineBox.className = lineActive ? LINE_BOX_ACTIVE : LINE_BOX_INACTIVE;
                if (lineIcon) lineIcon.className = lineActive ? METHOD_ICON_ACTIVE : METHOD_ICON_INACTIVE;
                if (lineLabel) lineLabel.className = lineActive ? METHOD_LABEL_ACTIVE : METHOD_LABEL_INACTIVE;

                if (emailBox)
                  emailBox.className = emailActive ? EMAIL_BOX_ACTIVE : LINE_BOX_INACTIVE;
                if (emailIcon)
                  emailIcon.className = emailActive ? EMAIL_ICON_ACTIVE : METHOD_ICON_INACTIVE;
                if (emailLabel)
                  emailLabel.className = emailActive ? EMAIL_LABEL_ACTIVE : METHOD_LABEL_INACTIVE;

                // CSSで“選択状態”を安定して表現するためのフラグ（レイアウト/サイズ変更なし）
                if (lineBox) lineBox.classList.toggle('is-active', lineActive);
                if (emailBox) emailBox.classList.toggle('is-active', emailActive);

                // プレビュー + 次へ（通知送信）活性
                if (!preview || !previewText || !sendBtn) return;

                if (!method) {
                  preview.classList.add('hidden');
                  sendBtn.setAttribute('disabled', 'true');
                  sendBtn.className = SEND_DISABLED_CLASS;
                  previewText.textContent = '';
                  return;
                }

                preview.classList.remove('hidden');
                previewText.textContent = computePreviewText(method);
                sendBtn.removeAttribute('disabled');
                sendBtn.className = method === 'LINE' ? SEND_LINE_CLASS : SEND_EMAIL_CLASS;
              };

              // 初期同期（open直後でも選択状態があれば反映）
              applyMethodUI(state.notifyMethod);

              if (btnLine) {
                btnLine.addEventListener('click', () => {
                  if (isClosing) return;
                  applyMethodUI('LINE'); // single select
                });
              }
              if (btnEmail) {
                btnEmail.addEventListener('click', () => {
                  if (isClosing) return;
                  applyMethodUI('EMAIL'); // single select
                });
              }

              const closeWithAnimation = () => {
                if (isClosing) return;
                isClosing = true;
                modalRoot.classList.add('notify-exit');
                window.setTimeout(() => {
                  state.callModalOpen = false;
                  state.selectedGuestIdForCall = null;
                  state.notifyMethod = null;
                  render();
                }, 180);
              };

              if (backdrop) {
                backdrop.addEventListener('click', closeWithAnimation);
              }
              if (close) {
                close.addEventListener('click', closeWithAnimation);
              }

              if (sendBtn) {
                sendBtn.addEventListener('click', () => {
                  const method = state.notifyMethod;
                  if (!method) return;

                  // updateGuestStatus 内で render() されるため、先にモーダル状態を落としておく
                  state.callModalOpen = false;
                  state.selectedGuestIdForCall = null;
                  state.notifyMethod = null;
                  updateGuestStatus(guest.id, 'CALLING', method);
                });
              }
            }
          }

          document.querySelectorAll('[data-elapsed-id]').forEach((el) => {
            const id = el.getAttribute('data-elapsed-id');
            const guest = state.guests.find((g) => g.id === id);
            if (!guest) return;
            if (guest.status === 'CALLING' && guest.calledAt) {
              el.textContent = formatElapsedTime(guest.calledAt);
            }
            if (guest.status === 'GUIDING' && guest.guidedAt) {
              el.textContent = formatElapsedTime(guest.guidedAt);
            }
          });

          return;
        }

        if (state.currentScreen === 'settings') {
          const closeBtn = document.getElementById('settings-close');
          const cancelBtn = document.getElementById('settings-cancel');
          const saveBtn = document.getElementById('settings-save');

          const goBackToMain = () => {
            setCurrentScreen('dashboard');
          };

          if (closeBtn) {
            closeBtn.addEventListener('click', goBackToMain);
          }
          if (cancelBtn) {
            cancelBtn.addEventListener('click', goBackToMain);
          }
          if (saveBtn) {
            saveBtn.addEventListener('click', () => {
              const callMessageInput = document.getElementById('call-message-input');
              const autoCancelInput = document.getElementById('auto-cancel-minutes-input');

              const rawMessage = callMessageInput ? callMessageInput.value : '';
              const minutesValue = autoCancelInput ? parseInt(autoCancelInput.value, 10) : 10;
              const autoCancelMinutes = Number.isNaN(minutesValue)
                ? 10
                : Math.max(1, Math.min(120, minutesValue));

              state.callMessage = rawMessage;
              state.autoCancelMinutes = autoCancelMinutes;
              alert('設定を保存しました');
              goBackToMain();
            });
          }

          const settingsRoot = document.querySelector('#app-root > div');
          if (settingsRoot) {
            const sections = settingsRoot.querySelectorAll('section');

            // 1. 営業時間 追加・削除
            const hoursSection = sections[0];
            if (hoursSection) {
              const hoursList = hoursSection.querySelector('#hours-list');
              if (hoursList) {
                const hourCards = hoursList.querySelectorAll('div.bg-white');
                hourCards.forEach((card) => {
                  const delBtn = card.querySelector('button');
                  if (delBtn) {
                    delBtn.addEventListener('click', () => card.remove());
                  }
                });
                const addHoursBtn = hoursList.querySelector('#open-hours-modal');
                if (addHoursBtn) {
                  addHoursBtn.addEventListener('click', () => {
                    toggleBusinessModal(true);
                  });
                }
              }
            }

            // 2. 定休日 追加・削除
            const closedSection = sections[1];
            if (closedSection) {
              const closedList = closedSection.querySelector('#closed-list');
              if (closedList) {
                const closedCards = closedList.querySelectorAll('div.bg-white');
                closedCards.forEach((card) => {
                  const delBtn = card.querySelector('button');
                  if (delBtn) {
                    delBtn.addEventListener('click', () => card.remove());
                  }
                });
                const addClosedBtn = closedList.querySelector('#open-closed-days-modal');
                if (addClosedBtn) {
                  addClosedBtn.addEventListener('click', () => {
                    openClosedDaysModal();
                  });
                }
              }
            }

            // 3. トグルスイッチ（順番待ち受付 / 本日の受付停止）
            const toggleSection = sections[2];
            if (toggleSection) {
              const toggles = toggleSection.querySelectorAll('div.w-12.h-7');
              toggles.forEach((wrap) => {
                wrap.addEventListener('click', () => {
                  const knob = wrap.querySelector('div.w-5.h-5');
                  const isOn = wrap.className.includes('bg-[#082752]');
                  if (isOn) {
                    wrap.className = 'w-12 h-7 rounded-full bg-gray-300 flex items-center px-1';
                    if (knob) {
                      knob.className = 'w-5 h-5 bg-white rounded-full shadow translate-x-0';
                    }
                  } else {
                    wrap.className = 'w-12 h-7 rounded-full bg-[#082752] flex items-center px-1';
                    if (knob) {
                      knob.className = 'w-5 h-5 bg-white rounded-full shadow translate-x-5';
                    }
                  }
                });
              });
            }

            // 呼び出しメッセージ：入力内容をリアルタイムでプレビュー反映
            const callMessageInput = document.getElementById('call-message-input');
            const callMessagePreview = document.getElementById('call-message-preview-text');
            if (callMessageInput && callMessagePreview) {
              const updatePreview = () => {
                const raw = callMessageInput.value || '';
                callMessagePreview.textContent = raw.replace(/\{number\}/g, '12');
              };
              callMessageInput.addEventListener('input', updatePreview);
              updatePreview();
            }

            // 自動キャンセルに移行する時間（分）：矢印で増減 + 範囲を固定
            const autoCancelInput = document.getElementById('auto-cancel-minutes-input');
            if (autoCancelInput) {
              const clampMinutes = () => {
                let n = parseInt(autoCancelInput.value, 10);
                if (Number.isNaN(n)) n = 10;
                n = Math.max(1, Math.min(120, n));
                autoCancelInput.value = String(n);
                state.autoCancelMinutes = n;
              };
              autoCancelInput.addEventListener('input', clampMinutes);
              clampMinutes();
            }
          }

          return;
        }

        if (state.currentScreen === 'history') {
          // タブ切り替え
          document.querySelectorAll('[data-history-tab]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const tab = btn.getAttribute('data-history-tab');
              if (!tab) return;
              state.historyTab = tab;
              render();
            });
          });

          // カード描画（DOM構築）→ 復元ボタンにイベントを貼る
          renderHistoryCardsDOM();
          document.querySelectorAll('[data-restore-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const id = btn.getAttribute('data-restore-id');
              if (!id) return;
              restoreGuestToWaiting(id);
            });
          });

          // 戻る（直前画面へ）
          const backBtn = document.getElementById('back-dashboard');
          if (backBtn) {
            backBtn.addEventListener('click', () => {
              const fallback = state.previousScreen || 'dashboard';
              // ブラウザ履歴がある場合はそれを優先（無反応回避）
              if (window.history && window.history.length > 1) {
                try {
                  window.history.back();
                  return;
                } catch (e) {
                  // ignore and fallback to SPA navigation
                }
              }
              setCurrentScreen(fallback);
            });
          }

          return;
        }

        if (state.currentScreen === 'summary') {
          const analyze = document.getElementById('summary-analyze');
          if (analyze) {
            analyze.addEventListener('click', () => {
              setCurrentScreen('analytics');
            });
          }

          const home = document.getElementById('summary-home');
          if (home) {
            home.addEventListener('click', () => {
              setCurrentScreen('dashboard');
            });
          }

          const save = document.getElementById('summary-save');
          if (save) {
            save.addEventListener('click', () => {
              const payload = {
                date: new Date().toISOString().slice(0, 10),
                guidedCount: state.guests.filter((g) => g.status === 'COMPLETED').length,
                droppedCount: state.guests.filter((g) => g.status === 'CANCELLED').length,
              };

              const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'etable-sales-report-' + payload.date + '.json';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            });
          }

          return;
        }

        const backDashboard = document.getElementById('back-dashboard');
        if (backDashboard) {
          backDashboard.addEventListener('click', () => {
            setCurrentScreen('dashboard');
          });
        }
      }

      function render() {
        const root = document.getElementById('app-root');
        if (!root) return;
        root.innerHTML = renderApp();
        attachEvents();

        // ログイン画面だけ外側シェルをスクショ仕様に合わせる（影なし/白背景）
        const shell = document.getElementById('app-shell');
        if (shell) {
          const isLogin = state.currentScreen === 'login';
          shell.classList.toggle('shadow-2xl', !isLogin);
          shell.classList.toggle('bg-background', !isLogin);
          shell.classList.toggle('bg-white', isLogin);
        }
      }

      setInterval(() => {
        // 通知設定モーダル表示中は再描画で選択状態が崩れないように止める
        // カードメニュー/サイドバー表示中もDOMを維持して操作を優先する
        if (
          state.currentScreen === 'dashboard' &&
          !state.callModalOpen &&
          !state.openCardMenuId &&
          !state.sidebarOpen
        ) {
          render();
        }
      }, 1000);

      window.addEventListener('DOMContentLoaded', () => {
        render();

        // 曜日の選択（全ボタンに click 配線、classList.toggle のみでトグル）
        document.querySelectorAll('#business-hours-modal .day-select-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            btn.classList.toggle('bg-[#082752]');
            btn.classList.toggle('text-white');
            btn.classList.toggle('border-[#082752]');
          });
        });

        // 保存ボタン配線（カード追加 / モーダルクローズ）
        const saveBtn = document.getElementById('save-business-hours');
        if (saveBtn) {
          saveBtn.addEventListener('click', () => {
            const startInput = document.getElementById('start-time-input');
            const endInput = document.getElementById('end-time-input');
            if (!startInput || !endInput) return;

            const selectedDays = Array.from(
              document.querySelectorAll('#business-hours-modal .day-select-btn.text-white')
            ).map((btn) => btn.textContent.trim());

            if (selectedDays.length === 0) {
              alert('曜日を選択してください');
              return;
            }

            const newHours = {
              days: selectedDays.join('・'),
              time: `${startInput.value}〜${endInput.value}`,
            };

            const listContainer = document.querySelector('#hours-list');
            const openHoursBtn = document.getElementById('open-hours-modal');
            if (!listContainer || !openHoursBtn) {
              toggleBusinessModal(false);
              return;
            }

            const newCard = document.createElement('div');
            // 既存カードと同じ class / 構造に揃えて、ゴミ箱アイコン位置のズレをなくす
            newCard.className =
              'bg-white rounded-[32px] p-5 border border-gray-100 flex items-center justify-between';
            newCard.innerHTML = `
              <div>
                <p class="text-xs text-gray-400 mb-1">${newHours.days}</p>
                <p class="text-base font-semibold text-[#082752]">${newHours.time}</p>
              </div>
              <button class="card-delete-btn p-2 rounded-full hover:bg-gray-100 transition-colors" type="button" aria-label="削除">
                <svg class="icon-delete w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 6h18"></path>
                  <path d="M8 6V4h8v2"></path>
                  <path d="M19 6l-1 16H6L5 6"></path>
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                </svg>
              </button>
            `;

            const deleteBtn = newCard.querySelector('.card-delete-btn');
            if (deleteBtn) {
              deleteBtn.addEventListener('click', () => {
                newCard.remove();
              });
            }

            // 「＋ 営業時間追加」ボタンのすぐ上に挿入
            listContainer.insertBefore(newCard, openHoursBtn);

            toggleBusinessModal(false);
          });
        }

        // 背景クリックで閉じる
        const modal = document.getElementById('business-hours-modal');
        if (modal) {
          modal.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'business-hours-modal') toggleBusinessModal(false);
          });
        }

        // 定休日追加モーダル配線
        const weeklyTab = document.getElementById('closed-days-tab-weekly');
        const specificTab = document.getElementById('closed-days-tab-specific');
        const addClosedBtn = document.getElementById('add-closed-rule');

        const weeklyPanel = document.getElementById('closed-days-panel-weekly');
        const specificPanel = document.getElementById('closed-days-panel-specific');

        if (weeklyTab && specificTab && addClosedBtn && weeklyPanel && specificPanel) {
          weeklyTab.addEventListener('click', () => {
            closedActiveMode = 'weekly';
            weeklyTab.className =
              'flex-1 py-3 rounded-xl text-sm font-medium bg-[#082752] text-white';
            specificTab.className =
              'flex-1 py-3 rounded-xl text-sm font-medium text-gray-500';

            weeklyPanel.classList.remove('hidden');
            specificPanel.classList.add('hidden');
            updateClosedAddButtonState();
          });

          specificTab.addEventListener('click', () => {
            closedActiveMode = 'specific';
            weeklyTab.className =
              'flex-1 py-3 rounded-xl text-sm font-medium text-gray-500';
            specificTab.className =
              'flex-1 py-3 rounded-xl text-sm font-medium bg-[#082752] text-white';

            weeklyPanel.classList.add('hidden');
            specificPanel.classList.remove('hidden');
            updateClosedAddButtonState();
          });

          // 毎週タブ：曜日は 1 つだけ選択
          document
            .querySelectorAll('#closed-weekly-day-grid .closed-day-btn')
            .forEach((btn) => {
              btn.addEventListener('click', () => {
                closedActiveMode = 'weekly';
                closedWeeklyDay = btn.textContent.trim();

                document
                  .querySelectorAll('#closed-weekly-day-grid .closed-day-btn')
                  .forEach((b) => setClosedRuleBtnActive(b, false));
                setClosedRuleBtnActive(btn, true);
                updateClosedAddButtonState();
              });
            });

          // 特定週タブ：第N週の選択
          document
            .querySelectorAll('#closed-specific-week-grid .closed-week-btn')
            .forEach((btn) => {
              btn.addEventListener('click', () => {
                closedActiveMode = 'specific';
                closedSpecificWeek = btn.getAttribute('data-week');

                document
                  .querySelectorAll('#closed-specific-week-grid .closed-week-btn')
                  .forEach((b) => setClosedRuleBtnActive(b, false));
                setClosedRuleBtnActive(btn, true);
                updateClosedAddButtonState();
              });
            });

          // 特定週タブ：曜日の選択
          document
            .querySelectorAll('#closed-specific-day-grid .closed-day-btn')
            .forEach((btn) => {
              btn.addEventListener('click', () => {
                closedActiveMode = 'specific';
                closedSpecificDay = btn.textContent.trim();

                document
                  .querySelectorAll('#closed-specific-day-grid .closed-day-btn')
                  .forEach((b) => setClosedRuleBtnActive(b, false));
                setClosedRuleBtnActive(btn, true);
                updateClosedAddButtonState();
              });
            });

          // ルール追加
          addClosedBtn.addEventListener('click', () => {
            if (addClosedBtn.disabled) return;

            const closedList = document.getElementById('closed-list');
            const openClosedBtn = document.getElementById('open-closed-days-modal');
            if (!closedList || !openClosedBtn) return;

            let label = '';
            if (closedActiveMode === 'weekly') {
              label = `毎週${closedWeeklyDay}`;
            } else {
              label = `第${closedSpecificWeek}${closedSpecificDay}曜日`;
            }

            const newCard = document.createElement('div');
            newCard.className =
              'bg-white rounded-[32px] p-5 border border-gray-100 flex items-center justify-between';
            newCard.innerHTML = `
              <div>
                <p class="text-base font-semibold text-[#082752]">${label}</p>
              </div>
              <button class="card-delete-btn p-2 rounded-full hover:bg-gray-100 transition-colors" type="button" aria-label="削除">
                <svg class="icon-delete w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 6h18"></path>
                  <path d="M8 6V4h8v2"></path>
                  <path d="M19 6l-1 16H6L5 6"></path>
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                </svg>
              </button>
            `;

            const deleteBtn = newCard.querySelector('.card-delete-btn');
            if (deleteBtn) {
              deleteBtn.addEventListener('click', () => {
                newCard.remove();
              });
            }

            closedList.insertBefore(newCard, openClosedBtn);
            toggleClosedDaysModal(false);
          });
        }

        // 背景クリックで閉じる（定休日追加モーダル）
        const closedModal = document.getElementById('closed-days-modal');
        if (closedModal) {
          closedModal.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'closed-days-modal') toggleClosedDaysModal(false);
          });
        }
      });
    
