import { BusinnessRequesterByRUCv2 } from "../requesters/consulta_ruc.req";
import { IAddress, IBusiness, IConsultaRucv2 } from "../utils/interfaces";

export namespace ITestBusiness {
  export interface IEstadoTipoContribuyente {
    tipo_contribuyente: string;
    estado_contribuyente: string;
  }
}

export async function get_business(
  ruc: string
): Promise<IConsultaRucv2> {
  const requester = new BusinnessRequesterByRUCv2();
  const data = await requester.fetch_data(ruc);
  return data;
}

export async function get_activo_habido(
  ruc: string
): Promise<ITestBusiness.IEstadoTipoContribuyente> {
  const requester = new BusinnessRequesterByRUCv2();
  const data = await requester.fetch_data(ruc);
  const response: ITestBusiness.IEstadoTipoContribuyente = {
    tipo_contribuyente: data.general.tipo_contribuyente,
    estado_contribuyente: data.general.estado_contribuyente,
  };
  return response;
}

export async function get_domocilio_fiscal(
  ruc: string
): Promise<IAddress | undefined> {
  const requester = new BusinnessRequesterByRUCv2();
  const data = await requester.fetch_data(ruc);
  const response: IAddress | undefined = data.general.domicilio_fiscal;
  return response;
}

export async function get_actividades_economicas( ruc: string, tipo: "principal" | "secundaria" = "principal"): Promise<
  { cod: string, description: string }
  | undefined
> {
  const requester = new BusinnessRequesterByRUCv2();
  const data = await requester.fetch_data(ruc);
  if (tipo == "secundaria") {
    return data.general.actividad_economica_secundaria;
  }
  return data.general.actividad_economica_principal;
}





