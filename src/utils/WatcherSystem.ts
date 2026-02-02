export class WatcherSystem<T, U> {
    private readonly watchers: Map<T, U[]> = new Map();

    watch(target: T, user: U): void {
        if (!this.watchers.has(target)) {
            this.watchers.set(target, []);
        }
        const users = this.watchers.get(target)!;
        if (!users.includes(user)) {
            users.push(user);
        }
    }

    unwatch(target: T, user: U): void {
        const users = this.watchers.get(target);
        if (users) {
            const index = users.indexOf(user);
            if (index !== -1) {
                users.splice(index, 1);
            }
            if (users.length === 0) {
                this.watchers.delete(target);
            }
        }
    }

    getWatchers(target: T): U[] {
        return this.watchers.get(target) || [];
    }
}
