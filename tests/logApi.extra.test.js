const loadHandler = () => {
  jest.resetModules();
  return require('../api/log.js');
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

describe('log API extra branches', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('responds 405 for non-POST methods', () => {
    const handler = loadHandler();
    const res = makeResponse();
    handler({ method: 'GET' }, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: 'Method not allowed' });
  });

  it('handles malformed JSON with 500', () => {
    const handler = loadHandler();
    const res = makeResponse();
    handler({ method: 'POST', body: '{' }, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });

  it('logs with and without data payload', () => {
    const handler = loadHandler();
    const res1 = makeResponse();
    handler({ method: 'POST', body: { level: 'WARN', message: 'hey' } }, res1);
    expect(res1.statusCode).toBe(200);

    const res2 = makeResponse();
    handler({ method: 'POST', body: { level: 'INFO', message: 'hi', data: { a: 1 } } }, res2);
    expect(res2.statusCode).toBe(200);
  });
});
