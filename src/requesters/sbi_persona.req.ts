import { load } from "cheerio";
import { IAddress, IConsultaRucv1, IEmployees, ILocal } from "../utils/interfaces";
import { sleep } from "../utils/utils";
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
  numero: string,
  plan?: string,
  operador?: string
  observacion?: string,
}

export interface IEmail {
  email: string,
}

export interface ISBIPhones {
  dni: string,
  telefonos: IPhone[]
}

export interface ISBIEmails {
  dni: string,
  emails: IEmail[]
}

export interface IPerson {
  nombre_completo: string,
  fecha_nacimiento: string,
  sexo: string,
  estado_civil: string,
  direccion: Omit<IAddress, 'direccion'>
  lugar_nacimiento: Omit<IAddress, 'direccion'>
}

export interface ISBIPerson extends IPerson {
  dni: string,
  phones?: ISBIPhones
  emails?: ISBIEmails
}

let SESSION_KEY = "";

export class SbiPersonaRequester extends BaseRequester<string, IPerson> {
  private base_url: string;
  private base_url_login: string;
  private method: string;
  private headers: any;
  private headers_login: any;
  private payload_login: any;
  private payload_numeros: any;
  private payload_correos: any;

  constructor(sbi_user: string, sbi_password: string) {
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

  async get_sbi_key() {
    const response = await fetch(this.base_url_login, {
      method: this.method,
      // headers: this.headers,
      body: this.payload_login,
    })
    if (!response.ok)
      throw new Error(`Error login in SBI`);

    const {data} = await response.json();

    return data.session_key;
  }

  async fetch_bulk_person_phone(documents: {documento: string, numero: string}[]): Promise<Record<string, ISBIPerson>> {
    if (SESSION_KEY == "") SESSION_KEY = await this.get_sbi_key();

    this.payload_numeros["session_key"] = SESSION_KEY;
    this.payload_numeros["documentos"] = documents;

    const response_phones = await fetch(this.base_url, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.payload_numeros),
    });

    if (!response_phones.ok) {
      throw new Error(`The request was rejected by ${this.base_url}`);
    }

    const { data: data_phones }: { data: IResponseSBIPersonaNumero[] } = await response_phones.json();

    if (data_phones.length <= 0){
      throw new Error(`There is not information of phones ${this.base_url}`);
    }

    const data_by_dni: Record<string, ISBIPerson> = data_phones.reduce((prev, current, index) => {
      if (!prev[current.documento]){
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
        }
        prev[current.documento].phones = {
          dni: current.documento,
          telefonos: [{numero: current.codigo, operador: current.empresa, plan: current.plan, observacion: current.obs}],
        }
      } else {
        prev[current.documento].phones?.telefonos.push({
          numero: current.codigo,
          operador: current.empresa,
          plan: current.plan,
          observacion: current.obs
        })
      };
      return prev;
    }, {} as Record<string, ISBIPerson>)

    return data_by_dni;
  }

  async fetch_bulk_email(documents: {documento: string, numero: string}[]): Promise<Record<string, ISBIEmails>> {
    try {
      this.payload_correos["session_key"] = SESSION_KEY;
      this.payload_correos["documentos"] = documents;

      const response_correos = await fetch(this.base_url, {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(this.payload_correos),
      });

      if (!response_correos.ok) {
        console.log(this.payload_numeros)
        throw new Error(`The request was rejected by ${this.base_url}`);
      }

      const { data: data_correos }: { data: IResponseSBIPersonaCorreo[] } = await response_correos.json();

      if (data_correos.length <= 0){
        throw new Error(`There is not information ${this.base_url}`);
      }

      const correos_by_dni = data_correos.reduce((prev, current, index) => {
        if (!prev[current.documento]) {
          prev[current.documento] = {
            dni: current.documento,
            emails: [{email: current.correo}]
          };
        } else {
          prev[current.documento].emails.push;
        }
        return prev;
      }, {} as Record<string, ISBIEmails>)

      return correos_by_dni;
    } catch (e) {
      throw e;
    }
  }

  public async fetch_data(data: string): Promise<any> {
    return {}
  }

  public async fetch_bulk_data(data: string[]): Promise<ISBIPerson[]> {
    if (SESSION_KEY == "") SESSION_KEY = await this.get_sbi_key();
    const documents = data.map((item) => ({
      documento: item,
      numero: "",
    }));

    const list_partial_person_phone = await this.fetch_bulk_person_phone(documents);

    await sleep(15);
    const list_partial_email = await this.fetch_bulk_email(documents);

    Object.entries(list_partial_email).forEach(([key, value]) => {
      if (list_partial_email[key]) {
        list_partial_person_phone[key].emails = list_partial_email[key];
      }
    })

    return Object.values(list_partial_person_phone);
  }

}
