import React from "react";
import Note from "../model/Note";

const Editor = (props: { activeNote: Note | undefined }) => {

  return (
    <textarea id="snovy-editor" value={props.activeNote?.content ?? "oh hell no"}/>
  );

};

export default Editor;