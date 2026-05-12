const LANG_KEY = window.LANG_KEY || 'financeTrackerLang';
const translations = window.TRANSLATIONS || {};

const dom = {
  enSection: document.getElementById('privacyEn'),
  zhSection: document.getElementById('privacyZh'),
  langBtn: document.getElementById('privacyLangBtn'),
  backBtn: document.getElementById('backToAppBtn'),
};

const getPreferredLang = () => {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'en' || q === 'zh') return q;
  const s = localStorage.getItem(LANG_KEY);
  return s === 'zh' ? 'zh' : 'en';
};

const setLang = (lang) => {
  const current = lang === 'zh' ? 'zh' : 'en';
  if (dom.enSection) dom.enSection.hidden = current !== 'en';
  if (dom.zhSection) dom.zhSection.hidden = current !== 'zh';
  document.documentElement.lang = current;

  if (dom.backBtn) {
    const backText = (translations[current] && translations[current].privacy_back) || (current === 'en' ? '← Back to App' : '← 返回应用');
    dom.backBtn.textContent = backText;
    dom.backBtn.href = `index.html?lang=${current}`;
  }

  if (dom.langBtn) {
    const toggleText = (translations[current] && translations[current].privacy_toggle) || (current === 'en' ? '中文' : 'English');
    dom.langBtn.textContent = toggleText;
  }

  document.title = (translations[current] && translations[current].privacy_title) || (current === 'en' ? 'Privacy Policy' : '隐私政策');

  localStorage.setItem(LANG_KEY, current);
};

const initializePrivacyPage = () => {
  setLang(getPreferredLang());
  if (dom.langBtn) {
    dom.langBtn.addEventListener('click', () => {
      const current = document.documentElement.lang === 'zh' ? 'zh' : 'en';
      setLang(current === 'en' ? 'zh' : 'en');
    });
  }
};

initializePrivacyPage();

const privacyContentEl = document.getElementById('privacyContent');
const renderPrivacyContent = () => {
  const lang = document.documentElement.lang || getPreferredLang();
  if (!privacyContentEl) return;
  if (translations[lang] && translations[lang].privacy_content) {
    privacyContentEl.innerHTML = translations[lang].privacy_content;
  }
};

renderPrivacyContent();

if (dom.langBtn) {
  dom.langBtn.addEventListener('click', () => {
    setTimeout(renderPrivacyContent, 0);
  });
}
