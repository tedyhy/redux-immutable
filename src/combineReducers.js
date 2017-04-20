import Immutable from 'immutable';
import {
  getUnexpectedInvocationParameterMessage,
  validateNextState
} from './utilities';

// 传参 (reducers, getDefaultState)
// reducers 是一个对象类型
// getDefaultState 可选，如果有则是一个函数类型，默认函数为 Immutable.Map 可以生成不可变数据对象
// 此函数返回值为函数类型
export default (reducers: Object, getDefaultState: ?Function = Immutable.Map): Function => {
  const reducerKeys = Object.keys(reducers);

  // eslint-disable-next-line space-infix-ops
  // 如果没有传参 inputState，则调用 getDefaultState() 生成默认 state。
  return (inputState: ?Function = getDefaultState(), action: Object): Immutable.Map => {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== 'production') {
      // 意外参数调用错误警告，对 inputState、reducers 做校验
      const warningMessage = getUnexpectedInvocationParameterMessage(inputState, reducers, action);

      // 输出警告内容
      if (warningMessage) {
        // eslint-disable-next-line no-console
        console.error(warningMessage);
      }
    }

    // 使用 withMutations 批量处理 inputState，提高 Immutable 性能。
    return inputState
      .withMutations((temporaryState) => {
        // 遍历 reducers
        reducerKeys.forEach((reducerName) => {
          // 当前 reducer 函数
          const reducer = reducers[reducerName];
          // 从临时可变拷贝集合 temporaryState 中获取 key 为 reducerName 的 state
          const currentDomainState = temporaryState.get(reducerName);
          // 执行当前 reducer 函数
          const nextDomainState = reducer(currentDomainState, action);

          // 校验 nextDomainState 值是否合法
          validateNextState(nextDomainState, reducerName, action);

          // 将新的 state（nextDomainState）更新到 State tree
          temporaryState.set(reducerName, nextDomainState);
        });
      });
  };
};
