import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Cookie from 'js-cookie';

import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core//Button';

import { AuthContext } from 'App';
import AlertMessage from 'components/utils/AlertMessage';
import { signUp } from 'lib/api/auth';
import { SignUpData } from 'interfaces/index';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(6),
  },
  submitBtn: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textTransform: 'none',
  },
  header: {
    textAlign: 'center',
  },
  card: {
    padding: theme.spacing(2),
    maxWidth: 400,
  },
}));

const SignUp: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const data: SignUpData = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
    }

    try {
      const response = await signUp(data);
      console.log(response);

      if (response.status === 200) {
        Cookie.set('_access_token', response.headers['access-token']);
        Cookie.set('_client', response.headers['client']);
        Cookie.set('_uid', response.headers['uid']);

        setIsSignedIn(true);
        setCurrentUser(response.data.data);

        history.push('/');

        console.log('Signed in successfully!');
      } else {
        setAlertMessageOpen(true);
      }
    } catch (error) {
      console.log(error);
      setAlertMessageOpen(true);
    }
  }

  return (
    <>
      <form noValidate autoComplete='off'>
        <Card className={classes.card}>
          <CardHeader className={classes.header} title='Sing Up' />
          <CardContent>
            <TextField
              variant='outlined'
              required
              fullWidth
              label='Name'
              value={name}
              margin='dense'
              onChange={event => setName(event.target.value)}
            />
            <TextField
              variant='outlined'
              required
              fullWidth
              label='Email'
              value={email}
              margin='dense'
              onChange={event => setEmail(event.target.value)}
            />
            <TextField
              variant='outlined'
              required
              fullWidth
              label='Password'
              type='password'
              value={password}
              margin='dense'
              autoComplete='current-password'
              onChange={event => setPassword(event.target.value)}
            />
            <TextField
              variant='outlined'
              required
              fullWidth
              label='Password (confirmation)'
              type='password'
              value={passwordConfirmation}
              margin='dense'
              autoComplete='current-password'
              onChange={event => setPasswordConfirmation(event.target.value)}
            />
            <div style={{ textAlign: 'right' }} >
              <Button
                type='submit'
                variant='outlined'
                color='primary'
                disabled={!name || !email || !password || !passwordConfirmation ? true : false}
                className={classes.submitBtn}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity='error'
        message='Wrong email or password. Please check again.'
      />
    </>
  );
}

export default SignUp;
