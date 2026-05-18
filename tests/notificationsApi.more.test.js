const fs = require('fs');
const loadHandler = () => { jest.resetModules(); return require('../api/notifications.js'); };
const makeResponse = () => ({ statusCode: null, body: null, ended: false, status(code){ this.statusCode=code; return this; }, json(payload){ this.body=payload; return this; }, end(){ this.ended=true; return this; } });

describe('notifications API additional branches', () => {
  beforeEach(()=>{
    jest.spyOn(console, 'log').mockImplementation(()=>{});
    jest.spyOn(console, 'error').mockImplementation(()=>{});
  });
  afterEach(()=> jest.restoreAllMocks());

  it('GET returns empty items when file missing', () => {
    const handler = loadHandler();
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const res = makeResponse();
    handler({ method: 'GET' }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [] });
  });

  it('POST accepts string body and persists (write path)', () => {
    const handler = loadHandler();
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    // allow writeFileSync to succeed
    jest.spyOn(fs, 'writeFileSync').mockImplementation(()=>{});

    const res = makeResponse();
    handler({ method: 'POST', body: JSON.stringify({ msg: 'hello' }) }, res);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ success: true });
  });
});
