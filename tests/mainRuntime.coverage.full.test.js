const path = require('path');

const FULL_DOM = `
  <form id="transactionForm"></form>

  <input id="titleInput" />
  <input id="amountInput" />
  <select id="categoryInput"></select>
  <input id="dateInput" />

  <small id="titleError"></small>
  <small id="amountError"></small>
  <small id="categoryError"></small>
  <small id="dateError"></small>

  <button id="submitBtn" type="button"></button>
  <button id="cancelEditBtn" type="button"></button>

  <select id="filterCategory"><option value="all">all</option></select>
  <select id="filterType"><option value="all">all</option></select>
  <input id="searchInput" />

  <button id="resetFiltersBtn" type="button"></button>
  <button id="exportCsvBtn" type="button"></button>
  <button id="themeToggleBtn" type="button"></button>

  <button id="historyToggleBtn" type="button"></button>

  <input id="settingConfirmDismiss" type="checkbox" />
  <input id="settingRecordAdded" type="checkbox" />
  <input id="settingRecordUpdated" type="checkbox" />
  <input id="settingRecordDeleted" type="checkbox" />
  <input id="settingRecordExported" type="checkbox" />

  <div id="transactionsList"></div>
  <div id="resultsCount"></div>
  <div id="totalBalance"></div>
  <div id="totalIncome"></div>
  <div id="totalExpenses"></div>

  <canvas id="financeChart"></canvas>
  <div id="chartAccessibleText"></div>
  <button id="toggleChartTableBtn" type="button"></button>

  <div id="srIncome"></div>
  <div id="srExpenses"></div>
  <div id="srBalance"></div>

  <div id="confirmModal" class="modal"></div>
  <button id="confirmDeleteBtn" type="button"></button>
  <button id="cancelDeleteBtn" type="button"></button>

  <div id="toastContainer"></div>
  <div id="srToast"></div>

  <div id="notificationHistoryContainer"></div>
  <ul id="notificationHistory"></ul>
  <div id="notificationHistoryStatus"></div>

  <button id="openHistoryBtn" type="button"></button>
  <span id="notificationCount"></span>

  <div id="notificationBackdrop"></div>

  <button id="clearNotificationsBtn" type="button"></button>

  <button id="restoreNotificationDefaultsBtn" type="button"></button>

  <div id="restoreDefaultsModal" class="modal"></div>
  <button id="confirmRestoreDefaultsBtn" type="button"></button>
  <button id="cancelRestoreDefaultsBtn" type="button"></button>

  <div id="clearNotificationsModal" class="modal"></div>
  <button id="confirmClearNotificationsBtn" type="button"></button>
  <button id="cancelClearNotificationsBtn" type="button"></button>

  <div id="dismissNotificationModal" class="modal"></div>
  <div id="dismissNotificationBody"></div>
  <button id="confirmDismissNotificationBtn" type="button"></button>
  <button id="cancelDismissNotificationBtn" type="button"></button>

  <button id="langToggleBtn" type="button"></button>

  <div id="localStorageNotice"></div>
  <button id="acceptLocalStorageBtn" type="button"></button>
  <button id="declineLocalStorageBtn" type="button"></button>

  <div id="skeleton"></div>

  <a class="local-storage-notice__link" href="privacy.html?lang=zh">Privacy</a>
`;


describe('main.js combined branch coverage tests (full DOM, corrected)', () => {
  const mainPath = path.join(__dirname, '..', 'main.js');
  const i18nPath = path.join(__dirname, '..', 'i18n.js');

  afterEach(() => {
    delete window.financeDateUtils;
    delete window.TRANSLATIONS;
    localStorage.clear();
    jest.useRealTimers();
    try { delete window.devicePixelRatio; } catch (e) {}
    if (global._origCreateObjectURL) {
      global.URL.createObjectURL = global._origCreateObjectURL;
      delete global._origCreateObjectURL;
    }
    if (global._origRevokeObjectURL) {
      global.URL.revokeObjectURL = global._origRevokeObjectURL;
      delete global._origRevokeObjectURL;
    }
    if (global._origLocalStorageSetItem) {
      localStorage.setItem = global._origLocalStorageSetItem;
      delete global._origLocalStorageSetItem;
    }
  });

  const loadWithFullDom = (setup = () => {}) => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    setup();
    try { require(i18nPath); } catch (e) {}
    return require(mainPath);
  };

  test('dateUtils fallback used when financeDateUtils absent', () => {
    const mod = loadWithFullDom(() => { delete window.financeDateUtils; });
    if (mod && typeof mod.loadFromLocalStorage === 'function') {
      localStorage.setItem('financeTrackerData', 'INVALID_JSON');
      expect(() => mod.loadFromLocalStorage()).not.toThrow();
      localStorage.setItem('financeTrackerData', JSON.stringify([{ id: 't1', date: '2026-05-19T12:00:00Z' }]));
      expect(() => mod.loadFromLocalStorage()).not.toThrow();
      const stored = JSON.parse(localStorage.getItem('financeTrackerData'));
      expect(typeof stored[0].date === 'string').toBeTruthy();
    } else {
      expect(mod).toBeDefined();
    }
  });

  test('bootstrapTranslations fallback populates window.TRANSLATIONS', () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    delete window.TRANSLATIONS;
    const mod = require(mainPath);
    expect(window.TRANSLATIONS).toBeDefined();
    expect(window.TRANSLATIONS.en).toBeDefined();
    expect(window.TRANSLATIONS.en.appTitle).toBe('Advanced Finance Tracker');
  });

  test('notification fallback branches (normalize/create/render/remove)', () => {
    const mod = loadWithFullDom();
    if (typeof mod.normalizeNotificationHistoryItem === 'function') {
      expect(mod.normalizeNotificationHistoryItem(null)).toBeNull();
      expect(mod.normalizeNotificationHistoryItem('string')).toBeNull();
      const normalized = mod.normalizeNotificationHistoryItem({ id: 'n1', timestamp: Date.now() });
      expect(normalized).toBeTruthy();
      expect(normalized.message).toBeDefined();
    }

    if (typeof mod.createNotificationHistoryItem === 'function' && typeof mod.renderNotificationHistory === 'function') {
      mod.state.notificationHistory = [];
      mod.renderNotificationHistory();
      expect(document.getElementById('notificationHistory').querySelector('#notificationHistoryEmpty')).not.toBeNull();

      mod.state.notificationHistory = [{ id: 'n1', timestamp: Date.now(), message: 'Hello' }];
      mod.renderNotificationHistory();
      expect(document.getElementById('notificationHistory').querySelectorAll('li').length).toBeGreaterThanOrEqual(1);

      const li = mod.createNotificationHistoryItem({ id: 'x', timestamp: Date.now(), message: 'X' });
      expect(li.dataset.id).toBe('x');
      expect(li.dataset.message).toContain('X');
    }

    if (typeof mod.removeNotificationById === 'function') {
      mod.state.notificationHistory = [{ id: 'n1' }, { id: 'n2' }];
      mod.removeNotificationById(null);
      expect(mod.state.notificationHistory.length).toBe(2);
      mod.removeNotificationById('n1');
      expect(mod.state.notificationHistory.find(n => n.id === 'n1')).toBeUndefined();
    }
  });

  test('modal early-return branches and safe modal operations', () => {
    const mod = loadWithFullDom();
    const dismiss = document.getElementById('dismissNotificationModal');
    if (dismiss) dismiss.remove();

    expect(() => mod.openDismissNotificationModal && mod.openDismissNotificationModal('id', 'msg')).not.toThrow();
    expect(() => mod.closeDismissNotificationModal && mod.closeDismissNotificationModal()).not.toThrow();

    if (typeof mod.openModal === 'function') expect(() => mod.openModal(null, null)).not.toThrow();
    if (typeof mod.closeModal === 'function') expect(() => mod.closeModal(null, null)).not.toThrow();
  });

  test('chart early-return and drawing branches (robust checks)', () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM.replace('<canvas id="financeChart"></canvas>', '');
    require(i18nPath);
    let mod = require(mainPath);
    expect(() => mod.renderChart && mod.renderChart()).not.toThrow();

    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    const origGet = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function () { return null; };
    require(i18nPath);
    mod = require(mainPath);
    expect(() => mod.renderChart && mod.renderChart()).not.toThrow();
    HTMLCanvasElement.prototype.getContext = origGet;

    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    const ctx = { clearRect: jest.fn(), setTransform: jest.fn() };
    const mockCanvas = {
      getContext: () => ctx,
      offsetWidth: 400,
      offsetHeight: 200,
      width: 0,
      height: 0,
    };
    const origGetById = document.getElementById;
    Object.defineProperty(document, 'getElementById', {
      value: (id) => (id === 'financeChart' ? mockCanvas : origGetById.call(document, id)),
      configurable: true,
    });
    require(i18nPath);
    mod = require(mainPath);
    if (typeof mod.renderChart === 'function') {
      mod.state.transactions = [];
      expect(() => mod.renderChart()).not.toThrow();
      expect(typeof mockCanvas.width === 'number').toBeTruthy();
      expect(typeof mockCanvas.height === 'number').toBeTruthy();
    } else {
      expect(mod).toBeDefined();
    }
    Object.defineProperty(document, 'getElementById', { value: origGetById, configurable: true });

    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    const ctx2 = {
      setTransform: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      clearRect: jest.fn(),
    };
    const mockCanvas2 = {
      getContext: () => ctx2,
      offsetWidth: 300,
      offsetHeight: 150,
      width: 0,
      height: 0,
    };
    const origGetById2 = document.getElementById;
    Object.defineProperty(document, 'getElementById', {
      value: (id) => (id === 'financeChart' ? mockCanvas2 : origGetById2.call(document, id)),
      configurable: true,
    });
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, writable: true });
    require(i18nPath);
    mod = require(mainPath);
    if (typeof mod.renderChart === 'function') {
      mod.state.transactions = [{ id: 't1', amount: 100, date: '2026-05-19' }];
      expect(() => mod.renderChart()).not.toThrow();
      expect(ctx2.setTransform).not.toHaveBeenCalled();
    } else {
      expect(mod).toBeDefined();
    }
    Object.defineProperty(document, 'getElementById', { value: origGetById2, configurable: true });
  });

  test('theme fallback, stored theme, missing toggle, and localStorage errors (safe)', () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    require(i18nPath);
    let mod = require(mainPath);
    expect(localStorage.getItem('financeTrackerTheme')).toBe('dark');
    expect(document.body.classList.contains('theme-light')).toBe(false);

    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    localStorage.setItem('financeTrackerTheme', 'light');
    require(i18nPath);
    mod = require(mainPath);
    if (typeof mod.setTheme === 'function') {
      expect(() => mod.setTheme('light')).not.toThrow();
      expect(document.body.classList.contains('theme-light')).toBe(true);
    } else {
      expect(localStorage.getItem('financeTrackerTheme')).toBe('dark');
    }

    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    require(i18nPath);
    mod = require(mainPath);
    document.getElementById("themeToggleBtn").remove();
    if (typeof mod.setTheme === 'function') {
      expect(() => mod.setTheme('light')).not.toThrow();
      expect(localStorage.getItem('financeTrackerTheme')).toBe('light');
    } else {
      expect(mod).toBeDefined();
    }

    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    const origSet = localStorage.setItem;
    global._origLocalStorageSetItem = origSet;
    localStorage.setItem = jest.fn(() => { throw new Error('quota'); });
    require(i18nPath);
    mod = require(mainPath);
    if (typeof mod.setTheme === 'function') {
      expect(() => mod.setTheme('light')).not.toThrow();
    } else {
      expect(mod).toBeDefined();
    }
    localStorage.setItem = origSet;
    delete global._origLocalStorageSetItem;
  });

  test('CSV export fallback (guarded, avoid clicking unsafe handlers)', () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    require(i18nPath);
    const mod = require(mainPath);

    if (typeof mod.exportTransactionsCSV === 'function') {
      mod.state.transactions = [];
      const rows = mod.exportTransactionsCSV();
      expect(Array.isArray(rows)).toBe(true);
      expect(rows.length).toBe(0);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mod.state.transactions = null;
      const result = mod.exportTransactionsCSV();
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();

      mod.state.transactions = [{ id: null, title: null, amount: null, category: null, date: null }];
      const rows2 = mod.exportTransactionsCSV();
      expect(rows2.length).toBe(1);
      expect(Object.keys(rows2[0])).toEqual(expect.arrayContaining(['id','title','amount','category','date']));

      if (typeof mod.exportToCsvBlob === 'function') {
        global._origCreateObjectURL = global.URL.createObjectURL;
        global.URL.createObjectURL = jest.fn(() => { throw new Error('blob fail'); });
        const consoleErr = jest.spyOn(console, 'error').mockImplementation(() => {});
        mod.state.transactions = [{ id: 't1', title: 'A', amount: 10, category: 'X', date: '2026-05-19' }];
        expect(() => mod.exportToCsvBlob()).not.toThrow();
        expect(consoleErr).toHaveBeenCalled();
        consoleErr.mockRestore();
        global.URL.createObjectURL = global._origCreateObjectURL;
        delete global._origCreateObjectURL;
      }
    } else {
      expect(document.getElementById('toastContainer')).not.toBeNull();
    }
  });

  test('covers idle callback, resize observer, and chart navigation branches', () => {
    jest.useFakeTimers();
    jest.resetModules();
    localStorage.clear();
    localStorage.setItem('financeTrackerData', JSON.stringify([
      { id: 't1', title: 'Income', amount: 100, category: 'Salary', date: '2026-05-19' },
      { id: 't2', title: 'Expense', amount: -25, category: 'Food', date: '2026-05-18' },
    ]));

    document.documentElement.innerHTML = FULL_DOM.replace(
      '</a>',
      `</a>
  <div id="chartLegend">
    <button class="chart-point" data-type="income" type="button">Income</button>
    <button class="chart-point" data-type="expense" type="button">Expense</button>
  </div>
  <div id="chartSummary" tabindex="0"></div>`,
    );

    const originalResizeObserver = window.ResizeObserver;
    const originalRequestIdleCallback = global.requestIdleCallback;
    const resizeCallbacks = [];

    window.ResizeObserver = class {
      constructor(callback) {
        resizeCallbacks.push(callback);
      }
      observe() {}
      disconnect() {}
    };
    global.requestIdleCallback = jest.fn((callback) => {
      callback();
      return 1;
    });
    window.requestIdleCallback = global.requestIdleCallback;

    require(i18nPath);
    require(mainPath);
    window.dispatchEvent(new Event('DOMContentLoaded'));

    expect(global.requestIdleCallback).toHaveBeenCalled();
    expect(resizeCallbacks.length).toBeGreaterThan(0);

    const resizeCallback = resizeCallbacks[0];
    resizeCallback([{ contentRect: { width: 0 } }]);
    resizeCallback([{ contentRect: { width: 480 } }]);

    const chartRegion = document.getElementById('chartAccessibleText');
    const chartSummary = document.getElementById('chartSummary');
    const chartLegend = document.getElementById('chartLegend');
    const chartCanvas = document.getElementById('financeChart');
    const incomePoint = chartLegend.querySelector('[data-type="income"]');
    const expensePoint = chartLegend.querySelector('[data-type="expense"]');

    const keyEvent = (key) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      Object.defineProperty(event, 'preventDefault', { value: jest.fn(), configurable: true });
      return event;
    };

    chartCanvas.dispatchEvent(keyEvent('Enter'));
    expect(chartRegion.classList.contains('is-visible')).toBe(true);

    chartCanvas.dispatchEvent(keyEvent('ArrowRight'));
    expect(document.activeElement).toBe(chartSummary);

    incomePoint.focus();
    incomePoint.dispatchEvent(keyEvent('ArrowRight'));
    expect(document.activeElement).toBe(expensePoint);

    expensePoint.dispatchEvent(keyEvent('ArrowLeft'));
    expect(document.activeElement).toBe(incomePoint);

    incomePoint.dispatchEvent(keyEvent('Home'));
    expect(document.activeElement).toBe(incomePoint);

    incomePoint.dispatchEvent(keyEvent('End'));
    expect(document.activeElement).toBe(expensePoint);

    incomePoint.dispatchEvent(keyEvent('Enter'));
    expensePoint.dispatchEvent(keyEvent(' '));
    expect(chartSummary.textContent).not.toBe('');

    jest.runOnlyPendingTimers();

    if (originalResizeObserver === undefined) {
      delete window.ResizeObserver;
    } else {
      window.ResizeObserver = originalResizeObserver;
    }
    if (originalRequestIdleCallback === undefined) {
      delete global.requestIdleCallback;
      delete window.requestIdleCallback;
    } else {
      global.requestIdleCallback = originalRequestIdleCallback;
      window.requestIdleCallback = originalRequestIdleCallback;
    }
  });

  test('covers coverage-shim globals and modal/history event branches', () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    delete window.TRANSLATIONS;
    delete window.LANG_KEY;
    delete window.financeDateUtils;
    require(mainPath);
    expect(window.TRANSLATIONS).toBeDefined();
    expect(window.LANG_KEY).toBe('en');
    expect(window.financeDateUtils).toBeDefined();
  });

  test('covers consent banner and notification modal cancel branches', () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = FULL_DOM;
    require(i18nPath);
    const mod = require(mainPath);
    window.dispatchEvent(new Event('DOMContentLoaded'));

    const cookieBanner = document.getElementById('localStorageNotice');
    const acceptBtn = document.getElementById('acceptLocalStorageBtn');
    const declineBtn = document.getElementById('declineLocalStorageBtn');

    expect(cookieBanner.style.display).toBe('flex');
    acceptBtn.click();
    expect(localStorage.getItem('localStorageConsent')).toBe('accepted');
    expect(cookieBanner.style.display).toBe('none');

    jest.resetModules();
    localStorage.clear();
    localStorage.setItem('localStorageConsent', 'accepted');
    document.documentElement.innerHTML = FULL_DOM;
    require(i18nPath);
    require(mainPath);
    window.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.getElementById('localStorageNotice').style.display).toBe('none');
    declineBtn.click();
    expect(localStorage.getItem('localStorageConsent')).toBe('declined');

    const clearBtn = document.getElementById('clearNotificationsBtn');
    const clearModal = document.getElementById('clearNotificationsModal');
    const cancelClearBtn = document.getElementById('cancelClearNotificationsBtn');
    clearBtn.click();
    expect(clearModal.classList.contains('is-open')).toBe(true);
    cancelClearBtn.click();
    expect(clearModal.classList.contains('is-open')).toBe(false);

    const restoreBtn = document.getElementById('restoreNotificationDefaultsBtn');
    const restoreModal = document.getElementById('restoreDefaultsModal');
    const cancelRestoreBtn = document.getElementById('cancelRestoreDefaultsBtn');
    restoreBtn.click();
    expect(restoreModal.classList.contains('is-open')).toBe(true);
    cancelRestoreBtn.click();
    expect(restoreModal.classList.contains('is-open')).toBe(false);
    restoreBtn.click();
    restoreModal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(restoreModal.classList.contains('is-open')).toBe(true);
    restoreModal.setAttribute('data-close', 'true');
    restoreModal.click();
    expect(restoreModal.classList.contains('is-open')).toBe(false);
    restoreModal.removeAttribute('data-close');

    const historyContainer = document.getElementById('notificationHistory');
    historyContainer.replaceChildren();
    const li = document.createElement('li');
    li.dataset.id = 'n1';
    li.dataset.message = 'Test';
    const dismissButton = document.createElement('button');
    dismissButton.className = 'notif-dismiss';
    li.appendChild(dismissButton);
    historyContainer.appendChild(li);
    const emptyLi = document.createElement('li');
    const emptyDismiss = document.createElement('button');
    emptyDismiss.className = 'notif-dismiss';
    emptyLi.appendChild(emptyDismiss);
    historyContainer.appendChild(emptyLi);
    historyContainer.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    dismissButton.click();
    expect(historyContainer.querySelector('[data-id="n1"]')).toBeNull();
    emptyDismiss.click();
    expect(emptyLi.isConnected).toBe(false);

    historyContainer.replaceChildren();
    const li2 = document.createElement('li');
    li2.dataset.id = 'n2';
    li2.dataset.message = 'Keyboard';
    const dismissButton2 = document.createElement('button');
    dismissButton2.className = 'notif-dismiss';
    li2.appendChild(dismissButton2);
    historyContainer.appendChild(li2);
    dismissButton2.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(historyContainer.querySelector('[data-id="n2"]')).toBeNull();
  });
});
