const fs = require('fs');
const logHandler = require('../api/log');
const notificationsHandler = require('../api/notifications');
const transactionsHandler = require('../api/transactions');

function makeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.end = jest.fn(() => res);
  return res;
}

describe('fill coverage gaps', () => {
  afterEach(() => jest.restoreAllMocks());

  test('log handler accepts non-string body (object)', () => {
    const req = { method: 'POST', body: { level: 'WARN', message: 'ok' } };
    const res = makeRes();
    logHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('log handler accepts missing body and uses defaults', () => {
    const req = { method: 'POST' };
    const res = makeRes();
    logHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('notifications GET reads existing file', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('[]');
    const req = { method: 'GET' };
    const res = makeRes();
    notificationsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: [] });
  });

  test('notifications GET falls back to an empty list for blank file contents', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    const req = { method: 'GET' };
    const res = makeRes();
    notificationsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ items: [] });
  });

  test('notifications POST accepts object body and reads existing file', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('[]');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const req = { method: 'POST', body: { title: 't' } };
    const res = makeRes();
    notificationsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test('notifications POST accepts missing body and reads existing file', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('[]');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const req = { method: 'POST' };
    const res = makeRes();
    notificationsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test('notifications POST falls back to an empty array for blank file contents', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const req = { method: 'POST', body: { title: 't' } };
    const res = makeRes();
    notificationsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test('transactions GET handles missing query safely', () => {
    const req = { method: 'GET', query: undefined };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test('transactions POST rejects invalid amount strings', () => {
    const req = { method: 'POST', body: { title: 'x', amount: 'abc', category: 'a', date: '2020-01-01' } };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('transactions POST accepts a missing body and still validates', () => {
    const req = { method: 'POST' };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('transactions POST accepts object body (not string)', () => {
    const req = { method: 'POST', body: { title: 'x', amount: 10, category: 'a', date: '2020-01-01' } };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test('transactions PUT returns 400 when id missing', () => {
    const req = { method: 'PUT', query: {} };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('transactions PUT tolerates a missing query object', () => {
    const req = { method: 'PUT', query: undefined };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('transactions PUT covers both fallback and replacement fields', () => {
    const createReq = {
      method: 'POST',
      body: { title: 'Orig', amount: '100', category: 'X', date: '2026-05-19' },
    };
    const createRes = makeRes();
    transactionsHandler(createReq, createRes);
    const id = createRes.json.mock.calls[0][0].data.id;

    const fallbackRes = makeRes();
    transactionsHandler({ method: 'PUT', query: { id }, body: {} }, fallbackRes);
    expect(fallbackRes.status).toHaveBeenCalledWith(200);

    const replaceRes = makeRes();
    transactionsHandler(
      { method: 'PUT', query: { id }, body: { title: 'New Title', amount: '75' } },
      replaceRes,
    );
    expect(replaceRes.status).toHaveBeenCalledWith(200);
  });

  test('transactions DELETE returns 400 when id missing', () => {
    const req = { method: 'DELETE', query: {} };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('transactions DELETE tolerates a missing query object', () => {
    const req = { method: 'DELETE', query: undefined };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
