export class BaseEntity {
    protected id: number;
    protected createdAt: Date;
    private static totalEntities: number = 0;

    constructor(id: number) {
        this.id = id;
        this.createdAt = new Date();
        BaseEntity.totalEntities += 1;
    }

    getId(): number {
        return this.id;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    static getTotalEntities(): number {
        return BaseEntity.totalEntities;
    }
}


