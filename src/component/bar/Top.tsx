import React from "react";
import Search from "../Search";

export default class TopBar extends React.Component {

  render() {
    return (
      <span id="snovy-bar-top">
        <Search/>
      </span>
    );
  }

}