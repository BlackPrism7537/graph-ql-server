export class Context {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.userId;
    }
}