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
exports.sendSMS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SMS_CONFIG = {
    SERVER: "https://app.sms8.io",
    API_KEY: "4c2f4abe7f4ac377813528e1fbc93d43697c9047",
    DEVICE_ID: "2017",
    DEVICE_SLOT: "1", // Updated to 1 from 0
    TYPE: "sms",
    PRIORITIZE: "0"
};
const sendSMS = (phoneNumber, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Format the URL exactly as provided
        const url = `${SMS_CONFIG.SERVER}/services/send.php?key=${SMS_CONFIG.API_KEY}&number=${encodeURIComponent(phoneNumber)}&message=${encodeURIComponent(message)}&devices=${SMS_CONFIG.DEVICE_ID}%7C${SMS_CONFIG.DEVICE_SLOT}&type=${SMS_CONFIG.TYPE}&prioritize=${SMS_CONFIG.PRIORITIZE}`;
        const response = yield fetch(url);
        const responseText = yield response.text();
        console.log('SMS Response:', responseText);
        try {
            return JSON.parse(responseText);
        }
        catch (e) {
            return { raw: responseText };
        }
    }
    catch (error) {
        console.error('SMS sending failed:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
exports.sendSMS = sendSMS;
// Usage example:
// await sendSMS('+243813333962', 'Hello from API');
