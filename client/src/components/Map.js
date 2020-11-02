import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import Blog from './Blog';
import { withStyles } from '@material-ui/core/styles';
import PinIcon from '../components/PinIcon';
import Context from '../Context';
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import { Subscription } from 'react-apollo';
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
} from '../graphql/subscriptions';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const INITIAL_VIEW_PORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13,
};

const Map = ({ classes }) => {
  console.log('Map executing');
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewPort] = useState(INITIAL_VIEW_PORT);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);
  const client = useRef(useClient());
  // if it its less than 650px, it will return true
  const mobileSize = useMediaQuery('(max-width: 650px)');

  /*
    we need to wrap it in useRef because it's an object and its value is always treated as new on each render 
    because object are reference equality
  */
  const currentViewPort = useRef(viewport);

  /* useEffect will run continuously because currentViewPort is still considered as new object */
  // const currentViewPort2 = useMemo(() => {
  //   return viewport;
  // }, [viewport]);

  const handleSelectPin = (pin) => {
    setPopup(pin);
    dispatch({ type: 'SET_PIN', payload: pin });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const getUserPosition = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        setViewPort({ ...currentViewPort.current, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  }, []);

  const getPins = useCallback(async () => {
    const { getPins } = await client.current.request(GET_PINS_QUERY);
    dispatch({ type: 'GET_PINS', payload: getPins });
  }, [dispatch]); // client is causing infinite re-render

  useEffect(() => {
    getUserPosition();
  }, [getUserPosition]);

  useEffect(() => {
    /*
      React state update on an unmounted component
      https://www.debuggr.io/react-update-unmounted-component/
    */
    let mounted = true;
    if (mounted) {
      getPins();
    }
    return () => (mounted = false);
  }, [getPins]);

  useEffect(() => {
    const pinExists = popup && state.pins.find((pin) => pin._id === popup._id);

    if (!pinExists) {
      // fix for when we have simulataneuos users, if one user has the pin selected and it was deleted by another session
      // we unselect the pin and clear the popup/blog content screen

      /*
        subscription is executed
        reducer is executed (from useReducer defined in index)
        index and child component is re-rendering (index re-rendering because Context is defined there and its value changed also dispatch of useReducer causes update/re-render)  
        Map is re-renderered
      */

      setPopup(null);
    }
  }, [popup, state.pins]);

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { longitude, latitude },
    });
  };

  const highlightNewPin = (pin) => {
    const isNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? 'limegreen' : 'darkblue';
  };

  const handleDeletePin = async (pin) => {
    const variables = { pinId: pin._id };

    /*const { deletePin } =*/ await client.current.request(
      DELETE_PIN_MUTATION,
      variables
    );

    // dispatch({ type: 'DELETE_PIN', payload: deletePin });
    // No need to dispatch, we're using apollo subscription, see resolvers deletePin

    setPopup(null);
  };

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      {/*height of the viewport - height of the header */}
      <ReactMapGL
        onClick={(event) => handleMapClick(event)}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicmFuZGVsciIsImEiOiJja2dyb2xmdmMxMmV1MnFxaXF1cm14M2R2In0.Jv3sAJKddnAMvfzog5ntQA"
        scrollZoom={!mobileSize}
        onViewportChange={(newViewPort) => setViewPort(newViewPort)}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={(newViewPort) => setViewPort(newViewPort)}
          />
        </div>
        {/* Pin for user's Current position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red"></PinIcon>
          </Marker>
        )}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink"></PinIcon>
          </Marker>
        )}
        {/* Created Pins */}
        {state.pins.map((pin) => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}
        {/* Popup Dialog for Created Pins*/}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      {/* Subscriptions for creating / Updating / Deleting Pins */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          dispatch({ type: 'CREATE_PIN', payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          console.log('subscription delete executing');
          const { pinDeleted } = subscriptionData.data;
          dispatch({ type: 'DELETE_PIN', payload: pinDeleted });
        }}
      />

      {/* Blog Area to Add Pin Content */}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex',
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em',
  },
  deleteIcon: {
    color: 'red',
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover',
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
};

export default withStyles(styles)(Map);
