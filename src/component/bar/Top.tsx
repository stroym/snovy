import React from "react";
import Search from "../Search";
import Toolbar from "../Toolbar";

export default class TopBar extends React.Component {

  render() {
    return (
      <span id="snovy-bar-top">
        <Search/>
        <Toolbar/>
      </span>
    );
  }

}