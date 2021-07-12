export interface SignUpData {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  gender: number;
  prefecture: number;
  birthday: Date;
  image: string;
}

export interface SignUpFormData extends FormData {
  append(name: keyof SignUpData, value: string | Blob, fileName?: string): SignUpFormData;
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
    url: string;
  };
  gender: number;
  birthday: string | number | Date;
  profile: string;
  prefecture: number;
  allowPasswordChange: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserData {
  nickname?: string;
  prefecture?: number;
  profile?: string;
  image?: string;
}

export interface UpdateUserFormData extends FormData {
  append(name: keyof UpdateUserData, value: string | Blob, fileName?: string): UpdateUserFormData;
}

export interface Like {
  id?: number;
  fromUserId: number | undefined | null;
  toUserId: number | undefined | null;
}

export interface ChatRoom {
  chatRoom: {
    id: number;
  };
  otherUser: User;
  lastMessage: MessageChannel;
}

export interface Message {
  chatRoomId: number;
  userId: number | undefined;
  content: string;
  createdAt?: Date;
}

export type Severity = 'error' | 'success' | 'info' | 'warning';
export interface AlertMessageProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  severity: Severity;
  message: string;
}
