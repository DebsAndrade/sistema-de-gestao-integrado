export class IdGenerator {

    private static counter: number = 0;

    static generate(): number {
        this.counter += 1;
        return this.counter;
    }
}


