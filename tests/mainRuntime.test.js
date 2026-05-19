const fs = require('fs');
const path = require('path');

const read = (relativePath) =>
  fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

describe('main runtime flows', () => {
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

    require(path.join(__dirname, '..', 'i18n.js'));
    require(path.join(__dirname, '..', 'main.js'));
    window.dispatchEvent(new Event('DOMContentLoaded'));
  });

  afterEach(() => {
    delete window.financeDateUtils;
    localStorage.clear();
    jest.useRealTimers();
  });

  it('renders, filters, and persists a transaction flow', () => {
    const titleInput = document.getElementById('titleInput');
    const amountInput = document.getElementById('amountInput');
    const categoryInput = document.getElementById('categoryInput');
    const dateInput = document.getElementById('dateInput');
    const form = document.getElementById('transactionForm');
    const transactionsList = document.getElementById('transactionsList');
    const totalIncome = document.getElementById('totalIncome');
    const totalBalance = document.getElementById('totalBalance');
    const notificationCount = document.getElementById('notificationCount');
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    const filterType = document.getElementById('filterType');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const langToggleBtn = document.getElementById('langToggleBtn');
    const privacyLink = document.querySelector('.local-storage-notice__link');

    titleInput.value = 'Freelance Payment';
    amountInput.value = '1200';
    categoryInput.value = 'Business';
    dateInput.value = '2026-05-19';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const storedTransactions = JSON.parse(localStorage.getItem('financeTrackerData'));
    expect(storedTransactions).toHaveLength(1);
    expect(storedTransactions[0].title).toBe('Freelance Payment');
    expect(totalIncome.textContent).toBe('$1,200.00');
    expect(totalBalance.textContent).toBe('$1,200.00');
    expect(notificationCount.textContent).toBe('1');
    expect(document.querySelector('#notificationHistory li')).not.toBeNull();

    filterCategory.value = 'Salary';
    filterCategory.dispatchEvent(new Event('change', { bubbles: true }));
    expect(transactionsList.querySelector('.empty-add-btn')).not.toBeNull();

    filterType.value = 'expense';
    filterType.dispatchEvent(new Event('change', { bubbles: true }));
    expect(transactionsList.querySelector('.empty-add-btn')).not.toBeNull();

    searchInput.value = 'missing';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(transactionsList.querySelector('.empty-add-btn')).not.toBeNull();

    resetFiltersBtn.click();
    expect(transactionsList.textContent).toContain('Freelance Payment');

    themeToggleBtn.click();
    expect(document.body.classList.contains('theme-light')).toBe(true);
    expect(localStorage.getItem('financeTrackerTheme')).toBe('light');
    expect(themeToggleBtn.textContent).toBe('Dark Mode');

    langToggleBtn.click();
    expect(localStorage.getItem('financeTrackerLang')).toBe('zh');
    expect(langToggleBtn.textContent).toBe('English');
    expect(themeToggleBtn.textContent).toBe('浅色模式');
    expect(privacyLink.getAttribute('href')).toBe('privacy.html?lang=zh');
  });

  it('syncs notification settings with local storage and the visible controls', () => {
    const confirmDismiss = document.getElementById('settingConfirmDismiss');
    const recordAdded = document.getElementById('settingRecordAdded');
    const recordUpdated = document.getElementById('settingRecordUpdated');
    const recordDeleted = document.getElementById('settingRecordDeleted');
    const recordExported = document.getElementById('settingRecordExported');
    const clearNotificationsBtn = document.getElementById('clearNotificationsBtn');

    confirmDismiss.checked = true;
    confirmDismiss.dispatchEvent(new Event('change', { bubbles: true }));
    expect(localStorage.getItem('financeTrackerConfirmNotificationDismiss')).toBe('true');
    expect(clearNotificationsBtn.title).toBe('Confirm before dismissing a notification');

    recordUpdated.checked = false;
    recordDeleted.checked = false;
    recordExported.checked = false;
    recordAdded.checked = true;
    recordAdded.dispatchEvent(new Event('change', { bubbles: true }));
    expect(JSON.parse(localStorage.getItem('financeTrackerActionableNotificationKeys'))).toEqual([
      'transactionAdded',
    ]);

    recordUpdated.checked = true;
    recordDeleted.checked = true;
    recordExported.checked = true;
    recordUpdated.dispatchEvent(new Event('change', { bubbles: true }));
    expect(JSON.parse(localStorage.getItem('financeTrackerActionableNotificationKeys'))).toEqual([
      'transactionAdded',
      'transactionUpdated',
      'transactionDeleted',
      'csvExported',
    ]);

    window.restoreNotificationDefaults();
    expect(confirmDismiss.checked).toBe(false);
    expect(recordAdded.checked).toBe(true);
    expect(recordUpdated.checked).toBe(true);
    expect(recordDeleted.checked).toBe(true);
    expect(recordExported.checked).toBe(true);
    expect(localStorage.getItem('financeTrackerConfirmNotificationDismiss')).toBe('false');
    expect(JSON.parse(localStorage.getItem('financeTrackerActionableNotificationKeys'))).toEqual([
      'transactionAdded',
      'transactionUpdated',
      'transactionDeleted',
      'csvExported',
    ]);
  });

  it('supports editing, deleting, chart toggling, and notification history controls', () => {
    jest.useFakeTimers();

    const submitTransaction = ({ title, amount, category, date }) => {
      document.getElementById('titleInput').value = title;
      document.getElementById('amountInput').value = amount;
      document.getElementById('categoryInput').value = category;
      document.getElementById('dateInput').value = date;
      document.getElementById('transactionForm').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      );
    };

    submitTransaction({
      title: 'Salary',
      amount: '1200',
      category: 'Salary',
      date: '2026-05-19',
    });
    submitTransaction({
      title: 'Groceries',
      amount: '-45',
      category: 'Food',
      date: '2026-05-19',
    });

    jest.advanceTimersByTime(250);

    const storedTransactions = JSON.parse(localStorage.getItem('financeTrackerData'));
    const newestId = storedTransactions[0].id;
    const olderId = storedTransactions[1].id;

    expect(document.querySelectorAll('.edit-btn')).toHaveLength(2);
    const editButton = document.querySelectorAll('.edit-btn')[0];
    editButton.click();
    expect(document.getElementById('submitBtn').textContent).toBe('Save Changes');

    document.getElementById('amountInput').value = '-55';
    document.getElementById('transactionForm').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    jest.advanceTimersByTime(250);

    const updatedTransactions = JSON.parse(localStorage.getItem('financeTrackerData'));
    expect(updatedTransactions).toHaveLength(2);
    expect(updatedTransactions[0].amount).toBe(-55);

    const deleteButton = document.querySelectorAll('.delete-btn')[1];
    deleteButton.click();
    expect(document.getElementById('confirmModal').classList.contains('is-open')).toBe(true);

    document.getElementById('confirmDeleteBtn').click();
    jest.advanceTimersByTime(250);
    const remainingTransactions = JSON.parse(localStorage.getItem('financeTrackerData'));
    expect(remainingTransactions).toHaveLength(1);
    expect(document.getElementById('totalExpenses').textContent).toBe('$55.00');
    expect(document.getElementById('totalBalance').textContent).toBe('-$55.00');
    expect(document.getElementById('notificationCount').textContent).toBe('4');
    expect(document.querySelectorAll('#notificationHistory li')).toHaveLength(4);

    const chartToggleBtn = document.getElementById('toggleChartTableBtn');
    const chartRegion = document.getElementById('chartAccessibleText');

    chartToggleBtn.click();
    expect(chartRegion.classList.contains('is-visible')).toBe(true);
    expect(chartToggleBtn.textContent).toBe('Hide data table');

    chartToggleBtn.click();
    expect(chartRegion.classList.contains('is-visible')).toBe(false);
    expect(chartToggleBtn.textContent).toBe('View data table');

    const openHistoryBtn = document.getElementById('openHistoryBtn');
    const historyToggleBtn = document.getElementById('historyToggleBtn');

    openHistoryBtn.click();
    jest.advanceTimersByTime(120);
    expect(document.getElementById('notificationHistoryContainer').classList.contains('is-visible')).toBe(true);

    historyToggleBtn.click();
    expect(document.getElementById('notificationHistoryContainer').classList.contains('is-visible')).toBe(false);

    jest.useRealTimers();
  });

  it('initializes safely with a minimal DOM and handles consent controls', () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.innerHTML = `
      <div id="skeleton"></div>
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
      <div id="srIncome"></div>
      <div id="srExpenses"></div>
      <div id="srBalance"></div>
      <div id="confirmModal"></div>
      <button id="confirmDeleteBtn" type="button"></button>
      <button id="cancelDeleteBtn" type="button"></button>
      <div id="toastContainer"></div>
      <div id="srToast"></div>
      <div id="notificationHistoryContainer"></div>
      <ul id="notificationHistory"></ul>
      <div id="notificationHistoryStatus"></div>
      <button id="openHistoryBtn" type="button"><span id="notificationCount"></span></button>
      <div id="notificationBackdrop"></div>
      <button id="clearNotificationsBtn" type="button"></button>
      <button id="restoreNotificationDefaultsBtn" type="button"></button>
      <div id="restoreDefaultsModal"></div>
      <button id="confirmRestoreDefaultsBtn" type="button"></button>
      <button id="cancelRestoreDefaultsBtn" type="button"></button>
      <div id="clearNotificationsModal"></div>
      <button id="confirmClearNotificationsBtn" type="button">Confirm</button>
      <button id="cancelClearNotificationsBtn" type="button"></button>
      <div id="dismissNotificationModal"></div>
      <button id="confirmDismissNotificationBtn" type="button"></button>
      <button id="cancelDismissNotificationBtn" type="button"></button>
      <button id="langToggleBtn" type="button"></button>
      <div id="localStorageNotice"></div>
      <button id="acceptLocalStorageBtn" type="button"></button>
      <button id="declineLocalStorageBtn" type="button"></button>
    `;

    window.financeDateUtils = {
      normalizeToLocalDateKey: (value) => value,
      isOnOrBeforeLocalDay: () => true,
      formatMonthLabel: () => 'May 2026',
      formatLocalDate: (value) => value,
      compareLocalDateStringsDesc: () => 0,
    };

    require(path.join(__dirname, '..', 'i18n.js'));
    require(path.join(__dirname, '..', 'main.js'));

    const cookieBanner = document.getElementById('localStorageNotice');
    const acceptBtn = document.getElementById('acceptLocalStorageBtn');
    const declineBtn = document.getElementById('declineLocalStorageBtn');

    expect(cookieBanner.style.display).toBe('flex');

    acceptBtn.click();
    expect(localStorage.getItem('localStorageConsent')).toBe('accepted');
    expect(cookieBanner.style.display).toBe('none');

    localStorage.removeItem('localStorageConsent');
    cookieBanner.style.display = 'flex';
    declineBtn.click();
    expect(localStorage.getItem('localStorageConsent')).toBe('declined');
    expect(cookieBanner.style.display).toBe('none');

    delete window.financeDateUtils;
  });
});