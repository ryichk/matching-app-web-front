import { AxiosPromise } from 'axios';
import Cookies from 'js-cookie';

import client from 'lib/api/client';
import { Like } from 'types';

const getLikes = (): AxiosPromise =>
  client.get('likes', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

const createLike = (data: Like): AxiosPromise =>
  client.post('likes', data, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

export { getLikes, createLike };
