/**
 *
 * @param response {HTTP Response} Response provided by a request
 * @returns {Promise<string>} Promise with html string parsed to UTF-8 encoding
 */
export declare const getUtf8Text: (response: Response) => Promise<string>;
