import React from "react";
import TagSelector from "../selector/tag";
import TagFilter from "../tagFilter";

export default class SidebarRight extends React.Component {

  render() {
    return (
      <div id="snovy-bar-right">
        <TagSelector/>
        <TagFilter/>
      </div>
    );
  }

}