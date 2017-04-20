import Immutable from 'immutable';
import getStateName from './getStateName';

// 非线上环境对传参 state 进行验证
export default (state: Object, reducers: Object, action: Object) => {
  const reducerNames = Object.keys(reducers);

  // 没有 reducer 时报错
  if (!reducerNames.length) {
    return 'Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.';
  }

  // 根据 action 类型判断
  const stateName = getStateName(action);

  // 如果是 Immutable.isImmutable 方法存在，则校验 state 是否是 Immutable 类型数据
  // 如果不是 Immutable 类型数据，抛出错误
  // 参考：
  // https://github.com/facebook/immutable-js/blob/master/src/Predicates.js
  // https://github.com/facebook/immutable-js/blob/master/src/Iterator.js
  if (Immutable.isImmutable ? !Immutable.isImmutable(state) : !Immutable.Iterable.isIterable(state)) {
    return 'The ' + stateName + ' is of unexpected type. Expected argument to be an instance of Immutable.Collection or Immutable.Record with the following properties: "' + reducerNames.join('", "') + '".';
  }

  // 将 state 由 Immutable 转成原生数组，然后遍历筛选出 state 中不存在的 reducer。
  const unexpectedStatePropertyNames = state.toSeq().keySeq().toArray().filter((name) => {
    return !reducers.hasOwnProperty(name);
  });

  // 如果存在不期望的 reducer 时，抛出错误
  if (unexpectedStatePropertyNames.length > 0) {
    return 'Unexpected ' + (unexpectedStatePropertyNames.length === 1 ? 'property' : 'properties') + ' "' + unexpectedStatePropertyNames.join('", "') + '" found in ' + stateName + '. Expected to find one of the known reducer property names instead: "' + reducerNames.join('", "') + '". Unexpected properties will be ignored.';
  }

  return null;
};
