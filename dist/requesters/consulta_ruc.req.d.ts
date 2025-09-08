import { IConsultaRucv1, IConsultaRucv2 as IConsultaRuc } from '../utils/interfaces';
export declare abstract class BaseRequester<T, U> {
    /**
     *
     * @param data - The business RUC (11 digits) or DNI (8 digits)
     * @returns - List of information of businesses related to the input provided
     */
    abstract fetch_data(data: T): Promise<U>;
    abstract fetch_bulk_data(data: T[]): Promise<U[]>;
}
/***
 * Default business requester
 */
export declare class BusinnessRequesterByRUC extends BaseRequester<string, IConsultaRucv1> {
    private base_url;
    private method;
    private headers;
    private payload_general;
    private payload_trabajadores;
    private payload_locales;
    private payload_rrll;
    constructor();
    private parseWorkers;
    private parseUbication;
    private parseLocales;
    private parseEconomicActivity;
    private parseLegalRepresentative;
    private parseBusiness;
    /**
     *
     * @param data - The business RUC - number 11 digits
     * @returns - The information of the business
     */
    getBusinessInformationByRUC(data: string): Promise<IConsultaRucv1>;
    fetch_data(data: string): Promise<IConsultaRucv1>;
    fetch_bulk_data(data: string[]): Promise<IConsultaRucv1[]>;
}
/***
 * Improved business requester
 */
export declare class BusinnessRequesterByRUCv2 extends BaseRequester<string, IConsultaRuc> {
    private base_url;
    private method;
    private headers;
    private payload_general;
    private payload_trabajadores;
    private payload_locales;
    private payload_rrll;
    constructor();
    private parseEconomicActivity;
    private parseUbication;
    private parseLocales;
    private parseWorkers;
    private parseLegalRepresentative;
    private parseBusiness;
    private fetch_business;
    private fetch_employees;
    private fetch_locales;
    private fetch_rrll;
    fetch_data(ruc: string): Promise<IConsultaRuc>;
    fetch_bulk_data(rucs: string[]): Promise<IConsultaRuc[]>;
}
/***
 * Experimental business requester to separate logic of request and parsing
 */
export declare class BusinnessRequesterByRUCv3 extends BaseRequester<string, IConsultaRucv1> {
    private base_url;
    private method;
    private headers;
    private payload_general;
    private payload_trabajadores;
    private payload_locales;
    private payload_rrll;
    constructor();
    private parseEconomicActivity;
    private parseUbication;
    private parseLocales;
    private parseWorkers;
    private parseLegalRepresentative;
    private parseBusiness;
    private fetch_business;
    private fetch_employees;
    private fetch_locales;
    private fetch_rrll;
    fetch_data(ruc: string): Promise<any>;
    fetch_bulk_data(rucs: string[]): Promise<any[]>;
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
    fetch_data(data: string): Promise<IConsultaRucv1>;
}
