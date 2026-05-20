const loadHandler = () => { jest.resetModules(); return require('../api/log.js'); };
const makeResponse = () => ({ statusCode: null, body: null, ended: false, status(code){ this.statusCode=code; return this; }, json(payload){ this.body=payload; return this; }, end(){ this.ended=true; return this; } });

describe('log API default args', () => {
  beforeEach(()=>{
    jest.spyOn(console, 'log').mockImplementation(()=>{});
    jest.spyOn(console, 'error').mockImplementation(()=>{});
  });
  afterEach(()=> jest.restoreAllMocks());

  it('uses defaults when body lacks fields', () => {
    const handler = loadHandler();
    const res = makeResponse();
    handler({ method: 'POST', body: {} }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
