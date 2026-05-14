const LANG_KEY = window.LANG_KEY || "financeTrackerLang";

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
    privacy_back: "← Back to App",
    privacy_toggle: "中文",
    privacy_title: "Privacy Policy",
    privacy_lastUpdated: "Last updated: May 2026",
    privacy_overview_heading: "1. Overview",
    privacy_overview_text: "Advanced Finance Tracker (\"the App\") is a client-side web application. We are committed to protecting your privacy. This policy explains what data is collected, how it is stored, and your rights regarding that data.",
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
      "我们使用本地存储 (Local Storage) 在本地存储您的偏好和交易数据。数据不会与第三方共享。",
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
    privacy_back: "← 返回应用",
    privacy_toggle: "English",
    privacy_title: "隐私政策",
    privacy_lastUpdated: "最后更新：2026年5月",
    privacy_overview_heading: "1. 概述",
    privacy_overview_text: "高级财务追踪器（\"本应用\"）是一个纯前端网页应用。我们重视并保护您的隐私。本政策说明我们收集哪些数据、如何存储这些数据，以及您对这些数据享有的权利。",
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
  console.warn('Translations not found on window; using DEFAULT_TRANSLATIONS fallback.');
};

const STORAGE_KEY = "financeTrackerData";
const THEME_KEY = "financeTrackerTheme";

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
  state.transactions = stored ? JSON.parse(stored) : [];
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

const showToast = (message, variant = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast${variant === "error" ? " toast--error" : ""}`;
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  dom.toastContainer.appendChild(toast);
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
  const date = dom.dateInput.value;

  if (state.editingId) {
    state.transactions = state.transactions.map((tx) =>
      tx.id === state.editingId ? { ...tx, title, amount, category, date } : tx,
    );
    showToast(translations[state.lang].transactionUpdated);
  } else {
    const newTransaction = {
      id: generateID(),
      title,
      amount,
      category,
      date,
    };

    state.transactions = [newTransaction, ...state.transactions];
    showToast(translations[state.lang].transactionAdded);
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
  dom.dateInput.value = transaction.date;

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
  showToast(translations[state.lang].transactionDeleted);
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
    dom.transactionsList.innerHTML = `
      <div class="transactions__empty">
        <button class="empty__icon empty-add-btn" type="button">+<span class="sr-only">${translations[state.lang].addFirst}</span></button>
        <p>${translations[state.lang].noTransactions}</p>
        <button class="btn btn--accent empty-add-btn" type="button">${translations[state.lang].addFirst}</button>
      </div>
    `;
    return;
  }

  const groups = groupByMonth(filtered);

  dom.transactionsList.innerHTML = groups
    .map(
      (group) => `
        <div class="month-group">
          <p class="month-title">${group.label}</p>
          ${group.items.map(renderTransactionItem).join("")}
        </div>
      `,
    )
    .join("");
};

const escapeHTML = (str) => {
  return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));
};

const renderTransactionItem = (tx) => {
  const typeClass = tx.amount >= 0 ? "amount--income" : "amount--expense";
  const formattedAmount = formatCurrency(tx.amount);
  const formattedDate = formatDate(tx.date);

  return `
    <div class="transaction">
      <div>
        <p class="transaction__title">${escapeHTML(tx.title)}</p>
        <div class="transaction__meta">
          <span class="badge">${escapeHTML(tx.category)}</span>
          <span>${formattedDate}</span>
        </div>
      </div>
      <div>
        <p class="amount ${typeClass}">${formattedAmount}</p>
        <button class="edit-btn" data-id="${tx.id}">${translations[state.lang].editBtn}</button>
        <button class="delete-btn" data-id="${tx.id}">${translations[state.lang].deleteBtn}</button>
      </div>
    </div>
  `;
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
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const groups = [];
  const lookup = new Map();

  sorted.forEach((tx) => {
    const label = new Date(tx.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

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
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderChart = () => {
  const canvas = dom.financeChart;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const displayWidth = canvas.clientWidth;
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
  
  if (dom.srIncome && dom.srExpenses && dom.srBalance) {
    const totalIncome = amounts.filter((a) => a > 0).reduce((s, a) => s + a, 0);
    const totalExpenses = Math.abs(amounts.filter((a) => a < 0).reduce((s, a) => s + a, 0));
    const totalBalance = totalIncome - totalExpenses;
    dom.srIncome.textContent = formatCurrency(totalIncome);
    dom.srExpenses.textContent = formatCurrency(totalExpenses);
    dom.srBalance.textContent = formatCurrency(totalBalance);
  }
  const chartLegend = document.getElementById('chartLegend');
  const chartRegion = document.getElementById('chartAccessibleText');
  if (chartRegion) {
    const t = translations[state.lang] || translations.en;
    const balance = income - expenses;
    const incomeIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l4 8h-3v8h-2v-8H8l4-8z"/></svg>`;
    const expenseIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22l-4-8h3V6h2v8h3l-4 8z"/></svg>`;

    chartRegion.innerHTML = `
      <p><span data-i18n="srIncomeLabel">Total Income:</span> <span id="srIncome">${formatCurrency(income)}</span></p>
      <p><span data-i18n="srExpensesLabel">Total Expenses:</span> <span id="srExpenses">${formatCurrency(expenses)}</span></p>
      <p><span data-i18n="srBalanceLabel">Total Balance:</span> <span id="srBalance">${formatCurrency(balance)}</span></p>
    `;

    if (chartLegend) {
      chartLegend.innerHTML = `
        <button class="chart-point chart-point--income" data-type="income" aria-label="${t.income || 'Income'} ${formatCurrency(income)}" tabindex="0">
          <span class="chart-point__swatch" aria-hidden="true"></span>
          <span class="chart-point__icon">${incomeIcon}</span>
          <span class="chart-point__content">
            <span class="chart-point__label" data-i18n="income"></span>
            <span class="chart-point-value">${formatCurrency(income)}</span>
          </span>
        </button>
        <button class="chart-point chart-point--expense" data-type="expense" aria-label="${t.expense || 'Expense'} ${formatCurrency(expenses)}" tabindex="0">
          <span class="chart-point__swatch" aria-hidden="true"></span>
          <span class="chart-point__icon">${expenseIcon}</span>
          <span class="chart-point__content">
            <span class="chart-point__label" data-i18n="expense"></span>
            <span class="chart-point-value">${formatCurrency(expenses)}</span>
          </span>
        </button>
      `;
    }
  }
  updateChartSummary();
};

const setupChartDataToggle = () => {
  const toggleBtn = document.getElementById('toggleChartTableBtn');
  const chartRegion = document.getElementById('chartAccessibleText');
  if (!toggleBtn || !chartRegion) return;

  const setExpanded = (expanded) => {
    if (expanded) {
      chartRegion.removeAttribute('hidden');
      chartRegion.classList.add('is-visible');
      toggleBtn.setAttribute('aria-expanded', 'true');
      return;
    }

    chartRegion.setAttribute('hidden', '');
    chartRegion.classList.remove('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'false');
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
        const isHidden = chartRegion.hasAttribute('hidden');
        if (isHidden) chartRegion.removeAttribute('hidden');
        else chartRegion.setAttribute('hidden', '');
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
        chartRegion.removeAttribute('hidden');
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

const renderApp = () => {
  renderSummary();
  renderTransactions();
  renderChart();
  updateI18n();
  updateChartSummary();
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
    tx.date,
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

  showToast(translations[state.lang].csvExported);
};

const initializeApp = () => {
  loadFromLocalStorage();
  loadTheme();
  
  state.filters.category = dom.filterCategory.value;
  state.filters.type = dom.filterType.value;
  state.filters.search = dom.searchInput.value;
  
  renderApp();

  setTimeout(() => {
    dom.skeleton.classList.add("is-hidden");
  }, 300);

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
initializeApp();
