import React, {useState} from "react";

const ContextMenu = (props: {
  actions: { text: string, action: any }[]
}) => {

  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <ol className="snovy-context-menu">
      {props.actions.map((a, i: number) => <li key={i++} onClick={a.action}>{a.text}</li>)}
    </ol>
  );

};

export default ContextMenu;