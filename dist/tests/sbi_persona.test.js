"use strict";
// 20480061595
// 20141090306
// 20552070110
// 20603565062
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
const sbi_persona_req_1 = require("../requesters/sbi_persona.req");
jest.setTimeout(50000);
describe('DNIS from 4 persons', () => {
    const rucs = [
        '20480061595',
        // '20141090306',
        // '20552070110',
        // '20603565062',
    ];
    const requester = new sbi_persona_req_1.SbiPersonaRequester('andy.garcia@frsoluciones.com', 'D1UdOKCz**');
    let data_person;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        data_person = yield requester.fetch_bulk_data(rucs);
    }));
    it('should be normal', () => {
        console.log(data_person);
    });
});
