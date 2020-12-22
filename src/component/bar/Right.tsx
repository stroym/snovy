import React from "react";
import TagSelector from "../selector/Tag";

export default class SidebarRight extends React.Component {

  render() {
    return (
      <div id="snovy-bar-right">
        <TagSelector/>
      </div>
    );
  }

}