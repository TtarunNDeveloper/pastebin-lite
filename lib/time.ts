export function getNow(req: Request): number {
  if (process.env.TEST_MODE === "1") {
    const headerNow = req.headers.get("x-test-now-ms");
    if (headerNow) {
      const parsed = Number(headerNow);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}
