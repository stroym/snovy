import React, {ChangeEvent, useEffect, useState} from "react";
import Note from "../model/Note";

const Editor = (props: {
  activeNote: Note | undefined,
  onValueChange: (value: string) => any
}) => {

  const [value, setValue] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  useEffect(
    () => {
      setValue(props.activeNote?.content ?? "");
    }, [props.activeNote]
  );

  useEffect(
    () => {
      props.onValueChange(value);
    }, [value]
  );

  return (
    <textarea id="snovy-editor" onChange={handleChange} value={value} disabled={!props.activeNote}/>
  );

};

export default Editor;