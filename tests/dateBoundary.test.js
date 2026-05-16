const {
  compareLocalDateStringsDesc,
  formatLocalDate,
  formatMonthLabel,
  getDateTime,
  isOnOrBeforeLocalDay,
  normalizeToLocalDateKey,
  resolveZone,
} = require('../dateUtils');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const luxon = require('luxon');

describe('Date boundary condition checks with luxon', () => {
  const tz = 'America/New_York';

  it('keeps a UTC timestamp on the previous local calendar day when DST is involved', () => {
    expect(normalizeToLocalDateKey('2026-03-08T02:30:00Z', tz)).toBe('2026-03-07');
    expect(formatLocalDate('2026-03-08T02:30:00Z', 'en-US', tz)).toBe('Mar 7, 2026');
  });

  it('uses an explicit inclusive day boundary for range checks', () => {
    expect(isOnOrBeforeLocalDay('2026-03-08T00:30:00-05:00', '2026-03-08', tz)).toBe(true);
    expect(isOnOrBeforeLocalDay('2026-03-09T00:30:00-04:00', '2026-03-08', tz)).toBe(false);
  });

  it('sorts most recent local dates first without drifting across midnight', () => {
    const transactions = [
      { id: 1, date: '2026-03-07T23:30:00Z' },
      { id: 2, date: '2026-03-08' },
      { id: 3, date: '2026-03-07T01:00:00-05:00' },
    ];

    const sorted = [...transactions].sort((left, right) =>
      compareLocalDateStringsDesc(left.date, right.date, tz),
    );

    expect(sorted.map((transaction) => normalizeToLocalDateKey(transaction.date, tz))).toEqual([
      '2026-03-08',
      '2026-03-07',
      '2026-03-07',
    ]);
  });

  it('formats month labels and falls back cleanly for invalid values', () => {
    expect(formatMonthLabel('2026-05-16', 'en-US', tz)).toBe('May 2026');
    expect(formatMonthLabel('not-a-date', 'en-US', tz)).toBe('not-a-date');
    expect(formatLocalDate('not-a-date', 'en-US', tz)).toBe('not-a-date');
    expect(normalizeToLocalDateKey('not-a-date', tz)).toBe('not-a-date');
  });

  it('handles invalid comparisons and exposes resolved DateTime values', () => {
    expect(compareLocalDateStringsDesc('not-a-date', '2026-05-16', tz)).toBe(0);
    expect(isOnOrBeforeLocalDay('not-a-date', '2026-05-16', tz)).toBe(false);
    expect(getDateTime('2026-05-16', tz).isValid).toBe(true);
    expect(resolveZone(tz)).toBe(tz);
    expect(resolveZone()).toBeTruthy();
  });

  it('falls back to the system zone when Intl date formatting is unavailable', () => {
    const originalIntl = global.Intl;
    global.Intl = undefined;

    try {
      expect(resolveZone()).toBe('system');
    } finally {
      global.Intl = originalIntl;
    }
  });

  it('falls back to system when Intl returns no time zone', () => {
    const originalIntl = global.Intl;
    global.Intl = {
      DateTimeFormat: () => ({
        resolvedOptions: () => ({ timeZone: '' }),
      }),
    };

    try {
      expect(resolveZone()).toBe('system');
    } finally {
      global.Intl = originalIntl;
    }
  });

  it('uses default English locale when no locale is provided', () => {
    expect(formatLocalDate('2026-05-16', undefined, tz)).toBe('May 16, 2026');
    expect(formatMonthLabel('2026-05-16', undefined, tz)).toBe('May 2026');
  });

  it('attaches utilities to the browser global when loaded without CommonJS', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'dateUtils.js'), 'utf8');
    const browserGlobal = {
      luxon,
      module: {},
    };
    browserGlobal.self = browserGlobal;
    browserGlobal.exports = undefined;

    vm.runInNewContext(source, browserGlobal, { filename: 'dateUtils.js' });

    expect(browserGlobal.financeDateUtils).toBeDefined();
    expect(browserGlobal.financeDateUtils.normalizeToLocalDateKey('2026-05-16')).toBe('2026-05-16');
  });
});
