import {
  FLAG_GETTING_ITEM_DATA,
  GET_ITEM_DATA_SUCCEEDED,
  SET_AUTH_TOKEN_SUCCEEDED,
  SET_ITEM_DATA_SUCCEEDED,
} from '../types';

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
    case FLAG_GETTING_ITEM_DATA:
      // todo: handle activity for other calls
      return {
        ...state,
        activity: payload
          ? [...state.activity, payload]
          : [...state.activity.slice(1)],
      };
    case SET_AUTH_TOKEN_SUCCEEDED:
      return {
        ...state,
        token: payload,
      };
    case SET_ITEM_DATA_SUCCEEDED:
      return {
        ...state,
        itemId: payload?.itemId,
        settings: payload?.settings,
      };
    case GET_ITEM_DATA_SUCCEEDED:
      return {
        ...state,
        itemId: payload?.itemId,
        settings: payload?.settings,
      };
    default:
      return state;
  }
};
