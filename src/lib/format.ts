export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
    sizes[i]
  }`;
}

export function average<T>(values: Array<T>, p: (v: T) => number) {
  return values.length > 0
    ? values.reduce((sum, value) => sum + p(value), 0) / values.length
    : 0;
}

export function mapRecord<T, U>(
  input: Record<string, T>,
  fn: ([key, value]: [string, T]) => [string, U]
): Record<string, U> {
  return Object.fromEntries(Object.entries(input).map(fn));
}
