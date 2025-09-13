import { load } from "cheerio";
import { IBusiness, IBusinessEmployees, IBusinessLegalRepresentative, IBusinessLocales, IConsultaRucv2 as IConsultaRuc, IEmployees, ILegalRepresentative, ILocal, IConsultaRucv2 } from '../utils/interfaces';
import { getUtf8Text } from "../utils/utils";
import { CookieJar } from 'tough-cookie';
import fetchCookie, { FetchCookieImpl } from 'fetch-cookie';

const cookieJar = new CookieJar();

export abstract class BaseRequester<T, U> {
  /**
   *
   * @param data - The business RUC (11 digits) or DNI (8 digits)
   * @returns - List of information of businesses related to the input provided
   */
  public abstract fetch_data(data: T): Promise<U>
  public abstract fetch_bulk_data(data: T[]): Promise<U[]>
}


/***
 * Improved business requester
 */
export class BusinnessRequesterByRUCv2 extends BaseRequester<string, IConsultaRuc> {
  private cookie_jar = new CookieJar()
  private base_url: string;
  private method: string;
  private headers: any;
  private payload_general: any;
  private payload_trabajadores: any;
  private payload_locales: any;
  private payload_rrll: any;

  constructor() {
    super()
    this.base_url = 'https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias';
    this.method = 'POST';
    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    this.payload_general = {
      accion: 'consPorRuc',
      nroRuc: '20123456789',
      token: '17weghazm68ik95e33loa9ut2ttomx0rn9b0wf6izye2tllztqy2',
      contexto: 'ti-it',
      modo: '1'
    };
    this.payload_trabajadores = {
      accion: 'getCantTrab',
      modo: '1',
      contexto: 'ti-it',
      nroRuc: '20123456789',
    };
    this.payload_locales = {
      accion: 'getLocAnex',
      modo: '1',
      contexto: 'ti-it',
      desRuc: '',
      nroRuc: '20123456789',
    };
    this.payload_rrll = {
      accion: 'getRepLeg',
      modo: '1',
      contexto: 'ti-it',
      desRuc: '',
      nroRuc: '20610222171',
    }
  }

  // Parsing the economic activity
  private parseEconomicActivity(raw_data: string | undefined): { cod: string, description: string } | undefined {
    if (raw_data == undefined) return raw_data;

    let values = raw_data.split('-').map((item) => item.trim());
    return {
      cod: values[1],
      description: values[2]
    };
  };

  private parseUbication(address: string): { direccion: string, departamento: string, provincia: string, distrito: string} {
    const departamentos_peru = ['AMAZONAS', 'ANCASH', 'APURIMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA', 'PROV. CONST. DEL CALLAO', 'CUSCO', 'HUANCAVELICA', 'HUANUCO', 'ICA', 'JUNIN', 'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS', 'MOQUEGUA', 'PASCO', 'PIURA', 'PUNO', 'SAN MARTIN', 'TACNA', 'TUMBES', 'UCAYALI'];
    let result = {
      direccion: address.replace(/\s+/g, ' ').trim(),
      departamento: '',
      provincia: '',
      distrito: ''
    };
    let streams: string[] = address.split('-');
    if (streams.length >= 3) {
      result.distrito = streams.pop()?.trim() || '-';
      result.provincia = streams.pop()?.trim() || '-';

      const partial_address = [...streams].join(' ').trim();
      result.departamento = departamentos_peru.find((item) => partial_address.endsWith(item)) || '';
    }
    return result;
  }

  private parseLocales(ruc: string, html: string): IBusinessLocales {
    const document = load(html);
    const table = document('table.table');
    if (!table.length) return {
      ruc: ruc,
      cantidad: 0,
      locales: []
    };

    const result: { ruc: string, cantidad: number, locales: any[] } = { ruc: ruc, cantidad: 0, locales: [] };
    table.find('tbody tr').each((index, row) => {
      const columns = document(row).find('td');
      result.locales.push({
        codigo: document(columns[0]).text().trim(),
        tipo: document(columns[1]).text().trim(),
        ubicacion: this.parseUbication(document(columns[2]).text().trim()),
        actividad_economica: document(columns[3]).text().trim()
      })
    });
    result.cantidad = result.locales.length;
    return result;
  }

  private parseWorkers(ruc: string, html: string): IBusinessEmployees | undefined {
    const document = load(html);
    const table = document('table.table');
    if (!table.length) return undefined;

    const result: { [period: string]: IEmployees } = {};
    table.find('tbody tr').each((_, row) => {
      const columns = document(row).find('td');
      result[document(columns[0]).text().trim()] = {
        trabajadores: parseInt(document(columns[1]).text().trim()) || 0,
        pensionistas: parseInt(document(columns[2]).text().trim()) || 0,
        prestadores_servicios: parseInt(document(columns[3]).text().trim()) || 0,
      }
    });

    if (Object.values(result).length <= 0)
      return undefined

    const {
      trabajadores: last_trabajadores,
      pensionistas: last_pensionistas,
      prestadores_servicios: last_prestadores_servicios
    } = Object.values(result).at(-1) as IEmployees;

    return {
      ruc: ruc,
      trabajadores: last_trabajadores,
      pensionistas: last_pensionistas,
      prestadores_servicios: last_prestadores_servicios,
      historial: result
    };
  };

  private parseLegalRepresentative(ruc: string, html: string): IBusinessLegalRepresentative[] {
    const document = load(html);
    const list_rrll: IBusinessLegalRepresentative[] = document('tbody').find('tr').map((_, row) => {
      const values = document(row).find('td').map(((_, item) => document(item).text().replace(/\s+/g, ' ').trim())).get();
      return {
        ruc: ruc,
        tipo_documento: values.length >= 1 ? values[0] : 'NO ENCONTRADO',
        documento: values.length >= 2 ? values[1] : 'NO ENCONTRADO',
        nombre: values.length >= 3 ? values[2] : 'NO ENCONTRADO',
        cargo: values.length >= 4 ? values[3] : 'NO ENCONTRADO',
        fecha: values.length >= 5 ? values[4] : 'NO ENCONTRADO'
      }
    }).get()

    return list_rrll;
  }

  private parseBusiness(ruc: string, html_general: string): IBusiness {
    let document = load(html_general);
    let data_general = document('.list-group-item');
    if (data_general.length === 0) {
      throw new Error('No data found');
    }

    let parsed_domicilio_fiscal = this.parseUbication(document('div:contains("Domicilio Fiscal:")').closest('.list-group-item').find('.row .col-sm-7 p').text().replace(/\s+/g, ' '));
    let parsed_actividad_economica_principal = this.parseEconomicActivity(document('div:contains("Actividad(es) Económica(s):")').closest('.list-group-item').find('tbody tr td').map((index, element) => document(element).text()).get()[0]);
    let parsed_actividad_economica_secundaria = this.parseEconomicActivity(document('div:contains("Actividad(es) Económica(s):")').closest('.list-group-item').find('tbody tr td').map((index, element) => document(element).text()).get()[1] || undefined);

    let raw_data: IBusiness = {
      ruc: ruc,
      razon_social: document('div:contains("Número de RUC:")').closest('.list-group-item').find('.row .col-sm-7 h4').text().trim().split('-').slice(1).join('-').trim(),
      tipo_contribuyente: document('div:contains("Tipo Contribuyente:")').closest('.list-group-item').find('.row .col-sm-7 p').text().trim(),
      nombre_comercial: document('div:contains("Nombre Comercial:")').closest('.list-group-item').find('.row .col-sm-7 p').text().replace('Afecto al Nuevo RUS: SI', '').trim(),
      fecha_inscripcion: document('div:contains("Fecha de Inscripción:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(0).text().trim(),
      fecha_inicio_actividades: document('div:contains("Fecha de Inicio de Actividades:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(1).text().trim(),
      estado_contribuyente: document('div:contains("Estado del Contribuyente:")').closest('.list-group-item').find('.row .col-sm-7 p').text().split('Fecha')[0].trim(),
      condicion_contribuyente: document('div:contains("Condición del Contribuyente:")').closest('.list-group-item').find('.row .col-sm-7 p').text().split('Fecha')[0].trim(),
      sistema_emision_comprobante: document('div:contains("Sistema Emisión de Comprobante:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(0).text().trim(),
      actividad_exterior: document('div:contains("Actividad Comercio Exterior:")').closest('.list-group-item').find('.row .col-sm-3 p').eq(1).text().trim(),
      domicilio_fiscal: parsed_domicilio_fiscal,
      actividad_economica_principal: parsed_actividad_economica_principal,
      actividad_economica_secundaria: parsed_actividad_economica_secundaria,
    };

    let possible_estado_constribuyente = ["INACTIVO", "ACTIVO", "SUSPENSION TEMPORAL", "BAJA PROVISIONAL DE OFICIO", "BAJA PROVISIONAL", "BAJA DEFINITIVA DE OFICIO", "BAJA DEFINITIVA"]
      .filter((item: string) => raw_data.estado_contribuyente.includes(item))[0];
    let possible_condicion_contribuyente = ["NO HABIDO", "HABIDO", "NO HALLADO"]
      .filter((item: string) => raw_data.condicion_contribuyente.includes(item))[0];

    raw_data.estado_contribuyente = (possible_estado_constribuyente && possible_estado_constribuyente.length > 0) ? possible_estado_constribuyente : raw_data.estado_contribuyente;
    raw_data.condicion_contribuyente = (possible_condicion_contribuyente && possible_condicion_contribuyente.length > 0) ? possible_condicion_contribuyente : raw_data.condicion_contribuyente;

    return raw_data;
  };

  private async fetch_business(ruc: string, fetcher?: FetchCookieImpl<any, RequestInit, Response>): Promise<IBusiness> {
    try {
      // Update the ruc of business before request
      this.payload_general['nroRuc'] = ruc;
      const fetchWithCookies = fetcher ?? fetchCookie(fetch, this.cookie_jar);
      let response_general = await fetchWithCookies(this.base_url, {
        method: this.method,
        headers: this.headers,
        body: new URLSearchParams(this.payload_general).toString(),
      });

      // Verify if the request was successfull
      if (!response_general.ok) {
        throw new Error(`HTTP error! status (BUSINESS GENERAL): [${response_general.status}]`);
      }

      // Set the characters to UTF-8
      const html_general = await getUtf8Text(response_general);

      // Parse the informtation to an object

      return this.parseBusiness(ruc, html_general); // Ensure parseBusiness is async if it returns a Promise
    } catch (e: any) {
      throw e
    }
  }

  private async fetch_employees(ruc: string, fetcher?: FetchCookieImpl<any, RequestInit, Response>): Promise<IBusinessEmployees | undefined> {
    try {
      // Update the ruc of business before request
      this.payload_trabajadores['nroRuc'] = ruc;
      const fetchWithCookies = fetcher ?? fetchCookie(fetch, this.cookie_jar);
      let response_trabajadores = await fetchWithCookies(this.base_url, {
        method: this.method,
        headers: this.headers,
        body: new URLSearchParams(this.payload_trabajadores).toString(),
      });

      // Verify if the request was successfull
      if (!response_trabajadores.ok) {
        throw new Error(`HTTP error! status (BUSINESS EMPLOYEES): [${response_trabajadores.status}]`);
      }

      // Set the characters to UTF-8
      const html_trabajadores = await getUtf8Text(response_trabajadores);

      // Parse the informtation to an object
      const response = this.parseWorkers(ruc, html_trabajadores);
      return response;
    } catch (e: any) {
      throw e
    }
  }

  private async fetch_locales(ruc: string, fetcher?: FetchCookieImpl<any, RequestInit, Response>): Promise<IBusinessLocales | undefined> {
    try {
      // Update the ruc of business before request
      this.payload_locales['nroRuc'] = ruc;
      const fetchWithCookies = fetcher ?? fetchCookie(fetch, this.cookie_jar);
      let response_locales = await fetchWithCookies(this.base_url, {
        method: this.method,
        headers: this.headers,
        body: new URLSearchParams(this.payload_locales).toString(),
      });

      // Verify if the request was successfull
      if (!response_locales.ok) {
        throw new Error(`HTTP error! status (BUSINESS LOCALES): [${response_locales.status}]`);
      }

      // Set the characters to UTF-8
      const html_locales = await getUtf8Text(response_locales);

      // Parse the informtation to an object
      const response = this.parseLocales(ruc, html_locales);
      return response;
    } catch (e: any) {
      throw e
    }
  }

  private async fetch_rrll(ruc: string, fetcher?: FetchCookieImpl<any, RequestInit, Response>): Promise<IBusinessLegalRepresentative[]> {
    try {
      // Update the ruc of business before request
      this.payload_rrll['nroRuc'] = ruc;
      const fetchWithCookies = fetcher ?? fetchCookie(fetch, this.cookie_jar);
      let response_rrll = await fetchWithCookies(this.base_url, {
        method: this.method,
        headers: this.headers,
        body: new URLSearchParams(this.payload_rrll).toString(),
      });

      // Verify if the request was successfull
      if (!response_rrll.ok) {
        throw new Error(`HTTP error! status (BUSINESS REPRESENTANTE): [${response_rrll.status}]`);
      }

      // Set the characters to UTF-8
      const html_rrll = await getUtf8Text(response_rrll);

      // Parse the informtation to an object
      const response = this.parseLegalRepresentative(ruc, html_rrll);
      return response;
    } catch (e: any) {
      throw e
    }
  }

  override async fetch_data(ruc: string): Promise<IConsultaRuc> {
    const fetchWithCookies = fetchCookie(fetch, this.cookie_jar);
    return {
      ruc: ruc,
      general: await this.fetch_business(ruc, fetchWithCookies),
      employees: await this.fetch_employees(ruc, fetchWithCookies),
      locales: await this.fetch_locales(ruc, fetchWithCookies),
      representantes: await this.fetch_rrll(ruc, fetchWithCookies),
      last_update: new Date()
    }
  }

  async fetch_bulk_data(rucs: string[]): Promise<IConsultaRuc[]> {
    const fetchWithCookies = fetchCookie(fetch, this.cookie_jar);

    const responses: IConsultaRuc[] = []
    for await (const ruc of rucs) {
      const [business, employees, locales, rrll] = [
        await this.fetch_business(ruc, fetchWithCookies),
        await this.fetch_employees(ruc, fetchWithCookies),
        await this.fetch_locales(ruc, fetchWithCookies),
        await this.fetch_rrll(ruc, fetchWithCookies),
      ];

      responses.push({
        ruc: ruc,
        general: business,
        employees: employees,
        locales: locales,
        representantes: rrll,
        last_update: new Date()
      })
    }

    return responses;
  }
}

export class BusinnessRequesterByDNI extends BaseRequester<string, IConsultaRuc[]> {
  private request_by_dni: {
    base_url: string,
    method: string,
    headers: {[key: string]: string},
    payload: any
  }
  private cookie_jar;
  private updated_cookie = false;
  private last_request_was_error = false;

  constructor() {
    super()
    this.request_by_dni = {
      base_url: "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Connection': 'keep-alive'
      },
      payload: {
        accion: 'consPorTipdoc',
        nroRuc: '',
        nrodoc: '20123456789',
        token: '17weghazm68ik95e33loa9ut2ttomx0rn9b0wf6izye2tllztqy2',
        contexto: 'ti-it',
        modo: '1',
        rbtnTipo: '2',
        tipdoc: '1',
        search2: '73965302'
      }
    }
    this.cookie_jar = new CookieJar()
  }

  /**
   *
   * @param dni - DNI of natural person
   * @returns - RUCS of business related to the person
   */
  public async getRUCsByDNI(dni: string): Promise<string[]> {
    const fetchWithCookies = fetchCookie(fetch, this.cookie_jar);

    // Get a validate cookie before request
    if (!this.updated_cookie || this.last_request_was_error) {
      await fetchWithCookies(this.request_by_dni.base_url, {
        method: 'GET'
      })
      this.updated_cookie = true;
    }

    this.request_by_dni.payload.nrodoc = dni;
    this.request_by_dni.payload.search2 = dni;

    let response_general = await fetchWithCookies(this.request_by_dni.base_url, {
      method: this.request_by_dni.method,
      headers: this.request_by_dni.headers,
      body: new URLSearchParams(this.request_by_dni.payload).toString(),
    });

    if (!response_general.ok) {
      throw new Error('Error in the request')
    }


    const html_rucs_by_dni = await getUtf8Text(response_general);

    let document = load(html_rucs_by_dni);

    let rucs: string[] = []
    document('a.aRucs').each((index, element) => {
      const rucText = document(element).find('h4.list-group-item-heading').first().text().trim();
      if (rucText) {
        // Filter the RUC number, deleting the "RUC:" prefix
        const ruc = rucText.replace('RUC:', '').trim();
        rucs.push(ruc); // Add the RUC number to array
      }
    });

    return rucs;
  }

  override async fetch_data(data: string): Promise<IConsultaRuc[]> {
    // Validate if it is a correct DNI and add pad if is necesary
    if (!Number.isInteger(Number(data))) {
      throw new Error(`Invalid input ${data}`)
    } else {
      data = data.padStart(8, '0');
    }

    const rucs = await this.getRUCsByDNI(data);
    const business_information: IConsultaRuc[] = []

    const business_requester = new BusinnessRequesterByRUCv2();
    const rucs_requested = await Promise.allSettled(rucs.map((ruc: string) => business_requester.fetch_data(ruc)));

    rucs_requested.forEach(element => {
      if(element.status == 'fulfilled') {
        business_information.push(element.value)
      }
    });

    return business_information
  }

  override async fetch_bulk_data(data: string[]): Promise<IConsultaRuc[][]> {
    // return [];
    const list_dni = data.filter((item) =>  Number.isInteger(Number(data))).map((item) =>  item.padStart(8, '0'))
    
    const hashmap_rucs: Record<string, string[]> = {};
    for await(const dni of list_dni) {
      const rucs_for_dni: string[] = await this.getRUCsByDNI(dni);
      if (!hashmap_rucs[dni])
        hashmap_rucs[dni] = rucs_for_dni;
    }

    const business_information: IConsultaRuc[][] = []
    const business_requester = new BusinnessRequesterByRUCv2();
    
    const list_dnis_with_rucs: string[] = Object.keys(hashmap_rucs);

    for await(const dni of list_dnis_with_rucs) {
      const business_found: IConsultaRuc[] = []
      const rucs_requested = await Promise.allSettled(hashmap_rucs[dni].map((ruc: string) => business_requester.fetch_data(ruc)));
      
      rucs_requested.forEach(element => {
        if(element.status == 'fulfilled') {
          business_found.push(element.value)
        }
      });
      
      business_information.push(business_found);
    }


    return business_information
  }
}


