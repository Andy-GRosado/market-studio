// 20480061595
// 20141090306
// 20552070110
// 20603565062

import { SbiPersonaRequester } from "../requesters/sbi_persona.req";
import { sleep } from "../utils/utils";

jest.setTimeout(50000);


describe('DNIS from 4 persons', () => {
  const rucs = [
    '08748066',
    '10220909',
    // '20141090306',
    // '20552070110',
    // '20603565062',
  ]
  const requester = new SbiPersonaRequester(process.env.SBI_USER!, process.env.SBI_PASSWORD!);
  let data_person: Record<any, any>;

  beforeAll(async() => {
    data_person = await requester.fetch_bulk_data(rucs);
    // console.log(data_person);
    await sleep(16);
  })

  it('should be normal', () => {
    console.log(data_person);
  })
})

