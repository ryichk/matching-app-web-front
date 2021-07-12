import { AxiosPromise } from 'axios';
import Cookies from 'js-cookie';

import client from 'lib/api/client';

const getUsers = (): AxiosPromise =>
  client.get('users', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

const getUser = (id: number | undefined): AxiosPromise =>
  client.get(`users/${id}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

export { getUsers, getUser };
