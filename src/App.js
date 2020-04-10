import React, { useState } from "react";
import "./App.css";
import thunk from "redux-thunk";
import logger from "redux-logger";
// import { createStore, applyMiddleware, compose } from "redux";
import { createStore, applyMiddleware, compose } from "./exploreRedux";
import delay from "utils/delay";

(function () {
  // test compose
  const a = (next) => (action) => {
    console.log("a");
    return next(action);
  };

  const b = (next) => (action) => {
    console.log("b");
    return next(action);
  };

  const c = (next) => (action) => {
    console.log("c");
    return next(action);
  };

  const com = compose(a, b, c);

  const dispatch = () => {
    console.log("dispatch");
  };

  const test = com(dispatch);

  test();
})();

const loggerTest = ({ getState }) => (next) => (action) => {
  console.log("will dispatch", action);

  // Call the next dispatch method in the middleware chain.
  const returnValue = next(action);

  console.log("state after dispatch", getState());

  // This will likely be the action itself, unless
  // a middleware further in chain changed it.
  return returnValue;
};

const middlewareTest = ({ getState }) => (next) => (action) => {
  const returnValue = next(action);
  console.log("1", returnValue);
  console.log("2", action);

  return returnValue;
};

let ID = 0;

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: ++ID,
          text: action.text,
        },
      ];

    case "REMOVE_TODO":
      return state.filter(({ id }) => id !== action.id);

    default:
      return state;
  }
};

// Note: logger must be the last middleware in chain, otherwise it will log thunk and promise, not actual actions
const store = createStore(
  reducer,
  [
    {
      text: "Use Redux",
      id: ID,
    },
  ],
  applyMiddleware(thunk, logger, middlewareTest)
);

function App() {
  const [list, setList] = useState(store.getState());

  function handleBtn() {
    store.dispatch({
      type: "ADD_TODO",
      text: "Read the docs",
    });

    setList(store.getState());
  }

  async function asyncFn(dispatch) {
    await delay(5000);
    dispatch({
      type: "ADD_TODO",
      text: "Read the docs(Async)",
    });
    setList(store.getState());
  }

  function handleBtnAsync() {
    store.dispatch(asyncFn);
  }

  function makeDelete(id) {
    store.dispatch({
      id,
      type: "REMOVE_TODO",
    });

    setList(store.getState());
  }

  return (
    <div className="App">
      <button onClick={handleBtn}>Add</button>
      <br />
      <br />
      <button onClick={handleBtnAsync}>Async Add</button>
      <ul>
        {list.map(({ text, id }) => (
          <li key={id} className="item">
            <p>
              ({id}) -- {text}
            </p>
            <button className="del" onClick={() => makeDelete(id)}>
              DELETE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
