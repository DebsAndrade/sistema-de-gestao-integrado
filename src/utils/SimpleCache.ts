export class SimpleCache<K, T> {

    private readonly cache: Map<K, T>;

    constructor() {
        this.cache = new Map<K, T>();
    }

    set(key: K, value: T): void {
        this.cache.set(key, value);
    }

    get(key: K): T | undefined {
        return this.cache.get(key);
    }
}
