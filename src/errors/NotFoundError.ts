export class NotFoundError extends Error { 
    status: number;
    constructor(message: string) {
        super(`${message} not found`);
        this.status = 404;
        this.name = "NotFoundError";
    }
}