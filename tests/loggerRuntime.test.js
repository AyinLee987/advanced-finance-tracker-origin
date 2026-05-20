const path = require('path');

describe('logger runtime', () => {
  let originalFetch;
  let originalCreateObjectURL;
  let originalRevokeObjectURL;

  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    document.body.innerHTML = '';

    originalFetch = global.fetch;
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;

    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = jest.fn();

    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    if (!HTMLAnchorElement.prototype.click) {
      HTMLAnchorElement.prototype.click = () => {};
    }
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    require(path.join(__dirname, '..', 'logger.js'));
  });

  afterEach(() => {
    global.fetch = originalFetch;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('logs info/warn/error and persists entries', () => {
    const logger = window.Logger;

    logger.info('startup');
    logger.warn('warn-msg', { a: 1 });
    logger.error('err-msg');

    expect(console.info).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(3);

    const stored = JSON.parse(localStorage.getItem('financeTrackerLogs'));
    expect(stored).toHaveLength(3);
    expect(stored[0].message).toBe('startup');
    expect(stored[1].data).toEqual({ a: 1 });
    expect(logger.getAll()).toHaveLength(3);
  });

  it('respects level filtering and handles malformed storage', () => {
    const logger = window.Logger;

    localStorage.setItem('financeTrackerLogs', '{not-json');
    logger.setLevel('ERROR');
    logger.debug('hidden');
    logger.info('hidden');
    logger.error('visible');

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.info).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    const stored = JSON.parse(localStorage.getItem('financeTrackerLogs'));
    expect(stored).toHaveLength(1);
    expect(stored[0].message).toBe('visible');
  });

  it('exports logs and handles empty export', () => {
    const logger = window.Logger;

    logger.clear();
    logger.export();
    expect(console.info).toHaveBeenCalledWith('[Logger] No logs to export.');

    logger.info('for-export', { x: 2 });
    logger.export();

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
  });

  it('caps persisted logs at 200 entries', () => {
    const logger = window.Logger;

    for (let i = 0; i < 205; i += 1) {
      logger.info(`msg-${i}`);
    }

    const stored = JSON.parse(localStorage.getItem('financeTrackerLogs'));
    expect(stored).toHaveLength(200);
    expect(stored[0].message).toBe('msg-5');
    expect(stored[199].message).toBe('msg-204');
  });

  it('ignores unknown log levels in setLevel', () => {
    const logger = window.Logger;

    logger.setLevel('BOGUS');
    logger.debug('still-filtered');

    expect(console.debug).not.toHaveBeenCalled();
  });
});
