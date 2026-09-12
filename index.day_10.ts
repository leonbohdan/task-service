export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  shouldRetry?: (error: unknown) => boolean;
}

export async function retryWithBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (
        attempt === options.maxRetries ||
        (options.shouldRetry && !options.shouldRetry(error))
      ) {
        throw error;
      }

      const maxAttemptDelay = Math.min(
        options.baseDelayMs * Math.pow(2, attempt),
        options.maxDelayMs,
      );

      const delay = Math.floor(Math.random() * maxAttemptDelay);

      console.log(
        `[Спроба #${attempt + 1} невдала] ` +
          `Експоненційний ліміт: ${maxAttemptDelay}ms | ` +
          `Обраний Jitter: ${delay}ms`,
      );

      await sleep(delay);
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function testRetryWithBackoff() {
  let attemptCount = 0;

  const unreliableOperation = async (attempt: number) => {
    attemptCount = attempt;
    if (attempt < 3) {
      throw new Error("Network error");
    }
    return "Success";
  };

  await retryWithBackoff(unreliableOperation, {
    maxRetries: 5,
    baseDelayMs: 100,
    maxDelayMs: 1000,
    shouldRetry: (error: unknown) =>
      (error as Error).message === "Network error",
  });

  console.log("Attempt count:", attemptCount);
}

// testRetryWithBackoff();

async function testRetryUtility() {
  let callCount = 0;

  const flakyNetworkCall = async (attempt: number) => {
    callCount++;

    console.log(
      `[Спроба #${attempt + 1}] Виклик операції о ${new Date().toISOString().substring(17, 23)}...`,
    );

    if (callCount < 3) {
      const err = new Error("503 Service Unavailable");
      (err as any).statusCode = 503;
      throw err;
    }

    return { status: 200, data: "Успішна відповідь!" };
  };

  console.log("--- Тестування retryWithBackoff ---");

  const startTime = Date.now();

  const result = await retryWithBackoff(flakyNetworkCall, {
    maxRetries: 4,
    baseDelayMs: 150,
    maxDelayMs: 2000,
    shouldRetry: (err: any) => err.statusCode === 503,
  });

  const totalDuration = Date.now() - startTime;

  console.log(`Результат:`, result);
  console.log(
    `Всього спроб: ${callCount}, загальний час очікування: ${totalDuration}ms`,
  );
  console.assert(callCount === 3, "Мало бути рівно 3 спроби!");
  console.log("✅ Алгоритм Exponential Backoff + Jitter працює коректно!");
}

testRetryUtility();

async function runParallelTests() {
  console.log("=== Запуск 3 паралельних клієнтів ===");
  await Promise.all([
    testRetryUtility(),
    testRetryUtility(),
    testRetryUtility(),
  ]);
}

runParallelTests();
