export class Favorites<T> {

    private readonly items: T[] = [];

    add(item: T): void {
        if (!this.exists(item)) {
            this.items.push(item);
        }
    }

    remove(item: T): void {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    exists(item: T): boolean {
        return this.items.includes(item);
    }

    getAll(): T[] {
        return [...this.items];
    }
}
