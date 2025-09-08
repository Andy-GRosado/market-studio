# Market Studio

This project is a reusable Node.js module that can be linked into other projects for local development using `npm link`. It allows to request business information using web scraping.

## 🔗 How to Link This Module Locally

To use this module in another project without publishing it to npm, follow these steps:

---

### 1. Create a Global Link from This Project

Open a terminal and navigate to this project’s root directory:

```bash
cd /path/to/this-module
npm link
```

## 🔗 How to unlink project

To unlink another project with this library just run the following commands

```bash
npm unlink
```

## 📜 Web Scraping for Business Information

The Market Studio module enables you to scrape business data from public sources, particularly for obtaining company details based on their RUC (Tax Identification Number). The library provides a powerful and flexible way to retrieve and organize this information.

### Key Features

- Scrape company data by RUC.
- Retrieve information such as business status, tax condition, and fiscal address.
- The module can fetch bulk data for multiple RUCs simultaneously (but it takes more time being processed each request).

## ⚙️ Business Object Structure

```typescript
export interface IConsultaRuc {
  ruc: string;

  general: {
    ruc: string;
    razon_social: string;
    tipo_contribuyente: string;
    nombre_comercial: string;
    fecha_inscripcion: string;
    fecha_inicio_actividades: string;
    estado_contribuyente: string;
    condicion_contribuyente: string;
    sistema_emision_comprobante: string;
    actividad_exterior: string;
    domicilio_fiscal?: IAddress;
    actividad_economica_principal?: {
      cod: string;
      description: string;
    };
    actividad_economica_secundaria?: {
      cod: string;
      description: string;
    };
  };

  employees?: {
    ruc: string;
    historial: Record<
      string,
      {
        trabajadores: number;
        pensionistas: number;
        prestadores_servicios: number;
      }
    >;
  };

  locales?: {
    ruc: string;
    cantidad: number;
    locales: {
      codigo: string;
      tipo: string;
      actividad_economica?: string;
      ubicacion: IAddress;
    }[];
  };

  representante_legal?: {
    ruc: string;
    tipo_documento: string;
    documento: string;
    nombre: string;
    cargo: string;
    fecha: string;
  };

  last_update?: Date;
}
```

## ☑️ Example Output

```json
{
  "ruc": "20XXXXXX001",
  "general": {
    "ruc": "20XXXXXX001",
    "razon_social": "BUSINESS S.A.C.",
    "tipo_contribuyente": "SOCIEDAD ANONIMA CERRADA",
    "nombre_comercial": "LITTLE BUSINESS",
    "fecha_inscripcion": "08/05/2025",
    "fecha_inicio_actividades": "07/09/2025",
    "estado_contribuyente": "ACTIVO",
    "condicion_contribuyente": "HABIDO",
    "sistema_emision_comprobante": "COMPUTARIZADO",
    "actividad_exterior": "SIN ACTIVIDAD",
    "domicilio_fiscal": {
      "direccion": "CAL.CALLES NRO. XXX URB. URBANIZACION DEPARTAMENTO - PROVINCIA - DISTRITO",
      "departamento": "DEPARTAMENTO",
      "provincia": "PROVINCIA",
      "distrito": "DISTRITO"
    },
    "actividad_economica_principal": {
      "cod": "XXX1",
      "description": "DESCRIPCION ACTIVIDAD PRINCIPAL"
    },
    "actividad_economica_secundaria": {
      "cod": "XXX2",
      "description": "DESCRIPCION ACTIVIDAD SECUNDARIA"
    }
  },
  "employees": {
    "ruc": "20XXXXXX001",
    "trabajadores": 8,
    "pensionistas": 8,
    "prestadores_servicios": 8,
    "historial": {
      // History from the last 7 or 6 months
      "2024-08": {
        "trabajadores": 17,
        "pensionistas": 0,
        "prestadores_servicios": 2
      },
      // ...
      "2025-07": {
        "trabajadores": 8,
        "pensionistas": 8,
        "prestadores_servicios": 8
      }
    }
  },
  "locales": {
    "ruc": "20XXXXXX001",
    "cantidad": 8,
    "locales": [
      {
        "codigo": "XXX1",
        "tipo": "TIPO DE LOCAL",
        "ubicacion": {
          "direccion": "CAL.CALLES NRO. XXX URB. URBANIZACION DEPARTAMENTO - PROVINCIA - DISTRITO",
          "departamento": "DEPARTAMENTO",
          "provincia": "PROVINCIA",
          "distrito": "DISTRITO"
        },
        "actividad_economica": "XXX1"
      }
      // ...
    ]
  },
  "representante_legal": {
    "ruc": "20XXXXXX001",
    "tipo_documento": "DNI",
    "documento": "7XXXXXX1",
    "nombre": "JUAN SANCHEZ SANCHEZ",
    "cargo": "DESCRIPCION CARGO",
    "fecha": "16/08/2025"
  },
  "last_update": "2025-09-08T02:51:29.505Z"
}
```

## 📩 Usage examples

### 🔍 Single request

```typescript
import { BusinnessRequesterByRUC } from "../requesters/consulta_ruc.req";
import { IConsultaRucv2 } from "../utils/interfaces";

const rucs = '20XXXXXX01';

const requester = new BusinnessRequesterByRUC();
const business_information = await requester.fetch_data(ruc);

console.log(business_information);
/**
 * IConsultaRuc{},
 * /

```

### 🎁 Bulk request

```typescript
import { BusinnessRequesterByRUC } from "../requesters/consulta_ruc.req";
import { IConsultaRucv2 } from "../utils/interfaces";

const rucs = [
  '20XXXXXX01',
  '20XXXXXX02',
];

const requester = new BusinnessRequesterByRUC();
const list_business_information = await requester.fetch_bulk_data(rucs);

console.log(list_business_information);
/**
 * [
 *      IConsultaRuc{},
 *      ...
 * ]
 * /

```
