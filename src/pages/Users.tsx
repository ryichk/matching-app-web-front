import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  Typography,
  Dialog,
  DialogContent,
  Avatar,
  Button,
  Divider,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import AlertMessage from 'components/utils/AlertMessage';
import { prefectures } from 'data/prefectures';
import { getUsers } from 'lib/api/users';
import { getLikes, createLike } from 'lib/api/likes';
import { getAge } from 'lib/utils/user';
import { useStyles } from 'components/styles/index';
import { User, Like } from 'interfaces/index';
import { AuthContext } from 'App';

const Users: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const styles = useStyles();

  const initialUserState: User = {
    id: 0,
    uid: '',
    provider: '',
    email: '',
    firstName: '',
    lastName: '',
    image: {
      url: ''
    },
    gender: 0,
    birthday: '',
    profile: '',
    prefecture: 13,
    allowPasswordChange: true
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Array<User>>([]);
  const [user, setUser] = useState<User>(initialUserState);
  const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false);
  const [likedUsers, setLikedUsers] = useState<Array<User>>([]);
  const [likes, setLikes] = useState<Array<Like>>([]);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const userPrefecture = (): string => {
    return prefectures[(user.prefecture) - 1];
  }

  const handleCreateLike = async (user: User) => {
    const data: Like = {
      fromUserId: currentUser?.id,
      toUserId: user.id
    }

    try {
      const response = await createLike(data);
      console.log(response);

      if (response?.status === 200) {
        setLikes([response.data.like, ...likes]);
        setLikedUsers([user, ...likedUsers]);

        console.log(response?.data.like);
      } else {
        console.log('Like creation Failed');
      }

      if (response?.data.isMatched) {
        setAlertMessageOpen(true);
        setUserDetailOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetUsers = async () => {
    try {
      const response = await getUsers();
      console.log(response);

      if (response?.status === 200) {
        setUsers(response?.data.users);
      } else {
        console.log('No users');
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  const handleGetLikes = async () => {
    try {
      const response = await getLikes();
      console.log(response);

      if (response?.status === 200) {
        setLikedUsers(response?.data.activeLikes);
      } else {
        console.log('No likes');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetUsers();
    handleGetLikes();
  }, []);

  const isLikedUser = (userId: number | undefined): boolean => {
    return likedUsers?.some((likedUser: User) => likedUser.id === userId);
  }

  return (
    <>
      {
        !loading && users?.length > 0 ? (
          <Grid container justify='center'>
            {
              users.map((user: User, index: number) => {
                return (
                  <div key={index} onClick={() => {
                    setUser(user);
                    setUserDetailOpen(true);
                  }}>
                    <Grid item style={{ margin: '0.5rem', cursor: 'pointer' }}>
                      <Avatar
                        alt='avatar'
                        src={user.image.url}
                        className={styles.avatar}
                      />
                      <Typography
                        variant='body2'
                        component='p'
                        gutterBottom
                        style={{ marginTop: '0.5rem', textAlign: 'center' }}
                      >
                        {user.nickname}
                      </Typography>
                    </Grid>
                  </div>
                );
              })
            }
          </Grid>
        ) : (
          <Typography
            component='p'
            variant='body2'
            color='textSecondary'
          >
            No Users.
          </Typography>
        )
      }
      <Dialog
        open={userDetailOpen}
        keepMounted
        onClose={() => setUserDetailOpen(false)}
      >
        <DialogContent>
          <Grid container justify='center'>
            <Grid item>
                <Avatar
                  alt='avatar'
                  src={user.image.url}
                  className={styles.avatar}
                />
              </Grid>
            </Grid>
            <Grid container justify='center'>
              <Grid item style={{ marginTop: '1rem' }}>
                <Typography
                  variant='body1'
                  component='p'
                  gutterBottom
                  style={{ textAlign: 'center' }}
                >
                  {user.nickname} {getAge(user)}歳 ({userPrefecture()})
                </Typography>
                <Divider />
                <Typography
                  variant='body2'
                  component='p'
                  gutterBottom
                  style={{ marginTop: '0.5rem', fontWeight: 'bold' }}
                >
                  Profile
                </Typography>
                <Typography
                  variant='body2'
                  component='p'
                  color='textSecondary'
                  style={{ marginTop: '0.5rem' }}
                >
                  {user.profile ? user.profile : 'よろしくお願いします。' }
                </Typography>
              </Grid>
            </Grid>
            <Grid container justify='center'>
              <Button
                variant='outlined'
                onClick={() => isLikedUser(user.id) ? void(0) : handleCreateLike(user)}
                color='secondary'
                startIcon={isLikedUser(user.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                disabled={isLikedUser(user.id) ? true : false}
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
        severity='success'
        message='マッチング！'
      />
    </>
  );
}

export default Users;
