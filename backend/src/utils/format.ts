/**
 * Recursively converts Prisma Decimal instances to JavaScript numbers for API JSON responses
 */
export function formatDecimal<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Check if object is a Prisma Decimal (has toNumber() or s, e, d properties)
  if (typeof data === 'object') {
    if (typeof (data as any).toNumber === 'function') {
      return (data as any).toNumber();
    }
    if (data instanceof Date) {
      return data;
    }
    if (Array.isArray(data)) {
      return data.map((item) => formatDecimal(item)) as unknown as T;
    }
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      result[key] = formatDecimal(val);
    }
    return result as T;
  }

  return data;
}

