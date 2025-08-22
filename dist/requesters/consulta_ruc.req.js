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
exports.BusinnessRequesterByDNI = exports.BusinnessRequesterByRUC = exports.BaseRequester = void 0;
const cheerio_1 = require("cheerio");
const utils_1 = require("../utils/utils");
const tough_cookie_1 = require("tough-cookie");
const fetch_cookie_1 = __importDefault(require("fetch-cookie"));
const cookieJar = new tough_cookie_1.CookieJar();
class BaseRequester {
}
exports.BaseRequester = BaseRequester;
class BusinnessRequesterByRUC extends BaseRequester {
    constructor() {
        super();
        // Parsing the economic activity
        this.parseEconomicActivity = (raw_data) => {
            if (raw_data == undefined)
                return raw_data;
            let values = raw_data.split('-').map((item) => item.trim());
            return {
                cod: values[1],
                description: values[2]
            };
        };
        // Parsing the business data
        this.parseBusiness = (ruc, html_general, html_trabajadores, html_locales) => __awaiter(this, void 0, void 0, function* () {
            let document = (0, cheerio_1.load)(html_general);
            let data_general = document('.list-group-item');
            if (data_general.length === 0) {
                throw new Error('No data found');
            }
            let parsed_trabajadores = this.parseWorkers(html_trabajadores);
            let parsed_domicilio_fiscal = this.parseUbication(document('div:contains("Domicilio Fiscal:")').closest('.list-group-item').find('.row .col-sm-7 p').text().replace(/\s+/g, ' '));
            let parsed_actividad_economica_principal = this.parseEconomicActivity(document('div:contains("Actividad(es) Económica(s):")').closest('.list-group-item').find('tbody tr td').map((index, element) => document(element).text()).get()[0]);
            let parsed_actividad_economica_secundaria = this.parseEconomicActivity(document('div:contains("Actividad(es) Económica(s):")').closest('.list-group-item').find('tbody tr td').map((index, element) => document(element).text()).get()[1] || undefined);
            let [lastKey, lastValue] = (parsed_trabajadores && Object.entries(parsed_trabajadores).at(-1)) ? (Object.entries(parsed_trabajadores).at(-1)) : [0, -1];
            let parsed_locales = this.parseLocales(html_locales);
            let raw_data = {
                id: ruc,
                razon_social: document('div:contains("Número de RUC:")').closest('.list-group-item').find('.row .col-sm-7 h4').text().trim().split('-').slice(1).join('-').trim(),
                tipo_contribuyente: document('div:contains("Tipo Contribuyente:")').closest('.list-group-item').find('.row .col-sm-7 p').text().trim(),
                nombre_comercial: document('div:contains("Nombre Comercial:")').closest('.list-group-item').find('.row .col-sm-7 p').text().replace('Afecto al Nuevo RUS: SI', '').trim(),
                fecha_inscripcion: document('div:contains("Fecha de Inscripción:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(0).text().trim(),
                fecha_inicio_actividades: document('div:contains("Fecha de Inicio de Actividades:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(1).text().trim(),
                estado_contribuyente: document('div:contains("Estado del Contribuyente:")').closest('.list-group-item').find('.row .col-sm-7 p').text().split('Fecha')[0].trim(),
                condicion_contribuyente: document('div:contains("Condición del Contribuyente:")').closest('.list-group-item').find('.row .col-sm-7 p').text().split('Fecha')[0].trim(),
                sistema_emision_comprobante: document('div:contains("Sistema Emisión de Comprobante:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(0).text().trim(),
                actividad_exterior: document('div:contains("Actividad Comercio Exterior:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(1).text().trim(),
                domicilio_fiscal: parsed_domicilio_fiscal,
                distrito: parsed_domicilio_fiscal.distrito,
                provincia: parsed_domicilio_fiscal.provincia,
                departamento: parsed_domicilio_fiscal.departamento,
                locales: parsed_locales,
            };
            if (parsed_trabajadores) {
                raw_data.trabajadores = parsed_trabajadores;
                if (lastValue) {
                    raw_data.trabajadores_actual = lastValue;
                }
            }
            if (parsed_actividad_economica_principal) {
                raw_data.actividad_economica_principal = parsed_actividad_economica_principal;
                raw_data.actividad_economica_principal_cod = parsed_actividad_economica_principal.cod;
            }
            if (parsed_actividad_economica_secundaria) {
                raw_data.actividad_economica_secundaria = parsed_actividad_economica_secundaria;
                raw_data.actividad_economica_secundaria_cod = parsed_actividad_economica_secundaria.cod;
            }
            let possible_estado_constribuyente = ["INACTIVO", "ACTIVO", "SUSPENSION TEMPORAL", "BAJA PROVISIONAL DE OFICIO", "BAJA PROVISIONAL", "BAJA DEFINITIVA DE OFICIO", "BAJA DEFINITIVA"]
                .filter((item) => raw_data.estado_contribuyente.includes(item))[0];
            let possible_condicion_contribuyente = ["NO HABIDO", "HABIDO", "NO HALLADO"]
                .filter((item) => raw_data.condicion_contribuyente.includes(item))[0];
            raw_data.estado_contribuyente = (possible_estado_constribuyente && possible_estado_constribuyente.length > 0) ? possible_estado_constribuyente : raw_data.estado_contribuyente;
            raw_data.condicion_contribuyente = (possible_condicion_contribuyente && possible_condicion_contribuyente.length > 0) ? possible_condicion_contribuyente : raw_data.condicion_contribuyente;
            return raw_data;
        });
        this.base_url = 'https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias';
        this.method = 'POST';
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        this.payload_general = {
            accion: 'consPorRuc',
            nroRuc: '20123456789',
            token: '17weghazm68ik95e33loa9ut2ttomx0rn9b0wf6izye2tllztqy2',
            contexto: 'ti-it',
            modo: '1'
        };
        this.payload_trabajadores = {
            accion: 'getCantTrab',
            nroRuc: '20123456789',
            contexto: 'ti-it',
            modo: '1'
        };
        this.payload_locales = {
            accion: 'getLocAnex',
            nroRuc: '20123456789',
            contexto: 'ti-it',
            modo: '1',
            desRuc: ''
        };
    }
    parseWorkers(html) {
        const document = (0, cheerio_1.load)(html);
        const table = document('table.table');
        if (!table.length)
            return undefined;
        const result = {};
        table.find('tbody tr').each((_, row) => {
            const columns = document(row).find('td');
            result[document(columns[0]).text().trim()] = {
                trabajadores: parseInt(document(columns[1]).text().trim()) || 0,
                pensionistas: parseInt(document(columns[2]).text().trim()) || 0,
                prestadores_servicios: parseInt(document(columns[3]).text().trim()) || 0,
            };
        });
        return result;
    }
    ;
    parseUbication(address) {
        var _a, _b;
        const departamentos_peru = ['AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA', 'CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN', 'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS', 'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA', 'TUMBES', 'UCAYALI'];
        let result = {
            direccion: address.replace(/\s+/g, ' ').trim(),
            departamento: '',
            provincia: '',
            distrito: ''
        };
        let streams = address.split('-');
        if (streams.length >= 3) {
            result.distrito = ((_a = streams.pop()) === null || _a === void 0 ? void 0 : _a.trim()) || '-';
            result.provincia = ((_b = streams.pop()) === null || _b === void 0 ? void 0 : _b.trim()) || '-';
            result.departamento = departamentos_peru.find((item) => [...streams].join(' ').includes(item)) || '';
        }
        return result;
    }
    parseLocales(html) {
        const document = (0, cheerio_1.load)(html);
        const table = document('table.table');
        if (!table.length)
            return {
                cantidad: 0,
                locales: []
            };
        const result = { cantidad: 0, locales: [] };
        table.find('tbody tr').each((index, row) => {
            const columns = document(row).find('td');
            result.locales.push({
                codigo: document(columns[0]).text().trim(),
                tipo: document(columns[1]).text().trim(),
                ubicacion: this.parseUbication(document(columns[2]).text().trim()),
                actividad_economica: document(columns[3]).text().trim()
            });
        });
        result.cantidad = result.locales.length;
        return result;
    }
    /**
     *
     * @param data - The business RUC - number 11 digits
     * @returns - The information of the business
     */
    getBusinessInformationByRUC(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.payload_general['nroRuc'] = data;
                this.payload_trabajadores['nroRuc'] = data;
                this.payload_locales['nroRuc'] = data;
                const fetchWithCookies = (0, fetch_cookie_1.default)(fetch, cookieJar);
                let response_general = yield fetchWithCookies(this.base_url, {
                    method: this.method,
                    headers: this.headers,
                    body: new URLSearchParams(this.payload_general).toString(),
                });
                let response_trabajadores = yield fetchWithCookies(this.base_url, {
                    method: this.method,
                    headers: this.headers,
                    body: new URLSearchParams(this.payload_trabajadores).toString(),
                });
                let response_locales = yield fetchWithCookies(this.base_url, {
                    method: this.method,
                    headers: this.headers,
                    body: new URLSearchParams(this.payload_locales).toString(),
                });
                // Check if both responses are OK
                if (!response_general.ok || !response_trabajadores.ok || !response_locales.ok) {
                    throw new Error(`HTTP error! status: [${response_general.status}] [${response_trabajadores.status}] [${response_locales.status}]`);
                }
                const [html_general, html_trabajadores, html_locales] = yield Promise.all([response_general, response_trabajadores, response_locales].map((item) => (0, utils_1.getUtf8Text)(item)));
                // let html_general = await getUtf8Text(response_general);
                // let html_trabajadores = await getUtf8Text(response_trabajadores);
                // let html_locales = await getUtf8Text(response_locales);
                return yield this.parseBusiness(data, html_general, html_trabajadores, html_locales);
            }
            catch (e) {
                throw Error(`Error fetching data for RUC ${data}: ${e.message}`);
            }
        });
    }
    fetch_data(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return [yield this.getBusinessInformationByRUC(data)];
        });
    }
}
exports.BusinnessRequesterByRUC = BusinnessRequesterByRUC;
class BusinnessRequesterByDNI extends BusinnessRequesterByRUC {
    constructor() {
        super();
        this.updated_cookie = false;
        this.last_request_was_error = false;
        this.request_by_dni = {
            base_url: "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias",
            method: "POST",
            headers: {
                // 'Host': 'e-consultaruc.sunat.gob.pe',
                // 'Cookie': 'TSf3c1dbbd027=08fe7428c8ab2000d6090f871cf06e00826ff619dfe88dab88c9f87bfa939734152af257c2d890e108717e1520113000c7b34e21209efce0e7c379e82228f16157ee06dff3fa102a76ea51a9452e3233ed1602e788a61eb58448ccd746951960; ITMRCONSRUCSESSION=P10ByLtSHrQ2WVJ1Xlvppp1hQ15wh77fV2CYj72Dk5kyGjVnjXcznQS39BvgT2XlksNHjrgNJ1qdkx2YJQSMvhVLQTv499Rmv2vSL6DpGYvFq4X8Sy36Wms2YWJpDH27kHM2rpqgCNVXyQzwYNN16tVvKMZJW50RGKJp956ydsWyqwhYNkfTpqjQJGcKDcs9Qb4W7cHLG2FkpLxsGh11M1ppRMtcQ8pvmhLGJ4xMJ55GLc2KsDJWhTSYWyNtqsCv!-618065953!880433833; TS01fda901=019edc9eb8e8f9eee600cc299584f1adf5e45c587ccf4e587da6dc31374df48a9b59f2d7faaed4dd0a65ceecad2768e13bed8a3e89bac481eccc6be9a4d1955395ecd176aa; site24x7rumID=9462107562528508.1753754932532.1753754932532.0; TS61ff7286027=08d0cd49b8ab20007edc6c877b5d04f626d2dfdbe2433a0b12aaac8bd3b8b45cb3c6ce70d226541608cb566b2911300005bd2b8941b0622fa466d57564aed0f4484d7ea7822ccec38b259d6aecae41d8d5c788d6553fe56fc0bc89c64a079e70',
                // 'Content-Length': '162',
                // 'Cache-Control': 'max-age=0',
                // 'Origin': 'https://e-consultaruc.sunat.gob.pe',
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Connection': 'keep-alive'
            },
            payload: {
                accion: 'consPorTipdoc',
                nroRuc: '',
                nrodoc: '20123456789',
                token: '17weghazm68ik95e33loa9ut2ttomx0rn9b0wf6izye2tllztqy2',
                contexto: 'ti-it',
                modo: '1',
                rbtnTipo: '2',
                tipdoc: '1',
                search2: '73965302'
            }
        };
        this.cookie_jar = new tough_cookie_1.CookieJar();
        // this.cookie_jar.setCookieSync(
        //   'ITMRCONSRUCSESSION=b6MNyLlKnK7WlxBLXZxGSyLRkJRrTJM2T1yG3wl71q4hLCMk3Vnvxy3W2lRQPftFmyLvpVpTSbLkqytTGRNchnL6pw8gTxy0pkJHPNKLrSp9vbw8f1gYRyJlYPJwSpTZSWG1vHT62bwNhhh2p0Mcc15SPBJLjKDzlvcn12hLzN7gBb9l5h4frDCJjYGvsK1W6Mcy1rnTTMYJfhnps2W9B6nVxYwhW6yRyxWQygprdGsPY7nShxF2TLLvHhvgXGLk!-971700263!-1051825872',
        //   'https://e-consultaruc.sunat.gob.pe',
        // );
        // this.cookie_jar.setCookieSync(
        //   'TSf3c1dbbd027=08fe7428c8ab2000d6090f871cf06e00826ff619dfe88dab88c9f87bfa939734152af257c2d890e108717e1520113000c7b34e21209efce0e7c379e82228f16157ee06dff3fa102a76ea51a9452e3233ed1602e788a61eb58448ccd746951960',
        //   'https://e-consultaruc.sunat.gob.pe',
        // );
        // this.cookie_jar.setCookieSync(
        //   'TS01fda901=019edc9eb8e8f9eee600cc299584f1adf5e45c587ccf4e587da6dc31374df48a9b59f2d7faaed4dd0a65ceecad2768e13bed8a3e89bac481eccc6be9a4d1955395ecd176aa',
        //   'https://e-consultaruc.sunat.gob.pe',
        // );
        // this.cookie_jar.setCookieSync(
        //   'site24x7rumID=9462107562528508.1753754932532.1753754932532.0',
        //   'https://e-consultaruc.sunat.gob.pe',
        // );
        // this.cookie_jar.setCookieSync(
        //   'TS61ff7286027=08d0cd49b8ab20007edc6c877b5d04f626d2dfdbe2433a0b12aaac8bd3b8b45cb3c6ce70d226541608cb566b2911300005bd2b8941b0622fa466d57564aed0f4484d7ea7822ccec38b259d6aecae41d8d5c788d6553fe56fc0bc89c64a079e70',
        //   'https://e-consultaruc.sunat.gob.pe',
        // );
    }
    /**
     *
     * @param dni - DNI of natural person
     * @returns - RUCS of business related to the person
     */
    getRUCsByDNI(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchWithCookies = (0, fetch_cookie_1.default)(fetch, this.cookie_jar);
            // Get a validate cookie before request
            if (!this.updated_cookie || this.last_request_was_error) {
                yield fetchWithCookies(this.request_by_dni.base_url, {
                    method: 'GET'
                });
                this.updated_cookie = true;
            }
            this.request_by_dni.payload.nrodoc = dni;
            this.request_by_dni.payload.search2 = dni;
            let response_general = yield fetchWithCookies(this.request_by_dni.base_url, {
                method: this.request_by_dni.method,
                headers: this.request_by_dni.headers,
                body: new URLSearchParams(this.request_by_dni.payload).toString(),
            });
            if (!response_general.ok) {
                throw new Error('Error in the request');
            }
            const html_rucs_by_dni = yield (0, utils_1.getUtf8Text)(response_general);
            let document = (0, cheerio_1.load)(html_rucs_by_dni);
            let rucs = [];
            document('a.aRucs').each((index, element) => {
                const rucText = document(element).find('h4.list-group-item-heading').first().text().trim();
                if (rucText) {
                    // Filtrar el RUC, eliminando el prefijo "RUC:"
                    const ruc = rucText.replace('RUC:', '').trim();
                    rucs.push(ruc); // Agregamos el RUC al array
                }
            });
            return rucs;
        });
    }
    fetch_data(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate if it is a correct DNI and add pad if is necesary
            if (!Number.isInteger(Number(data))) {
                throw new Error(`Invalid input ${data}`);
            }
            else {
                data = data.padStart(8, '0');
            }
            const rucs = yield this.getRUCsByDNI(data);
            const business_information = [];
            const rucs_requested = yield Promise.allSettled(rucs.map((ruc) => this.getBusinessInformationByRUC(ruc)));
            rucs_requested.forEach(element => {
                if (element.status == 'fulfilled') {
                    business_information.push(element.value);
                }
            });
            return business_information;
        });
    }
}
exports.BusinnessRequesterByDNI = BusinnessRequesterByDNI;
