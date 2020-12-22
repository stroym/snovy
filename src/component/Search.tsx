import React from "react";
import TagFilter from "./TagFilter";

export default class Search extends React.Component {

  render() {
    return (
      <span id="snovy-search">
        <TagFilter/>
      </span>
    );
  }

}