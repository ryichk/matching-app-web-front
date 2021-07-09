import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { AuthContext } from 'App';
import AlertMessage from 'components/utils/AlertMessage';
import { signIn } from 'lib/api/auth';
import { useStyles } from 'components/styles/index';
import { SignInData } from 'interfaces/index';

const SignIn: React.FC = () => {
  const styles = useStyles();
  const history = useHistory();

  const { isSignedIn, setIsSignedIn, currentUser, setCurrentUser } = useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const data: SignInData = {
      email: email,
      password: password
    }

    try {
      const response = await signIn(data);
      console.log(response);

      if (response.status === 200) {
        Cookies.set('_access_token', response.headers['access-token']);
        Cookies.set('_client', response.headers['client']);
        Cookies.set('_uid', response.headers['uid']);

        setIsSignedIn(true);
        setCurrentUser(response.data.data);

        history.push('/');

        console.log('Signed in successfully!');
        console.log(`current user: ${response.data.data}`)
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
      {
        isSignedIn && currentUser ? (
          <p>Current User: {currentUser.firstName} {currentUser.lastName}</p>
        ) : (
          <>
            <form noValidate autoComplete='off'>
              <Card className={styles.formCard}>
                <CardHeader className={styles.header} title='Sign In' />
                <CardContent>
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
                    label='password'
                    type='password'
                    placeholder='At least 8 characters'
                    value={password}
                    margin='dense'
                    autoComplete='current-password'
                    onChange={event => setPassword(event.target.value)}
                  />
                  <div style={{ textAlign: 'right'}} >
                    <Button
                      type='submit'
                      variant='outlined'
                      color='primary'
                      disabled={!email || !password ? true : false}
                      className={styles.submitBtn}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                  <Box textAlign='center' className={styles.box}>
                    <Typography variant='body2'>
                      If you haven't created an account yet, please do so&nbsp;
                      <Link to='/sign-up' className={styles.link}>
                        here.
                      </Link>
                    </Typography>
                  </Box>
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
        )
      }
    </>
  );
}

export default SignIn;
