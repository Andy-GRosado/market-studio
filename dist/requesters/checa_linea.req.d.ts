import { IChecaTuLinea } from '../utils/interfaces';
export declare abstract class BaseRequester<T, U> {
    abstract fetch_data(data: T): Promise<U>;
}
export declare class ChecaTuLineaRequester extends BaseRequester<string, IChecaTuLinea> {
    private base_url;
    private method;
    private headers;
    private payload;
    constructor();
    countByCompany(list_phones: {
        id: string;
        type: string;
        number: string;
        company: string;
    }[]): any[];
    transformData(list_phones: string[][]): {
        id: string;
        type: string;
        number: string;
        company: string;
    }[];
    fetch_data(ruc: string): Promise<IChecaTuLinea>;
}
