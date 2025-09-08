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
exports.SbiPersonaRequester = void 0;
const consulta_ruc_req_1 = require("./consulta_ruc.req");
let SESSION_KEY = "";
class SbiPersonaRequester extends consulta_ruc_req_1.BaseRequester {
    constructor(sbi_user, sbi_password) {
        super();
        this.base_url_login = "https://tubusquedaweb.online/session.php";
        this.headers_login = {
            "Host": "tubusquedaweb.online",
            "Content-Type": "aplication/json",
        };
        this.payload_login = new FormData();
        this.payload_login.append('usuario', sbi_user);
        this.payload_login.append('clave', sbi_password);
        this.payload_login.append('ops', 'login');
        // Set the request to get phone numbers
        this.base_url = "https://tubusquedaweb.online/masivo.php";
        this.method = "POST";
        this.headers = {
            "Host": "tubusquedaweb.online",
            "Content-Type": "aplication/json",
        };
        // Payload for phone numbers
        this.payload_numeros = {
            session_key: "",
            tipo: "numeros",
            documentos: [], // [{ documento: "XXXXXDNI", numero: "" }]
            cliente: "persona",
        };
        this.payload_correos = {
            session_key: "",
            tipo: "correos",
            documentos: [], // [{ documento: "XXXXXDNI", numero: "" }]
            cliente: "persona",
        };
    }
    get_sbi_key() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.base_url_login, {
                method: this.method,
                // headers: this.headers,
                body: this.payload_login,
            });
            if (!response.ok)
                throw new Error(`Error login in SBI`);
            const { data } = yield response.json();
            return data.session_key;
        });
    }
    fetch_bulk_person_phone(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            if (SESSION_KEY == "")
                SESSION_KEY = yield this.get_sbi_key();
            this.payload_numeros["session_key"] = SESSION_KEY;
            this.payload_numeros["documentos"] = documents;
            const response_phones = yield fetch(this.base_url, {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(this.payload_numeros),
            });
            if (!response_phones.ok) {
                throw new Error(`The request was rejected by ${this.base_url}`);
            }
            const { data: data_phones } = yield response_phones.json();
            if (data_phones.length <= 0) {
                throw new Error(`There is not information of phones ${this.base_url}`);
            }
            const data_by_dni = data_phones.reduce((prev, current, index) => {
                var _a;
                if (!prev[current.documento]) {
                    prev[current.documento] = {
                        dni: current.documento,
                        nombre_completo: current.nombre_completo,
                        fecha_nacimiento: current.nacimiento,
                        sexo: current.sexo,
                        estado_civil: current.est_civil,
                        direccion: {
                            departamento: current.departamento,
                            provincia: current.provincia,
                            distrito: current.distrito,
                        },
                        lugar_nacimiento: {
                            departamento: current.nac_departamento,
                            provincia: current.nac_provincia,
                            distrito: current.nac_distrito,
                        }
                    };
                    prev[current.documento].phones = {
                        dni: current.documento,
                        telefonos: [{ numero: current.codigo, operador: current.empresa, plan: current.plan, observacion: current.obs }],
                    };
                }
                else {
                    (_a = prev[current.documento].phones) === null || _a === void 0 ? void 0 : _a.telefonos.push({
                        numero: current.codigo,
                        operador: current.empresa,
                        plan: current.plan,
                        observacion: current.obs
                    });
                }
                ;
                return prev;
            }, {});
            return data_by_dni;
        });
    }
    fetch_bulk_email(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.payload_correos["session_key"] = SESSION_KEY;
                this.payload_correos["documentos"] = documents;
                const response_correos = yield fetch(this.base_url, {
                    method: this.method,
                    headers: this.headers,
                    body: JSON.stringify(this.payload_correos),
                });
                if (!response_correos.ok) {
                    console.log(this.payload_numeros);
                    throw new Error(`The request was rejected by ${this.base_url}`);
                }
                const { data: data_correos } = yield response_correos.json();
                if (data_correos.length <= 0) {
                    throw new Error(`There is not information ${this.base_url}`);
                }
                const correos_by_dni = data_correos.reduce((prev, current, index) => {
                    if (!prev[current.documento]) {
                        prev[current.documento] = {
                            dni: current.documento,
                            emails: [{ email: current.correo }]
                        };
                    }
                    else {
                        prev[current.documento].emails.push;
                    }
                    return prev;
                }, {});
                return correos_by_dni;
            }
            catch (e) {
                throw e;
            }
        });
    }
    fetch_data(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    fetch_bulk_data(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (SESSION_KEY == "")
                SESSION_KEY = yield this.get_sbi_key();
            const documents = data.map((item) => ({
                documento: item,
                numero: "",
            }));
            const list_partial_person_phone = yield this.fetch_bulk_person_phone(documents);
            const list_partial_email = yield this.fetch_bulk_email(documents);
            Object.entries(list_partial_email).forEach(([key, value]) => {
                list_partial_person_phone[key].emails = list_partial_email[key];
            });
            return Object.values(list_partial_person_phone);
        });
    }
}
exports.SbiPersonaRequester = SbiPersonaRequester;
