// @flow
import type { UnitState } from '../unit/constants';
import type { ServiceState } from '../service/constants';
import type { SearchState } from '../search/constants';

export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const DIGITRANSIT_API_BASE_URL =
  process.env.REACT_APP_DIGITRANSIT_API_URL;
export const APP_NAME = process.env.REACT_APP_APP_NAME;

export const DEFAULT_LANG = 'fi';

export const mobileBreakpoint = 768;

export type Action = {
  type: string,
  payload: Object,
};

export type FetchAction = {
  type: string,
  payload: {
    params: Object,
  },
};

export type PositionAction = {
  type: string,
  payload: {
    position: Object,
  },
};

export type EntityAction = {
  type: string,
  payload: {
    entities: Object,
    result: mixed,
  },
};

export type AppState = {
  unit: UnitState,
  service: ServiceState,
  search: SearchState,
};

export type QueryValue = string | Array<string>;
