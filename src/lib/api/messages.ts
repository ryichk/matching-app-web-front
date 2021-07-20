import { AxiosPromise } from 'axios';
import Cookies from 'js-cookie';

import client from 'lib/api/client';
import { Message } from 'types';

const createMessage = (data: Message): AxiosPromise =>
  client.post('messages', data, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

export default createMessage;
