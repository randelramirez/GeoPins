import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';
import { GoogleLogout } from 'react-google-login';
import UserContext from '../../Context';

const Signout = ({ classes }) => {
  const { dispatch } = useContext(UserContext);
  const onSignout = () => {
    dispatch({ type: 'SIGNOUT_USER' });
    console.log('Signed out user');
  };
  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      render={({ onClick }) => {
        return (
          <span onClick={onclick}>
            <Typography className={classes.buttonText} variant="body1">
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
