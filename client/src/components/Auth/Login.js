import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request'; /* alternative to apollo */
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import UserContext from '../../Context';
import { ME_QUERY } from '../../graphql/queries';
import Typography from '@material-ui/core/Typography';

const Login = ({ classes }) => {
  const { dispatch } = useContext(UserContext);

  const onSuccess = async (googleUser) => {
    try {
      // user was able to login in google
      const idToken = googleUser.getAuthResponse().id_token;

      // Create GraphQLClient instance, setup connection to the GraphQLServer
      const client = new GraphQLClient('http://localhost:4000/graphql', {
        headers: { authorization: idToken },
      });

      // we make a request to the GraphQLServer, passing the authorization with the idToken
      const { me } = await client.request(ME_QUERY);

      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = (error) => {
    console.error('Error Loggin in', error);
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: 'rgb(66,133, 244)' }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="65979260083-oroughcrouri4nais5l7fosuh8alnihs.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        theme="dark"
        buttonText="Login with Google 😎"
      />
    </div>
  );
};

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default withStyles(styles)(Login);
