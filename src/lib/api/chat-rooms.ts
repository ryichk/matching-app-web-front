import { AxiosPromise } from 'axios';
import Cookies from 'js-cookie';

import client from 'lib/api/client';

export const getChatRooms = (): AxiosPromise =>
  client.get('chat_rooms', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

export const getChatRoom = (id: number): AxiosPromise =>
  client.get(`chat_rooms/${id}`, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });
