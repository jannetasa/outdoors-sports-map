import {keys} from 'lodash';
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {UnitActions, IceSkatingServices, SkiingServices, QualityEnum} from './constants';
import {getUnitQuality, enumerableQuality} from './helpers';
import {EntityAction} from '../common/constants';

const isFetchingReducer = handleActions({
  [UnitActions.FETCH]: () => true,
  [UnitActions.RECEIVE]: () => false
}, false);

const byIdReducer = handleActions({
  [UnitActions.RECEIVE]: (state: Object, {payload: {entities}}: EntityAction) =>
    ({...entities.unit})
}, {});

const all = handleActions({
  [UnitActions.RECEIVE]: (state: Object, {payload: {entities}}: EntityAction) =>
    [...keys(entities.unit)]
}, []);

const iceskate = handleActions({
  [UnitActions.RECEIVE]: (state: Object, {payload: {entities}}: EntityAction) =>
    [...keys(entities.unit).filter((id) => entities.unit[id].services.some((unitService) => IceSkatingServices.indexOf(unitService.id) !== -1))]
}, []);

const ski = handleActions({
  [UnitActions.RECEIVE]: (state: Object, {payload: {entities}}: EntityAction) =>
    [...keys(entities.unit).filter((id) => entities.unit[id].services.some((unitService) => SkiingServices.indexOf(unitService.id) !== -1))]
}, []);

const openNow = handleActions({
  [UnitActions.RECEIVE]: (state: Object, {payload: {entities}}: EntityAction) =>
    [...keys(entities.unit).filter((id) => enumerableQuality(getUnitQuality(entities.unit[id])) <= QualityEnum.satisfactory)]
}, []);

const reducer = combineReducers({
  isFetching: isFetchingReducer,
  byId: byIdReducer,
  all,
  iceskate,
  ski,
  open_now: openNow
});

export default reducer;
