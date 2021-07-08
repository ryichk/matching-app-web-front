import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Cookie from 'js-cookie';

import { makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { signOut } from 'lib/api/auth';

import { AuthContext } from 'App';

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexgrow: 1,
    textDecoration: 'none',
    color: 'inherit'
  },
  linkBtn: {
    textTransform: 'none'
  }
}));

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const classes = useStyles();
  const history = useHistory();

  const handleSignOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await signOut();

      if (response.data.success === true) {
        Cookie.remove('_access_token');
        Cookie.remove('_client');
        Cookie.remove('_uid');

        setIsSignedIn(false);
        history.push('/signin');

        console.log('Succeeded in sign out');
      } else {
        console.log('Failed in sign out');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <Button
            color='inherit'
            className={classes.linkBtn}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        );
      } else {
        return (
          <Button
            component={Link}
            to='/signin'
            color='inherit'
            className={classes.linkBtn}
          >
            Sign In
          </Button>
        );
      }
    } else {
      return <></>;
    }
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton
          edge='start'
          className={classes.iconButton}
          color='inherit'
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component={Link}
          to='/'
          variant='h6'
          className={classes.title}
        >
          Sample
        </Typography>
        <AuthButtons />
      </Toolbar>
    </AppBar>
  );
}

export default Header;