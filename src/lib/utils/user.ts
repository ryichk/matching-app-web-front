import { User } from 'types';

const getAge = (user: User): number => {
  const birthday = user.birthday.toString().replace(/-/g, '');
  const date = new Date();
  const today = `${date.getFullYear()}${`0${(date.getMonth() + 1).toString()}`.slice(-2)}${`0${date
    .getDate()
    .toString()}`.slice(-2)}`;
  return Math.floor((parseInt(today, 10) - parseInt(birthday, 10)) / 10000);
};

export default getAge;
