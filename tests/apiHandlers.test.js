const fs = require('fs');

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

const loadLogHandler = () => {
  jest.resetModules();
  return require('../api/log.js');
};

const loadNotificationsHandler = () => {
  jest.resetModules();
  return require('../api/notifications.js');
};

describe('log API handler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles preflight, POST payloads, method guards, and parse failures', () => {
    const handler = loadLogHandler();

    const optionsResponse = makeResponse();
    handler({ method: 'OPTIONS' }, optionsResponse);
    expect(optionsResponse.statusCode).toBe(200);
    expect(optionsResponse.ended).toBe(true);

    const postWithDataResponse = makeResponse();
    handler(
      {
        method: 'POST',
        body: JSON.stringify({
          level: 'WARN',
          message: 'Widget created',
          data: { id: 1 },
          timestamp: '2026-05-19T00:00:00.000Z',
        }),
      },
      postWithDataResponse,
    );
    expect(postWithDataResponse.statusCode).toBe(200);
    expect(postWithDataResponse.body.success).toBe(true);
    expect(console.log).toHaveBeenCalledWith(
      '[WARN] [2026-05-19T00:00:00.000Z] Widget created',
      JSON.stringify({ id: 1 }, null, 2),
    );

    const postWithoutDataResponse = makeResponse();
    handler(
      {
        method: 'POST',
        body: { message: 'Plain entry' },
      },
      postWithoutDataResponse,
    );
    expect(postWithoutDataResponse.statusCode).toBe(200);
    expect(postWithoutDataResponse.body.message).toBe('Log recorded');

    const methodResponse = makeResponse();
    handler({ method: 'GET' }, methodResponse);
    expect(methodResponse.statusCode).toBe(405);

    const malformedResponse = makeResponse();
    handler({ method: 'POST', body: '{' }, malformedResponse);
    expect(malformedResponse.statusCode).toBe(500);
    expect(malformedResponse.body).toEqual({ error: 'Internal server error' });
  });
});

describe('notifications API handler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles file reads, writes, preflight, and malformed payloads', () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync');
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

    const handler = loadNotificationsHandler();

    const optionsResponse = makeResponse();
    handler({ method: 'OPTIONS' }, optionsResponse);
    expect(optionsResponse.statusCode).toBe(200);
    expect(optionsResponse.ended).toBe(true);

    existsSyncSpy.mockReturnValue(false);
    const missingFileResponse = makeResponse();
    handler({ method: 'GET' }, missingFileResponse);
    expect(missingFileResponse.statusCode).toBe(200);
    expect(missingFileResponse.body).toEqual({ items: [] });

    existsSyncSpy.mockReturnValue(true);
    readFileSyncSpy.mockReturnValue(JSON.stringify([{ id: 'n1', message: 'One' }]));
    const existingFileResponse = makeResponse();
    handler({ method: 'GET' }, existingFileResponse);
    expect(existingFileResponse.body.items).toEqual([{ id: 'n1', message: 'One' }]);

    readFileSyncSpy.mockReturnValue('[]');
    const postResponse = makeResponse();
    handler(
      {
        method: 'POST',
        body: JSON.stringify({ id: 'n2', message: 'Stored notification' }),
      },
      postResponse,
    );
    expect(postResponse.statusCode).toBe(201);
    expect(postResponse.body).toEqual({ success: true });
    expect(writeFileSyncSpy).toHaveBeenCalled();

    const methodResponse = makeResponse();
    handler({ method: 'PATCH' }, methodResponse);
    expect(methodResponse.statusCode).toBe(405);

    const malformedResponse = makeResponse();
    handler({ method: 'POST', body: '{' }, malformedResponse);
    expect(malformedResponse.statusCode).toBe(500);
    expect(malformedResponse.body).toEqual({ error: 'Failed to persist notification' });
  });
});