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

  test('notifications GET reads existing file', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('[]');
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

  test('transactions GET handles missing query safely', () => {
    const req = { method: 'GET', query: undefined };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
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

  test('transactions DELETE returns 400 when id missing', () => {
    const req = { method: 'DELETE', query: {} };
    const res = makeRes();
    transactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
