export interface IEmployees {
    trabajadores: number;
    pensionistas: number;
    prestadores_servicios: number;
}
export interface IAddress {
    direccion: string;
    departamento: string;
    provincia: string;
    distrito: string;
}
export interface ILocal {
    codigo: string;
    tipo: string;
    actividad_economica?: string;
    ubicacion: IAddress;
}
export interface IConsultaRuc {
    id: string;
    razon_social: string;
    tipo_contribuyente: string;
    nombre_comercial: string;
    fecha_inscripcion: string;
    fecha_inicio_actividades: string;
    estado_contribuyente: string;
    condicion_contribuyente: string;
    sistema_emision_comprobante: string;
    actividad_exterior: string;
    domicilio_fiscal: IAddress;
    departamento: string;
    distrito: string;
    provincia: string;
    locales: {
        cantidad: number;
        locales: ILocal[];
    };
    trabajadores_actual?: IEmployees;
    trabajadores?: {
        [period: string]: IEmployees;
    };
    actividad_economica_principal?: {
        cod: string;
        description: string;
    };
    actividad_economica_principal_cod?: string;
    actividad_economica_secundaria?: {
        cod: string;
        description: string;
    };
    actividad_economica_secundaria_cod?: string;
    last_update?: Date;
}
export interface IChecaTuLinea {
    id: string;
    data: {
        company: string;
        count: number;
        lines: {
            type: string;
            count: number;
        }[];
    }[];
    claro: number;
    entel: number;
    telefonica: number;
    bitel: number;
    otros: number;
    last_update?: Date;
}
