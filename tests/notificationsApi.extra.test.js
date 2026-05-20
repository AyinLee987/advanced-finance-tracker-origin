const fs = require('fs');

const loadHandler = () => {
  jest.resetModules();
  return require('../api/notifications.js');
};

const makeResponse = () => {
  return {
    statusCode: null,
    body: null,
    ended: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
};

describe('notifications API extra branches', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 500 when GET read throws', () => {
    const handler = loadHandler();
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('disk error'); });

    const res = makeResponse();
    handler({ method: 'GET' }, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to read notifications' });
  });

  it('returns 500 when POST write fails', () => {
    const handler = loadHandler();
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('no write'); });

    const res = makeResponse();
    handler({ method: 'POST', body: { msg: 'x' } }, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to persist notification' });
  });

  it('returns 405 for unsupported methods', () => {
    const handler = loadHandler();
    const res = makeResponse();
    handler({ method: 'TRACE' }, res);
    expect(res.statusCode).toBe(405);
  });
});
