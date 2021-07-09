export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  gender: number;
  prefecture: number;
  birthday: Date;
  image: string;
}

export interface SignUpFormData extends FormData {
  append(name: keyof SignUpData, value: String | Blob, fileName?: string): any
}

export interface SignInData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  uid: string;
  provider: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  image: {
    url: string
  }
  gender: number;
  birthday: string | number | Date;
  profile: string;
  prefecture: number;
  allowPasswordChange: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserData {
  id: number | undefined | null;
  firstName?: string;
  lastName?: string;
  prefecture?: number;
  profile?: string;
  image?: string;
}

export interface UpdateUserFormData extends FormData {
  append(name: keyof UpdateUserData, value: string | Blob, fileName?: string): any
}

export interface Like {
  id?: number;
  fromUserId: number | undefined | null;
  toUserId: number | undefined | null;
}
