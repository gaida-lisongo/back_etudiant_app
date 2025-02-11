"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Model {
    constructor(db) {
        this.db = db;
    }
    formatResponse(success, message, data) {
        return Object.assign({ status: success ? 'success' : 'error', message }, (data && { data }));
    }
    executeQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.db.execute(query, params);
                return this.formatResponse(true, 'Query executed successfully', result);
            }
            catch (error) {
                return this.formatResponse(false, error.message);
            }
        });
    }
}
exports.default = Model;
