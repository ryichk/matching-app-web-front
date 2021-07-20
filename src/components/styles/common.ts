import { makeStyles, Theme } from '@material-ui/core';

const common = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    minWidth: 340,
    maxWidth: '100%',
  },
  link: {
    textDecoration: 'none',
  },
  chatRoomLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  container: {
    marginTop: theme.spacing(6),
  },
  headerContainer: {
    marginTop: '3rem',
  },
  box: {
    marginBottom: '1.5rem',
  },
  signInBox: {
    marginTop: '2rem',
  },
  title: {
    flexgrow: 1,
    textDecoration: 'none',
    color: 'inherit',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
  },
  card: {
    width: 340,
  },
  formCard: {
    padding: theme.spacing(2),
    maxWidth: 400,
  },
  formWrapper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 340,
  },
  input: {
    display: 'none',
  },
  textInputWrapper: {
    width: '100%',
  },
  imagePreview: {
    width: '100%',
  },
  submitBtn: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textTransform: 'none',
  },
  messageSubmitBtn: {
    marginLeft: theme.spacing(1),
  },
  inputFileButton: {
    textTransform: 'none',
    color: theme.palette.primary.main,
  },
  imageUploadBtn: {
    textAlign: 'right',
  },
  linkBtn: {
    textTransform: 'none',
    marginLeft: theme.spacing(1),
  },
}));

export default common;
