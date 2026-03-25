export class DependencyGraph<T> {
    private readonly graph: Map<T, T[]> = new Map();

    addDependency(item: T, dependsOn: T): void {
        if (!this.graph.has(item)) {
            this.graph.set(item, []);
        }
        this.graph.get(item)!.push(dependsOn);
    }

    getDependencies(item: T): T[] {
        return this.graph.get(item) || [];
    }

    hasDependencies(item: T): boolean {
        return this.graph.has(item) && this.graph.get(item)!.length > 0;
    }
}
