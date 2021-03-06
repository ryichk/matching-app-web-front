import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from '@material-ui/core';

import { AuthContext } from 'App';
import { SignInData, Severity } from 'types';
import { signIn } from 'lib/api/auth';
import AlertMessage from 'components/utils/AlertMessage';
import commonStyles from 'components/styles/common';

const SignIn: React.FC = () => {
  const styles = commonStyles();
  const history = useHistory();

  const { isSignedIn, setIsSignedIn, currentUser, setCurrentUser } = useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const data: SignInData = {
      email,
      password,
    };

    try {
      const response = await signIn(data);
      if (response.status === 200) {
        Cookies.set('_access_token', response.headers['access-token']);
        Cookies.set('_client', response.headers.client);
        Cookies.set('_uid', response.headers.uid);

        setIsSignedIn(true);
        setCurrentUser(response.data.data);

        history.push('/');

        setAlertMessageOpen(true);
        setAlertMessage('Signed in successfully!');
        setSeverity('success');
      } else {
        setAlertMessageOpen(true);
        setAlertMessage('Failed sign in. Wrong email or password. Please check again.');
        setSeverity('error');
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage(String(error));
      setSeverity('error');
    }
  };

  return (
    <>
      {isSignedIn && currentUser ? (
        <p>
          Current User:
          {currentUser.firstName} {currentUser.lastName}
        </p>
      ) : (
        <>
          <form noValidate autoComplete="off">
            <Card className={styles.formCard}>
              <CardHeader className={styles.header} title="Sign In" />
              <CardContent>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Email"
                  value={email}
                  margin="dense"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  margin="dense"
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <div style={{ textAlign: 'right' }}>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    disabled={!!(!email || !password)}
                    className={styles.submitBtn}
                    onClick={handleSignIn}
                  >
                    Submit
                  </Button>
                </div>
                <Box textAlign="center" className={styles.box}>
                  <Typography variant="body2">
                    If you haven&apos;t created an account yet, please do so&nbsp;
                    <Link to="/sign-up" className={styles.link}>
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
            severity={severity}
            message={alertMessage}
          />
        </>
      )}
    </>
  );
};

export default SignIn;
