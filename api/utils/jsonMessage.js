const ERROR_TYPE = {
    SYNTAX : 1001,
    SERVER : 5000,
    NOT_FOUND : 4004,
    FORBIDDEN : 4008,
}

class JsonMessage {
    constructor() {
        this.errorCode = 0;
        this.error = false;
        this.content = '';
        this.httpCode = 200;
    }

    getStatusCode() {
        return this.httpCode;
    }

    setHttpCode(code) {
        this.httpCode = code;
    }

    setError(message, code) {
        if (code > 0) this.errorCode = code;
        
        switch (code) {
            case ERROR_TYPE.SYNTAX:
                this.httpCode = 400;
                break
            case ERROR_TYPE.SERVER:
                this.httpCode = 500;
                break
            case ERROR_TYPE.NOT_FOUND:
                this.httpCode = 404;
                break
            case ERROR_TYPE.FORBIDDEN:
                this.httpCode = 401;
                break
        }

        this.error = true;
        this.content = message;
    }

    isError() {
        return this.error;
    }

    setSuccess(message) {
        this.error = false;
        this.content = message;
    }

    getMessage() {
        if (!this.error) {
            return JSON.stringify({
                content : this.content
            })
        } else {
            return JSON.stringify({
                content : this.content,
                error : this.error,
                errorCode : this.errorCode,
            });
        }
    }
}

module.exports = JsonMessage

module.exports.ERROR_TYPE = ERROR_TYPE