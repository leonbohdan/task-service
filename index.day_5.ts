let balanceWithoutMutex = 100;
let balanceWithMutex = 100;

// Classic Mutex implementation
class Mutex {
  private locked = false;
  private queue: (() => void)[] = [];

  async acquire(): Promise<() => void> {
    const release = () => {
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) next();
      } else {
        this.locked = false;
      }
    };

    if (!this.locked) {
      this.locked = true;

      return release;
    }

    await new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });

    return release;
  }

  async runExclusive<T>(callback: () => Promise<T>): Promise<T> {
    const release = await this.acquire();

    try {
      return await callback();
    } finally {
      release();
    }
  }
}

// Promise Chaining (Alternative implementation using promise chaining)
class MutexChained {
  private current: Promise<void> = Promise.resolve();

  async acquire(): Promise<() => void> {
    let release!: () => void;

    const next = new Promise<void>((resolve) => {
      release = resolve;
    });

    const wait = this.current;
    this.current = this.current.then(() => next);

    await wait;
    return release;
  }
}

const mutex = new Mutex();

// WITHOUT MUTEX
async function withdrawNoMutex(amount: number): Promise<boolean> {
  if (balanceWithoutMutex >= amount) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    balanceWithoutMutex -= amount;
    return true;
  }
  return false;
}

async function mainWithoutMutex() {
  console.log("=== Without Mutex ===");
  console.log(`Initial balance: ${balanceWithoutMutex}`);

  const results = await Promise.all([withdrawNoMutex(80), withdrawNoMutex(80)]);

  console.log("Request results:", results);
  console.log(`Final balance: ${balanceWithoutMutex}\n`);
}

// WITH MUTEX
async function withdrawWithMutex(amount: number): Promise<boolean> {
  return mutex.runExclusive(async () => {
    if (balanceWithMutex >= amount) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      balanceWithMutex -= amount;
      return true;
    }
    return false;
  });
}

async function mainWithMutex() {
  console.log("=== With Mutex ===");
  console.log(`Initial balance: ${balanceWithMutex}`);

  const results = await Promise.all([
    withdrawWithMutex(80),
    withdrawWithMutex(80),
  ]);

  console.log("Request results:", results);
  console.log(`Final balance: ${balanceWithMutex}\n`);
}

async function run() {
  await mainWithoutMutex();
  await mainWithMutex();
}

run();
