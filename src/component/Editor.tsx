import React from "react";
import Note from "../model/Note";

const Editor = (props: { activeNote: Note | undefined }) => {

  return (
    <textarea id="snovy-editor">{props.activeNote?.content}</textarea>
  );

};

export default Editor;