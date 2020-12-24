import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

//TODO disabled strict mode because of react-select warnings
ReactDOM.render(
  // <React.StrictMode>
  <App/>,
  // </React.StrictMode>,
  document.getElementById("root")
);