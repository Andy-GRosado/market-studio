import { IAddress } from "../utils/interfaces";
import { BaseRequester } from "./consulta_ruc.req";
export interface IResponseSBIPersonaNumero {
    documento: string;
    nombre_completo: string;
    nacimiento: string;
    departamento: string;
    provincia: string;
    distrito: string;
    fecha_actualizacion: string;
    codigo: string;
    empresa: string;
    plan: string;
    obs: string;
    tipo: string;
    sexo: string;
    est_civil: string;
    nac_departamento: string;
    nac_provincia: string;
    nac_distrito: string;
}
export interface IResponseSBIPersonaCorreo {
    documento: string;
    correo: string;
}
export interface IPhone {
    numero: string;
    plan?: string;
    operador?: string;
    observacion?: string;
}
export interface IEmail {
    email: string;
}
export interface ISBIPhones {
    dni: string;
    telefonos: IPhone[];
}
export interface ISBIEmails {
    dni: string;
    emails: IEmail[];
}
export interface IPerson {
    nombre_completo: string;
    fecha_nacimiento: string;
    sexo: string;
    estado_civil: string;
    direccion: Omit<IAddress, 'direccion'>;
    lugar_nacimiento: Omit<IAddress, 'direccion'>;
}
export interface ISBIPerson extends IPerson {
    dni: string;
    phones?: ISBIPhones;
    emails?: ISBIEmails;
}
export declare class SbiPersonaRequester extends BaseRequester<string, IPerson> {
    private base_url;
    private base_url_login;
    private method;
    private headers;
    private headers_login;
    private payload_login;
    private payload_numeros;
    private payload_correos;
    constructor(sbi_user: string, sbi_password: string);
    get_sbi_key(): Promise<any>;
    fetch_bulk_person_phone(documents: {
        documento: string;
        numero: string;
    }[]): Promise<Record<string, ISBIPerson>>;
    fetch_bulk_email(documents: {
        documento: string;
        numero: string;
    }[]): Promise<Record<string, ISBIEmails>>;
    fetch_data(data: string): Promise<any>;
    fetch_bulk_data(data: string[]): Promise<ISBIPerson[]>;
}
