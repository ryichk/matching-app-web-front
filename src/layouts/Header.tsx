import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import { AuthContext } from 'App';
import commonStyles from 'components/styles/common';

const Header: React.FC = () => {
  const { loading, isSignedIn } = useContext(AuthContext);
  const classes = commonStyles();

  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <>
            <IconButton
              component={Link}
              to="/users"
              edge="start"
              color="inherit"
              className={classes.linkBtn}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              component={Link}
              to="/chat-rooms"
              edge="start"
              color="inherit"
              className={classes.linkBtn}
            >
              <ChatBubbleIcon />
            </IconButton>
            <IconButton
              component={Link}
              to="/"
              edge="start"
              color="inherit"
              className={classes.linkBtn}
            >
              <PersonIcon />
            </IconButton>
          </>
        );
      }
      return (
        <IconButton component={Link} to="/sign-in" color="inherit" className={classes.linkBtn}>
          <ExitToAppIcon />
        </IconButton>
      );
    }
    return <></>;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography component={Link} to="/users" variant="h6" className={classes.title}>
          Matching App
        </Typography>
        <AuthButtons />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
