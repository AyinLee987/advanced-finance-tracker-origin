const LANG_KEY = window.LANG_KEY || "financeTrackerLang";
const dateUtils =
  window.financeDateUtils ||
  {
    normalizeToLocalDateKey: (dateValue) => {
      try {
        const d = new Date(dateValue);
        if (Number.isNaN(d.getTime())) return dateValue;
        return d.toISOString().slice(0, 10);
      } catch (e) {
        return dateValue;
      }
    },
    isOnOrBeforeLocalDay: (dateValue, cutoffValue) => {
      try {
        const d = new Date(dateValue);
        const c = new Date(cutoffValue);
        if (Number.isNaN(d.getTime()) || Number.isNaN(c.getTime())) return true;
        const left = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const right = new Date(c.getFullYear(), c.getMonth(), c.getDate()).getTime();
        return left <= right;
      } catch (e) {
        return true;
      }
    },
    formatLocalDate: (v) => String(v),
    formatMonthLabel: (v) => String(v),
    compareLocalDateStringsDesc: () => 0,
  };

const DEFAULT_TRANSLATIONS = {
  en: {
    eyebrow: "Personal Finance",
    appTitle: "Advanced Finance Tracker",
    appSubtitle: "Track income, expenses, and your balance with clarity.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    exportCsv: "Export CSV",
    resetFilters: "Reset Filters",
    totalBalance: "Total Balance",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    cashFlowOverview: "Cash Flow Overview",
    incomeVsExpense: "Income vs Expense",
    chartAriaLabel: "Bar chart showing total income versus total expenses",
    addTransactionHeading: "Add Transaction",
    formTitle: "Title",
    formAmount: "Amount",
    formCategory: "Category",
    formDate: "Date",
    selectCategory: "Select category",
    addTransactionBtn: "Add Transaction",
    saveChanges: "Save Changes",
    cancelEdit: "Cancel Edit",
    filtersSearch: "Filters & Search",
    allCategories: "All categories",
    all: "All",
    income: "Income",
    expense: "Expense",
    searchByTitle: "Search by title",
    searchPlaceholder: "Start typing...",
    transactions: "Transactions",
    results: "results",
    noTransactions: "No transactions yet. Add your first one to get started.",
    addFirst: "Add First Transaction",
    deleteTitle: "Delete transaction?",
    deleteBody: "This action cannot be undone.",
    cancel: "Cancel",
    delete: "Delete",
    privacyPolicy: "Privacy Policy",
    cookieMsg:
      "We use Local Storage to store your preferences and transaction data locally. No data is shared with third parties.",
    acceptCookies: "Accept",
    declineCookies: "Decline",
    editBtn: "Edit",
    deleteBtn: "Delete",
    catSalary: "Salary",
    catBusiness: "Business",
    catInvestments: "Investments",
    catHousing: "Housing",
    catFood: "Food",
    catTransport: "Transport",
    catHealth: "Health",
    catEntertainment: "Entertainment",
    catEducation: "Education",
    catOther: "Other",
    fixFields: "Please fix the highlighted fields.",
    transactionUpdated: "Transaction updated.",
    transactionAdded: "Transaction added.",
    editingMode: "Editing mode enabled.",
    transactionDeleted: "Transaction deleted.",
    noDataExport: "No data to export.",
    csvExported: "CSV exported.",
    titleRequired: "Title is required.",
    validAmount: "Enter a valid amount.",
    categoryRequired: "Select a category.",
    pickDate: "Pick a date.",
    titlePlaceholder: "e.g., Freelance Payment",
    amountPlaceholder: "e.g., 1200 or -45",
    srIncomeLabel: "Total Income:",
    srExpensesLabel: "Total Expenses:",
    srBalanceLabel: "Total Balance:",
    chartDataRegionAriaLabel: "Accessible chart data",
    chartDataSummary:
      "Accessible chart data table with income, expenses, and balance values.",
    chartDataTableCaption: "Income, expenses, and balance summary table",
    chartDataMetric: "Metric",
    chartDataValue: "Value",
    chart_table_toggle: "View data table",
    chart_table_hide: "Hide data table",
    chart_summary: "Income: {income}. Expenses: {expenses}. Balance: {balance}.",
    privacy_back: "← Back to App",
    privacy_toggle: "中文",
    privacy_title: "Privacy Policy",
    privacy_lastUpdated: "Last updated: May 2026",
    privacy_overview_heading: "1. Overview",
    privacy_overview_text: "Advanced Finance Tracker (\"the App\") is a client-side web application. We are committed to protecting your privacy. This policy explains what data is collected, how it is stored, and your rights regarding that data.",
    notificationHistoryTitle: "Notification History",
    notificationHistoryEmpty: "No notifications.",
    notificationHistoryStatus: "{count} notifications in history.",
    clearNotifications: "Clear notifications",
    dismissNotification: "Dismiss notification",
    notificationHistoryCleared: "Notifications cleared.",
    showNotificationHistory: "Show notification history",
    hideNotificationHistory: "Hide notification history",
    notificationSettingsHeading: "Notification Settings",
    notificationSettingsMeta: "Control which notifications are stored and how the history behaves.",
    settingHistoryVisibleLabel: "Show notification history",
    settingConfirmDismissLabel: "Confirm before dismissing a notification",
    settingRecordedTypesLegend: "Record these notification types",
    settingRecordAddedLabel: "Transaction added",
    settingRecordUpdatedLabel: "Transaction updated",
    settingRecordDeletedLabel: "Transaction deleted",
    settingRecordExportedLabel: "CSV exported",
    restoreNotificationDefaults: "Restore defaults",
    notificationSettingsReset: "Notification settings restored to defaults.",
  },
  zh: {
    eyebrow: "个人财务",
    appTitle: "高级财务追踪器",
    appSubtitle: "清晰追踪您的收入、支出和余额。",
    lightMode: "浅色模式",
    darkMode: "深色模式",
    exportCsv: "导出 CSV",
    resetFilters: "重置筛选",
    totalBalance: "总余额",
    totalIncome: "总收入",
    totalExpenses: "总支出",
    cashFlowOverview: "现金流概览",
    incomeVsExpense: "收入 vs 支出",
    chartAriaLabel: "显示总收入与总支出对比的柱状图",
    addTransactionHeading: "添加交易",
    formTitle: "标题",
    formAmount: "金额",
    formCategory: "类别",
    formDate: "日期",
    selectCategory: "选择类别",
    addTransactionBtn: "添加交易",
    saveChanges: "保存更改",
    cancelEdit: "取消编辑",
    filtersSearch: "筛选与搜索",
    allCategories: "所有类别",
    all: "全部",
    income: "收入",
    expense: "支出",
    searchByTitle: "按标题搜索",
    searchPlaceholder: "开始输入...",
    transactions: "交易记录",
    results: "条结果",
    noTransactions: "暂无交易记录，请添加第一笔交易。",
    addFirst: "添加第一笔交易",
    deleteTitle: "删除交易？",
    deleteBody: "此操作无法撤销。",
    cancel: "取消",
    delete: "删除",
    privacyPolicy: "隐私政策",
    cookieMsg:
      "我们使用浏览器的本地存储来在本地保存您的偏好和交易数据。数据不会与第三方共享。",
    acceptCookies: "接受",
    declineCookies: "拒绝",
    editBtn: "编辑",
    deleteBtn: "删除",
    catSalary: "工资",
    catBusiness: "商业",
    catInvestments: "投资",
    catHousing: "住房",
    catFood: "餐饮",
    catTransport: "交通",
    catHealth: "健康",
    catEntertainment: "娱乐",
    catEducation: "教育",
    catOther: "其他",
    fixFields: "请修正标出的字段。",
    transactionUpdated: "交易已更新。",
    transactionAdded: "交易已添加。",
    editingMode: "已启用编辑模式。",
    transactionDeleted: "交易已删除。",
    noDataExport: "没有可导出的数据。",
    csvExported: "CSV 已导出。",
    titleRequired: "标题为必填项。",
    validAmount: "请输入有效金额。",
    categoryRequired: "请选择类别。",
    pickDate: "请选择日期。",
    titlePlaceholder: "例如：自由职业付款",
    amountPlaceholder: "例如：1200 或 -45",
    srIncomeLabel: "总收入：",
    srExpensesLabel: "总支出：",
    srBalanceLabel: "总余额：",
    chartDataRegionAriaLabel: "可访问图表数据",
    chartDataSummary: "包含收入、支出和余额的可访问图表数据表。",
    chartDataTableCaption: "收入、支出和余额汇总表",
    chartDataMetric: "指标",
    chartDataValue: "数值",
    chart_table_toggle: "查看数据表格",
    chart_table_hide: "隐藏数据表格",
    chart_summary: "收入：{income}。 支出：{expenses}。 余额：{balance}。",
    privacy_back: "← 返回应用",
    privacy_toggle: "English",
    privacy_title: "隐私政策",
    privacy_lastUpdated: "最后更新：2026年5月",
    privacy_overview_heading: "1. 概述",
    privacy_overview_text: "高级财务追踪器（\"本应用\"）是一个纯前端网页应用。我们重视并保护您的隐私。本政策说明我们收集哪些数据、如何存储这些数据，以及您对这些数据享有的权利。",
    notificationSettingsHeading: "通知设置",
    notificationSettingsMeta: "控制存储哪些通知以及历史记录的显示方式。",
    settingHistoryVisibleLabel: "显示通知历史",
    settingConfirmDismissLabel: "关闭通知前确认",
    settingRecordedTypesLegend: "记录这些通知类型",
    settingRecordAddedLabel: "交易已添加",
    settingRecordUpdatedLabel: "交易已更新",
    settingRecordDeletedLabel: "交易已删除",
    settingRecordExportedLabel: "CSV 已导出",
    restoreNotificationDefaults: "恢复默认设置",
    notificationSettingsReset: "通知设置已恢复为默认值。",
    notificationHistoryStatus: "历史记录中有 {count} 条通知。",
  },
};

let translations = null;
const bootstrapTranslations = () => {
  if (window.TRANSLATIONS && Object.keys(window.TRANSLATIONS).length) {
    translations = window.TRANSLATIONS;
    return;
  }
  translations = DEFAULT_TRANSLATIONS;
  window.TRANSLATIONS = translations;
};

const STORAGE_KEY = "financeTrackerData";
const THEME_KEY = "financeTrackerTheme";
const NOTIFICATION_HISTORY_LIMIT = 20;
const NOTIF_HISTORY_KEY = 'financeTrackerNotifications';
const NOTIF_CONFIRM_DISMISS_KEY = 'financeTrackerConfirmNotificationDismiss';
const NOTIF_ACTIONABLE_KEYS_KEY = 'financeTrackerActionableNotificationKeys';
const NOTIF_VISIBLE_KEY = 'financeTrackerNotificationsVisible';
const DEFAULT_ACTIONABLE_NOTIFICATION_KEYS = [
  'transactionAdded',
  'transactionUpdated',
  'transactionDeleted',
  'csvExported',
];
let ACTIONABLE_NOTIFICATION_KEYS = new Set(DEFAULT_ACTIONABLE_NOTIFICATION_KEYS);
const NOTIFICATION_MESSAGE_TO_KEY = {
  'Transaction added.': 'transactionAdded',
  'Transaction updated.': 'transactionUpdated',
  'Transaction deleted.': 'transactionDeleted',
  'CSV exported.': 'csvExported',
  '交易已添加。': 'transactionAdded',
  '交易已更新。': 'transactionUpdated',
  '交易已删除。': 'transactionDeleted',
  'CSV 已导出。': 'csvExported',
};

const setActionableNotificationKeys = (keys) => {
  ACTIONABLE_NOTIFICATION_KEYS = new Set(keys || []);
  try {
    localStorage.setItem(NOTIF_ACTIONABLE_KEYS_KEY, JSON.stringify(Array.from(ACTIONABLE_NOTIFICATION_KEYS)));
  } catch (e) {}
};
window.setActionableNotificationKeys = setActionableNotificationKeys;

const restoreNotificationDefaults = () => {
  state.confirmNotificationDismiss = false;
  setActionableNotificationKeys(DEFAULT_ACTIONABLE_NOTIFICATION_KEYS);
  saveNotificationPreferences();
  syncNotificationSettingsUI();
};
window.restoreNotificationDefaults = restoreNotificationDefaults;

const loadActionableNotificationKeys = () => {
  try {
    const raw = localStorage.getItem(NOTIF_ACTIONABLE_KEYS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      ACTIONABLE_NOTIFICATION_KEYS = new Set(parsed);
    }
  } catch (e) {}
};

const state = {
  transactions: [],
  filters: {
    category: "all",
    type: "all",
    search: "",
  },
  editingId: null,
  pendingDeleteId: null,
  theme: "dark",
  lang: localStorage.getItem(LANG_KEY) || 'en',
  notificationHistory: [],
  confirmNotificationDismiss: localStorage.getItem(NOTIF_CONFIRM_DISMISS_KEY) === 'true',
  pendingNotificationDismissId: null,
};

let chartDisplayWidth = null;
let chartResizeObserver = null;

const saveNotificationHistory = () => {
  try {
    localStorage.setItem(NOTIF_HISTORY_KEY, JSON.stringify(state.notificationHistory));
  } catch (e) {}
};

const saveNotificationPreferences = () => {
  try {
    localStorage.setItem(NOTIF_CONFIRM_DISMISS_KEY, String(state.confirmNotificationDismiss));
    localStorage.setItem(NOTIF_ACTIONABLE_KEYS_KEY, JSON.stringify(Array.from(ACTIONABLE_NOTIFICATION_KEYS)));
  } catch (e) {}
};



const setNotificationDismissConfirmation = (enabled) => {
  state.confirmNotificationDismiss = Boolean(enabled);
  saveNotificationPreferences();
  updateHistoryButtons();
  syncNotificationSettingsUI();
};
window.setNotificationDismissConfirmation = setNotificationDismissConfirmation;

const loadNotificationHistory = () => {
  try {
    const raw = localStorage.getItem(NOTIF_HISTORY_KEY);
    state.notificationHistory = raw
      ? JSON.parse(raw).map(normalizeNotificationHistoryItem).filter(Boolean)
      : [];
  } catch (e) {
    state.notificationHistory = [];
  }
};

const fetchServerNotifications = async () => {
  return;
};

const createSvgIcon = (pathD) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);

  return svg;
};

const createBellIcon = () =>
  createSvgIcon(
    'M12 3a4.5 4.5 0 0 0-4.5 4.5v2.1c0 1.3-.55 2.55-1.52 3.42L4.75 14.1V16h14.5v-1.9l-1.23-1.08A4.6 4.6 0 0 1 16.5 9.6V7.5A4.5 4.5 0 0 0 12 3Zm0 18a2.75 2.75 0 0 0 2.58-1.8H9.42A2.75 2.75 0 0 0 12 21Z'
  );

const createCloseIcon = () =>
  createSvgIcon(
    'm6.7 5.3 12 12-1.4 1.4-12-12 1.4-1.4Zm12 1.4-12 12-1.4-1.4 12-12 1.4 1.4Z'
  );

const createEmptyTransactionsState = () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'transactions__empty';

  const iconButton = document.createElement('button');
  iconButton.className = 'empty__icon empty-add-btn';
  iconButton.type = 'button';
  iconButton.append('+');

  const iconLabel = document.createElement('span');
  iconLabel.className = 'sr-only';
  iconLabel.textContent = translations[state.lang].addFirst;
  iconButton.appendChild(iconLabel);

  const emptyMessage = document.createElement('p');
  emptyMessage.textContent = translations[state.lang].noTransactions;

  const ctaButton = document.createElement('button');
  ctaButton.className = 'btn btn--accent empty-add-btn';
  ctaButton.type = 'button';
  ctaButton.textContent = translations[state.lang].addFirst;

  wrapper.append(iconButton, emptyMessage, ctaButton);
  return wrapper;
};

const createTransactionItemElement = (tx) => {
  const typeClass = tx.amount >= 0 ? 'amount--income' : 'amount--expense';
  const item = document.createElement('div');
  item.className = 'transaction';

  const leftColumn = document.createElement('div');
  const title = document.createElement('p');
  title.className = 'transaction__title';
  title.textContent = tx.title;

  const meta = document.createElement('div');
  meta.className = 'transaction__meta';

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = tx.category;

  const date = document.createElement('span');
  date.textContent = formatDate(tx.date);

  meta.append(badge, date);
  leftColumn.append(title, meta);

  const rightColumn = document.createElement('div');
  const amount = document.createElement('p');
  amount.className = `amount ${typeClass}`;
  amount.textContent = formatCurrency(tx.amount);

  const editButton = document.createElement('button');
  editButton.className = 'edit-btn';
  editButton.type = 'button';
  editButton.dataset.id = tx.id;
  editButton.textContent = translations[state.lang].editBtn;
  editButton.setAttribute('aria-label', `${translations[state.lang].editBtn} ${tx.title}`);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.type = 'button';
  deleteButton.dataset.id = tx.id;
  deleteButton.textContent = translations[state.lang].deleteBtn;
  deleteButton.setAttribute('aria-label', `${translations[state.lang].deleteBtn} ${tx.title}`);

  rightColumn.append(amount, editButton, deleteButton);
  item.append(leftColumn, rightColumn);

  return item;
};

const createMonthGroupElement = (group) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'month-group';

  const title = document.createElement('p');
  title.className = 'month-title';
  title.textContent = group.label;

  wrapper.appendChild(title);
  group.items.forEach((tx) => {
    wrapper.appendChild(createTransactionItemElement(tx));
  });

  return wrapper;
};

const createChartLegendButton = ({ type, label, value, iconPath }) => {
  const button = document.createElement('button');
  button.className = `chart-point chart-point--${type}`;
  button.type = 'button';
  button.dataset.type = type;
  button.setAttribute('aria-label', `${label} ${value}`);
  button.tabIndex = 0;

  const swatch = document.createElement('span');
  swatch.className = 'chart-point__swatch';
  swatch.setAttribute('aria-hidden', 'true');

  const icon = document.createElement('span');
  icon.className = 'chart-point__icon';
  icon.appendChild(createSvgIcon(iconPath));

  const content = document.createElement('span');
  content.className = 'chart-point__content';

  const labelSpan = document.createElement('span');
  labelSpan.className = 'chart-point__label';
  labelSpan.setAttribute('data-i18n', type);

  const valueSpan = document.createElement('span');
  valueSpan.className = 'chart-point-value';
  valueSpan.textContent = value;

  content.append(labelSpan, valueSpan);
  button.append(swatch, icon, content);

  return button;
};

const getNotificationMessageKey = (notification) =>
  notification?.key || notification?.messageKey || NOTIFICATION_MESSAGE_TO_KEY[notification?.message] || null;

const getNotificationMessage = (notification, lang = state.lang) => {
  if (!notification) return '';
  const key = getNotificationMessageKey(notification);
  if (key && translations[lang]?.[key]) {
    return translations[lang][key];
  }
  return notification.message || '';
};

const normalizeNotificationHistoryItem = (notification) => {
  if (!notification || typeof notification !== 'object') return null;

  const key = getNotificationMessageKey(notification);
  const fallbackMessage = key ? translations.en?.[key] : '';

  return {
    ...notification,
    key,
    messageKey: key,
    message: notification.message || fallbackMessage || '',
  };
};

const createNotificationHistoryItem = (notification) => {
  const resolvedMessage = getNotificationMessage(notification);
  const li = document.createElement('li');
  li.setAttribute('role', 'listitem');
  li.tabIndex = 0;
  li.dataset.id = notification.id;
  li.dataset.message = resolvedMessage;
  li.setAttribute('aria-label', resolvedMessage);

  const text = document.createElement('span');
  text.className = 'notif-text';
  text.textContent = `[${new Date(notification.timestamp).toLocaleTimeString(state.lang)}] ${resolvedMessage}`;

  const dismissButton = document.createElement('button');
  dismissButton.className = 'notif-dismiss btn btn--ghost';
  dismissButton.type = 'button';
  dismissButton.replaceChildren(createCloseIcon());
  dismissButton.setAttribute(
    'aria-label',
    translations[state.lang]?.dismissNotification || 'Dismiss notification',
  );

  li.append(text, dismissButton);
  return li;
};

const renderNotificationHistory = () => {
  if (!dom.notificationHistory || !dom.notificationHistoryContainer) return;
  dom.notificationHistory.replaceChildren();
  const count = Array.isArray(state.notificationHistory) ? state.notificationHistory.length : 0;
  if (dom.notificationHistoryStatus) {
    const emptyText = translations[state.lang]?.notificationHistoryEmpty || 'No notifications.';
    const statusTemplate = translations[state.lang]?.notificationHistoryStatus || '{count} notifications in history.';
    dom.notificationHistoryStatus.textContent = count
      ? statusTemplate.replace('{count}', String(count))
      : emptyText;
  }
  if (!state.notificationHistory || state.notificationHistory.length === 0) {
    const li = document.createElement('li');
    li.id = 'notificationHistoryEmpty';
    li.className = 'notification-empty';
    li.textContent = translations[state.lang]?.notificationHistoryEmpty || 'No notifications.';
    dom.notificationHistory.appendChild(li);
    return;
  }

  state.notificationHistory.forEach((n) => {
    dom.notificationHistory.appendChild(createNotificationHistoryItem(n));
  });
};

const removeNotificationById = (id) => {
  if (!id) return;
  state.notificationHistory = state.notificationHistory.filter((n) => n.id !== id);
  saveNotificationHistory();
  renderNotificationHistory();
  updateHistoryButtons();
};

const openDismissNotificationModal = (notificationId, notificationMessage) => {
  if (!dom.dismissNotificationModal) return;
  state.pendingNotificationDismissId = notificationId;
  const body = document.getElementById('dismissNotificationBody');
  if (body) {
    const base = translations[state.lang]?.dismissNotificationConfirmBody || 'This will remove this notification from your history.';
    body.textContent = notificationMessage ? `${base} ${notificationMessage}` : base;
  }
  openModal(dom.dismissNotificationModal, dom.cancelDismissNotificationBtn);
};

const closeDismissNotificationModal = () => {
  state.pendingNotificationDismissId = null;
  if (!dom.dismissNotificationModal) return;
  closeModal(dom.dismissNotificationModal, dom.notificationHistoryContainer?.classList.contains('is-visible') ? dom.notificationHistoryContainer : dom.openHistoryBtn);
};

const syncNotificationSettingsUI = () => {
  if (dom.settingConfirmDismiss) dom.settingConfirmDismiss.checked = state.confirmNotificationDismiss;
  if (dom.settingRecordAdded) dom.settingRecordAdded.checked = ACTIONABLE_NOTIFICATION_KEYS.has('transactionAdded');
  if (dom.settingRecordUpdated) dom.settingRecordUpdated.checked = ACTIONABLE_NOTIFICATION_KEYS.has('transactionUpdated');
  if (dom.settingRecordDeleted) dom.settingRecordDeleted.checked = ACTIONABLE_NOTIFICATION_KEYS.has('transactionDeleted');
  if (dom.settingRecordExported) dom.settingRecordExported.checked = ACTIONABLE_NOTIFICATION_KEYS.has('csvExported');
};


const updateHistoryButtons = () => {
  if (!dom.openHistoryBtn || !dom.clearNotificationsBtn) return;

  const hasHistory = Array.isArray(state.notificationHistory) && state.notificationHistory.length > 0;
  const count = hasHistory ? state.notificationHistory.length : 0;
  const visible = Boolean(state.notificationHistoryVisible);
  const label = visible
    ? (translations[state.lang]?.hideNotificationHistory || 'Hide notification history')
    : (translations[state.lang]?.showNotificationHistory || 'Show notification history');

  dom.openHistoryBtn.disabled = false;
  dom.openHistoryBtn.removeAttribute('aria-disabled');
  dom.openHistoryBtn.setAttribute('aria-label', label);
  dom.openHistoryBtn.setAttribute('aria-expanded', String(visible));
  dom.openHistoryBtn.setAttribute('aria-pressed', String(visible));
  dom.openHistoryBtn.classList.toggle('has-notifications', hasHistory);

  if (dom.notificationCount) {
    dom.notificationCount.textContent = String(Math.min(count, 99));
    dom.notificationCount.hidden = !hasHistory;
  }

  dom.clearNotificationsBtn.disabled = !hasHistory;
  dom.clearNotificationsBtn.setAttribute('aria-disabled', String(!hasHistory));

  if (dom.notificationBackdrop) {
    dom.notificationBackdrop.classList.toggle('is-visible', visible);
    dom.notificationBackdrop.setAttribute('aria-hidden', String(!visible));
  }

  if (dom.notificationHistoryContainer) {
    dom.notificationHistoryContainer.classList.toggle('is-visible', visible);
    dom.notificationHistoryContainer.setAttribute('aria-hidden', String(!visible));
  }

  if (dom.settingConfirmDismiss) {
    const confirmText = translations[state.lang]?.settingConfirmDismissLabel || 'Confirm before dismissing a notification';
    dom.clearNotificationsBtn.title = state.confirmNotificationDismiss ? confirmText : '';
  }
};

const commitRecordedTypesFromSettings = () => {
  const keys = [];
  if (dom.settingRecordAdded?.checked) keys.push('transactionAdded');
  if (dom.settingRecordUpdated?.checked) keys.push('transactionUpdated');
  if (dom.settingRecordDeleted?.checked) keys.push('transactionDeleted');
  if (dom.settingRecordExported?.checked) keys.push('csvExported');
  setActionableNotificationKeys(keys);
};

const dom = {
  form: document.getElementById("transactionForm"),
  titleInput: document.getElementById("titleInput"),
  amountInput: document.getElementById("amountInput"),
  categoryInput: document.getElementById("categoryInput"),
  dateInput: document.getElementById("dateInput"),
  titleError: document.getElementById("titleError"),
  amountError: document.getElementById("amountError"),
  categoryError: document.getElementById("categoryError"),
  dateError: document.getElementById("dateError"),
  submitBtn: document.getElementById("submitBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  filterCategory: document.getElementById("filterCategory"),
  filterType: document.getElementById("filterType"),
  searchInput: document.getElementById("searchInput"),
  resetFiltersBtn: document.getElementById("resetFiltersBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  historyToggleBtn: document.getElementById("historyToggleBtn"),
  settingConfirmDismiss: document.getElementById("settingConfirmDismiss"),
  settingRecordAdded: document.getElementById("settingRecordAdded"),
  settingRecordUpdated: document.getElementById("settingRecordUpdated"),
  settingRecordDeleted: document.getElementById("settingRecordDeleted"),
  settingRecordExported: document.getElementById("settingRecordExported"),
  transactionsList: document.getElementById("transactionsList"),
  resultsCount: document.getElementById("resultsCount"),
  totalBalance: document.getElementById("totalBalance"),
  totalIncome: document.getElementById("totalIncome"),
  totalExpenses: document.getElementById("totalExpenses"),
  financeChart: document.getElementById("financeChart"),
  srIncome: document.getElementById("srIncome"),
  srExpenses: document.getElementById("srExpenses"),
  srBalance: document.getElementById("srBalance"),
  confirmModal: document.getElementById("confirmModal"),
  confirmDeleteBtn: document.getElementById("confirmDeleteBtn"),
  cancelDeleteBtn: document.getElementById("cancelDeleteBtn"),
  toastContainer: document.getElementById("toastContainer"),
  srToast: document.getElementById("srToast"),
  notificationHistoryContainer: document.getElementById("notificationHistoryContainer"),
  notificationHistory: document.getElementById("notificationHistory"),
  notificationHistoryStatus: document.getElementById("notificationHistoryStatus"),
  openHistoryBtn: document.getElementById("openHistoryBtn"),
  notificationCount: document.getElementById("notificationCount"),
  notificationBackdrop: document.getElementById("notificationBackdrop"),
  clearNotificationsBtn: document.getElementById("clearNotificationsBtn"),
  restoreNotificationDefaultsBtn: document.getElementById("restoreNotificationDefaultsBtn"),
  restoreDefaultsModal: document.getElementById("restoreDefaultsModal"),
  confirmRestoreDefaultsBtn: document.getElementById("confirmRestoreDefaultsBtn"),
  cancelRestoreDefaultsBtn: document.getElementById("cancelRestoreDefaultsBtn"),
  clearNotificationsModal: document.getElementById("clearNotificationsModal"),
  confirmClearNotificationsBtn: document.getElementById("confirmClearNotificationsBtn"),
  cancelClearNotificationsBtn: document.getElementById("cancelClearNotificationsBtn"),
  dismissNotificationModal: document.getElementById("dismissNotificationModal"),
  confirmDismissNotificationBtn: document.getElementById("confirmDismissNotificationBtn"),
  cancelDismissNotificationBtn: document.getElementById("cancelDismissNotificationBtn"),
  skeleton: document.getElementById("skeleton"),
};

const generateID = () => {
  return `tx_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const saveToLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
};

const loadFromLocalStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  state.transactions = stored
    ? JSON.parse(stored).map((transaction) => ({
        ...transaction,
        date: dateUtils.normalizeToLocalDateKey(transaction.date),
      }))
    : [];
};

const saveTheme = () => {
  localStorage.setItem(THEME_KEY, state.theme);
};

const setTheme = (theme) => {
  state.theme = theme;
  document.body.classList.toggle("theme-light", theme === "light");
  if (dom.themeToggleBtn) {
    const t = translations[state.lang] || translations.en;
    dom.themeToggleBtn.textContent = theme === "light" ? (t.darkMode || 'Dark Mode') : (t.lightMode || 'Light Mode');
  }
  saveTheme();
};

const loadTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  setTheme(storedTheme || "dark");
};

const showToast = (message, variant = "success", opts = {}) => {
  try {
    dom.toastContainer.querySelectorAll('.toast').forEach(t => t.remove());
  } catch (e) {}
  const toast = document.createElement("div");
  toast.className = `toast${variant === "error" ? " toast--error" : ""}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  
  if (dom.srToast) {
    dom.srToast.textContent = '';
    setTimeout(() => {
      dom.srToast.setAttribute('aria-live', variant === 'error' ? 'assertive' : 'polite');
      dom.srToast.setAttribute('role', 'status');
      dom.srToast.textContent = message;
    }, 50);
  }

  const key = opts.key;
  if (dom.notificationHistory && key && ACTIONABLE_NOTIFICATION_KEYS.has(key)) {
    const nid = `n_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const notifObj = { id: nid, timestamp: Date.now(), message, key, messageKey: key };
    state.notificationHistory = [notifObj, ...(state.notificationHistory || [])];
    if (state.notificationHistory.length > NOTIFICATION_HISTORY_LIMIT) {
      state.notificationHistory = state.notificationHistory.slice(0, NOTIFICATION_HISTORY_LIMIT);
    }
    saveNotificationHistory();
    renderNotificationHistory();
    updateHistoryButtons();
    try {
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifObj),
      }).catch(() => {});
    } catch (e) {}
  }

  setTimeout(() => toast.remove(), 2400);
};

const clearErrors = () => {
  const fields = [
    { input: dom.titleInput, error: dom.titleError },
    { input: dom.amountInput, error: dom.amountError },
    { input: dom.categoryInput, error: dom.categoryError },
    { input: dom.dateInput, error: dom.dateError },
  ];

  fields.forEach(({ input, error }) => {
    input.classList.remove("is-invalid");
    error.textContent = "";
  });
};

const setError = (input, errorEl, message) => {
  input.classList.add("is-invalid");
  errorEl.textContent = message;
};

const validateForm = () => {
  clearErrors();

  const title = dom.titleInput.value.trim();
  const amountValue = dom.amountInput.value.trim();
  const amount = Number(amountValue);
  const category = dom.categoryInput.value;
  const date = dom.dateInput.value;

  let isValid = true;

  if (!title) {
    setError(dom.titleInput, dom.titleError, translations[state.lang].titleRequired);
    isValid = false;
  }

  if (!amountValue || Number.isNaN(amount) || amount === 0) {
    setError(dom.amountInput, dom.amountError, translations[state.lang].validAmount);
    isValid = false;
  }

  if (!category) {
    setError(dom.categoryInput, dom.categoryError, translations[state.lang].categoryRequired);
    isValid = false;
  }

  if (!date) {
    setError(dom.dateInput, dom.dateError, translations[state.lang].pickDate);
    isValid = false;
  }

  if (date) {
    try {
      const isAllowed = dateUtils.isOnOrBeforeLocalDay(date, new Date().toISOString());
      if (!isAllowed) {
        setError(dom.dateInput, dom.dateError, translations[state.lang].pickDate);
        isValid = false;
      }
    } catch (e) {}
  }

  return isValid;
};

const resetFormState = () => {
  dom.form.reset();
  state.editingId = null;
  dom.submitBtn.textContent = translations[state.lang].addTransactionBtn;
  dom.cancelEditBtn.hidden = true;
  clearErrors();
};

const addTransaction = () => {
  if (!validateForm()) {
    showToast(translations[state.lang].fixFields, "error");
    return;
  }

  const title = dom.titleInput.value.trim();
  const amount = Number(dom.amountInput.value);
  const category = dom.categoryInput.value;
  const date = dateUtils.normalizeToLocalDateKey(dom.dateInput.value);

  if (state.editingId) {
    state.transactions = state.transactions.map((tx) =>
      tx.id === state.editingId ? { ...tx, title, amount, category, date } : tx,
    );
    showToast(translations[state.lang].transactionUpdated, 'success', { key: 'transactionUpdated' });
  } else {
    const newTransaction = {
      id: generateID(),
      title,
      amount,
      category,
      date,
    };

    state.transactions = [newTransaction, ...state.transactions];
    showToast(translations[state.lang].transactionAdded, 'success', { key: 'transactionAdded' });
  }

  resetFormState();
  saveToLocalStorage();
  renderApp();
};

const startEditing = (id) => {
  const transaction = state.transactions.find((tx) => tx.id === id);
  if (!transaction) return;

  dom.titleInput.value = transaction.title;
  dom.amountInput.value = transaction.amount;
  dom.categoryInput.value = transaction.category;
  dom.dateInput.value = dateUtils.normalizeToLocalDateKey(transaction.date);

  state.editingId = id;
  dom.submitBtn.textContent = translations[state.lang].saveChanges;
  dom.cancelEditBtn.hidden = false;
  dom.titleInput.focus();
  showToast(translations[state.lang].editingMode);
};

const deleteTransaction = (id) => {
  state.transactions = state.transactions.filter((tx) => tx.id !== id);
  saveToLocalStorage();
  renderApp();
  showToast(translations[state.lang].transactionDeleted, 'success', { key: 'transactionDeleted' });
};

const openConfirmModal = (id) => {
  state.pendingDeleteId = id;
  dom.confirmModal.classList.add("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "false");
};

const closeConfirmModal = () => {
  state.pendingDeleteId = null;
  dom.confirmModal.classList.remove("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "true");
};

const renderSummary = () => {
  const amounts = state.transactions.map((tx) => tx.amount);

  const totalIncome = amounts
    .filter((amount) => amount > 0)
    .reduce((sum, amount) => sum + amount, 0);

  const totalExpenses = amounts
    .filter((amount) => amount < 0)
    .reduce((sum, amount) => sum + amount, 0);

  const totalBalance = totalIncome + totalExpenses;

  dom.totalIncome.textContent = formatCurrency(totalIncome);
  dom.totalExpenses.textContent = formatCurrency(Math.abs(totalExpenses));
  dom.totalBalance.textContent = formatCurrency(totalBalance);
};

const renderTransactions = () => {
  const filtered = filterTransactions();

  dom.resultsCount.textContent = `${filtered.length} ${translations[state.lang].results}`;

  if (filtered.length === 0) {
    dom.transactionsList.replaceChildren(createEmptyTransactionsState());
    return;
  }

  const groups = groupByMonth(filtered);
  const fragment = document.createDocumentFragment();

  groups.forEach((group) => {
    fragment.appendChild(createMonthGroupElement(group));
  });

  dom.transactionsList.replaceChildren(fragment);
};

const filterTransactions = () => {
  const { category, type, search } = state.filters;

  return state.transactions.filter((tx) => {
    const matchesCategory = category === "all" || tx.category === category;

    const matchesType =
      type === "all" ||
      (type === "income" && tx.amount > 0) ||
      (type === "expense" && tx.amount < 0);

    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });
};

const groupByMonth = (transactions) => {
  const sorted = [...transactions].sort((a, b) =>
    dateUtils.compareLocalDateStringsDesc(a.date, b.date),
  );

  const groups = [];
  const lookup = new Map();

  sorted.forEach((tx) => {
    const label = dateUtils.formatMonthLabel(tx.date, "en-US");

    if (!lookup.has(label)) {
      lookup.set(label, { label, items: [] });
      groups.push(lookup.get(label));
    }

    lookup.get(label).items.push(tx);
  });

  return groups;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString) => {
  return dateUtils.formatLocalDate(dateString, "en-US");
};

const observeChartSize = () => {
  const canvas = dom.financeChart;
  if (!canvas || typeof window.ResizeObserver !== 'function') return;

  if (chartResizeObserver) {
    chartResizeObserver.disconnect();
  }

  chartResizeObserver = new window.ResizeObserver((entries) => {
    const entry = entries[0];
    const nextWidth = Math.round(entry?.contentRect?.width || 0);
    if (!nextWidth || nextWidth === chartDisplayWidth) return;
    chartDisplayWidth = nextWidth;
    scheduleChartRender();
  });

  chartResizeObserver.observe(canvas);
};

const renderChart = () => {
  const canvas = dom.financeChart;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const displayWidth = Math.max(1, Math.round(chartDisplayWidth || 800));
  const displayHeight = 260;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = displayWidth;
  const height = displayHeight;

  ctx.clearRect(0, 0, width, height);

  const amounts = state.transactions.map((tx) => tx.amount);
  const income = amounts.filter((a) => a > 0).reduce((s, a) => s + a, 0);
  const expenses = Math.abs(
    amounts.filter((a) => a < 0).reduce((s, a) => s + a, 0),
  );

  const maxValue = Math.max(income, expenses, 1);
  const barWidth = 120;
  const gap = 80;
  const baseY = height - 40;

  const incomeHeight = (income / maxValue) * (height - 80);
  const expenseHeight = (expenses / maxValue) * (height - 80);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(40, baseY);
  ctx.lineTo(width - 40, baseY);
  ctx.stroke();

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(160, baseY - incomeHeight, barWidth, incomeHeight);

  ctx.fillStyle = "#f97316";
  ctx.fillRect(
    160 + barWidth + gap,
    baseY - expenseHeight,
    barWidth,
    expenseHeight,
  );
  
  ctx.fillStyle = "#f8f4e9";
  ctx.font = "14px sans-serif";
  ctx.fillText("Income", 170, baseY + 20);
  ctx.fillText("Expense", 160 + barWidth + gap, baseY + 20);

  ctx.fillText(formatCurrency(income), 150, baseY - incomeHeight - 10);
  ctx.fillText(
    formatCurrency(expenses),
    150 + barWidth + gap,
    baseY - expenseHeight - 10,
  );
  try {
    const t = translations[state.lang] || translations.en;
    ctx.fillText(t.income || 'Income', 170, baseY + 20);
    ctx.fillText(t.expense || 'Expense', 160 + barWidth + gap, baseY + 20);
  } catch (e) {}
  
  if (dom.srIncome || dom.srExpenses || dom.srBalance) {
    const totalIncome = amounts.filter((a) => a > 0).reduce((s, a) => s + a, 0);
    const totalExpenses = Math.abs(amounts.filter((a) => a < 0).reduce((s, a) => s + a, 0));
    const totalBalance = totalIncome - totalExpenses;
    const formattedIncome = formatCurrency(totalIncome);
    const formattedExpenses = formatCurrency(totalExpenses);
    const formattedBalance = formatCurrency(totalBalance);
    if (dom.srIncome && dom.srIncome.textContent !== formattedIncome) dom.srIncome.textContent = formattedIncome;
    if (dom.srExpenses && dom.srExpenses.textContent !== formattedExpenses) dom.srExpenses.textContent = formattedExpenses;
    if (dom.srBalance && dom.srBalance.textContent !== formattedBalance) dom.srBalance.textContent = formattedBalance;
  }
  const chartLegend = document.getElementById('chartLegend');
  const chartRegion = document.getElementById('chartAccessibleText');
  const chartDataSummary = document.getElementById('chartDataSummary');
  if (chartRegion) {
    const t = translations[state.lang] || translations.en;
    const balance = income - expenses;

    if (dom.srIncome) dom.srIncome.textContent = formatCurrency(income);
    if (dom.srExpenses) dom.srExpenses.textContent = formatCurrency(expenses);
    if (dom.srBalance) dom.srBalance.textContent = formatCurrency(balance);
    if (chartDataSummary) {
      chartDataSummary.textContent =
        t.chartDataSummary ||
        'Accessible chart data table with income, expenses, and balance values.';
    }

    if (chartLegend) {
      const fragment = document.createDocumentFragment();
      fragment.append(
        createChartLegendButton({
          type: 'income',
          label: t.income || 'Income',
          value: formatCurrency(income),
          iconPath: 'M12 2l4 8h-3v8h-2v-8H8l4-8z',
        }),
        createChartLegendButton({
          type: 'expense',
          label: t.expense || 'Expense',
          value: formatCurrency(expenses),
          iconPath: 'M12 22l-4-8h3V6h2v8h3l-4 8z',
        }),
      );
      chartLegend.replaceChildren(fragment);
    }
  }
  updateChartSummary();
};

const setupChartDataToggle = () => {
  const toggleBtn = document.getElementById('toggleChartTableBtn');
  const chartRegion = document.getElementById('chartAccessibleText');
  if (!toggleBtn || !chartRegion) return;

  const setExpanded = (expanded) => {
    const t = translations[state.lang] || translations.en;
    chartRegion.classList.toggle('is-visible', expanded);
    toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    toggleBtn.textContent = expanded
      ? (t.chart_table_hide || 'Hide data table')
      : (t.chart_table_toggle || 'View data table');
  };

  setExpanded(toggleBtn.getAttribute('aria-expanded') === 'true');

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    setExpanded(!isExpanded);
  });
};

window.addEventListener('DOMContentLoaded', setupChartDataToggle);

const updateChartSummary = () => {
  const chartSummary = document.getElementById('chartSummary');
  if (!chartSummary) return;
  const amounts = state.transactions.map((tx) => tx.amount);
  const income = amounts.filter((a) => a > 0).reduce((s, a) => s + a, 0);
  const expenses = Math.abs(amounts.filter((a) => a < 0).reduce((s, a) => s + a, 0));
  const balance = income - expenses;
  const tpl = translations[state.lang]?.chart_summary || 'Income: {income}. Expenses: {expenses}. Balance: {balance}.';
  const text = tpl.replace('{income}', formatCurrency(income)).replace('{expenses}', formatCurrency(expenses)).replace('{balance}', formatCurrency(balance));
  chartSummary.textContent = text;
};

const setupChartKeyboardNavigation = () => {
  const canvas = document.getElementById('financeChart');
  const chartRegion = document.getElementById('chartAccessibleText');
  const chartSummary = document.getElementById('chartSummary');
  if (!canvas) return;
  canvas.setAttribute('tabindex', '0');

  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (chartRegion) {
        chartRegion.classList.add('is-visible');
        const toggleBtn = document.getElementById('toggleChartTableBtn');
        if (toggleBtn) {
          const t = translations[state.lang] || translations.en;
          toggleBtn.setAttribute('aria-expanded', 'true');
          toggleBtn.textContent = t.chart_table_hide || 'Hide data table';
        }
      }
    }

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      updateChartSummary();
      chartSummary && chartSummary.focus && chartSummary.focus();
    }
  });
};

window.addEventListener('DOMContentLoaded', setupChartKeyboardNavigation);

const setupChartPointNavigation = () => {
  const chartLegend = document.getElementById('chartLegend');
  const chartRegion = document.getElementById('chartAccessibleText');
  if (!chartLegend) return;

  chartLegend.addEventListener('keydown', (e) => {
    const target = e.target;
    if (!target.classList || !target.classList.contains('chart-point')) return;

    const focusables = Array.from(chartLegend.querySelectorAll('.chart-point'));
    const currentIndex = focusables.indexOf(target);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = focusables[(currentIndex + 1) % focusables.length];
      next && next.focus && next.focus();
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = focusables[(currentIndex - 1 + focusables.length) % focusables.length];
      prev && prev.focus && prev.focus();
    }

    if (e.key === 'Home') {
      e.preventDefault();
      focusables[0] && focusables[0].focus && focusables[0].focus();
    }

    if (e.key === 'End') {
      e.preventDefault();
      focusables[focusables.length - 1] && focusables[focusables.length - 1].focus && focusables[focusables.length - 1].focus();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const type = target.dataset.type;
      const amounts = state.transactions.map((tx) => tx.amount);
      const income = amounts.filter((a) => a > 0).reduce((s, a) => s + a, 0);
      const expenses = Math.abs(amounts.filter((a) => a < 0).reduce((s, a) => s + a, 0));
      const balance = income - expenses;
      const t = translations[state.lang] || translations.en;
      const label = type === 'income' ? (t.income || 'Income') : (t.expense || 'Expense');
      const value = type === 'income' ? formatCurrency(income) : formatCurrency(expenses);
      const summary = `${label}: ${value}`;
      if (chartRegion) {
        chartRegion.classList.add('is-visible');
      }
      const toggleBtn = document.getElementById('toggleChartTableBtn');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.textContent = t.chart_table_hide || 'Hide data table';
      }
      const chartSummary = document.getElementById('chartSummary');
      if (chartSummary) {
        chartSummary.textContent = summary;
        chartSummary.focus && chartSummary.focus();
      }
    }
  });
};

window.addEventListener('DOMContentLoaded', setupChartPointNavigation);

const scheduleChartRender = () => {
  if (typeof window.requestIdleCallback === 'function') {
    try {
      requestIdleCallback(() => {
        try { renderChart(); } catch (e) {}
      }, { timeout: 500 });
      return;
    } catch (e) {}
  }
  setTimeout(() => {
    try { renderChart(); } catch (e) {}
  }, 200);
};

const renderApp = () => {
  renderSummary();
  if (typeof window.requestIdleCallback === 'function') {
    try {
      requestIdleCallback(() => {
        try {
          renderTransactions();
        } catch (e) {}
      }, { timeout: 1000 });
    } catch (e) {
      setTimeout(() => {
        try { renderTransactions(); } catch (e) {}
      }, 200);
    }
  } else {
    setTimeout(() => {
      try { renderTransactions(); } catch (e) {}
    }, 200);
  }

  updateI18n();
  updateChartSummary();
  scheduleChartRender();
};

const updateI18n = () => {
  const currentLang = state.lang || 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (el.id === 'chartSummary') {
      return;
    }
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang]?.[key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang]?.[key]) {
      el.setAttribute('placeholder', translations[currentLang][key]);
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (translations[currentLang]?.[key]) {
      el.setAttribute('aria-label', translations[currentLang][key]);
    }
  });

  const chartToggleBtn = document.getElementById('toggleChartTableBtn');
  const chartRegion = document.getElementById('chartAccessibleText');
  if (chartToggleBtn && chartRegion) {
    const expanded = chartRegion.classList.contains('is-visible');
    chartToggleBtn.textContent = expanded
      ? (translations[currentLang]?.chart_table_hide || 'Hide data table')
      : (translations[currentLang]?.chart_table_toggle || 'View data table');
  }

  const notifTitle = document.getElementById('notificationHistoryTitle');
  if (notifTitle) {
    notifTitle.textContent = translations[currentLang]?.notificationHistoryTitle || 'Notification History';
  }
  const notifEmpty = document.getElementById('notificationHistoryEmpty');
  if (notifEmpty) {
    notifEmpty.textContent = translations[currentLang]?.notificationHistoryEmpty || 'No notifications.';
  }
  renderNotificationHistory();
  updateHistoryButtons();

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? (translations.en.privacy_toggle || '中文') : (translations.zh.privacy_toggle || 'English');
  }

  const privacyLink = document.querySelector('.local-storage-notice__link');
  if (privacyLink) {
    privacyLink.setAttribute('href', `privacy.html?lang=${currentLang}`);
  }
};

const toggleLang = () => {
  state.lang = state.lang === 'en' ? 'zh' : 'en';
  localStorage.setItem(LANG_KEY, state.lang);
  updateI18n();
};

const exportToCSV = () => {
  if (state.transactions.length === 0) {
    showToast(translations[state.lang].noDataExport, "error");
    return;
  }

  const headers = ["Title", "Amount", "Category", "Date"];
  const rows = state.transactions.map((tx) => [
    tx.title,
    tx.amount,
    tx.category,
    dateUtils.normalizeToLocalDateKey(tx.date),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "transactions.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast(translations[state.lang].csvExported, 'success', { key: 'csvExported' });
};

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container) =>
  Array.from(container?.querySelectorAll(FOCUSABLE_SELECTOR) || []).filter((el) => {
    try {
      if (el.hidden) return false;
      if (el.getAttribute('aria-hidden') === 'true') return false;
      if (el.closest('[aria-hidden="true"]')) return false;
      if (el.hasAttribute('inert') || el.closest('[inert]')) return false;
      if ('disabled' in el && el.disabled) return false;
      if (typeof el.tabIndex === 'number' && el.tabIndex < 0) return false;
      return true;
    } catch (e) {
      return false;
    }
  });

const isAnyModalOpen = () => Boolean(document.querySelector('.modal.is-open'));

const openModal = (modal, initialFocus) => {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    const target = initialFocus || getFocusableElements(modal)[0];
    target?.focus?.();
  });
};

const closeModal = (modal, returnFocus) => {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  returnFocus?.focus?.();
};

const focusFirstInSidebar = () => {
  const focusable = getFocusableElements(dom.notificationHistoryContainer);
  (focusable[0] || dom.notificationHistoryContainer)?.focus?.();
};

const trapFocus = (container, e, { allowDuringModal = false } = {}) => {
  if (e.key !== 'Tab' || (!allowDuringModal && isAnyModalOpen())) return;

  const focusable = getFocusableElements(container);
  if (!focusable.length) {
    e.preventDefault();
    container.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

const initializeApp = () => {
  loadFromLocalStorage();
  loadActionableNotificationKeys();
  loadNotificationHistory();
  fetchServerNotifications();
  state.notificationHistoryVisible = localStorage.getItem(NOTIF_VISIBLE_KEY) === 'true';
  state.confirmNotificationDismiss = localStorage.getItem(NOTIF_CONFIRM_DISMISS_KEY) === 'true';
  loadTheme();
  
  state.filters.category = dom.filterCategory.value;
  state.filters.type = dom.filterType.value;
  state.filters.search = dom.searchInput.value;
  try {
    if (dom.dateInput) {
      dom.dateInput.max = dateUtils.normalizeToLocalDateKey(new Date().toISOString());
    }
  } catch (e) {}

  observeChartSize();
  renderApp();

  setTimeout(() => {
    dom.skeleton.classList.add("is-hidden");
  }, 300);

  renderNotificationHistory();
  syncNotificationSettingsUI();

  dom.form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTransaction();
  });

  dom.cancelEditBtn.addEventListener("click", () => {
    resetFormState();
  });

  dom.transactionsList.addEventListener("click", (e) => {
    const deleteButton = e.target.closest(".delete-btn");
    const editButton = e.target.closest(".edit-btn");
    const emptyAdd = e.target.closest(".empty-add-btn");

    const deleteId = deleteButton?.dataset?.id;
    const editId = editButton?.dataset?.id;

    if (deleteId) {
      openConfirmModal(deleteId);
    }

    if (editId) {
      startEditing(editId);
    }

    if (emptyAdd) {
      dom.titleInput.focus();
    }
  });

  dom.filterCategory.addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    renderTransactions();
  });

  dom.filterType.addEventListener("change", (e) => {
    state.filters.type = e.target.value;
    renderTransactions();
  });

  dom.searchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value;
    renderTransactions();
  });

  dom.resetFiltersBtn.addEventListener("click", () => {
    state.filters = { category: "all", type: "all", search: "" };
    dom.filterCategory.value = "all";
    dom.filterType.value = "all";
    dom.searchInput.value = "";
    renderTransactions();
  });

  dom.exportCsvBtn.addEventListener("click", exportToCSV);

  dom.themeToggleBtn.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });

  const debounce = (fn, wait = 120) => {
    let t = null;
    return (...args) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  let sidebarRestoreFocusTarget = null;

  const openSidebar = () => {
    sidebarRestoreFocusTarget = document.activeElement;
    setNotificationHistoryVisible(true);
    document.body.classList.add('no-scroll');
    setTimeout(focusFirstInSidebar, 260);
  };

  const closeSidebar = ({ restoreFocus = true } = {}) => {
    if (!dom.notificationHistoryContainer?.classList.contains('is-visible')) return;
    setNotificationHistoryVisible(false);
    document.body.classList.remove('no-scroll');
    if (restoreFocus) {
      const target = sidebarRestoreFocusTarget && document.contains(sidebarRestoreFocusTarget)
        ? sidebarRestoreFocusTarget
        : dom.openHistoryBtn;
      target?.focus?.();
    }
    sidebarRestoreFocusTarget = null;
  };

  const setNotificationHistoryVisible = (visible) => {
    state.notificationHistoryVisible = visible;
    localStorage.setItem(NOTIF_VISIBLE_KEY, String(visible));
    updateHistoryButtons();
  };

  const toggleSidebar = () => (
    dom.notificationHistoryContainer.classList.contains('is-visible') ? closeSidebar() : openSidebar()
  );

  if (dom.openHistoryBtn) {
    dom.openHistoryBtn.addEventListener('click', debounce(() => {
      dom.openHistoryBtn.classList.add('is-animating');
      toggleSidebar();
      setTimeout(() => dom.openHistoryBtn.classList.remove('is-animating'), 220);
    }, 100));
  }

  if (dom.historyToggleBtn) {
    dom.historyToggleBtn.addEventListener('click', () => closeSidebar());
  }

  if (dom.notificationBackdrop) {
    dom.notificationBackdrop.addEventListener('click', () => closeSidebar());
  }

  window.addEventListener('keydown', (e) => {
    const activeModal = document.querySelector('.modal.is-open');
    if (activeModal) {
      trapFocus(activeModal, e, { allowDuringModal: true });
      return;
    }

    if (dom.notificationHistoryContainer?.classList.contains('is-visible')) {
      if (e.key === 'Escape' && !isAnyModalOpen()) {
        e.preventDefault();
        closeSidebar();
        return;
      }
      trapFocus(dom.notificationHistoryContainer, e);
    }
  });

  document.addEventListener('focusin', (e) => {
    const activeModal = document.querySelector('.modal.is-open');
    if (activeModal && !activeModal.contains(e.target)) {
      const focusable = getFocusableElements(activeModal);
      (focusable[0] || activeModal)?.focus?.();
      return;
    }

    if (
      dom.notificationHistoryContainer?.classList.contains('is-visible') &&
      !isAnyModalOpen() &&
      !dom.notificationHistoryContainer.contains(e.target)
    ) {
      focusFirstInSidebar();
    }
  });

  if (dom.settingConfirmDismiss) {
    dom.settingConfirmDismiss.addEventListener('change', (e) => {
      setNotificationDismissConfirmation(e.target.checked);
      syncNotificationSettingsUI();
    });
  }

  if (dom.restoreNotificationDefaultsBtn) {
    dom.restoreNotificationDefaultsBtn.addEventListener('click', () => {
      if (dom.restoreDefaultsModal) {
        dom.restoreDefaultsModal.classList.add('is-open');
        dom.restoreDefaultsModal.setAttribute('aria-hidden', 'false');
      } else {
        restoreNotificationDefaults();
        showToast(translations[state.lang]?.notificationSettingsReset || 'Notification settings restored to defaults.');
      }
    });
  }

  [
    dom.settingRecordAdded,
    dom.settingRecordUpdated,
    dom.settingRecordDeleted,
    dom.settingRecordExported,
  ].forEach((input) => {
    if (!input) return;
    input.addEventListener('change', () => {
      commitRecordedTypesFromSettings();
      syncNotificationSettingsUI();
    });
  });

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLang);
  }

  const cookieBanner = document.getElementById('localStorageNotice');
  const acceptBtn = document.getElementById('acceptLocalStorageBtn');
  const declineBtn = document.getElementById('declineLocalStorageBtn');
  
  if (cookieBanner) {
    if (!localStorage.getItem('localStorageConsent')) {
      cookieBanner.style.display = 'flex';
    } else {
      cookieBanner.style.display = 'none';
    }
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('localStorageConsent', 'accepted');
      if(cookieBanner) cookieBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('localStorageConsent', 'declined');
      if(cookieBanner) cookieBanner.style.display = 'none';
    });
  }

  if (dom.clearNotificationsBtn && dom.clearNotificationsModal) {
    dom.clearNotificationsBtn.addEventListener('click', () => {
      openModal(dom.clearNotificationsModal, dom.cancelClearNotificationsBtn);
    });
  }

  if (dom.confirmClearNotificationsBtn) {
    dom.confirmClearNotificationsBtn.addEventListener('click', async () => {
      const originalText = dom.confirmClearNotificationsBtn.textContent;
      dom.confirmClearNotificationsBtn.disabled = true;
      dom.confirmClearNotificationsBtn.textContent = 'Clearing...';
      dom.confirmClearNotificationsBtn.setAttribute('aria-busy', 'true');
      try {
        state.notificationHistory = [];
        saveNotificationHistory();
        renderNotificationHistory();
        updateHistoryButtons();
        syncNotificationSettingsUI();
      } finally {
        dom.confirmClearNotificationsBtn.disabled = false;
        dom.confirmClearNotificationsBtn.textContent = originalText;
        dom.confirmClearNotificationsBtn.removeAttribute('aria-busy');
        closeModal(dom.clearNotificationsModal, dom.notificationHistoryContainer?.classList.contains('is-visible') ? dom.notificationHistoryContainer : dom.openHistoryBtn);
        showToast(translations[state.lang]?.notificationHistoryCleared || 'Notifications cleared.');
      }
    });
  }

  if (dom.openHistoryBtn) {
    const count = dom.notificationCount;
    dom.openHistoryBtn.replaceChildren(createBellIcon());
    if (count) dom.openHistoryBtn.appendChild(count);
    dom.openHistoryBtn.setAttribute('aria-controls', 'notificationHistoryContainer');
  }

  if (dom.notificationHistory) {
    dom.notificationHistory.setAttribute('aria-live', 'polite');
    dom.notificationHistory.setAttribute('aria-relevant', 'additions removals text');
  }

  if (dom.cancelClearNotificationsBtn) {
    dom.cancelClearNotificationsBtn.addEventListener('click', () => {
      closeModal(dom.clearNotificationsModal, dom.clearNotificationsBtn);
    });
  }

  if (dom.dismissNotificationModal) {
    dom.confirmDismissNotificationBtn?.addEventListener('click', () => {
      const id = state.pendingNotificationDismissId;
      closeDismissNotificationModal();
      removeNotificationById(id);
    });

    dom.cancelDismissNotificationBtn?.addEventListener('click', closeDismissNotificationModal);

    dom.dismissNotificationModal.addEventListener('click', (e) => {
      if (e.target.dataset.close) {
        closeDismissNotificationModal();
      }
    });
  }

  if (dom.restoreDefaultsModal) {
    dom.confirmRestoreDefaultsBtn?.addEventListener('click', () => {
      restoreNotificationDefaults();
      if (dom.restoreDefaultsModal) {
        dom.restoreDefaultsModal.classList.remove('is-open');
        dom.restoreDefaultsModal.setAttribute('aria-hidden', 'true');
      }
      showToast(translations[state.lang]?.notificationSettingsReset || 'Notification settings restored to defaults.');
    });

    dom.cancelRestoreDefaultsBtn?.addEventListener('click', () => {
      if (dom.restoreDefaultsModal) {
        dom.restoreDefaultsModal.classList.remove('is-open');
        dom.restoreDefaultsModal.setAttribute('aria-hidden', 'true');
      }
    });

    dom.restoreDefaultsModal.addEventListener('click', (e) => {
      if (e.target.dataset.close) {
        dom.restoreDefaultsModal.classList.remove('is-open');
        dom.restoreDefaultsModal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (dom.notificationHistory) {
    dom.notificationHistory.addEventListener('click', (e) => {
      const btn = e.target.closest('.notif-dismiss');
      if (btn) {
        const li = btn.closest('li');
        if (li) {
          const id = li.getAttribute('data-id');
          const message = li.getAttribute('data-message') || li.textContent || '';
          if (id) {
            if (state.confirmNotificationDismiss) {
              openDismissNotificationModal(id, message);
            } else {
              removeNotificationById(id);
            }
          } else {
            li.remove();
          }
        }
      }
    });

    dom.notificationHistory.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const btn = e.target.closest('.notif-dismiss');
        if (btn) {
          e.preventDefault();
          const li = btn.closest('li');
          if (li) {
            const id = li.getAttribute('data-id');
            const message = li.getAttribute('data-message') || li.textContent || '';
            if (id) {
              if (state.confirmNotificationDismiss) {
                openDismissNotificationModal(id, message);
              } else {
                removeNotificationById(id);
              }
            } else {
              li.remove();
            }
          }
        }
      }
    });
  }

  dom.confirmDeleteBtn.addEventListener("click", () => {
    if (state.pendingDeleteId) {
      deleteTransaction(state.pendingDeleteId);
    }
    closeConfirmModal();
  });

  dom.cancelDeleteBtn.addEventListener("click", closeConfirmModal);

  dom.confirmModal.addEventListener("click", (e) => {
    if (e.target.dataset.close) {
      closeConfirmModal();
    }
  });
};

bootstrapTranslations();
if (typeof window.requestIdleCallback === 'function') {
  try {
    requestIdleCallback(() => {
      try { initializeApp(); } catch (e) { console.error(e); }
    }, { timeout: 2000 });
  } catch (e) {
    window.addEventListener('load', () => setTimeout(initializeApp, 200));
  }
} else {
  window.addEventListener('load', () => setTimeout(initializeApp, 200));
}
