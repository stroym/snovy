import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import Database from "./data/Database"
import "what-input"

export const dexie = new Database()

ReactDOM.render(
  <React.StrictMode>
    <App dexie={dexie}/>
  </React.StrictMode>,
  document.getElementById("root")
)