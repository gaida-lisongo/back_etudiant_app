"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    constructor() {
        console.log('Controller initialized');
    }
    sendResponse(res, { status = 200, success = true, message = '', data = null }) {
        return res.status(status).json(Object.assign({ success,
            message }, (data && { data })));
    }
    success(res, data, message = 'Success') {
        return this.sendResponse(res, {
            status: 200,
            success: true,
            message,
            data
        });
    }
    created(res, data, message = 'Created') {
        return this.sendResponse(res, {
            status: 201,
            success: true,
            message,
            data
        });
    }
    badRequest(res, message = 'Bad Request') {
        return this.sendResponse(res, {
            status: 400,
            success: false,
            message
        });
    }
    unauthorized(res, message = 'Unauthorized') {
        return this.sendResponse(res, {
            status: 401,
            success: false,
            message
        });
    }
    notFound(res, message = 'Not Found') {
        return this.sendResponse(res, {
            status: 404,
            success: false,
            message
        });
    }
    serverError(res, error) {
        console.error('Server Error:', error);
        return this.sendResponse(res, {
            status: 500,
            success: false,
            message: 'Internal Server Error'
        });
    }
}
exports.default = Controller;
