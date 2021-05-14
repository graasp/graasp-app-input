import { GRAASP_APP_ID } from '../config/settings';
import {
  FLAG_GETTING_AUTH_TOKEN,
  GET_AUTH_TOKEN,
  GET_AUTH_TOKEN_SUCCEEDED,
  SET_AUTH_TOKEN_SUCCEEDED,
} from '../types';
import { flag, postMessage } from './common';

export const setAuthToken = payload => async dispatch => {
  dispatch({
    type: SET_AUTH_TOKEN_SUCCEEDED,
    payload,
  });
};

export const getAuthToken = () => async dispatch => {
  const flagGettingAuthToken = flag(FLAG_GETTING_AUTH_TOKEN);
  dispatch(flagGettingAuthToken(true));

  const onMessage = () => {
    // do something
  };

  const receiveMessage = event => {
    const { type, payload } = event?.data || {};
    // get init message getting the Message Channel port
    if (type === GET_AUTH_TOKEN_SUCCEEDED) {
      dispatch({ type: GET_AUTH_TOKEN_SUCCEEDED, payload });
      const port2 = event.ports[0];
      port2.onmessage = onMessage;

      // will use port for further communication
      // stop to listen to window message
      window.removeEventListener('message', receiveMessage);

      dispatch(flagGettingAuthToken(false));
    }
  };

  window.addEventListener('message', receiveMessage);

  // request parent to provide item data (item id, settings...) and access token
  postMessage({
    type: GET_AUTH_TOKEN,
    payload: {
      app: GRAASP_APP_ID,
      origin: window.location.origin,
    },
  });
};
