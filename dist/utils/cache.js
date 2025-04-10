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
exports.cache = exports.DEFAULT_TTL = void 0;
const memjs_1 = __importDefault(require("memjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a Memcached client using environment variables or defaults
const client = memjs_1.default.Client.create(process.env.MEMCACHIER_SERVERS || 'localhost:11211', {
    username: process.env.MEMCACHIER_USERNAME || '',
    password: process.env.MEMCACHIER_PASSWORD || '',
    failover: true,
    timeout: 1,
    keepAlive: true
});
exports.DEFAULT_TTL = 60 * 5; // 5 minutes in seconds
exports.cache = {
    /**
     * Get value from cache
     */
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value } = yield client.get(key);
                if (!value)
                    return null;
                return JSON.parse(value.toString());
            }
            catch (error) {
                console.error('Cache get error:', error);
                return null;
            }
        });
    },
    /**
     * Set value in cache
     */
    set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, ttl = exports.DEFAULT_TTL) {
            try {
                const serialized = JSON.stringify(value);
                yield client.set(key, serialized, { expires: ttl });
                return true;
            }
            catch (error) {
                console.error('Cache set error:', error);
                return false;
            }
        });
    },
    /**
     * Delete value from cache
     */
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.delete(key);
                return true;
            }
            catch (error) {
                console.error('Cache delete error:', error);
                return false;
            }
        });
    },
    /**
     * Flush all cache
     */
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.flush();
                return true;
            }
            catch (error) {
                console.error('Cache flush error:', error);
                return false;
            }
        });
    }
};
