import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
import Blog from './Blog';
import { withStyles } from '@material-ui/core/styles';
import PinIcon from '../components/PinIcon';
import Context from '../Context';
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

// const INITIAL_VIEW_PORT = {
//   latitude: 14.44324,
//   longitude: 121.04337,
//   zoom: 13,
// };

const INITIAL_VIEW_PORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13,
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewPort] = useState(INITIAL_VIEW_PORT);
  const [userPosition, setUserPosition] = useState(null);
  const client = useRef(useClient());

  /*
    we need to wrap it in useRef because it's an object and its value is always treated as new on each render 
    because object are reference equality
  */
  const currentViewPort = useRef(viewport);

  /* useEffect will run continuously because currentViewPort is still considered as new object */
  // const currentViewPort2 = useMemo(() => {
  //   return viewport;
  // }, [viewport]);

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
    console.log(getPins);
    dispatch({ type: 'GET_PINS', payload: getPins });
  }, [dispatch]); // client is causing infinite re-render

  useEffect(() => {
    getUserPosition();
  }, [getUserPosition]);

  useEffect(() => {
    getPins();
  }, [getPins]);

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

  return (
    <div className={classes.root}>
      {/*height of the viewport - height of the header */}
      <ReactMapGL
        onClick={(event) => handleMapClick(event)}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoicmFuZGVsciIsImEiOiJja2dyb2xmdmMxMmV1MnFxaXF1cm14M2R2In0.Jv3sAJKddnAMvfzog5ntQA"
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
            <PinIcon size={40} color="darkblue" />
          </Marker>
        ))}
      </ReactMapGL>
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
