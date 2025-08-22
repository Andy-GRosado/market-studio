"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUtf8Text = exports.BusinnessRequesterByRUC = exports.BusinnessRequesterByDNI = exports.BaseRequester = void 0;
var consulta_ruc_req_1 = require("./requesters/consulta_ruc.req");
Object.defineProperty(exports, "BaseRequester", { enumerable: true, get: function () { return consulta_ruc_req_1.BaseRequester; } });
Object.defineProperty(exports, "BusinnessRequesterByDNI", { enumerable: true, get: function () { return consulta_ruc_req_1.BusinnessRequesterByDNI; } });
Object.defineProperty(exports, "BusinnessRequesterByRUC", { enumerable: true, get: function () { return consulta_ruc_req_1.BusinnessRequesterByRUC; } });
var utils_1 = require("./utils/utils");
Object.defineProperty(exports, "getUtf8Text", { enumerable: true, get: function () { return utils_1.getUtf8Text; } });
