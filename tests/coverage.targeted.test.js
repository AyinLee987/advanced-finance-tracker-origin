const fs = require('fs');

const makeResponse = () => ({
  statusCode: null,
  body: null,
  ended: false,
  status(code) { this.statusCode = code; return this; },
  json(payload) { this.body = payload; return this; },
  end() { this.ended = true; return this; },
});

describe('coverage targeted tests', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('log API records entry with explicit timestamp and data', () => {
    jest.resetModules();
    const handler = require('../api/log.js');
    const res = makeResponse();
    handler({ method: 'POST', body: { level: 'WARN', message: 'Test', data: { x: 1 }, timestamp: '2020-01-01T00:00:00Z' } }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Log recorded');
  });

  it('notifications POST truncates to 200 entries when file has many items', () => {
    jest.resetModules();
    const handler = require('../api/notifications.js');
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const big = new Array(300).fill({ note: 'old' });
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(big));

    let captured = null;
    jest.spyOn(fs, 'writeFileSync').mockImplementation((p, data) => { captured = data; });

    const res = makeResponse();
    handler({ method: 'POST', body: { note: 'fresh' } }, res);
    expect(res.statusCode).toBe(201);
    expect(captured).not.toBeNull();
    const parsed = JSON.parse(captured);
    expect(parsed.length).toBeLessThanOrEqual(200);
  });

  it('transactions PUT updates title-only preserving amount', () => {
    jest.resetModules();
    const handler = require('../api/transactions.js');

    const createRes = makeResponse();
    handler({ method: 'POST', body: { title: 'Orig', amount: '100', category: 'X', date: '2026-05-19' } }, createRes);
    expect(createRes.statusCode).toBe(201);
    const id = createRes.body.data.id;

    const updateRes = makeResponse();
    handler({ method: 'PUT', query: { id }, body: { title: 'New Title' } }, updateRes);
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.title).toBe('New Title');
    expect(updateRes.body.data.amount).toBe(100);
  });

  it('notifications outer catch logs when response.status throws', () => {
    jest.resetModules();
    const handler = require('../api/notifications.js');

    let logged = null;
    jest.spyOn(console, 'error').mockImplementation((...args) => { logged = args; });

    const res = {
      status(code) {
        if (code === 405) throw new Error('boom');
        this.statusCode = code;
        return this;
      },
      json(payload) { this.body = payload; return this; },
      end() { this.ended = true; return this; },
    };

    handler({ method: 'PATCH' }, res);
    expect(logged).not.toBeNull();
    expect(String(logged[0])).toMatch(/\[API\] \/api\/notifications error:/);
  });
});
