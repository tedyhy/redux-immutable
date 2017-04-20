// 根据 action 类型判断
export default (action: Object): string => {
  return action && action.type === '@@redux/INIT' ? 'initialState argument passed to createStore' : 'previous state received by the reducer';
};
