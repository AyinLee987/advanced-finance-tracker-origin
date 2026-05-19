const path = require('path');

describe('privacy page runtime', () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    jest.useFakeTimers();

    document.body.innerHTML = `
      <a id="backToAppBtn" href="index.html"></a>
      <button id="privacyLangBtn" type="button"></button>
      <div id="privacyContent"></div>
      <div id="privacyEn"></div>
      <div id="privacyZh"></div>
    `;

    window.TRANSLATIONS = {
      en: {
        privacy_back: 'Back',
        privacy_toggle: '中文',
        privacy_title: 'Privacy Policy',
        privacy_content: '<p>EN</p>',
      },
      zh: {
        privacy_back: '返回',
        privacy_toggle: 'English',
        privacy_title: '隐私政策',
        privacy_content: '<p>ZH</p>',
      },
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    delete window.TRANSLATIONS;
    localStorage.clear();
  });

  it('initializes language from query string and renders translated content', () => {
    window.history.replaceState({}, '', 'http://localhost/privacy.html?lang=zh');

    require(path.join(__dirname, '..', 'privacy.js'));

    expect(document.documentElement.lang).toBe('zh');
    expect(document.getElementById('privacyZh').hidden).toBe(false);
    expect(document.getElementById('privacyEn').hidden).toBe(true);
    expect(document.getElementById('backToAppBtn').getAttribute('href')).toBe('index.html?lang=zh');
    expect(document.title).toBe('隐私政策');
    expect(document.getElementById('privacyContent').innerHTML).toContain('<p>ZH</p>');
    expect(localStorage.getItem('financeTrackerLang')).toBe('zh');
  });

  it('falls back to localStorage language and toggles on button click', () => {
    localStorage.setItem('financeTrackerLang', 'zh');
    window.history.replaceState({}, '', 'http://localhost/privacy.html?lang=bad');

    require(path.join(__dirname, '..', 'privacy.js'));

    const langBtn = document.getElementById('privacyLangBtn');
    expect(document.documentElement.lang).toBe('zh');

    langBtn.click();
    jest.runOnlyPendingTimers();

    expect(document.documentElement.lang).toBe('en');
    expect(document.getElementById('backToAppBtn').getAttribute('href')).toBe('index.html?lang=en');
    expect(document.title).toBe('Privacy Policy');
    expect(document.getElementById('privacyContent').innerHTML).toContain('<p>EN</p>');
    expect(localStorage.getItem('financeTrackerLang')).toBe('en');
  });

  it('uses built-in fallback strings when translations are missing', () => {
    delete window.TRANSLATIONS;
    localStorage.setItem('financeTrackerLang', 'other');
    window.history.replaceState({}, '', 'http://localhost/privacy.html');

    require(path.join(__dirname, '..', 'privacy.js'));

    expect(document.documentElement.lang).toBe('en');
    expect(document.getElementById('backToAppBtn').textContent).toBe('← Back to App');
    expect(document.getElementById('privacyLangBtn').textContent).toBe('中文');
    expect(document.title).toBe('Privacy Policy');
    expect(document.getElementById('privacyContent').innerHTML).toBe('');
  });

  it('handles missing DOM targets without throwing', () => {
    delete window.TRANSLATIONS;
    document.body.innerHTML = '';
    window.history.replaceState({}, '', 'http://localhost/privacy.html?lang=zh');

    expect(() => {
      require(path.join(__dirname, '..', 'privacy.js'));
    }).not.toThrow();

    expect(document.documentElement.lang).toBe('zh');
    expect(localStorage.getItem('financeTrackerLang')).toBe('zh');
  });
});
