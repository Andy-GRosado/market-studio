import { IAddress, IConsultaRucv2 } from "../utils/interfaces";
export declare namespace ITestBusiness {
    interface IEstadoTipoContribuyente {
        tipo_contribuyente: string;
        estado_contribuyente: string;
    }
}
export declare function get_business(ruc: string): Promise<IConsultaRucv2>;
export declare function get_activo_habido(ruc: string): Promise<ITestBusiness.IEstadoTipoContribuyente>;
export declare function get_domocilio_fiscal(ruc: string): Promise<IAddress | undefined>;
export declare function get_actividades_economicas(ruc: string, tipo?: "principal" | "secundaria"): Promise<{
    cod: string;
    description: string;
} | undefined>;
