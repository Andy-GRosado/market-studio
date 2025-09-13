import { SbiPersonaRequester } from "../requesters/sbi_persona.req";
import dotenv from 'dotenv';
import { sleep } from "../utils/utils";

dotenv.config({ path: '.env.local', debug: true, quiet: true, encoding: 'utf8'});

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
  let hashmap_person: Record<string, any>;

  beforeAll(async() => {
    const response = await requester.fetch_bulk_data(rucs);
    hashmap_person = response.reduce((prev: any, current, index) => {
      if (!prev[current.dni]){
        prev[current.dni] = current;
      }
      return prev;
    }, {})
    await sleep(10);
  })

  it('10220909 - should have 1 phones', () => {
    console.log(hashmap_person['10220909'].emails.emails);
    expect(hashmap_person['10220909'].phones.telefonos).toHaveLength(1);
  })

  it('10220909 - should have 1 emails', () => {
    expect(hashmap_person['10220909'].emails.emails).toHaveLength(1);
  })

  it('08748066 - should have 3 phones', () => {
    expect(hashmap_person['08748066'].phones.telefonos).toHaveLength(3);
  })

  it('08748066 - should have 1 emails', () => {
    expect(hashmap_person['08748066'].emails.emails).toHaveLength(1);
  })
})

