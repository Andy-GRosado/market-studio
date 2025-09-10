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
exports.ChecaTuLineaRequester = exports.BaseRequester = void 0;
class BaseRequester {
}
exports.BaseRequester = BaseRequester;
class ChecaTuLineaRequester extends BaseRequester {
    constructor() {
        super();
        this.base_url = 'https://checatuslineas.osiptel.gob.pe/Consultas/GetAllCabeceraConsulta/';
        this.method = 'POST';
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        this.payload = {
            'columns[0][data]': '0',
            'columns[0][name]': 'indice',
            'order[0][column]': '0',
            'order[0][dir]': 'asc',
            'length': '1000',
            'models[IdTipoDoc]': '2',
            'models[NumeroDocumento]': '20123456789',
            'models[ReCaptcha]': '03AFcWeA6430-l0mzlJAkRl4ezWPZBnfDwmhicALJPJ1cXS0i4-fXxbaxpziB-gki-xjmqrjwsd74qyyRsE1o7L_-f-SxJtSeYOI19b1mZQv3K9i1zuH2xtPYg8R7zyYcvTBliT0UITmcBnoK70z_onFY5r7eFgLlp_7MCr62zhF5WYwcRphrTz7v3BYBGMSjKFmG6UakyJowZVMg0a6iBkM33BuG7pxh17TG7n3TYJ2-9vUx4G5KKKNT_KR7qliZbIE3WfJQ5ry1VYvAWrwb0v-opQELxf443_t__V5X2rY-zhgeslCqmHPl1w5F5tpKL8Zpa1hJJy_MnwtogXEo-x1hOn2N4DuAibJxg_w3XS3jdafIhSf5drEyON8xXJlYjxdo1tKLCKjoeDJA8Yjn9Kwfsj6tU-pYLrq2r2q4dNyRskL8DVJJRzH5z6fFI9I63Rt0Uy0K4H2kX0TaJ5v0dfGHtBs6CBXZF1n7u8fCiHVn8Fpvu-Zcl4-x1cXhpCKeqNCCKn0Lz9NcJW5Iks7xG6hCX0HmR0mHgBKCNs-F1zxqP4Mwu5NZ7s6Q9-HBPXj6rtGTabW8k1q6_fcsF4uhOW_vwBfDqhGKuM_s65EOKuDvlHd-eQQuioTLtWY4rPTsSOjJ1ZPq85xSqIefXheFjFCTOw4GEb7TScFuizPjL81fDVQI3vsbPrYwh6GTftDBa_MNQhtw1Wu7RRfyRnaqhONf5YY8K6HvQrqppuw3pDcEUr6F-CclacuUyLOtxBFROCStYau0YBfXe4Bh0RWPkuNlOoGwmXt-q1RVARd1I2BU2a6Ttc5fMj86dzYOeoNpS9aF3sGpXRnBUJujCb12pD2vfm_e88YoFU0mxsExutkrYQSmXz6biU9btvzl8VPUpm-6-KiUZCewUeBssvbgamZWod34Fxy-ZNsXBUvbZU9BfBIf4qOjP9i0OeMcmHEHhAIrpYsQEyZqv',
            'models[GoogleCaptchaToken]': '03AFcWeA6430-l0mzlJAkRl4ezWPZBnfDwmhicALJPJ1cXS0i4-fXxbaxpziB-gki-xjmqrjwsd74qyyRsE1o7L_-f-SxJtSeYOI19b1mZQv3K9i1zuH2xtPYg8R7zyYcvTBliT0UITmcBnoK70z_onFY5r7eFgLlp_7MCr62zhF5WYwcRphrTz7v3BYBGMSjKFmG6UakyJowZVMg0a6iBkM33BuG7pxh17TG7n3TYJ2-9vUx4G5KKKNT_KR7qliZbIE3WfJQ5ry1VYvAWrwb0v-opQELxf443_t__V5X2rY-zhgeslCqmHPl1w5F5tpKL8Zpa1hJJy_MnwtogXEo-x1hOn2N4DuAibJxg_w3XS3jdafIhSf5drEyON8xXJlYjxdo1tKLCKjoeDJA8Yjn9Kwfsj6tU-pYLrq2r2q4dNyRskL8DVJJRzH5z6fFI9I63Rt0Uy0K4H2kX0TaJ5v0dfGHtBs6CBXZF1n7u8fCiHVn8Fpvu-Zcl4-x1cXhpCKeqNCCKn0Lz9NcJW5Iks7xG6hCX0HmR0mHgBKCNs-F1zxqP4Mwu5NZ7s6Q9-HBPXj6rtGTabW8k1q6_fcsF4uhOW_vwBfDqhGKuM_s65EOKuDvlHd-eQQuioTLtWY4rPTsSOjJ1ZPq85xSqIefXheFjFCTOw4GEb7TScFuizPjL81fDVQI3vsbPrYwh6GTftDBa_MNQhtw1Wu7RRfyRnaqhONf5YY8K6HvQrqppuw3pDcEUr6F-CclacuUyLOtxBFROCStYau0YBfXe4Bh0RWPkuNlOoGwmXt-q1RVARd1I2BU2a6Ttc5fMj86dzYOeoNpS9aF3sGpXRnBUJujCb12pD2vfm_e88YoFU0mxsExutkrYQSmXz6biU9btvzl8VPUpm-6-KiUZCewUeBssvbgamZWod34Fxy-ZNsXBUvbZU9BfBIf4qOjP9i0OeMcmHEHhAIrpYsQEyZqv'
        };
    }
    countByCompany(list_phones) {
        let final_data = [];
        let companies = list_phones.map((phone) => {
            return phone['company'];
        });
        companies = Array.from(new Set(companies));
        companies.forEach((company) => {
            let phones_by_company = list_phones.filter((value) => value['company'] === company);
            let types_by_company = phones_by_company.map((phone) => {
                if (phone['company'] === company) {
                    return phone['type'];
                }
            });
            types_by_company = Array.from(new Set(types_by_company));
            let types_list = [];
            types_by_company.forEach((type) => {
                types_list.push({ type: type, count: phones_by_company.filter((value) => value['type'] === type).length });
            });
            types_by_company = Array.from(new Set(types_by_company));
            final_data.push({ company: company, count: phones_by_company.length, lines: types_list });
        });
        return final_data;
    }
    transformData(list_phones) {
        let new_list = list_phones.map((phone) => {
            let new_obj = { id: phone[0], type: phone[1], number: phone[2], company: phone[3] };
            return new_obj;
        });
        return new_list;
    }
    fetch_data(ruc) {
        return __awaiter(this, void 0, void 0, function* () {
            this.payload['models[NumeroDocumento]'] = ruc;
            let response = yield fetch(this.base_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(this.payload).toString()
            });
            let json_response = yield response.json();
            const data_lineas = this.countByCompany(this.transformData(json_response['aaData']));
            let lineas_claro = 0;
            let lineas_entel = 0;
            let lineas_telefonica = 0;
            let lineas_bitel = 0;
            let lineas_otros = 0;
            data_lineas.forEach((current) => {
                if (current.company == "AMERICA MOVIL PERU S.A.C.") {
                    lineas_claro += current.count;
                }
                else if (current.company == "ENTEL PERU S.A.") {
                    lineas_entel += current.count;
                }
                else if (current.company == "TELEFONICA DEL PERU S.A.A.") {
                    lineas_telefonica += current.count;
                }
                else if (current.company == "VIETTEL PERU S.A.C.") {
                    lineas_bitel += current.count;
                }
                else {
                    lineas_otros += current.count;
                }
            });
            const result = {
                ruc: ruc,
                data: data_lineas,
                claro: lineas_claro,
                entel: lineas_entel,
                telefonica: lineas_telefonica,
                bitel: lineas_bitel,
                otros: lineas_bitel
            };
            return result;
        });
    }
}
exports.ChecaTuLineaRequester = ChecaTuLineaRequester;
