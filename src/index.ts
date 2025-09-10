export { BaseRequester, BusinnessRequesterByDNI, BusinnessRequesterByRUCv2 as BusinnessRequesterByRUC } from './requesters/consulta_ruc.req'
export { ChecaTuLineaRequester } from './requesters/checa_linea.req'
export { SbiPersonaRequester } from './requesters/sbi_persona.req'

export { IAddress, IEmployees, ILocal, IConsultaRucv2 as IConsultaRuc, IChecaTuLinea } from './utils/interfaces'
export { IBusiness, IBusinessEmployees, IBusinessLocales, IBusinessLegalRepresentative } from './utils/interfaces'

export { getUtf8Text } from './utils/utils'
