/**
 * Run side effects (e.g. handover emails) only after the surrounding transaction commits.
 *
 * installAfterCommitHooks(pool) wraps every pooled client's promise-style query():
 *   - COMMIT              -> run queued callbacks after the commit succeeds
 *   - ROLLBACK            -> drop queued callbacks
 *   - SAVEPOINT x         -> remember the queue length
 *   - ROLLBACK TO x       -> drop callbacks queued since that savepoint
 *   - client.release()    -> run anything still queued (client was used without a transaction)
 *
 * runAfterCommit(db, fn): if `db` is a pooled client, queue fn; if it is the pool itself, run now.
 */

const QUEUE = Symbol('afterCommitQueue');
const SAVEPOINTS = Symbol('afterCommitSavepoints');
const WRAPPED = Symbol('afterCommitWrapped');

const runAll = (callbacks) => {
  for (const fn of callbacks) {
    Promise.resolve()
      .then(fn)
      .catch((err) => console.error('[afterCommit] callback failed:', err));
  }
};

const flush = (client) => {
  const pending = client[QUEUE] || [];
  client[QUEUE] = [];
  client[SAVEPOINTS] = new Map();
  runAll(pending);
};

const discard = (client) => {
  client[QUEUE] = [];
  client[SAVEPOINTS] = new Map();
};

const sqlText = (arg) => (typeof arg === 'string' ? arg : arg && typeof arg.text === 'string' ? arg.text : '');

const wrapClient = (client) => {
  if (client[WRAPPED]) return;
  client[WRAPPED] = true;
  client[QUEUE] = [];
  client[SAVEPOINTS] = new Map();

  const originalQuery = client.query.bind(client);
  client.query = (...args) => {
    // Callback-style calls (used internally by pg-pool for pool.query) pass straight through.
    if (typeof args[args.length - 1] === 'function') return originalQuery(...args);

    const text = sqlText(args[0]).trim();
    const savepoint = text.match(/^SAVEPOINT\s+("?[\w$]+"?)/i);
    const rollbackTo = text.match(/^ROLLBACK\s+TO\s+(?:SAVEPOINT\s+)?("?[\w$]+"?)/i);

    if (savepoint) {
      client[SAVEPOINTS].set(savepoint[1], client[QUEUE].length);
      return originalQuery(...args);
    }
    if (rollbackTo) {
      return originalQuery(...args).then((res) => {
        const mark = client[SAVEPOINTS].get(rollbackTo[1]);
        if (mark !== undefined) client[QUEUE].length = mark;
        return res;
      });
    }
    if (/^(COMMIT|END)\b/i.test(text)) {
      return originalQuery(...args).then((res) => {
        flush(client);
        return res;
      });
    }
    if (/^(ROLLBACK|ABORT)\b/i.test(text)) {
      discard(client);
      return originalQuery(...args);
    }
    return originalQuery(...args);
  };
};

export const installAfterCommitHooks = (pool) => {
  pool.on('connect', wrapClient);
  pool.on('release', (_err, client) => {
    if (client && client[QUEUE] && client[QUEUE].length > 0) flush(client);
  });
};

export const runAfterCommit = (db, fn) => {
  if (db && db[WRAPPED]) {
    db[QUEUE].push(fn);
  } else {
    runAll([fn]);
  }
};
