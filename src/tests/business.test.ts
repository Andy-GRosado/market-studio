import { BusinnessRequesterByRUCv2 } from "../requesters/consulta_ruc.req";
import { IConsultaRucv2 } from "../utils/interfaces";
import { get_business } from "./business";

jest.setTimeout(50000);

describe('RUC 20 - business condicion_contribuyente and estado_contribuyente', () => {
  const rucs = [
    '20131028301', // ACTIVO - HABIDO
    '20602160697', // ACTIVO - NO HABIDO
    '20600427343', // BAJA DE OFICIO - NO HABIDO
    '20614042011', // BAJA DEFINITIVA - HABIDO
    '20609902982', // BAJA MULT.INSCR. Y OTROS - HABIDO
    '20603426844', // BAJA PROV. POR OFICIO - NO HABIDO
    '20614081776', // SUSPENSION TEMPORAL - HABIDO
  ]

  const hashmap_business: Record<string, IConsultaRucv2> = {};

  beforeAll(async () => {
    const requester = new BusinnessRequesterByRUCv2();
    const list_business = await requester.fetch_bulk_data(rucs)
    list_business.forEach(item => {
      if(!hashmap_business[item.general.ruc]) {
        hashmap_business[item.general.ruc] = item;
      }
    })
  })

  it('should be ACTIVO - HABIDO', async () => {
    expect(hashmap_business['20131028301'].general).toEqual(expect.objectContaining({condicion_contribuyente: 'HABIDO', estado_contribuyente: 'ACTIVO'}));
  });

  it('should be ACTIVO - NO HABIDO', async () => {
    expect(hashmap_business['20602160697'].general).toEqual(expect.objectContaining({condicion_contribuyente: 'NO HABIDO', estado_contribuyente: 'ACTIVO'}));
  });

  it('should be BAJA DE OFICIO - NO HABIDO', async () => {
    expect(hashmap_business['20600427343'].general).toEqual(expect.objectContaining({condicion_contribuyente: 'NO HABIDO', estado_contribuyente: 'BAJA DE OFICIO'}));
  });

  it('should be BAJA PROV. POR OFICIO - NO HABIDO', async () => {
    expect(hashmap_business['20603426844'].general).toEqual(expect.objectContaining({condicion_contribuyente: 'NO HABIDO', estado_contribuyente: 'BAJA PROV. POR OFICIO'}));
  });

  it('should be BAJA DEFINITIVA - HABIDO', async () => {
    expect(hashmap_business['20614042011'].general).toEqual(expect.objectContaining({condicion_contribuyente: 'HABIDO', estado_contribuyente: 'BAJA DEFINITIVA'}));
  });

  it('should be BAJA MULT.INSCR. Y OTROS - HABIDO', async () => {
    expect(hashmap_business['20609902982'].general).toEqual(expect.objectContaining({condicion_contribuyente: 'HABIDO', estado_contribuyente: 'BAJA MULT.INSCR. Y OTROS'}));
  });

  it('should be SUSPENSION TEMPORAL - HABIDO', async () => {
    expect(hashmap_business['20614081776'].general).toEqual(expect.objectContaining({condicion_contribuyente: 'HABIDO', estado_contribuyente: 'SUSPENSION TEMPORAL'}));
  });

})

describe('RUC 20 - business fiscal address', () => {
  const rucs = [
    '20603464614', // Amazonas
    '20445723119', // Ancash
    '20613797344', // Apurimac
    '20614718634', // Arequipa
    '20614719363', // Ayacucho
    '20614721074', // Cajamarca
    '20614719398', // Prov. const. del callao
    '20614721201', // Cusco
    '20614718430', // Huancavelica
    '20614720876', // Huanuco
    '20614718821', // Ica
    '20614718367', // Junin
    '20614721007', // La Libertad
    '20614718529', // Lambayeque
    '20614714159', // Madre de dios
    '20614720922', // San Martin
    '20526343345', // Piura
    '20131028301',
    '20116913314',
    '20131057238',
    '20131312017',
  ]

  const hashmap_business: Record<string, IConsultaRucv2> = {};

  beforeAll(async () => {
    const requester = new BusinnessRequesterByRUCv2();
    const list_business = await requester.fetch_bulk_data(rucs)
    list_business.forEach(item => {
      if(!hashmap_business[item.general.ruc]) {
        hashmap_business[item.general.ruc] = item;
      }
    })
  })

  it('should be correct fiscal address AMAZONAS - BAGUA - BAGUA', () => {
    expect(hashmap_business['20603464614'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'AMAZONAS',
      provincia: 'BAGUA',
      distrito: 'BAGUA'
    }));
  });


  it('should be correct fiscal address ANCASH - CASMA - CASMA', () => {
    expect(hashmap_business['20445723119'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'ANCASH',
      provincia: 'CASMA',
      distrito: 'CASMA'
    }));
  });


  it('should be correct fiscal address APURIMAC - ABANCAY - ABANCAY', () => {
    expect(hashmap_business['20613797344'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'APURIMAC',
      provincia: 'ABANCAY',
      distrito: 'ABANCAY'
    }));
  });


  it('should be correct fiscal address AREQUIPA - AREQUIPA - CERRO COLORADO', () => {
    expect(hashmap_business['20614718634'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'AREQUIPA',
      provincia: 'AREQUIPA',
      distrito: 'CERRO COLORADO'
    }));
  });


  it('should be correct fiscal address AYACUCHO - HUAMANGA - CHIARA', () => {
    expect(hashmap_business['20614719363'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'AYACUCHO',
      provincia: 'HUAMANGA',
      distrito: 'CHIARA'
    }));
  });


  it('should be correct fiscal address CAJAMARCA - CUTERVO - SAN ANDRES DE CUTERVO', () => {
    expect(hashmap_business['20614721074'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'CAJAMARCA',
      provincia: 'CUTERVO',
      distrito: 'SAN ANDRES DE CUTERVO'
    }));
  });


  it('should be correct fiscal address PROV. CONST. DEL CALLAO  - PROV. CONST. DEL CALLAO - BELLAVISTA', () => {
    expect(hashmap_business['20614719398'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'PROV. CONST. DEL CALLAO',
      provincia: 'PROV. CONST. DEL CALLAO',
      distrito: 'BELLAVISTA'
    }));
  });


  it('should be correct fiscal address CUSCO - ESPINAR - ESPINAR', () => {
    expect(hashmap_business['20614721201'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'CUSCO',
      provincia: 'ESPINAR',
      distrito: 'ESPINAR'
    }));
  });


  it('should be correct fiscal address HUANCAVELICA - TAYACAJA - DANIEL HERNANDEZ', () => {
    expect(hashmap_business['20614718430'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'HUANCAVELICA',
      provincia: 'TAYACAJA',
      distrito: 'DANIEL HERNANDEZ'
    }));
  });


  it('should be correct fiscal address HUANUCO - HUANUCO - AMARILIS', () => {
    expect(hashmap_business['20614720876'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'HUANUCO',
      provincia: 'HUANUCO',
      distrito: 'AMARILIS'
    }));
  });


  it('should be correct fiscal address ICA - ICA - PARCONA', () => {
    expect(hashmap_business['20614718821'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'ICA',
      provincia: 'ICA',
      distrito: 'PARCONA'
    }));
  });


  it('should be correct fiscal address JUNIN - CHANCHAMAYO - SAN LUIS DE SHUARO', () => {
    expect(hashmap_business['20614718367'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'JUNIN',
      provincia: 'CHANCHAMAYO',
      distrito: 'SAN LUIS DE SHUARO'
    }));
  });


  it('should be correct fiscal address LA LIBERTAD - TRUJILLO - LAREDO', () => {
    expect(hashmap_business['20614721007'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'LA LIBERTAD',
      provincia: 'TRUJILLO',
      distrito: 'LAREDO'
    }));
  });


  it('should be correct fiscal address LAMBAYEQUE - CHICLAYO - JOSE LEONARDO ORTIZ', () => {
    expect(hashmap_business['20614718529'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'LAMBAYEQUE',
      provincia: 'CHICLAYO',
      distrito: 'JOSE LEONARDO ORTIZ'
    }));
  });


  it('should be correct fiscal address MADRE DE DIOS - TAMBOPATA - LABERINTO', () => {
    expect(hashmap_business['20614714159'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'MADRE DE DIOS',
      provincia: 'TAMBOPATA',
      distrito: 'LABERINTO'
    }));
  });


  it('should be correct fiscal address SAN MARTIN - MOYOBAMBA - MOYOBAMBA', () => {
    expect(hashmap_business['20614720922'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'SAN MARTIN',
      provincia: 'MOYOBAMBA',
      distrito: 'MOYOBAMBA'
    }));
  });


  it('should be correct fiscal address PIURA - PIURA - PIURA', () => {
    expect(hashmap_business['20526343345'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'PIURA',
      provincia: 'PIURA',
      distrito: 'PIURA'
    }));
  });

  it('should be correct fiscal address LIMA - LIMA - LIMA', () => {
    expect(hashmap_business['20131028301'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'LIMA',
      provincia: 'LIMA',
      distrito: 'LIMA'
    }));
  });

  it('should be correct fiscal address PUNO - CHUCUITO - DESAGUADERO', () => {
    expect(hashmap_business['20116913314'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'PUNO',
      provincia: 'CHUCUITO',
      distrito: 'DESAGUADERO'
    }));
  });

  it('should be correct fiscal address LIMA - LIMA - SANTIAGO DE SURCO', () => {
    expect(hashmap_business['20131057238'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'LIMA',
      provincia: 'LIMA',
      distrito: 'SANTIAGO DE SURCO'
    }));
  });

  it('should be correct fiscal address LIMA - HUAROCHIRI - SURCO', () => {
    expect(hashmap_business['20131312017'].general.domicilio_fiscal).toEqual(expect.objectContaining({
      departamento: 'LIMA',
      provincia: 'HUAROCHIRI',
      distrito: 'SURCO'
    }));
  });
});

