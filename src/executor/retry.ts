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
