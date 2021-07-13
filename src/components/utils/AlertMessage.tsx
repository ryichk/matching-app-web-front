import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { AlertMessageProps } from 'types';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props: AlertProps, ref) => {
  const {
    action,
    children,
    classes,
    closeText,
    color,
    icon,
    iconMapping,
    onClose,
    role,
    severity,
  } = props;
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      action={action}
      classes={classes}
      closeText={closeText}
      color={color}
      icon={icon}
      iconMapping={iconMapping}
      onClose={onClose}
      role={role}
      severity={severity}
    >
      {children}
    </MuiAlert>
  );
});

const AlertMessage = ({ open, setOpen, severity, message }: AlertMessageProps): JSX.Element => {
  const handleCloseAlertMessage = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleCloseAlertMessage}
    >
      <Alert onClose={handleCloseAlertMessage} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
