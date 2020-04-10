import compose from "./compose";

export default (...middlewares) => {
  return (createStore) => (reducer, ...args) => {
    const store = createStore(reducer, ...args);

    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    };

    const chain = middlewares.map((middleware) => middleware(middlewareAPI));

    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
};
