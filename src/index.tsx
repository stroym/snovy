import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import Database from "./data/Database"
import whatInput from "what-input"
import {OptionsProvider} from "./util/OptionsContext"

export const dexie = new Database()

whatInput.specificKeys([9])

ReactDOM.render(
  <React.StrictMode>
    <OptionsProvider>
      <App/>
    </OptionsProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

console.log(document.querySelector("div:not([class]):not([id])"))