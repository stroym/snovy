import React, {useCallback, useEffect, useState} from "react";

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  actions: Array<Action>
}) => {

  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleClick = useCallback(() => {
    visible && setVisible(false);
  }, [visible]);

  const handleContextMenu = useCallback(
    (event: any) => {
      event.preventDefault();
      event.stopPropagation();

      setX(event.pageX);
      setY(event.pageY);

      setVisible(true);
    },
    []
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    props.parentRef.current?.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      props.parentRef.current?.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return (
    <ol className="snovy-context-menu" hidden={!visible}
        style={{
          position: "absolute",
          top: y + "px",
          left: x + "px"
        }}>
      {props.actions.map((a, i: number) => <li key={i++} onClick={a.action}>{a.text}</li>)}
    </ol>
  );

};

export class Action {
  text: string;
  action: (...params: any) => any

  constructor(text: string, action: (...params: any) => any) {
    this.text = text;
    this.action = action;
  }

}

export default ContextMenu;