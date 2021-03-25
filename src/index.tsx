import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import Database from "./data/Database"
import whatInput from "what-input"

export const dexie = new Database()

whatInput.specificKeys([9])

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById("root")
)