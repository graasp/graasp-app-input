import { GRAASP_APP_ID } from '../config/settings';
import {
  FLAG_GETTING_ITEM_DATA,
  GET_AUTH_TOKEN,
  GET_AUTH_TOKEN_SUCCEEDED,
  GET_ITEM_DATA,
  GET_ITEM_DATA_SUCCEEDED,
  SET_AUTH_TOKEN_SUCCEEDED,
} from '../types';
import { flag, postMessage } from './common';

export const setAuthToken = payload => async dispatch => {
  dispatch({
    type: SET_AUTH_TOKEN_SUCCEEDED,
    payload,
  });
};

export const getItemData = () => async dispatch => {
  const flagPatchingAppData = flag(FLAG_GETTING_ITEM_DATA);
  dispatch(flagPatchingAppData(true));

  const onMessage = event => {
    const { data } = event;
    const { type, payload } = JSON.parse(data);
    try {
      // save token to further use the API directly
      if (type === GET_AUTH_TOKEN_SUCCEEDED) {
        // dispatch received data
        dispatch(setAuthToken(payload));
      }

      return payload;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const receiveMessage = event => {
    // get init message getting the Message Channel port
    if (event.data?.type === GET_ITEM_DATA_SUCCEEDED) {
      const payload = event.data;
      dispatch({ type: GET_ITEM_DATA_SUCCEEDED, payload });
      const port2 = event.ports[0];
      port2.onmessage = onMessage;

      // request auth token
      port2.postMessage({
        type: GET_AUTH_TOKEN,
        app: GRAASP_APP_ID,
        origin: window.location.origin,
      });

      // will use port for further communication
      // stop to listen to window message
      window.removeEventListener('message', receiveMessage);

      dispatch(flagPatchingAppData(false));
    }
  };

  window.addEventListener('message', receiveMessage);

  // request parent to provide item data (item id, settings...)
  postMessage({ type: GET_ITEM_DATA });
};
