import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import Database from "./data/Database"
import whatInput from "what-input"
import {OptionsProvider} from "./util/OptionsContext"
import {AppProvider} from "./util/AppContext"

export const dexie = new Database()

whatInput.specificKeys([9])

ReactDOM.render(
  <React.StrictMode>
    <OptionsProvider>
      <AppProvider>
        <App/>
      </AppProvider>
    </OptionsProvider>
  </React.StrictMode>,
  document.getElementById("root")
)