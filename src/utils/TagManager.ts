export class TagManager<T> {
    private readonly tags: Map<T, Set<string>> = new Map();

    addTag(item: T, tag: string): void {
        if (!this.tags.has(item)) {
            this.tags.set(item, new Set());
        }
        this.tags.get(item)!.add(tag);
    }

    removeTag(item: T, tag: string): void {
        if (this.tags.has(item)) {
            this.tags.get(item)!.delete(tag);
            if (this.tags.get(item)!.size === 0) {
                this.tags.delete(item);
            }
        }
    }

    getTags(item: T): string[] {
        return this.tags.has(item) ? Array.from(this.tags.get(item)!) : [];
    }
}