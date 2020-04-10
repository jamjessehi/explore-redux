const createStore = (reducer, preloadedState, enhancer) => {
  if (typeof enhancer !== "undefined") {
    return enhancer(createStore)(reducer, preloadedState);
  }

  let currentState = preloadedState;

  const dispatch = (action) => {
    const state = currentState;
    currentState = reducer(state, action);
    return action;
  };

  const getState = () => {
    return currentState;
  };

  return {
    dispatch,
    getState,
  };
};

export default createStore;
