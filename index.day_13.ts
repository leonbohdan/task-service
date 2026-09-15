import { createHash } from "crypto";

const STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export type RequestStatus = (typeof STATUS)[keyof typeof STATUS];

export interface IdempotentRecord<R> {
  hash: string;
  status: RequestStatus;
  response?: R;
  createdAt: number;
}

export class IdempotencyManager<R> {
  private storage = new Map<string, IdempotentRecord<R>>();

  static canonicalize(value: unknown): unknown {
    if (value === null || typeof value !== "object") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.canonicalize(item));
    }

    return Object.fromEntries(
      Object.keys(value)
        .toSorted()
        .map((key) => [
          key,
          this.canonicalize((value as Record<string, unknown>)[key]),
        ]),
    );
  }

  static hashPayload(payload: unknown): string {
    const canonicalized = this.canonicalize(payload);

    return createHash("sha256")
      .update(JSON.stringify(canonicalized))
      .digest("hex");
  }

  public async execute(
    key: string,
    payload: unknown,
    action: () => Promise<R>,
  ): Promise<{ data: R; fromCache: boolean }> {
    const hash = IdempotencyManager.hashPayload(payload);
    const record = this.storage.get(key);

    if (record) {
      if (record.hash !== hash) {
        throw new Error(
          "Bad Request: Idempotency key reused with different payload",
        );
      }

      if (record?.status === STATUS.PENDING) {
        throw new Error("Concurrent operation in progress");
      }

      if (record?.status === STATUS.COMPLETED) {
        return { data: record.response, fromCache: true };
      }

      if (record?.status === STATUS.FAILED) {
        throw new Error("Operation failed previously");
      }
    }

    this.storage.set(key, {
      hash,
      status: STATUS.PENDING,
      createdAt: Date.now(),
    });

    try {
      const response = await action();

      this.storage.set(key, {
        hash,
        status: STATUS.COMPLETED,
        response,
        createdAt: Date.now(),
      });

      return { data: response, fromCache: false };
    } catch (error) {
      this.storage.set(key, {
        hash,
        status: STATUS.FAILED,
        createdAt: Date.now(),
      });
      throw error;
    }
  }
}

async function testIdempotency() {
  const manager = new IdempotencyManager<{
    transactionId: string;
    amount: number;
  }>();

  let actualExecutionCount = 0;
  const processPayment = async (orderId: string, amount: number) => {
    actualExecutionCount++;
    console.log(
      `[Business Logic] Actual debit of $${amount} for order ${orderId}...`,
    );
    return { transactionId: `tx-${Date.now()}`, amount };
  };

  const key = "client-req-uuid-999";
  const payload = { orderId: "ord-42", amount: 150 };

  console.log("--- Attempt 1: First call ---");
  const res1 = await manager.execute(key, payload, () =>
    processPayment("ord-42", 150),
  );
  console.log("Result 1:", res1);

  console.log("--- Attempt 2: Repeat call due to network failure ---");
  // Same key and payload (even if the key order is different)
  const res2 = await manager.execute(
    key,
    { amount: 150, orderId: "ord-42" },
    () => processPayment("ord-42", 150),
  );
  console.log("Result 2 (from cache):", res2);

  console.assert(
    actualExecutionCount === 1,
    "CRITICAL ERROR: Business logic called twice!",
  );
  console.assert(
    res2.fromCache === true,
    "Error: res2 should have returned from cache!",
  );
  console.assert(
    res1.data.transactionId === res2.data.transactionId,
    "Error: Transaction IDs must match!",
  );

  console.log("✅ Idempotency manager test passed!");
}

testIdempotency();
