export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      console.log(`Attempt ${attempt} failed`);
    }
  }

  throw lastError;
}

export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    fn(),

    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Tool timeout"));
      }, timeoutMs);
    }),
  ]);
}
