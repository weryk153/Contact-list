import apiClient from './apiClient';

/**
 * 	get all contact
 * @export
 * @param {string} sort
 * @param {string} exchange
 * @returns string
 */
export function GETAllContacts() {
  const url = '/api/contacts';

  return apiClient.get(url);
}

/**
 * 取得香港證券 IPO 新股列表
 * https://www.anuesec.com/api/session/submitSoapQuery
 * @returns json
 */
 export function PATCHContact(id: number, params: any) {
  const url = `/api/contacts/${id}`;

  return apiClient.patch(url, params);
}
/**
 * 取得香港證券 IPO 新股列表
 * https://www.anuesec.com/api/session/submitSoapQuery
 * @returns json
 */
 export function POSTAddContact(params: any) {
  const url = '/api/contacts';

  return apiClient.post(url, params);
}

/**
 * 取得香港證券 IPO 新股列表
 * https://www.anuesec.com/api/session/submitSoapQuery
 * @returns json
 */
 export function DELETEContact(id: number) {
  const url = `/api/contacts/${id}`;

  return apiClient.delete(url);
}


/**
 * 取得香港證券 IPO 新股列表
 * https://www.anuesec.com/api/session/submitSoapQuery
 * @returns json
 */
export function POSTSubmitSoapQuery() {
  const url = '/api/session/submitSoapQuery';
  const param = {
    form: {
      name: 'IPOListEnquiry',
      credentials: {
        username: '',
        password: '',
      },
      header: {
        version: '1',
        traceNo: '1',
      },
      body: {},
    },
  };

  return anueSecUrlClient.post(url, param);
}
