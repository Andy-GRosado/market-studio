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
exports.get_business = get_business;
exports.get_activo_habido = get_activo_habido;
exports.get_domocilio_fiscal = get_domocilio_fiscal;
exports.get_actividades_economicas = get_actividades_economicas;
const consulta_ruc_req_1 = require("../requesters/consulta_ruc.req");
function get_business(ruc) {
    return __awaiter(this, void 0, void 0, function* () {
        const requester = new consulta_ruc_req_1.BusinnessRequesterByRUCv2();
        const data = yield requester.fetch_data(ruc);
        return data;
    });
}
function get_activo_habido(ruc) {
    return __awaiter(this, void 0, void 0, function* () {
        const requester = new consulta_ruc_req_1.BusinnessRequesterByRUCv2();
        const data = yield requester.fetch_data(ruc);
        const response = {
            tipo_contribuyente: data.general.tipo_contribuyente,
            estado_contribuyente: data.general.estado_contribuyente,
        };
        return response;
    });
}
function get_domocilio_fiscal(ruc) {
    return __awaiter(this, void 0, void 0, function* () {
        const requester = new consulta_ruc_req_1.BusinnessRequesterByRUCv2();
        const data = yield requester.fetch_data(ruc);
        const response = data.general.domicilio_fiscal;
        return response;
    });
}
function get_actividades_economicas(ruc_1) {
    return __awaiter(this, arguments, void 0, function* (ruc, tipo = "principal") {
        const requester = new consulta_ruc_req_1.BusinnessRequesterByRUCv2();
        const data = yield requester.fetch_data(ruc);
        if (tipo == "secundaria") {
            return data.general.actividad_economica_secundaria;
        }
        return data.general.actividad_economica_principal;
    });
}
