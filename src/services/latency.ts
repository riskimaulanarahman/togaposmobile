export async function withLatency<T>(payload: T, ms = 320): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return payload;
}
