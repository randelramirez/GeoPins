export default function reducer(state, { type, payload }) {
  switch (type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: payload,
      };
    case 'IS_LOGGED_IN':
      return {
        ...state,
        isAuth: payload,
      };
    case 'SIGNOUT_USER':
      return {
        ...state,
        isAuth: false,
        currentUser: null,
      };
    case 'CREATE_DRAFT':
      return {
        ...state,
        currentPin: null,
        draft: {
          latitude: 0,
          longitude: 0,
        },
      };
    case 'UPDATE_DRAFT_LOCATION':
      return {
        ...state,
        draft: payload,
      };
    case 'DELETE_DRAFT':
      return {
        ...state,
        draft: null,
      };
    case 'GET_PINS':
      return {
        ...state,
        pins: payload,
      };
    case 'SET_PIN':
      return {
        ...state,
        currentPin: payload,
      };
    case 'CREATE_PIN':
      return {
        ...state,
        pins: [...state.pins, payload],
        currentPin: payload,
      };
    case 'DELETE_PIN':
      const deletedPin = payload;
      const currentPin =
        state.currentPin._id === deletedPin._id ? null : state.currentPin;
      const filteredPins = state.pins.filter(
        (pin) => pin._id !== deletedPin._id
      );
      return {
        ...state,
        pins: filteredPins,
        currentPin,
      };
    case 'CREATE_COMMENT':
      const updatedCurrentPin = payload;
      const updatedPins = state.pins.map((pin) =>
        pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin
      );
      return { ...state, pins: updatedPins, currentPin: updatedCurrentPin };
    default:
      return state;
  }
}
