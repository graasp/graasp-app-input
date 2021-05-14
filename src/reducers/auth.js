import { FLAG_GETTING_AUTH_TOKEN, GET_AUTH_TOKEN_SUCCEEDED } from '../types';

const DEFAULT_SETTINGS = {};

const INITIAL_STATE = {
  token: null,
  itemId: null,
  settings: DEFAULT_SETTINGS,
  // array of flags to keep track of various actions
  activity: [],
};

export default (state = INITIAL_STATE, { payload, type }) => {
  switch (type) {
    case FLAG_GETTING_AUTH_TOKEN:
      // todo: handle activity for other calls
      return {
        ...state,
        activity: payload
          ? [...state.activity, payload]
          : [...state.activity.slice(1)],
      };
    case GET_AUTH_TOKEN_SUCCEEDED:
      return {
        ...state,
        token: payload?.token,
        itemId: payload?.itemId,
        settings: payload?.settings,
      };
    default:
      return state;
  }
};
