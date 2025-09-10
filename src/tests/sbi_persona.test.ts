// 20480061595
// 20141090306
// 20552070110
// 20603565062

import { SbiPersonaRequester } from "../requesters/sbi_persona.req";

jest.setTimeout(50000);


describe('DNIS from 4 persons', () => {
  const rucs = [
    '20480061595',
    // '20141090306',
    // '20552070110',
    // '20603565062',
  ]
  const requester = new SbiPersonaRequester('andy.garcia@frsoluciones.com', 'D1UdOKCz**');
  let data_person: Record<any, any>;

  beforeAll(async() => {
    data_person = await requester.fetch_bulk_data(rucs);
  })

  it('should be normal', () => {
    console.log(data_person);
  })

})

