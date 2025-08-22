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
exports.getUtf8Text = void 0;
/**
 *
 * @param response {HTTP Response} Response provided by a request
 * @returns {Promise<string>} Promise with html string parsed to UTF-8 encoding
 */
const getUtf8Text = (response) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = response.headers.get('Content-Type');
    const charsetMatch = contentType === null || contentType === void 0 ? void 0 : contentType.match(/charset=([a-zA-Z0-9-]+)/);
    const charset = charsetMatch ? charsetMatch[1] : 'utf-8'; // Por defecto UTF-8 si no se encuentra el charset
    const decoder = new TextDecoder(charset);
    const decodedText = decoder.decode(yield response.arrayBuffer());
    return decodedText;
});
exports.getUtf8Text = getUtf8Text;
