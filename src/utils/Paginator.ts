export class Paginator {

    paginate<T>(items: T[], page: number, size: number): T[] {
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        return items.slice(startIndex, endIndex);
    }
}
