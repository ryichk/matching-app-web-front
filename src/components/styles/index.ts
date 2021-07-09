import {
  makeStyles,
  Theme,
} from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) => ({
  link: {
    textDecoration: 'none',
  },
  container: {
    marginTop: theme.spacing(6),
  },
  headerContainer: {
    marginTop: '3rem'
  },
  box: {
    marginBottom: '1.5rem'
  },
  signInBox: {
    marginTop: '2rem',
  },
  title: {
    flexgrow: 1,
    textDecoration: 'none',
    color: 'inherit'
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  header: {
    textAlign: 'center',
  },
  card: {
    width: 340
  },
  formCard: {
    padding: theme.spacing(2),
    maxWidth: 400,
  },
  input: {
    display: 'none'
  },
  imagePreview: {
    width: '100%'
  },
  submitBtn: {
    marginTop: theme.spacing(2),
    flexGrow: 1,
    textTransform: 'none',
  },
  inputFileButton: {
    textTransform: 'none',
    color: theme.palette.primary.main
  },
  imageUploadBtn: {
    textAlign: 'right'
  },
  linkBtn: {
    textTransform: 'none',
    marginLeft: theme.spacing(1)
  },
}));
