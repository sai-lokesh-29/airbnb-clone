class expressError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message || 'Internal Error';
    }
}
module.exports = expressError