import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserContext from './userContext';
import reducer from './reducer';
import ProtectedRoute from './components/ProtectedRoute';

import App from './pages/App';
import Splash from './pages/Splash';

import 'mapbox-gl/dist/mapbox-gl.css';
import * as serviceWorker from './serviceWorker';

const Root = () => {
  const initialState = useContext(UserContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Router>
      <UserContext.Provider value={{ state, dispatch }}>
        <Switch>
          <ProtectedRoute exact path="/" component={App} />
          <Route path="/login" component={Splash} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
