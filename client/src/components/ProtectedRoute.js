import React, { useContext } from 'react';
import Context from '../Context';
import { Route, Redirect } from 'react-router-dom';

/* 
    component: Component is destructuring a nested object 

   ex. component: {
        Component => we get this property
        property1
        property2
    }
*/
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context);
  return (
    <Route
      /*props = props from Route */
      render={(props) =>
        !state.isAuth ? <Redirect to="login" /> : <Component {...props} />
      }
      {...rest}
    />
  );
};

export default ProtectedRoute;
