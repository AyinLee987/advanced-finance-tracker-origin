const fs = require('fs');
const path = require('path');

const read = (relativePath) =>
  fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

describe('chart accessibility contract', () => {
  const indexHtml = read('index.html');
  const mainJs = read('main.js');

  it('exposes the chart canvas with the expected ARIA metadata', () => {
    expect(indexHtml).toContain('id="financeChart"');
    expect(indexHtml).toContain('role="img"');
    expect(indexHtml).toContain('aria-label="Bar chart showing total income versus total expenses"');
    expect(indexHtml).toContain('aria-describedby="chartAccessibleText chartLegend"');
  });

  it('keeps semantic chart data in the markup', () => {
    expect(indexHtml).toContain('id="chartAccessibleText"');
    expect(indexHtml).toContain('role="region"');
    expect(indexHtml).toContain('aria-live="polite"');
    expect(indexHtml).toContain('data-i18n-aria="chartDataRegionAriaLabel"');
    expect(indexHtml).toContain('<table class="chart-data-table">');
    expect(indexHtml).toContain('<caption class="sr-only" data-i18n="chartDataTableCaption">');
    expect(indexHtml).toContain('<th scope="col" data-i18n="chartDataMetric">Metric</th>');
    expect(indexHtml).toContain('<th scope="col" data-i18n="chartDataValue">Value</th>');
    expect(indexHtml).toContain('<th scope="row" data-i18n="srIncomeLabel">Total Income:</th>');
    expect(indexHtml).toContain('<th scope="row" data-i18n="srExpensesLabel">Total Expenses:</th>');
    expect(indexHtml).toContain('<th scope="row" data-i18n="srBalanceLabel">Total Balance:</th>');
  });

  it('keeps the chart data toggle and renderer from hiding the semantic table from assistive tech', () => {
    expect(indexHtml).toContain('aria-controls="chartAccessibleText"');
    expect(mainJs).toContain("chartRegion.classList.toggle('is-visible', expanded)");
    expect(mainJs).not.toContain("chartRegion.setAttribute('hidden'",);
    expect(mainJs).not.toContain("chartRegion.removeAttribute('hidden'",);
    expect(mainJs).not.toContain("chartRegion.innerHTML = `\n      <p><span data-i18n=\"srIncomeLabel\">Total Income:</span>");
  });
});