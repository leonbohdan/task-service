export type BatchFunction<K, V> = (
  keys: readonly K[],
) => Promise<(V | Error)[]>;

type QueueItem<K, V> = {
  key: K;
  resolve: (value: V) => void;
  reject: (reason?: unknown) => void;
};

export class BatchLoader<K, V> {
  constructor(private readonly batchFn: BatchFunction<K, V>) {}

  private cache: Map<K, Promise<V>> = new Map();
  private queue: QueueItem<K, V>[] = [];
  private isDispatchScheduled: boolean = false;

  public load(key: K): Promise<V> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const promise = new Promise<V>((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
    });
    this.cache.set(key, promise);

    if (!this.isDispatchScheduled) {
      this.isDispatchScheduled = true;
      queueMicrotask(() => this.dispatch());
    }

    return promise;
  }

  private dispatch(): void {
    this.isDispatchScheduled = false;
    const currentQueue = this.queue;
    this.queue = [];

    if (!currentQueue.length) {
      return;
    }

    const keys = currentQueue.map((item) => item.key);

    this.batchFn(keys)
      .then((results) => {
        results.forEach((result, index) => {
          if (result instanceof Error) {
            currentQueue[index].reject(result);
          } else {
            currentQueue[index].resolve(result);
          }
        });
      })
      .catch((error) => {
        currentQueue.forEach((item) => item.reject(error));
      });
  }

  public clear(key?: K): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Demonstration and test of the batcher
async function testBatchLoader() {
  let dbQueriesCount = 0;

  // Simulate batch fetching function from the database
  const fakeBatchFindUsers: BatchFunction<
    string,
    { id: string; name: string }
  > = async (keys) => {
    dbQueriesCount++;
    console.log(
      `[Database Query #${dbQueriesCount}] Querying the database for keys:`,
      keys,
    );

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const mockDb: Record<string, string> = {
      u1: "Alice",
      u2: "Bob",
      u3: "Charlie",
    };

    return keys.map((key) =>
      mockDb[key]
        ? { id: key, name: mockDb[key] }
        : new Error(`User ${key} not found`),
    );
  };

  const userLoader = new BatchLoader(fakeBatchFindUsers);

  console.log("--- Starting parallel calls to load() ---");
  const p1 = userLoader.load("u1");
  const p2 = userLoader.load("u2");
  const p3 = userLoader.load("u1"); // Should be taken from cache
  const p4 = userLoader.load("u3");

  const [u1, u2, u1Cached, u3] = await Promise.all([p1, p2, p3, p4]);

  console.log("Results:", { u1, u2, u1Cached, u3 });
  console.assert(
    dbQueriesCount === 1,
    "Error: Database query should have been called exactly once!",
  );
  console.assert(
    u1 === u1Cached,
    "Error: u1 and u1Cached should be the same reference (cache)!",
  );
  console.log("✅ Batcher test passed successfully!");
}

testBatchLoader();
