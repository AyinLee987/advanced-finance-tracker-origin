const loadHandler = () => {
  jest.resetModules();
  return require('../api/transactions.js');
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

describe('transactions API extra branches', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('GET with type/all and category/all returns all transactions (no-filter path)', () => {
    const handler = loadHandler();

    const createResponse = makeResponse();
    handler(
      {
        method: 'POST',
        body: {
          title: 'Side Gig',
          amount: '300',
          category: 'Misc',
          date: '2026-05-19',
        },
      },
      createResponse,
    );
    expect(createResponse.statusCode).toBe(201);

    const res = makeResponse();
    handler({ method: 'GET', query: { category: 'all', type: 'all' } }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.filtered).toBe(res.body.total);
  });

  it('PUT with partial body preserves unspecified fields (else branches)', () => {
    const handler = loadHandler();

    const createResponse = makeResponse();
    handler(
      {
        method: 'POST',
        body: {
          title: 'Partial Update Test',
          amount: '50',
          category: 'Test',
          date: '2026-05-19',
        },
      },
      createResponse,
    );
    expect(createResponse.statusCode).toBe(201);
    const id = createResponse.body.data.id;

    const updateResponse = makeResponse();
    handler({ method: 'PUT', query: { id }, body: { amount: '75' } }, updateResponse);
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.title).toBe('Partial Update Test');
    expect(updateResponse.body.data.amount).toBe(75);
  });
});
