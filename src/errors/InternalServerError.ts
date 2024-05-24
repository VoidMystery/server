export class InternalServerError extends Error{
    public status;
    constructor(public reason: string){
        super("Internal Server Error")
        this.status = 500;
        this.reason = reason;
    }
}