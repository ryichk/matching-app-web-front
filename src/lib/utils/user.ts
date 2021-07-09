import { User } from 'interfaces/index';

export const getAge = (user: User): number => {
  const birthday = user.birthday.toString().replace(/-/g, '');
  const date = new Date();
  const today = `${date.getFullYear()}${('0'+(date.getMonth()+1).toString()).slice(-2)}${('0'+date.getDate().toString()).slice(-2)}`;
  return Math.floor((parseInt(today)-parseInt(birthday))/10000);
}
