import {
  DEFAULT_GET_REQUEST,
  DEFAULT_PATCH_REQUEST,
  DEFAULT_POST_REQUEST,
} from '../config/api';
import { MISSING_APP_INSTANCE_RESOURCE_ID_MESSAGE } from '../constants/messages';
import {
  FLAG_PATCHING_APP_DATA,
  GET_APP_DATA_SUCCEEDED,
  PATCH_APP_DATA_FAILED,
  PATCH_APP_DATA_SUCCEEDED,
  POST_APP_DATA_SUCCEEDED,
} from '../types';
import { showErrorToast } from '../utils/toasts';
import { flag, isErrorResponse } from './common';

export const getAppData = () => async (dispatch, getState) => {
  const {
    context: { apiHost },
    auth: { token, itemId },
  } = getState();

  const data = await fetch(`//${apiHost}/items/${itemId}/app-data`, {
    ...DEFAULT_GET_REQUEST,
    headers: {
      ...DEFAULT_GET_REQUEST.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await data.json();

  dispatch({
    type: GET_APP_DATA_SUCCEEDED,
    payload,
  });
};

export const postAppData = ({ text, type }) => async (dispatch, getState) => {
  const {
    context: { apiHost },
    auth: { token, itemId },
  } = getState();

  const data = await fetch(`//${apiHost}/items/${itemId}/app-data`, {
    body: JSON.stringify({ data: { text }, type }),
    ...DEFAULT_POST_REQUEST,
    headers: {
      ...DEFAULT_POST_REQUEST.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await data.json();

  dispatch({
    type: POST_APP_DATA_SUCCEEDED,
    payload,
  });
};

export const patchAppData = async ({ id, data } = {}) => async (
  dispatch,
  getState
) => {
  const flagPatchingAppData = flag(FLAG_PATCHING_APP_DATA);
  dispatch(flagPatchingAppData(true));
  try {
    const {
      context: { apiHost },
      auth: { token, itemId },
    } = getState();

    if (!id) {
      return showErrorToast(MISSING_APP_INSTANCE_RESOURCE_ID_MESSAGE);
    }

    const url = `//${apiHost}/items/${itemId}/app-data/${id}`;

    const body = {
      data,
    };

    const response = await fetch(url, {
      ...DEFAULT_PATCH_REQUEST,
      body: JSON.stringify(body),
      headers: {
        ...DEFAULT_PATCH_REQUEST.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // throws if it is an error
    await isErrorResponse(response);

    const appData = await response.json();

    return dispatch({
      type: PATCH_APP_DATA_SUCCEEDED,
      payload: appData,
    });
  } catch (err) {
    return dispatch({
      type: PATCH_APP_DATA_FAILED,
      payload: err,
    });
  } finally {
    dispatch(flagPatchingAppData(false));
  }
};
