const fs = require('fs');
const path = require('path');

const read = (relativePath) =>
  fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

describe('main.js extended coverage tests', () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = read('index.html');

    window.financeDateUtils = {
      normalizeToLocalDateKey: (value) => value,
      formatMonthLabel: () => 'May 2026',
      formatLocalDate: (value) => value,
      compareLocalDateStringsDesc: () => 0,
    };

    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();

    require(path.join(__dirname, '..', 'i18n.js'));
    require(path.join(__dirname, '..', 'main.js'));
    window.dispatchEvent(new Event('DOMContentLoaded'));
  });

  afterEach(() => {
    delete window.financeDateUtils;
    localStorage.clear();
    jest.useRealTimers();
  });

  it('handles modal operations: delete with confirm', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(250);

    const deleteBtn = document.querySelector('.delete-btn');
    deleteBtn.click();
    const confirmModal = document.getElementById('confirmModal');
    expect(confirmModal.classList.contains('is-open')).toBe(true);

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.click();

    jest.advanceTimersByTime(250);

    const stored = JSON.parse(localStorage.getItem('financeTrackerData'));
    expect(stored).toHaveLength(0);

    jest.useRealTimers();
  });

  it('handles clear notifications modal with confirmation', () => {
    jest.useFakeTimers();

    const addTxn = (title) => {
      document.getElementById('titleInput').value = title;
      document.getElementById('amountInput').value = '100';
      document.getElementById('categoryInput').value = 'Salary';
      document.getElementById('dateInput').value = '2026-05-19';
      document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));
    };

    addTxn('Test1');
    addTxn('Test2');

    jest.advanceTimersByTime(250);

    const clearBtn = document.getElementById('clearNotificationsBtn');
    clearBtn.click();
    const clearModal = document.getElementById('clearNotificationsModal');
    expect(clearModal.classList.contains('is-open')).toBe(true);

    const confirmClearBtn = document.getElementById('confirmClearNotificationsBtn');
    confirmClearBtn.click();

    jest.advanceTimersByTime(250);

    expect(clearBtn.disabled).toBe(true);

    jest.useRealTimers();
  });

  it('handles restore defaults modal with confirmation', () => {
    jest.useFakeTimers();

    const confirmDismiss = document.getElementById('settingConfirmDismiss');
    const recordAdded = document.getElementById('settingRecordAdded');

    confirmDismiss.checked = true;
    confirmDismiss.dispatchEvent(new Event('change', { bubbles: true }));
    recordAdded.checked = false;
    recordAdded.dispatchEvent(new Event('change', { bubbles: true }));

    const restoreBtn = document.getElementById('restoreNotificationDefaultsBtn');
    restoreBtn.click();

    const restoreModal = document.getElementById('restoreDefaultsModal');
    expect(restoreModal.classList.contains('is-open')).toBe(true);

    const confirmRestoreBtn = document.getElementById('confirmRestoreDefaultsBtn');
    confirmRestoreBtn.click();

    jest.advanceTimersByTime(250);

    expect(confirmDismiss.checked).toBe(false);
    expect(recordAdded.checked).toBe(true);

    jest.useRealTimers();
  });

  it('handles chart table toggle functionality', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(300);

    const toggleChartBtn = document.getElementById('toggleChartTableBtn');
    const chartRegion = document.getElementById('chartAccessibleText');

    expect(chartRegion.classList.contains('is-visible')).toBe(false);

    toggleChartBtn.click();
    jest.advanceTimersByTime(100);
    expect(chartRegion.classList.contains('is-visible')).toBe(true);

    toggleChartBtn.click();
    jest.advanceTimersByTime(100);
    expect(chartRegion.classList.contains('is-visible')).toBe(false);

    jest.useRealTimers();
  });

  it('handles notification history sidebar open/close', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(250);

    const openHistoryBtn = document.getElementById('openHistoryBtn');
    const historyToggleBtn = document.getElementById('historyToggleBtn');
    const historyContainer = document.getElementById('notificationHistoryContainer');

    expect(historyContainer.classList.contains('is-visible')).toBe(false);

    openHistoryBtn.click();
    jest.advanceTimersByTime(150);
    expect(historyContainer.classList.contains('is-visible')).toBe(true);

    historyToggleBtn.click();
    expect(historyContainer.classList.contains('is-visible')).toBe(false);

    jest.useRealTimers();
  });

  it('handles keyboard events on chart canvas', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    const canvas = document.getElementById('financeChart');
    const chartRegion = document.getElementById('chartAccessibleText');

    chartRegion.classList.remove('is-visible');

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    Object.defineProperty(enterEvent, 'preventDefault', { value: jest.fn(), writable: true });
    canvas.dispatchEvent(enterEvent);

    expect(chartRegion.classList.contains('is-visible')).toBe(true);

    jest.useRealTimers();
  });

  it('handles notification settings synchronization', () => {
    const confirmDismiss = document.getElementById('settingConfirmDismiss');
    const recordAdded = document.getElementById('settingRecordAdded');
    const recordUpdated = document.getElementById('settingRecordUpdated');

    confirmDismiss.checked = true;
    confirmDismiss.dispatchEvent(new Event('change', { bubbles: true }));
    expect(localStorage.getItem('financeTrackerConfirmNotificationDismiss')).toBe('true');

    recordAdded.checked = false;
    recordAdded.dispatchEvent(new Event('change', { bubbles: true }));
    let keys = JSON.parse(localStorage.getItem('financeTrackerActionableNotificationKeys'));
    expect(keys).not.toContain('transactionAdded');

    recordUpdated.checked = false;
    recordUpdated.dispatchEvent(new Event('change', { bubbles: true }));
    keys = JSON.parse(localStorage.getItem('financeTrackerActionableNotificationKeys'));
    expect(keys).not.toContain('transactionUpdated');
  });

  it('handles CSV export functionality', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(250);

    const exportBtn = document.getElementById('exportCsvBtn');
    exportBtn.click();

    jest.advanceTimersByTime(250);

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('handles notification history visibility persistence', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(250);

    const openHistoryBtn = document.getElementById('openHistoryBtn');

    openHistoryBtn.click();
    jest.advanceTimersByTime(150);

    expect(localStorage.getItem('financeTrackerNotificationsVisible')).toBe('true');

    const historyToggleBtn = document.getElementById('historyToggleBtn');
    historyToggleBtn.click();

    expect(localStorage.getItem('financeTrackerNotificationsVisible')).toBe('false');

    jest.useRealTimers();
  });

  it('handles theme toggle persistence', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    expect(localStorage.getItem('financeTrackerTheme')).toBe('dark');

    themeToggleBtn.click();
    expect(localStorage.getItem('financeTrackerTheme')).toBe('light');

    themeToggleBtn.click();
    expect(localStorage.getItem('financeTrackerTheme')).toBe('dark');
  });

  it('handles language toggle and privacy link update', () => {
    const privacyLink = document.querySelector('.local-storage-notice__link');
    expect(privacyLink.getAttribute('href')).toContain('lang=en');

    const langToggleBtn = document.getElementById('langToggleBtn');
    langToggleBtn.click();

    expect(privacyLink.getAttribute('href')).toContain('lang=zh');

    langToggleBtn.click();
    expect(privacyLink.getAttribute('href')).toContain('lang=en');
  });

  it('handles comprehensive filtering by category, type, and search', () => {
    jest.useFakeTimers();

    const addTxn = (title, amt, cat) => {
      document.getElementById('titleInput').value = title;
      document.getElementById('amountInput').value = amt;
      document.getElementById('categoryInput').value = cat;
      document.getElementById('dateInput').value = '2026-05-19';
      document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));
    };

    addTxn('Income1', '2000', 'Salary');
    addTxn('Expense1', '-100', 'Food');

    jest.advanceTimersByTime(250);

    const filterCat = document.getElementById('filterCategory');
    const filterType = document.getElementById('filterType');

    filterType.value = 'income';
    filterType.dispatchEvent(new Event('change', { bubbles: true }));

    filterCat.value = 'Food';
    filterCat.dispatchEvent(new Event('change', { bubbles: true }));

    document.getElementById('resetFiltersBtn').click();
    expect(filterCat.value).toBe('all');
    expect(filterType.value).toBe('all');

    jest.useRealTimers();
  });

  it('handles transaction edit with field updates', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Original';
    document.getElementById('amountInput').value = '500';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(250);

    const editBtn = document.querySelector('.edit-btn');
    editBtn.click();

    document.getElementById('titleInput').value = 'Updated';
    document.getElementById('amountInput').value = '600';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(250);

    const stored = JSON.parse(localStorage.getItem('financeTrackerData'));
    expect(stored[0].title).toBe('Updated');
    expect(stored[0].amount).toBe(600);

    jest.useRealTimers();
  });

  it('handles notification types deselection', () => {
    const recordAdded = document.getElementById('settingRecordAdded');
    const recordUpdated = document.getElementById('settingRecordUpdated');
    const recordDeleted = document.getElementById('settingRecordDeleted');
    const recordExported = document.getElementById('settingRecordExported');

    [recordAdded, recordUpdated, recordDeleted, recordExported].forEach(el => {
      el.checked = false;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    let keys = JSON.parse(localStorage.getItem('financeTrackerActionableNotificationKeys'));
    expect(keys.length).toBe(0);
  });

  it('handles backdrop click to close sidebar', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    jest.advanceTimersByTime(250);

    const openHistoryBtn = document.getElementById('openHistoryBtn');
    const backdrop = document.getElementById('notificationBackdrop');
    const historyContainer = document.getElementById('notificationHistoryContainer');

    openHistoryBtn.click();
    jest.advanceTimersByTime(150);
    expect(historyContainer.classList.contains('is-visible')).toBe(true);

    backdrop.click();
    expect(historyContainer.classList.contains('is-visible')).toBe(false);

    jest.useRealTimers();
  });

  it('handles space key on chart canvas', () => {
    jest.useFakeTimers();

    document.getElementById('titleInput').value = 'Test';
    document.getElementById('amountInput').value = '500';
    document.getElementById('categoryInput').value = 'Salary';
    document.getElementById('dateInput').value = '2026-05-19';
    document.getElementById('transactionForm').dispatchEvent(new Event('submit', { bubbles: true }));

    const canvas = document.getElementById('financeChart');
    const chartRegion = document.getElementById('chartAccessibleText');

    chartRegion.classList.remove('is-visible');

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    Object.defineProperty(spaceEvent, 'preventDefault', { value: jest.fn(), writable: true });
    canvas.dispatchEvent(spaceEvent);

    expect(chartRegion.classList.contains('is-visible')).toBe(true);

    jest.useRealTimers();
  });

  it('handles form validation for empty title', () => {
    const form = document.getElementById('transactionForm');

    document.getElementById('titleInput').value = '';
    document.getElementById('amountInput').value = '100';
    document.getElementById('categoryInput').value = 'Salary';
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    const titleError = document.getElementById('titleError');
    expect(titleError.textContent).toBeTruthy();
  });

  it('handles confirm dismiss notification setting toggle', () => {
    const confirmDismiss = document.getElementById('settingConfirmDismiss');

    expect(confirmDismiss.checked).toBe(false);

    confirmDismiss.checked = true;
    confirmDismiss.dispatchEvent(new Event('change', { bubbles: true }));

    expect(localStorage.getItem('financeTrackerConfirmNotificationDismiss')).toBe('true');

    confirmDismiss.checked = false;
    confirmDismiss.dispatchEvent(new Event('change', { bubbles: true }));

    expect(localStorage.getItem('financeTrackerConfirmNotificationDismiss')).toBe('false');
  });
});
