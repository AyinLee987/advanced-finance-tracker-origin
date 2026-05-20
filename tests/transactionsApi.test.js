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

describe('transactions API handler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles preflight and unsupported methods', () => {
    const handler = loadHandler();

    const optionsResponse = makeResponse();
    handler({ method: 'OPTIONS' }, optionsResponse);
    expect(optionsResponse.statusCode).toBe(200);
    expect(optionsResponse.ended).toBe(true);

    const methodResponse = makeResponse();
    handler({ method: 'PATCH' }, methodResponse);
    expect(methodResponse.statusCode).toBe(405);
    expect(methodResponse.body).toEqual({ error: 'Method not allowed' });
  });

  it('supports the CRUD lifecycle and query filters', () => {
    const handler = loadHandler();

    const createResponse = makeResponse();
    handler(
      {
        method: 'POST',
        body: {
          title: 'Freelance Payment',
          amount: '1200',
          category: 'Business',
          date: '2026-05-19',
        },
      },
      createResponse,
    );

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.title).toBe('Freelance Payment');

    const createdId = createResponse.body.data.id;

    const defaultGetResponse = makeResponse();
    handler({ method: 'GET', query: {} }, defaultGetResponse);
    expect(defaultGetResponse.statusCode).toBe(200);
    expect(defaultGetResponse.body.total).toBe(1);
    expect(defaultGetResponse.body.filtered).toBe(1);

    const filteredByCategory = makeResponse();
    handler(
      { method: 'GET', query: { category: 'Business' } },
      filteredByCategory,
    );
    expect(filteredByCategory.body.filtered).toBe(1);

    const filteredByType = makeResponse();
    handler(
      { method: 'GET', query: { type: 'income' } },
      filteredByType,
    );
    expect(filteredByType.body.filtered).toBe(1);

    const emptyTypeFilter = makeResponse();
    handler(
      { method: 'GET', query: { type: 'expense' } },
      emptyTypeFilter,
    );
    expect(emptyTypeFilter.body.filtered).toBe(0);

    const searchFilter = makeResponse();
    handler(
      { method: 'GET', query: { search: 'freelance' } },
      searchFilter,
    );
    expect(searchFilter.body.filtered).toBe(1);

    const missingIdResponse = makeResponse();
    handler({ method: 'PUT', query: {}, body: {} }, missingIdResponse);
    expect(missingIdResponse.statusCode).toBe(400);
    expect(missingIdResponse.body).toEqual({
      success: false,
      error: 'Missing id parameter',
    });

    const notFoundResponse = makeResponse();
    handler(
      { method: 'PUT', query: { id: 'missing' }, body: {} },
      notFoundResponse,
    );
    expect(notFoundResponse.statusCode).toBe(404);

    const updateResponse = makeResponse();
    handler(
      {
        method: 'PUT',
        query: { id: createdId },
        body: {
          title: 'Updated Payment',
          amount: '-45',
          category: 'Food',
          date: '2026-05-20',
        },
      },
      updateResponse,
    );
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.data.title).toBe('Updated Payment');
    expect(updateResponse.body.data.amount).toBe(-45);

    const deleteMissingIdResponse = makeResponse();
    handler({ method: 'DELETE', query: {} }, deleteMissingIdResponse);
    expect(deleteMissingIdResponse.statusCode).toBe(400);

    const deleteNotFoundResponse = makeResponse();
    handler(
      { method: 'DELETE', query: { id: 'missing' } },
      deleteNotFoundResponse,
    );
    expect(deleteNotFoundResponse.statusCode).toBe(404);

    const deleteResponse = makeResponse();
    handler({ method: 'DELETE', query: { id: createdId } }, deleteResponse);
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.data.id).toBe(createdId);

    const afterDeleteResponse = makeResponse();
    handler({ method: 'GET', query: {} }, afterDeleteResponse);
    expect(afterDeleteResponse.body.total).toBe(0);
    expect(afterDeleteResponse.body.filtered).toBe(0);
  });

  it('returns validation and parse errors for bad input', () => {
    const handler = loadHandler();

    const validationResponse = makeResponse();
    handler(
      {
        method: 'POST',
        body: { title: ' ', amount: 0, category: '', date: '' },
      },
      validationResponse,
    );
    expect(validationResponse.statusCode).toBe(400);
    expect(validationResponse.body.errors).toEqual(
      expect.objectContaining({
        title: 'Title is required.',
        amount: 'Enter a valid amount.',
        category: 'Select a category.',
        date: 'Pick a date.',
      }),
    );

    const malformedResponse = makeResponse();
    handler({ method: 'POST', body: '{' }, malformedResponse);
    expect(malformedResponse.statusCode).toBe(500);
    expect(malformedResponse.body).toEqual({
      error: 'Internal server error',
    });
  });
});