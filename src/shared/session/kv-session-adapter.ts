export function cloudflareKVStorage<T>(
  kv: KVNamespace,
  keyPrefix = "session:"
) {
  return {
    async read(key: string): Promise<T | undefined> {
      const value = await kv.get<T>(keyPrefix + key, "json");
      return value ?? undefined;
    },
    async write(key: string, value: T): Promise<void> {
      await kv.put(keyPrefix + key, JSON.stringify(value));
    },
    async delete(key: string): Promise<void> {
      await kv.delete(keyPrefix + key);
    },
  };
}
