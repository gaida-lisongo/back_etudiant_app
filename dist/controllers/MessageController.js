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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Controller_1 = __importDefault(require("./Controller"));
dotenv_1.default.config();
const SMS_CONFIG = {
    SERVER: process.env.SMS_SERVER || "https://app.sms8.io",
    API_KEY: process.env.SMS_API_KEY || "4c2f4abe7f4ac377813528e1fbc93d43697c9047",
    USE_SPECIFIED: 0,
    USE_ALL_DEVICES: 1,
    USE_ALL_SIMS: 2
};
class MessageController extends Controller_1.default {
    sendRequest(url, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${SMS_CONFIG.SERVER}${url}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(Object.assign({ key: SMS_CONFIG.API_KEY }, postData))
                });
                // Log raw response for debugging
                const responseText = yield response.text();
                console.log('Raw API Response:', responseText);
                // Try parsing as JSON, but don't fail if it's not JSON
                let result;
                try {
                    result = JSON.parse(responseText);
                    return result.data || result;
                }
                catch (parseError) {
                    // If not JSON, return the raw response
                    return {
                        raw: responseText,
                        status: response.status,
                        statusText: response.statusText
                    };
                }
            }
            catch (error) {
                // Only throw for network/fetch errors
                console.error('Request failed:', error);
                throw new Error(`SMS API Error: ${error.message}`);
            }
        });
    }
    sendMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ number, message, device = 2017, schedule, isMMS = "sms", attachments = "https://example.com/images/footer-logo.png,https://example.com/downloads/sms-gateway/images/section/create-chat-bot.png" }) {
            try {
                if (!number || !message) {
                    return { code: 500, result: null, message: 'Number and message are required' };
                }
                const result = yield this.sendRequest('/services/send.php', {
                    number,
                    message,
                    devices: device,
                    schedule: schedule || null,
                    type: isMMS ? 'mms' : 'sms',
                    attachments: attachments || null
                });
                return { code: 200, result: result.messages[0], message: 'Message sent successfully' };
            }
            catch (error) {
                console.error('Error sending message:', error);
                return { code: 500, result: null, message: error instanceof Error ? error.message : 'An unknown error occurred' };
            }
        });
    }
    getMessageById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                if (!id) {
                    return { code: 400, result: null, message: 'Message ID is required' };
                }
                const result = yield this.sendRequest('/services/read-messages.php', { id });
                return { code: 200, result: result.messages[0], message: 'Message retrieved successfully' };
            }
            catch (error) {
                console.error('Error getting message:', error);
                return { code: 500, result: null, message: error instanceof Error ? error.message : 'An unknown error occurred' };
            }
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.sendRequest('/services/send.php', {});
                const balance = result.credits || 'Unlimited';
                return { code: 200, result: { balance }, message: 'Balance retrieved successfully' };
            }
            catch (error) {
                console.error('Error getting balance:', error);
                return { code: 500, result: null, message: error instanceof Error ? error.message : 'An unknown error occurred' };
            }
        });
    }
    getDevices() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Get Devices");
            try {
                const result = yield this.sendRequest('/services/get-devices.php', {});
                return {
                    code: 200,
                    result: result.devices,
                    message: 'Devices retrieved successfully'
                };
            }
            catch (error) {
                console.error('Error getting devices:', error);
                return {
                    code: 500,
                    result: null,
                    message: error instanceof Error ? error.message : 'An unknown error occurred'
                };
            }
        });
    }
}
exports.default = MessageController;
