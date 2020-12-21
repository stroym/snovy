import React from "react";
import TopBar from "./bar/Top";
import LeftBar from "./bar/Left";
import RightBar from "./bar/Right";
import BottomBar from "./bar/Bottom";
import Editor from "./Editor";

export default class Container extends React.Component {

  render() {
    return (
      <div id="snovy-container">
        <TopBar/>
        <LeftBar/>
        <RightBar/>
        <BottomBar/>
        <Editor/>
      </div>
    );
  }

}