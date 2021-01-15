import React, {useCallback, useEffect, useState} from "react";

const ContextMenu = (props: {
  id?: string
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
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setX(e.pageX);
      setY(e.pageY);

      // console.log(e.target);
      // console.log(props.parentRef.current);
      if (e.target == props.parentRef.current) {
        setVisible(true);
      }

    },
    [setX, setY]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return (
    <ol className="snovy-context-menu" id={props.id} hidden={!visible}
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