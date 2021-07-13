import React, { useContext, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';

import { AuthContext } from 'App';
import { SignUpFormData, Severity } from 'types';
import genders from 'data/genders';
import prefectures from 'data/prefectures';
import { signUp } from 'lib/api/auth';
import AlertMessage from 'components/utils/AlertMessage';
import commonStyles from 'components/styles/common';

const SignUp: React.FC = () => {
  const styles = commonStyles();
  const history = useHistory();

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [gender, setGender] = useState<number>(0);
  const [prefecture, setPrefecture] = useState<number>(12);
  const [birthday, setBirthday] = useState<Date | null>(new Date('2000-01-01T00:00:00'));
  const [image, setImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  const uploadedImage = useCallback((event) => {
    const file = event.target.files[0];
    setImage(file);
  }, []);

  const displayImagePreview = useCallback((event) => {
    const file = event.target.files[0];
    setImagePreview(window.URL.createObjectURL(file));
  }, []);

  const createFormData = (): SignUpFormData => {
    const formData = new FormData() as SignUpFormData;

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('nickname', nickname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('passwordConfirmation', passwordConfirmation);
    formData.append('gender', String(gender));
    formData.append('prefecture', String(prefecture));
    formData.append('birthday', String(birthday));
    formData.append('image', image);

    return formData;
  };

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = createFormData();
    try {
      const response = await signUp(data);
      if (response.status === 200) {
        Cookies.set('_access_token', response.headers['access-token']);
        Cookies.set('_client', response.headers.client);
        Cookies.set('_uid', response.headers.uid);

        setIsSignedIn(true);
        setCurrentUser(response.data.data);
        history.push('/');

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setGender(0);
        setPrefecture(12);
        setBirthday(new Date());

        setAlertMessageOpen(true);
        setAlertMessage('Signed in successfully!');
        setSeverity('success');
      } else {
        setAlertMessageOpen(true);
        setAlertMessage('Wrong email or password. Please check again.');
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
      <form noValidate autoComplete="off">
        <Card className={styles.formCard}>
          <CardHeader className={styles.header} title="Sign Up" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="First Name"
              value={firstName}
              margin="dense"
              onChange={(event) => setFirstName(event.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Last Name"
              value={lastName}
              margin="dense"
              onChange={(event) => setLastName(event.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Nickname"
              value={nickname}
              margin="dense"
              onChange={(event) => setNickname(event.target.value)}
            />
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
              label="Password"
              type="password"
              value={password}
              margin="dense"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password (confirmation)"
              type="password"
              value={passwordConfirmation}
              margin="dense"
              autoComplete="current-password"
              onChange={(event) => setPasswordConfirmation(event.target.value)}
            />
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={gender}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                  setGender(event.target.value as number)
                }
                label="Gender"
              >
                {Object.entries(genders).map(([key, value]) => (
                  <MenuItem value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">居住地</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={prefecture}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                  setPrefecture(event.target.value as number)
                }
                label="居住地"
              >
                {Object.entries({ ...prefectures }).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  fullWidth
                  inputVariant="outlined"
                  margin="dense"
                  id="date-picker-dialog"
                  label="生年月日"
                  format="yyyy/MM/dd"
                  value={birthday}
                  onChange={(date: Date | null) => {
                    setBirthday(date);
                  }}
                  KeyboardButtonProps={{ 'aria-label': 'change date' }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <div className={styles.imageUploadBtn}>
              <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
                <input
                  accept="image/*"
                  className={styles.imageUploadBtn}
                  id="icon-button-file"
                  type="file"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    uploadedImage(event);
                    displayImagePreview(event);
                  }}
                />
              </label>
            </div>
            {imagePreview ? (
              <Box className={styles.box}>
                <IconButton color="inherit" onClick={() => setImagePreview('')}>
                  <CancelIcon />
                </IconButton>
                <img src={imagePreview} alt="preview" className={styles.imagePreview} />
              </Box>
            ) : null}
            <div style={{ textAlign: 'right' }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={
                  !!(
                    !firstName ||
                    !lastName ||
                    !nickname ||
                    !email ||
                    !password ||
                    !passwordConfirmation
                  )
                }
                className={styles.submitBtn}
                onClick={handleSignUp}
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
        severity={severity}
        message={alertMessage}
      />
    </>
  );
};

export default SignUp;
