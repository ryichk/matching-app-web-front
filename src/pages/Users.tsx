import React, { useState, useEffect, useContext } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import { AuthContext } from 'App';
import { User, Like, Severity } from 'types';
import prefectures from 'data/prefectures';
import { getUsers } from 'lib/api/users';
import { getLikes, createLike } from 'lib/api/likes';
import getAge from 'lib/utils/user';
import AlertMessage from 'components/utils/AlertMessage';
import commonStyles from 'components/styles/common';

const Users: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const styles = commonStyles();

  const initialUserState: User = {
    id: 0,
    uid: '',
    provider: '',
    email: '',
    firstName: '',
    lastName: '',
    image: {
      url: '',
    },
    gender: 0,
    birthday: '',
    profile: '',
    prefecture: 12,
    allowPasswordChange: true,
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Array<User>>([]);
  const [user, setUser] = useState<User>(initialUserState);
  const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false);
  const [likedUsers, setLikedUsers] = useState<Array<User>>([]);
  const [likes, setLikes] = useState<Array<Like>>([]);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  const userPrefecture = (): string => prefectures[user.prefecture];

  const handleCreateLike = async (otherUser: User) => {
    const data: Like = {
      fromUserId: currentUser?.id,
      toUserId: otherUser.id,
    };

    try {
      const response = await createLike(data);
      if (response?.status === 200) {
        setLikes([response.data.like, ...likes]);
        setLikedUsers([user, ...likedUsers]);
        if (response?.data.isMatched) {
          setAlertMessageOpen(true);
          setAlertMessage('マッチングしました！');
          setSeverity('info');

          setUserDetailOpen(false);
        }
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage(String(error));
      setSeverity('error');
    }
  };

  const handleGetUsers = async () => {
    try {
      const response = await getUsers();
      if (response?.status === 200) {
        setUsers(response?.data.users);
      } else {
        setAlertMessageOpen(true);
        setAlertMessage('No users');
        setSeverity('error');
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage(String(error));
      setSeverity('error');
    }

    setLoading(false);
  };

  const handleGetLikes = async () => {
    try {
      const response = await getLikes();
      if (response?.status === 200) {
        setLikedUsers(response?.data.activeLikes);
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage(String(error));
      setSeverity('error');
    }
  };

  useEffect(() => {
    handleGetUsers();
    handleGetLikes();
  }, []);

  const isLikedUser = (userId: number | undefined): boolean =>
    likedUsers?.some((likedUser: User) => likedUser.id === userId);

  return (
    <>
      {!loading && users?.length > 0 ? (
        <Grid container justify="center">
          {users.map((otherUser: User) => (
            <div
              key={otherUser.id}
              role="presentation"
              onClick={() => {
                setUser(otherUser);
                setUserDetailOpen(true);
              }}
            >
              <Grid item style={{ margin: '0.5rem', cursor: 'pointer' }}>
                <Avatar alt="avatar" src={otherUser.image.url} className={styles.avatar} />
                <Typography
                  variant="body2"
                  component="p"
                  gutterBottom
                  style={{ marginTop: '0.5rem', textAlign: 'center' }}
                >
                  {otherUser.nickname}
                </Typography>
              </Grid>
            </div>
          ))}
        </Grid>
      ) : (
        <Typography component="p" variant="body2" color="textSecondary">
          No Users.
        </Typography>
      )}
      <Dialog open={userDetailOpen} keepMounted onClose={() => setUserDetailOpen(false)}>
        <DialogContent>
          <Grid container justify="center">
            <Grid item>
              <Avatar alt="avatar" src={user.image.url} className={styles.avatar} />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item style={{ marginTop: '1rem' }}>
              <Typography
                variant="body1"
                component="p"
                gutterBottom
                style={{ textAlign: 'center' }}
              >
                {user.nickname} {getAge(user)}歳 ({userPrefecture()})
              </Typography>
              <Divider />
              <Typography
                variant="body2"
                component="p"
                gutterBottom
                style={{ marginTop: '0.5rem', fontWeight: 'bold' }}
              >
                Profile
              </Typography>
              <Typography
                variant="body2"
                component="p"
                color="textSecondary"
                style={{ marginTop: '0.5rem' }}
              >
                {user.profile ? user.profile : 'よろしくお願いします。'}
              </Typography>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Button
              variant="outlined"
              onClick={() => (isLikedUser(user.id) ? 0 : handleCreateLike(user))}
              color="secondary"
              startIcon={isLikedUser(user.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              disabled={!!isLikedUser(user.id)}
              style={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              {isLikedUser(user.id) ? 'いいね済み' : 'いいね'}
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity={severity}
        message={alertMessage}
      />
    </>
  );
};

export default Users;
