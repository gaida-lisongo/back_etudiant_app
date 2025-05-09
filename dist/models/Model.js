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
const BASE_URL = "https://modal.inbtp.net/?";
let params = null;
let sql = null;
class Model {
    constructor() {
        console.log('Model initialized:', BASE_URL);
    }
    formatResponse(success, message, data) {
        return Object.assign({ status: success ? 'success' : 'error', message }, (data && { data }));
    }
    executeQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Send to BASE_URL request with params and sql like this:https://modal.inbtp.net/?params=[1]&sql=SELECT%20*%20FROM%20agent%20WHERE%20id_grade=?
                //sql is SELECT%20*%20FROM%20agent%20WHERE%20id_grade=?
                //and params is [1]
                // all reponse are this forme example:[{"id":151,"nom":"Lisongo","post_nom":"Baita","prenom":"Gaida","sexe":"M","matricule":"2025-1708","grade":"LICENCE","id_grade":1,"statut":"PERMANANT","mdp":null,"telephone":null,"adresse":null,"e_mail":null,"avatar":null,"date_naiss":"2021-03-03","solde":null}]
                const encodedParams = encodeURIComponent(JSON.stringify(params));
                const encodedSql = encodeURIComponent(query);
                const url = `${BASE_URL}params=${encodedParams}&sql=${encodedSql}`;
                const response = yield fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                return this.formatResponse(true, 'Query executed successfully', data);
            }
            catch (error) {
                return this.formatResponse(false, error.message);
            }
        });
    }
}
exports.default = Model;
