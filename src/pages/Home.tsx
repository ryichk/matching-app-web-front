import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Avatar,
  Divider,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { AuthContext } from 'App';
import { prefectures } from 'data/prefectures';
import { signOut } from 'lib/api/auth';
import { getAge } from 'lib/utils/user';
import { useStyles } from 'components/styles/index';

const Home: React.FC = () => {
  const { isSignedIn, setIsSignedIn, currentUser } = useContext(AuthContext);

  const styles = useStyles();
  const histroy = useHistory();

  const currentUserPrefecture = (): string => {
    return prefectures[(currentUser?.prefecture || 0) - 1];
  }

  const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await signOut();

      if (response.data.success === true) {
        Cookies.remove('_access_token');
        Cookies.remove('_client');
        Cookies.remove('_uid');

        setIsSignedIn(false);
        histroy.push('/signin');

        console.log('Succeeded in sign out');
      } else {
        console.log('Failed in sign out');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <Card className={styles.card}>
              <CardContent>
                <Link to='/edit-profile'>
                  <Grid container justify='flex-end'>
                    <Grid item>
                      <IconButton>
                        <SettingsIcon
                          color='action'
                          fontSize='small'
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Link>
                <Grid container justify='center'>
                  <Grid item>
                    <Avatar
                      alt='avatar'
                      src={currentUser?.image.url}
                      className={styles.avatar}
                    />
                  </Grid>
                </Grid>
                <Grid container justify='center'>
                  <Grid item style={{ marginTop: '1.5rem'}}>
                    <Typography variant='body1' component='p' gutterBottom>
                      {currentUser?.firstName} {currentUser?.lastName} {getAge(currentUser)}歳 ({currentUserPrefecture()})
                    </Typography>
                    <Divider style={{ marginTop: '0.5rem' }} />
                    <Typography
                      variant='body2'
                      component='p'
                      gutterBottom
                      style={{ marginTop: '0.5rem', fontWeight: 'bold' }}
                    >
                      Profile
                    </Typography>
                    {
                      currentUser.profile ? (
                        <Typography variant='body2' component='p' color='textSecondary'>
                          {currentUser.profile}
                        </Typography>
                      ) : (
                        <Typography variant='body2' component='p' color='textSecondary'>
                          よろしくお願いします。
                        </Typography>
                      )
                    }
                    <Button
                      variant='outlined'
                      onClick={handleSignOut}
                      color='primary'
                      fullWidth
                      startIcon={<ExitToAppIcon />}
                      style={{ marginTop: '1rem' }}
                    >
                      Sign Out
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </>
        ) : (
          <></>
        )
      }
    </>
  );
}

export default Home;
