import React from "react";
import TopBar from "./bar/top";
import LeftBar from "./bar/left";
import RightBar from "./bar/right";
import BottomBar from "./bar/bottom";
import Editor from "./editor";

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