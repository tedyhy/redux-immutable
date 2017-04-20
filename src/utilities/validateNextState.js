// 校验新的 state（nextState）
// 如果 nextState 为 undefined，则抛出错误。
export default (nextState, reducerName: string, action: Object): void => {
  // eslint-disable-next-line no-undefined
  if (nextState === undefined) {
    throw new Error('Reducer "' + reducerName + '" returned undefined when handling "' + action.type + '" action. To ignore an action, you must explicitly return the previous state.');
  }
};
