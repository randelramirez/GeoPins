import React, { useContext } from 'react';
import Login from '../components/Auth/Login';
import UserContext from '../userContext';
import { Redirect } from 'react-router-dom';

const Splash = () => {
  const { state } = useContext(UserContext);
  /* if the user is already logged in we redirect to home page otherwise display Login page */
  return state.isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;
