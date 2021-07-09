import Cookies from 'js-cookie';

import client from 'lib/api/client';

export const getUsers = () => {
  return client.get('users', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid')
    }
  });
}

export const getUser = (id: number | undefined) => {
  return client.get(`users/${id}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      'client': Cookies.get('_client'),
      'uid': Cookies.get('_uid')
    }
  });
}

