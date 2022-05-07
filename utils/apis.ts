import apiClient from './apiClient';

export function GETAllContacts() {
  const url = '/api/contacts';

  return apiClient.get(url);
}

 export function PATCHContact(id: number, params: any) {
  const url = `/api/contacts/${id}`;

  return apiClient.patch(url, params);
}

 export function POSTAddContact(params: any) {
  const url = '/api/contacts';

  return apiClient.post(url, params);
}

 export function DELETEContact(id: number) {
  const url = `/api/contacts/${id}`;

  return apiClient.delete(url);
}
