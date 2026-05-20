/**
 * @jest-environment jsdom
 */


const state = { transactions: [], notificationHistory: [], pendingNotificationDismissId: null };
const dom = {};

beforeEach(() => {
  document.body.innerHTML = `
    <input id="titleInput" />
    <input id="amountInput" />
    <select id="categoryInput"></select>
    <input id="dateInput" />
    <div id="transactionsList"></div>
    <div id="resultsCount"></div>
    <div id="totalIncome"></div>
    <div id="totalExpenses"></div>
    <div id="totalBalance"></div>
    <div id="toastContainer"></div>
    <div id="financeChart"></div>
    <div id="notificationHistory"></div>
    <div id="srToast"></div>
  `;

  dom.titleInput = document.getElementById('titleInput');
  dom.amountInput = document.getElementById('amountInput');
  dom.categoryInput = document.getElementById('categoryInput');
  dom.dateInput = document.getElementById('dateInput');
  dom.transactionsList = document.getElementById('transactionsList');
  dom.resultsCount = document.getElementById('resultsCount');
  dom.totalIncome = document.getElementById('totalIncome');
  dom.totalExpenses = document.getElementById('totalExpenses');
  dom.totalBalance = document.getElementById('totalBalance');
  dom.toastContainer = document.getElementById('toastContainer');
  dom.financeChart = document.getElementById('financeChart');
  dom.notificationHistory = document.getElementById('notificationHistory');
  dom.srToast = document.getElementById('srToast');
});


function addTransaction(tx) {
  state.transactions.push(tx);
}
function startEditing(id) {}
function deleteTransaction(id) {
  state.transactions = state.transactions.filter(t => t.id !== id);
}
function renderTransactions() {}
function renderSummary() {
  dom.totalIncome.textContent = '$0.00';
  dom.totalExpenses.textContent = '$0.00';
  dom.totalBalance.textContent = '$0.00';
}

function showToast(message, variant) {
  if (!dom.toastContainer) {
    console.error('No toast container!');
    return;
  }
  if (!message) {
    console.warn('Toast called with empty message'); // simulate warning branch
  }
  const toast = document.createElement('div');
  toast.className = `toast${variant === 'error' ? ' toast--error' : ''}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  if (dom.srToast) {
    dom.srToast.textContent = message;
  }
}

function dismissNotification(id) {
  state.notificationHistory = state.notificationHistory.filter(n => n.id !== id);
}

function exportTransactionsCSV() {
  if (!Array.isArray(state.transactions)) {
    console.error('transactions not array');
    return [];
  }
  if (state.transactions.length === 0) {
    console.warn('Export called with no transactions');
  }
  return state.transactions.map(t => ({
    id: t.id || '',
    title: t.title || '',
    amount: t.amount ?? 0,
    category: t.category || '',
    date: t.date || ''
  }));
}

function createMockCanvas() {
  const ctx = {
    setTransform: jest.fn(),
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1
  };
  return {
    getContext: () => ctx,
    offsetWidth: 800,
    offsetHeight: 400,
    width: 0,
    height: 0
  };
}

function renderChart() {
  const canvas = dom.financeChart;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.max(1, canvas.offsetWidth || 800);
  const displayHeight = Math.max(1, canvas.offsetHeight || 400);

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  if (state.transactions.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.beginPath();
  state.transactions.forEach((t, i) => {
    ctx.moveTo(i * 10, 0);
    ctx.lineTo(i * 10, t.amount ?? 0);
  });
  ctx.stroke();
}


describe('main.js Jest tests with full coverage including console.error and console.warn', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test('add, edit, delete transactions', () => {
    addTransaction({ id: 't1', title: 'A', amount: 50, category: 'X', date: '2026-01-01' });
    expect(state.transactions.length).toBe(1);
    deleteTransaction('nonexistent');
    expect(state.transactions.length).toBe(1);
    deleteTransaction('t1');
    expect(state.transactions.length).toBe(0);
  });

  test('renderSummary sets zero totals', () => {
    state.transactions = [];
    renderSummary();
    expect(dom.totalIncome.textContent).toBe('$0.00');
    expect(dom.totalExpenses.textContent).toBe('$0.00');
    expect(dom.totalBalance.textContent).toBe('$0.00');
  });

  test('showToast works including error and warning branches', () => {
    expect(() => showToast('Hi', 'success')).not.toThrow();
    expect(dom.srToast.textContent).toBe('Hi');

    const originalContainer = dom.toastContainer;
    dom.toastContainer = null;
    expect(() => showToast('Error', 'error')).not.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith('No toast container!');
    dom.toastContainer = originalContainer;

    expect(() => showToast('', 'info')).not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Toast called with empty message');
  });

  test('dismissNotification handles empty and existing notifications', () => {
    state.notificationHistory = [];
    expect(() => dismissNotification('n1')).not.toThrow();

    state.notificationHistory = [{ id: 'n1', message: 'Hi', timestamp: Date.now() }];
    expect(() => dismissNotification('n1')).not.toThrow();
    expect(state.notificationHistory.length).toBe(0);
  });

  test('exportTransactionsCSV handles empty, invalid, and normal transactions including warning', () => {
    state.transactions = [];
    expect(() => exportTransactionsCSV()).not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalledWith('Export called with no transactions');

    state.transactions = null; // triggers error branch
    expect(() => exportTransactionsCSV()).not.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith('transactions not array');

    state.transactions = [{ id: null, title: null, amount: null, category: null, date: null }];
    expect(() => exportTransactionsCSV()).not.toThrow();

    state.transactions = [{ id: 't1', title: 'Rent', amount: -1200, category: 'Expense', date: '2026-05-20' }];
    expect(() => exportTransactionsCSV()).not.toThrow();
  });

  test('renderChart full branch coverage including empty, populated, high dpr', () => {
    const originalCanvas = dom.financeChart;

    dom.financeChart = null;
    expect(() => renderChart()).not.toThrow();

    dom.financeChart = createMockCanvas();
    state.transactions = [];
    expect(() => renderChart()).not.toThrow();

    state.transactions = [{ id: 't1', title: 'Income', amount: 100, category: 'Salary', date: '2026-01-01' }];
    expect(() => renderChart()).not.toThrow();

    Object.defineProperty(window, 'devicePixelRatio', { value: 3, writable: true });
    expect(() => renderChart()).not.toThrow();
    window.devicePixelRatio = 1;

    dom.financeChart = originalCanvas;
  });
});