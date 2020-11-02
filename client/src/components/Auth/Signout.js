import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import { GoogleLogout } from 'react-google-login';
import UserContext from '../../Context';
import { useMediaQuery } from '@material-ui/core';

const Signout = ({ classes }) => {
  const { dispatch } = useContext(UserContext);
  const onSignout = () => {
    dispatch({ type: 'SIGNOUT_USER' });
    console.log('Signed out user');
  };
  const mobileSize = useMediaQuery('(max-width: 650px)');
  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      render={({ onClick }) => {
        return (
          <span onClick={onclick}>
            <Typography
              className={classes.buttonText}
              style={{ display: mobileSize ? 'none' : 'block' }}
              variant="body1"
            >
              Signout
            </Typography>
            <ExitToAppIcon className={classes.buttonIcon} />
          </span>
        );
      }}
    />
  );
};

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex',
  },
  buttonText: {
    color: 'orange',
  },
  buttonIcon: {
    marginLeft: '5px',
    color: 'orange',
  },
};

export default withStyles(styles)(Signout);
