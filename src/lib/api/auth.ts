import { AxiosPromise, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import client from 'lib/api/client';
import { UpdateUserFormData, SignUpFormData, SignInData } from 'interfaces/index';

const signUp = (data: SignUpFormData): AxiosPromise<AxiosResponse> => client.post('auth', data);

const signIn = (data: SignInData): AxiosPromise<AxiosResponse> => client.post('auth/sign_in', data);

const signOut = (): AxiosPromise =>
  client.delete('auth/sign_out', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

const getCurrentUser = (): AxiosPromise =>
  client.get('/auth/sessions', {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

const updateUser = (data: UpdateUserFormData): AxiosPromise<AxiosResponse> =>
  client.put('auth', data, {
    headers: {
      'access-token': Cookies.get('_access_token'),
      client: Cookies.get('_client'),
      uid: Cookies.get('_uid'),
    },
  });

export { signUp, signIn, signOut, getCurrentUser, updateUser };
