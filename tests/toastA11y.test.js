const fs = require('fs');
const path = require('path');

describe('Toast accessible announcement behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    document.documentElement.innerHTML = html;

    window.financeDateUtils = {
      normalizeToLocalDateKey: (d) => d,
      formatMonthLabel: () => 'May 2026',
      formatLocalDate: (d) => d,
    };

    require(path.join(__dirname, '..', 'i18n.js'));
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('srToast is cleared then updated so repeated messages are announced', () => {
    require(path.join(__dirname, '..', 'main.js'));

    const srToast = document.getElementById('srToast');
    expect(srToast).not.toBeNull();

    const exportBtn = document.getElementById('exportCsvBtn');
    expect(exportBtn).not.toBeNull();

    exportBtn.click();

    expect(srToast.textContent === '' || srToast.textContent === undefined).toBeTruthy();

    jest.advanceTimersByTime(60);
    const firstMessage = srToast.textContent;
    expect(firstMessage).toBeTruthy();

    exportBtn.click();

    expect(srToast.textContent).toBe('');

    jest.advanceTimersByTime(60);
    const secondMessage = srToast.textContent;
    expect(secondMessage).toBe(firstMessage);
  });
});
