import React from "react";
import "./App.scss";
import TopBar from "./component/bar/Top";
import LeftBar from "./component/bar/Left";
import RightBar from "./component/bar/Right";
import BottomBar from "./component/bar/Bottom";
import Editor from "./component/Editor";

function App() {
  return (
    <div id="snovy-app">
      <TopBar/>
      <LeftBar/>
      <RightBar/>
      <BottomBar/>
      <Editor/>
    </div>
  );
}

export default App;
