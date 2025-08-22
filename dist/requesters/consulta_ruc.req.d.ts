import { IConsultaRuc } from '../utils/interfaces';
export declare abstract class BaseRequester<T, U> {
    /**
     *
     * @param data - The business RUC (11 digits) or DNI (8 digits)
     * @returns - List of information of businesses related to the input provided
     */
    abstract fetch_data(data: T): Promise<U[]>;
}
export declare class BusinnessRequesterByRUC extends BaseRequester<string, IConsultaRuc> {
    private base_url;
    private method;
    private headers;
    private payload_general;
    private payload_trabajadores;
    private payload_locales;
    constructor();
    private parseWorkers;
    private parseUbication;
    private parseLocales;
    private parseEconomicActivity;
    private parseBusiness;
    /**
     *
     * @param data - The business RUC - number 11 digits
     * @returns - The information of the business
     */
    getBusinessInformationByRUC(data: string): Promise<IConsultaRuc>;
    fetch_data(data: string): Promise<IConsultaRuc[]>;
}
export declare class BusinnessRequesterByDNI extends BusinnessRequesterByRUC {
    private request_by_dni;
    private cookie_jar;
    private updated_cookie;
    private last_request_was_error;
    constructor();
    /**
     *
     * @param dni - DNI of natural person
     * @returns - RUCS of business related to the person
     */
    getRUCsByDNI(dni: string): Promise<string[]>;
    fetch_data(data: string): Promise<IConsultaRuc[]>;
}
