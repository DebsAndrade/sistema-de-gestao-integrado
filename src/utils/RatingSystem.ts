export class RatingSystem<T> {
    private readonly ratings: Map<T, number[]> = new Map();

    rate(item: T, value: number): void {
        if (value < 1 || value > 5) {
            throw new Error("Rating value must be between 1 and 5.");
        }
        if (!this.ratings.has(item)) {
            this.ratings.set(item, []);
        }
        this.ratings.get(item)!.push(value);
    }

    getAverage(item: T): number {
        const itemRatings = this.ratings.get(item);
        if (!itemRatings || itemRatings.length === 0) {
            return 0;
        }
        const total = itemRatings.reduce((sum, rating) => sum + rating, 0);
        return total / itemRatings.length;
    }

    getRatings(item: T): number[] {
        return this.ratings.get(item) || [];
    }
}
