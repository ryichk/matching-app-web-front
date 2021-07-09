import React, { useContext, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';

import { AuthContext } from 'App';
import AlertMessage from 'components/utils/AlertMessage';
import { updateUser } from 'lib/api/auth';
import { useStyles } from 'components/styles/index';
import { prefectures } from 'data/prefectures';
import { UpdateUserFormData } from 'interfaces/index';

const EditUserProfile: React.FC = () => {
  const styles = useStyles();
  const history = useHistory();

  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const [nickname, setNickname] = useState<string | undefined>(currentUser?.nickname);
  const [prefecture, setPrefecture] = useState<number | undefined>(currentUser?.prefecture);
  const [profile, setProfile] = useState<string | undefined>(currentUser?.profile);
  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const uploadedImage = useCallback((event) => {
    const file = event.target.files[0];
    setImage(file);
  }, []);

  const displayImagePreview = useCallback((event) => {
    const file = event.target.files[0];
    setImagePreview(window.URL.createObjectURL(file));
  }, []);

  const createFormData = (): UpdateUserFormData => {
    const formData = new FormData();

    formData.append('nickname', nickname || '');
    formData.append('prefecture', String(prefecture));
    formData.append('profile', profile || '');
    formData.append('image', image);

    return formData;
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const data = createFormData();

    try {
      const response = await updateUser(data);
      console.log(response);

      if (response.status === 200) {
        Cookies.remove('_access_token');
        Cookies.remove('_client');
        Cookies.remove('_uid');

        Cookies.set('_access_token', response.headers['access-token']);
        Cookies.set('_client', response.headers['client']);
        Cookies.set('_uid', response.headers['uid']);
        setCurrentUser(response.data.data);

        history.push('/');

        console.log('Update user successfully!!');
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
      console.log('Failed in updating user');
    }
  }

  return (
    <>
      <form noValidate autoComplete='off'>
        <Card className={styles.card}>
          <CardHeader className={styles.header} title='Edit Profile' />
          <Grid container justify='center'>
            <Grid item>
              <Avatar
                alt='avatar'
                src={currentUser?.image.url}
                className={styles.avatar}
              />
            </Grid>
          </Grid>
          <CardContent>
            <TextField
              variant='outlined'
              required
              fullWidth
              label='Nickname'
              value={nickname}
              margin='dense'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNickname(event.target.value)}
            />
            <FormControl
              variant='outlined'
              margin='dense'
              fullWidth
            >
              <InputLabel id='demo-simple-select-outlined-label'>居住地</InputLabel>
              <Select
                labelId='demo-simple-select-outlined-label'
                id='demo-simple-select-outlined'
                value={prefecture}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => setPrefecture(event.target.value as number)}
                label='居住地'
              >
                {
                  prefectures.map((prefecture, index) => <MenuItem key={index + 1} value={index + 1}>{prefecture}</MenuItem>)
                }
              </Select>
            </FormControl>
            <TextField
              placeholder='Within 3,000 characters'
              variant='outlined'
              multiline
              fullWidth
              label='Profile'
              rows='8'
              value={profile}
              margin='dense'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProfile(event.target.value);
              }}
            />
            <div className={styles.imageUploadBtn}>
              <input
                accept='image/*'
                className={styles.input}
                id='icon-button-file'
                type='file'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  uploadedImage(event);
                  displayImagePreview(event);
                }}
              />
              <label htmlFor='icon-button-file'>
                <IconButton
                  color='primary'
                  aria-label='upload picture'
                  component='span'
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </div>
            {
              imagePreview ? (
                <Box className={styles.box}>
                  <IconButton
                    color='inherit'
                    onClick={() => setImagePreview('')}
                  >
                    <CancelIcon />
                  </IconButton>
                  <img
                    src={imagePreview}
                    alt='preview'
                    className={styles.imagePreview}
                  />
                </Box>
              ) : null
            }
            <div style={{ textAlign: 'center' }}>
              <Button
                type='submit'
                variant='outlined'
                color='primary'
                disabled={!nickname || !prefecture || !profile ? true : false}
                className={styles.submitBtn}
                onClick={handleSubmit}
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity='error'
        message='Something to Wrong.'
      />
    </>
  )
}

export default EditUserProfile;
