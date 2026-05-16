const fs = require('fs');
const path = require('path');

const read = (relativePath) =>
  fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

describe('XSS defense contract', () => {
  const indexHtml = read('index.html');
  const mainJs = read('main.js');

  it('builds user-facing transaction and chart markup with safe DOM APIs', () => {
    expect(mainJs).toContain('const createTransactionItemElement = (tx) => {');
    expect(mainJs).toContain("title.textContent = tx.title");
    expect(mainJs).toContain("badge.textContent = tx.category");
    expect(mainJs).toContain("dom.transactionsList.replaceChildren(createEmptyTransactionsState())");
    expect(mainJs).toContain('dom.transactionsList.replaceChildren(fragment);');
    expect(mainJs).toContain('const createChartLegendButton = ({ type, label, value, iconPath }) => {');
    expect(mainJs).toContain("chartLegend.replaceChildren(fragment);");
    expect(mainJs).not.toContain('dom.transactionsList.innerHTML');
    expect(mainJs).not.toContain('chartLegend.innerHTML');
    expect(mainJs).not.toContain('li.innerHTML');
  });

  it('initializes the runtime token observer before the main bundle loads', () => {
    expect(indexHtml).toContain("const TOKEN_STORAGE_KEY = 'financeTrackerRuntimeToken';");
    expect(indexHtml).toContain("const observer = new MutationObserver((mutations) => {");
    expect(indexHtml).toContain("observer.observe(document.documentElement, { childList: true, subtree: true });");
    expect(indexHtml).toContain("window.__financeTrackerRuntimeToken = expectedToken;");
    expect(indexHtml).toContain("data-runtime-token");
    expect(indexHtml).toContain("script, iframe, object, embed");
  });
});