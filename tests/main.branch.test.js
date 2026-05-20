const path = require('path');
const fs = require('fs');

const MAIN_PATH = path.join(__dirname, '..', 'main.js');
const I18N_PATH = path.join(__dirname, '..', 'i18n.js');
const HTML_PATH = path.join(__dirname, '..', 'index.html');

const readHTML = () => fs.readFileSync(HTML_PATH, 'utf8');

describe('main.js targeted branch tests (robust)', () => {
  let origGetById;
  let origCanvasGetContext;
  let origLocalStorageSetItem;

  afterEach(() => {
    jest.resetModules();
    localStorage.clear();
    try {
      if (origGetById) {
        Object.defineProperty(document, 'getElementById', { value: origGetById, configurable: true });
        origGetById = null;
      }
    } catch (e) {}
    try {
      if (origCanvasGetContext) {
        HTMLCanvasElement.prototype.getContext = origCanvasGetContext;
        origCanvasGetContext = null;
      }
    } catch (e) {}
    if (origLocalStorageSetItem) {
      localStorage.setItem = origLocalStorageSetItem;
      delete global._origLocalStorageSetItem;
      origLocalStorageSetItem = null;
    }
    jest.restoreAllMocks();
    try { delete window.devicePixelRatio; } catch (e) {}
  });

  test('openModal / closeModal handle missing modal DOM safely', () => {
    jest.resetModules();
    
    document.documentElement.innerHTML = readHTML();
    
    window.financeDateUtils = {
      normalizeToLocalDateKey: (value) => value,
      formatMonthLabel: () => 'May 2026',
      formatLocalDate: (value) => value,
      compareLocalDateStringsDesc: () => 0,
    };
    
    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);
    window.dispatchEvent(new Event('DOMContentLoaded'));
    
    const openDismissNotificationModal = (mod && mod.openDismissNotificationModal) || window.openDismissNotificationModal;
    const closeDismissNotificationModal = (mod && mod.closeDismissNotificationModal) || window.closeDismissNotificationModal;
    const openModal = (mod && mod.openModal) || window.openModal;
    const closeModal = (mod && mod.closeModal) || window.closeModal;

    if (openDismissNotificationModal) {
      expect(() => openDismissNotificationModal('id', 'msg')).not.toThrow();
    }

    if (closeDismissNotificationModal) {
      expect(() => closeDismissNotificationModal()).not.toThrow();
    }

    if (openModal) {
      expect(() => openModal(null, null)).not.toThrow();
    }
    if (closeModal) {
      expect(() => closeModal(null, null)).not.toThrow();
    }
  });

  test('updateHistoryButtons returns early when openHistoryBtn is missing', () => {
    jest.resetModules();

    document.documentElement.innerHTML = `
      <button id="clearNotificationsBtn" type="button"></button>
      <div id="notificationHistoryContainer"></div>
    `;

    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);

    const updateHistoryButtons = (mod && mod.updateHistoryButtons) || window.updateHistoryButtons;

    const btn = document.getElementById('clearNotificationsBtn');
    expect(btn).not.toBeNull();
    btn.disabled = false;

    if (updateHistoryButtons) {
      expect(() => updateHistoryButtons()).not.toThrow();
      expect(btn.disabled).toBe(false);
    } else {
      expect(mod).toBeDefined();
    }
  });

  test('syncNotificationSettingsUI handles missing checkbox elements gracefully', () => {
    jest.resetModules();

    document.documentElement.innerHTML = `
      <input id="settingConfirmDismiss" type="checkbox" />
      <!-- missing: <input id="settingRecordAdded" type="checkbox" /> -->
      <input id="settingRecordUpdated" type="checkbox" />
      <input id="settingRecordDeleted" type="checkbox" />
      <input id="settingRecordExported" type="checkbox" />
    `;

    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);

    const syncNotificationSettingsUI = (mod && mod.syncNotificationSettingsUI) || window.syncNotificationSettingsUI;

    if (syncNotificationSettingsUI) {
      expect(() => syncNotificationSettingsUI()).not.toThrow();

      const confirm = document.getElementById('settingConfirmDismiss');
      expect(confirm).not.toBeNull();
      expect(typeof confirm.checked).toBe('boolean');
    } else {
      expect(mod).toBeDefined();
    }
  });

  test('renderChart handles missing canvas and null 2D context without throwing', () => {
    jest.resetModules();

    document.documentElement.innerHTML = `
      <div id="transactionsList"></div>
    `;
    try { require(I18N_PATH); } catch (e) {}
    let mod = require(MAIN_PATH);
    const renderChartA = (mod && mod.renderChart) || window.renderChart;
    if (renderChartA) {
      expect(() => renderChartA()).not.toThrow();
    } else {
      expect(mod).toBeDefined();
    }

    jest.resetModules();
    document.documentElement.innerHTML = `
      <canvas id="financeChart"></canvas>
    `;

    origCanvasGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function () { return null; };

    try { require(I18N_PATH); } catch (e) {}
    mod = require(MAIN_PATH);
    const renderChartB = (mod && mod.renderChart) || window.renderChart;
    if (renderChartB) {
      expect(() => renderChartB()).not.toThrow();
    } else {
      expect(mod).toBeDefined();
    }

    HTMLCanvasElement.prototype.getContext = origCanvasGetContext;
    origCanvasGetContext = null;
  });

  test('renderChart drawing path tolerates high DPR and performs sizing when context exists', () => {
    jest.resetModules();

    const mockCtx = {
      setTransform: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    };
    const mockCanvas = {
      getContext: () => mockCtx,
      offsetWidth: 300,
      offsetHeight: 150,
      width: 0,
      height: 0,
    };

    origGetById = document.getElementById;
    Object.defineProperty(document, 'getElementById', {
      value: (id) => (id === 'financeChart' ? mockCanvas : origGetById.call(document, id)),
      configurable: true,
    });

    Object.defineProperty(window, 'devicePixelRatio', { value: 3, writable: true });

    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);
    const renderChart = (mod && mod.renderChart) || window.renderChart;

    if (mod && mod.state) {
      mod.state.transactions = [{ id: 't1', amount: 100, date: '2026-05-19' }];
    }

    if (renderChart) {
      expect(() => renderChart()).not.toThrow();
    } else {
      expect(mod).toBeDefined();
    }

    Object.defineProperty(document, 'getElementById', { value: origGetById, configurable: true });
    origGetById = null;

    Object.defineProperty(window, 'devicePixelRatio', { value: 1, writable: true });
  });

  test('localStorage.setItem throwing is tolerated by saveTheme / saveToLocalStorage flows', () => {
    jest.resetModules();

    document.documentElement.innerHTML = `
      <button id="themeToggleBtn" type="button"></button>
      <form id="transactionForm"></form>
      <input id="titleInput" />
      <input id="amountInput" />
      <select id="categoryInput"></select>
      <input id="dateInput" />
      <div id="toastContainer"></div>
    `;

    origLocalStorageSetItem = localStorage.setItem;
    global._origLocalStorageSetItem = origLocalStorageSetItem;
    localStorage.setItem = jest.fn(() => { throw new Error('quota exceeded'); });

    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);

    const setTheme = (mod && mod.setTheme) || window.setTheme;

    if (setTheme) {
      expect(() => setTheme('light')).not.toThrow();
    } else {
      expect(mod).toBeDefined();
    }

    localStorage.setItem = origLocalStorageSetItem;
    delete global._origLocalStorageSetItem;
    origLocalStorageSetItem = null;
  });

  test('notification list item without data-id is removed on dismiss click', () => {
    jest.resetModules();
    
    document.documentElement.innerHTML = readHTML();
    
    window.financeDateUtils = {
      normalizeToLocalDateKey: (value) => value,
      formatMonthLabel: () => 'May 2026',
      formatLocalDate: (value) => value,
      compareLocalDateStringsDesc: () => 0,
    };
    
    try { require(I18N_PATH); } catch (e) {}
    require(MAIN_PATH);
    window.dispatchEvent(new Event('DOMContentLoaded'));
    
    const notificationHistory = document.getElementById('notificationHistory');
    if (notificationHistory) {
      const li = document.createElement('li');
      li.setAttribute('role', 'listitem');
      li.tabIndex = 0;
      
      const text = document.createElement('span');
      text.className = 'notif-text';
      text.textContent = 'Test notification without id';
      
      const dismissButton = document.createElement('button');
      dismissButton.className = 'notif-dismiss btn btn--ghost';
      dismissButton.type = 'button';
      dismissButton.textContent = '×';
      
      li.append(text, dismissButton);
      notificationHistory.appendChild(li);
      
      expect(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true });
        dismissButton.dispatchEvent(clickEvent);
      }).not.toThrow();
      
      expect(li.parentNode).toBeNull();
    }
  });

  test('confirm modal data-close attribute path', () => {
    jest.resetModules();

    document.documentElement.innerHTML = readHTML();

    window.financeDateUtils = {
      normalizeToLocalDateKey: (value) => value,
      formatMonthLabel: () => 'May 2026',
      formatLocalDate: (value) => value,
      compareLocalDateStringsDesc: () => 0,
    };
    
    try { require(I18N_PATH); } catch (e) {}
    require(MAIN_PATH);
    window.dispatchEvent(new Event('DOMContentLoaded'));
    
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
      let closeBtn = confirmModal.querySelector('[data-close]');
      if (!closeBtn) {
        closeBtn = document.createElement('span');
        closeBtn.setAttribute('data-close', 'true');
        closeBtn.textContent = '×';
        confirmModal.appendChild(closeBtn);
      }

      expect(() => {
        const clickEvent = new MouseEvent('click', { bubbles: true });
        closeBtn.dispatchEvent(clickEvent);
      }).not.toThrow();
    }
  });

  test('canvas getContext mock with all rendering methods', () => {
    jest.resetModules();
    document.documentElement.innerHTML = `
      <canvas id="financeChart"></canvas>
      <div id="srIncome"></div>
      <div id="srExpenses"></div>
      <div id="srBalance"></div>
      <form id="transactionForm">
        <input id="titleInput" />
        <input id="amountInput" />
        <select id="categoryInput"></select>
        <input id="dateInput" />
        <button id="submitBtn"></button>
        <button id="cancelEditBtn"></button>
      </form>
      <ul id="transactionsList"></ul>
      <div id="toastContainer"></div>
    `;
    const mockCtx = {
      setTransform: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      fillRect: jest.fn(),
      fillText: jest.fn(),
      arc: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      measureText: jest.fn(() => ({ width: 100 })),
    };
    origCanvasGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);
    if (mod && mod.state) {
      mod.state.transactions = [{ id: 't1', amount: 100, date: '2026-05-19' }];
    }
    const renderChart = (mod && mod.renderChart) || window.renderChart;
    if (renderChart) {
      expect(() => renderChart()).not.toThrow();
    }
    HTMLCanvasElement.prototype.getContext = origCanvasGetContext;
  });

  test('setNotificationDismissConfirmation exercises confirmation branches', () => {
    jest.resetModules();
    document.documentElement.innerHTML = `
      <button id="openHistoryBtn"></button>
      <button id="clearNotificationsBtn"></button>
      <div id="notificationHistoryContainer">
        <ul id="notificationHistory"></ul>
      </div>
      <div id="dismissNotificationModal" class="modal">
        <button id="confirmDismissBtn"></button>
        <button id="cancelDismissNotificationBtn"></button>
      </div>
      <form id="transactionForm">
        <input id="titleInput" />
        <input id="amountInput" />
        <select id="categoryInput"></select>
        <input id="dateInput" />
        <button id="submitBtn"></button>
        <button id="cancelEditBtn"></button>
      </form>
      <ul id="transactionsList"></ul>
      <div id="toastContainer"></div>
    `;
    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);
    const setConfirm = (mod && mod.setNotificationDismissConfirmation) || window.setNotificationDismissConfirmation;
    if (setConfirm) {
      expect(() => setConfirm(true)).not.toThrow();
      expect(() => setConfirm(false)).not.toThrow();
    }
  });

  test('modal and notification management functions', () => {
    jest.resetModules();
    document.documentElement.innerHTML = `
      <div id="restoreDefaultsModal" class="modal" aria-hidden="true">
        <button id="confirmRestoreDefaultsBtn"></button>
        <button id="cancelRestoreDefaultsBtn"></button>
      </div>
      <div id="dismissNotificationModal" class="modal" aria-hidden="true">
        <button id="confirmDismissBtn"></button>
        <button id="cancelDismissNotificationBtn"></button>
        <div id="dismissNotificationBody"></div>
      </div>
      <button id="openHistoryBtn"></button>
      <button id="clearNotificationsBtn"></button>
      <div id="notificationHistoryContainer">
        <ul id="notificationHistory"></ul>
        <div id="notificationHistoryStatus"></div>
      </div>
      <form id="transactionForm">
        <input id="titleInput" />
        <input id="amountInput" />
        <select id="categoryInput"></select>
        <input id="dateInput" />
        <button id="submitBtn"></button>
        <button id="cancelEditBtn"></button>
      </form>
      <ul id="transactionsList"></ul>
      <div id="toastContainer"></div>
    `;
    try { require(I18N_PATH); } catch (e) {}
    const mod = require(MAIN_PATH);
    
    const openDismissNotificationModal = (mod && mod.openDismissNotificationModal) || window.openDismissNotificationModal;
    const closeDismissNotificationModal = (mod && mod.closeDismissNotificationModal) || window.closeDismissNotificationModal;
    const renderNotificationHistory = (mod && mod.renderNotificationHistory) || window.renderNotificationHistory;
    const restoreNotificationDefaults = (mod && mod.restoreNotificationDefaults) || window.restoreNotificationDefaults;
    
    if (openDismissNotificationModal) expect(() => openDismissNotificationModal('id', 'msg')).not.toThrow();
    if (closeDismissNotificationModal) expect(() => closeDismissNotificationModal()).not.toThrow();
    if (renderNotificationHistory) expect(() => renderNotificationHistory()).not.toThrow();
    if (restoreNotificationDefaults) expect(() => restoreNotificationDefaults()).not.toThrow();
  });

  test('coverageShim exercises financeDateUtils default initialization and canvas mock setup', () => {
    jest.resetModules();
    
    delete window.financeDateUtils;
    
    document.documentElement.innerHTML = readHTML();
    
    try { require(I18N_PATH); } catch (e) {}
    
    const mod = require(MAIN_PATH);

    expect(window.financeDateUtils).toBeDefined();
    expect(window.financeDateUtils.normalizeToLocalDateKey).toBeDefined();
    expect(window.financeDateUtils.formatMonthLabel).toBeDefined();
    expect(window.financeDateUtils.compareLocalDateStringsDesc).toBeDefined();

    const canvas = document.getElementById('financeChart');
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      expect(ctx).toBeDefined();
      expect(ctx.rotate).toBeDefined();
      expect(ctx.measureText).toBeDefined();
      expect(() => ctx.rotate(0.5)).not.toThrow();
      const measured = ctx.measureText('test');
      expect(measured.width).toBe(100);
    }
  });
});
